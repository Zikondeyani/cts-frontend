param(
  [string]$AvdName = "CTS_API34",
  [string]$ApiLevel = "34",
  [string]$Abi = "x86_64",
  [string]$Device = "pixel_6"
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
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  return $null
}

function Get-SdkToolPath($sdkRoot, $tool) {
  return Join-Path $sdkRoot "cmdline-tools\latest\bin\$tool"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$javaHome = Resolve-JavaHome
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

$sdkRoot = Resolve-AndroidSdkRoot
if (-not $sdkRoot) {
  Write-Host "Android SDK not found. Bootstrapping SDK first..."
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

$sdkManager = Get-SdkToolPath $sdkRoot "sdkmanager.bat"
$avdManager = Get-SdkToolPath $sdkRoot "avdmanager.bat"
$emulatorExe = Join-Path $sdkRoot "emulator\emulator.exe"

if (-not (Test-Path $sdkManager)) {
  throw "sdkmanager not found at $sdkManager"
}
if (-not (Test-Path $avdManager)) {
  throw "avdmanager not found at $avdManager"
}

$systemImage = "system-images;android-$ApiLevel;google_apis;$Abi"

Write-Host "Installing emulator + system image ($systemImage)..."
& $sdkManager --sdk_root=$sdkRoot "emulator" $systemImage "platform-tools" "platforms;android-$ApiLevel"
if ($LASTEXITCODE -ne 0) {
  throw "Failed installing emulator packages."
}

if (-not (Test-Path $emulatorExe)) {
  throw "emulator.exe not found at $emulatorExe"
}

$existingAvds = & $emulatorExe -list-avds
if ($existingAvds -notcontains $AvdName) {
  Write-Host "Creating AVD $AvdName..."
  "no" | & $avdManager create avd --force --name $AvdName --package $systemImage --device $Device
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to create AVD $AvdName."
  }
} else {
  Write-Host "AVD $AvdName already exists."
}

Write-Host "Android emulator setup complete."
Write-Host "AVD ready: $AvdName"
