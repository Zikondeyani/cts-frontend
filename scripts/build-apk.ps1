param(
  [ValidateSet("debug", "release")]
  [string]$Type = "debug"
)

$ErrorActionPreference = "Stop"

function Resolve-JavaHome {
  if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
    return $env:JAVA_HOME
  }

  $candidates = @()

  $adoptiumRoot = "C:\Program Files\Eclipse Adoptium"
  if (Test-Path $adoptiumRoot) {
    $candidates += Get-ChildItem $adoptiumRoot -Directory -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -like "jdk-*" } |
      Sort-Object Name -Descending |
      Select-Object -ExpandProperty FullName
  }

  $javaRoot = "C:\Program Files\Java"
  if (Test-Path $javaRoot) {
    $candidates += Get-ChildItem $javaRoot -Directory -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -like "jdk*" } |
      Sort-Object Name -Descending |
      Select-Object -ExpandProperty FullName
  }

  $studioJbr = "C:\Program Files\Android\Android Studio\jbr"
  if (Test-Path $studioJbr) {
    $candidates += $studioJbr
  }

  $selected = $candidates | Select-Object -First 1
  if (-not $selected) {
    throw "Could not find a JDK. Install JDK 17 and retry."
  }

  return $selected
}

function Resolve-AndroidSdkRoot {
  $candidates = @(
    $env:ANDROID_HOME,
    $env:ANDROID_SDK_ROOT,
    (Join-Path $env:LOCALAPPDATA "Android\Sdk"),
    (Join-Path $env:USERPROFILE "AppData\Local\Android\Sdk")
  ) | Where-Object { $_ }

  foreach ($candidate in $candidates) {
    if (Test-Path (Join-Path $candidate "platforms")) {
      return $candidate
    }
  }

  return $null
}

function Write-LocalProperties($repoRoot, $sdkRoot) {
  $localPropertiesPath = Join-Path $repoRoot "android\local.properties"
  $sdkDir = ($sdkRoot -replace "\\", "/")
  Set-Content -Path $localPropertiesPath -Value "sdk.dir=$sdkDir"
}

function Get-EnvValueFromFile($filePath, $key) {
  if (-not (Test-Path $filePath)) {
    return $null
  }

  $line = Get-Content -Path $filePath | Where-Object { $_ -match "^\s*$key\s*=" } | Select-Object -First 1
  if (-not $line) {
    return $null
  }

  return ($line -split "=", 2)[1].Trim()
}

function Assert-MobileApiEndpoint($repoRoot) {
  $productionEnvPath = Join-Path $repoRoot ".env.production"
  $rootApi = Get-EnvValueFromFile -filePath $productionEnvPath -key "VUE_APP_ROOT_API"

  if (-not $rootApi) {
    Write-Warning "VUE_APP_ROOT_API was not found in .env.production."
    return
  }

  if ($rootApi -match "^(http://)?(127\.0\.0\.1|localhost)(:\d+)?(/|$)") {
    throw "VUE_APP_ROOT_API in .env.production points to localhost ($rootApi). A phone cannot reach localhost of your PC. Set VUE_APP_ROOT_API to a reachable backend URL, then rerun npm run apk:debug."
  }
}

function Assert-PushConfiguration($repoRoot) {
  $productionEnvPath = Join-Path $repoRoot ".env.production"
  $pushEnabled = (Get-EnvValueFromFile -filePath $productionEnvPath -key "VUE_APP_ENABLE_PUSH_NOTIFICATIONS")

  if (-not $pushEnabled) {
    return
  }

  if ($pushEnabled.Trim().ToLower() -ne "true") {
    return
  }

  $googleServicesPath = Join-Path $repoRoot "android\app\google-services.json"
  if (-not (Test-Path $googleServicesPath)) {
    throw "Push notifications are enabled (VUE_APP_ENABLE_PUSH_NOTIFICATIONS=true) but android/app/google-services.json is missing. Download it from Firebase console for appId org.mw.dodma.cts and place it at android/app/google-services.json, then rerun npm run apk:debug."
  }
}

function Remove-StaleAndroidWebAssets($repoRoot) {
  $pathsToClean = @(
    "android\app\src\main\assets\public",
    "android\app\build\intermediates\assets",
    "android\app\build\intermediates\compressed_assets",
    "android\app\build\intermediates\merged_assets"
  )

  foreach ($relativePath in $pathsToClean) {
    $fullPath = Join-Path $repoRoot $relativePath
    if (Test-Path $fullPath) {
      Write-Host "Cleaning stale Android assets: $relativePath"
      Remove-Item -Path $fullPath -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$javaHome = Resolve-JavaHome
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

$sdkRoot = Resolve-AndroidSdkRoot
if (-not $sdkRoot) {
  Write-Host "Android SDK not found. Bootstrapping command-line SDK..."
  & powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "setup-android-sdk.ps1")
  if ($LASTEXITCODE -ne 0) {
    throw "Android SDK bootstrap failed."
  }
  $sdkRoot = Resolve-AndroidSdkRoot
}

if (-not $sdkRoot) {
  throw "Android SDK not found after bootstrap."
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
Write-LocalProperties $repoRoot $sdkRoot

Write-Host "Using JAVA_HOME=$javaHome"
Write-Host "Using ANDROID_HOME=$sdkRoot"

Assert-MobileApiEndpoint $repoRoot
Assert-PushConfiguration $repoRoot
Remove-StaleAndroidWebAssets $repoRoot

npm run apk:prepare

Set-Location (Join-Path $repoRoot "android")

if ($Type -eq "debug") {
  $buildStartUtc = (Get-Date).ToUniversalTime()
  cmd /c "gradlew.bat assembleDebug"
  if ($LASTEXITCODE -ne 0) {
    throw "Gradle assembleDebug failed with exit code $LASTEXITCODE"
  }
  $apkPath = Join-Path $repoRoot "android\app\build\outputs\apk\debug\app-debug.apk"
  if (-not (Test-Path $apkPath)) {
    throw "Debug APK build finished without producing app-debug.apk"
  }
  if ((Get-Item $apkPath).LastWriteTimeUtc -lt $buildStartUtc) {
    throw "Debug APK exists but was not updated by the current build. Delete old outputs and retry."
  }
  Write-Host "APK generated at: android\app\build\outputs\apk\debug\app-debug.apk"
} else {
  $buildStartUtc = (Get-Date).ToUniversalTime()
  cmd /c "gradlew.bat assembleRelease"
  if ($LASTEXITCODE -ne 0) {
    throw "Gradle assembleRelease failed with exit code $LASTEXITCODE"
  }
  $apkPath = Join-Path $repoRoot "android\app\build\outputs\apk\release\app-release-unsigned.apk"
  if (-not (Test-Path $apkPath)) {
    throw "Release APK build finished without producing app-release-unsigned.apk"
  }
  if ((Get-Item $apkPath).LastWriteTimeUtc -lt $buildStartUtc) {
    throw "Release APK exists but was not updated by the current build. Delete old outputs and retry."
  }
  Write-Host "APK generated at: android\app\build\outputs\apk\release\app-release-unsigned.apk"
}
