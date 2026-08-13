$ErrorActionPreference = "Stop"

function Resolve-JavaHome {
  if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
    return $env:JAVA_HOME
  }

  $roots = @(
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Java",
    "C:\Program Files\Android\Android Studio\jbr"
  )

  foreach ($root in $roots) {
    if ($root -like "*jbr" -and (Test-Path $root)) {
      return $root
    }

    if (Test-Path $root) {
      $jdk = Get-ChildItem $root -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "jdk*" } |
        Sort-Object Name -Descending |
        Select-Object -First 1 -ExpandProperty FullName

      if ($jdk) {
        return $jdk
      }
    }
  }

  throw "JDK 17 not found. Install Java first."
}

function Initialize-Directory($path) {
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
  }
}

function Get-SdkRoot {
  return Join-Path $env:LOCALAPPDATA "Android\Sdk"
}

function Get-SdkManagerPath($sdkRoot) {
  return Join-Path $sdkRoot "cmdline-tools\latest\bin\sdkmanager.bat"
}

function Install-CommandLineTools($sdkRoot) {
  $sdkManager = Get-SdkManagerPath $sdkRoot
  if (Test-Path $sdkManager) {
    return $sdkManager
  }

  Initialize-Directory $sdkRoot

  $toolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-15859902_latest.zip"
  $zipPath = Join-Path $env:TEMP "commandlinetools-win-15859902_latest.zip"
  $extractRoot = Join-Path $env:TEMP ("android-cmdline-tools-" + [guid]::NewGuid().ToString())
  $targetRoot = Join-Path $sdkRoot "cmdline-tools"
  $latestRoot = Join-Path $targetRoot "latest"

  Write-Host "Downloading Android command-line tools..."
  Invoke-WebRequest -Uri $toolsUrl -OutFile $zipPath

  Initialize-Directory $extractRoot
  Initialize-Directory $targetRoot

  Write-Host "Extracting Android command-line tools..."
  Expand-Archive -Path $zipPath -DestinationPath $extractRoot -Force

  if (Test-Path $latestRoot) {
    Remove-Item $latestRoot -Recurse -Force
  }

  $expanded = Join-Path $extractRoot "cmdline-tools"
  Move-Item -Path $expanded -Destination $latestRoot

  Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
  Remove-Item $extractRoot -Recurse -Force -ErrorAction SilentlyContinue

  return (Get-SdkManagerPath $sdkRoot)
}

function Confirm-AndroidLicenses($sdkManager, $sdkRoot) {
  Write-Host "Accepting Android SDK licenses..."
  $inputText = ((1..20) | ForEach-Object { "y" }) -join [Environment]::NewLine
  $inputText | & $sdkManager --sdk_root=$sdkRoot --licenses | Out-Host
}

function Install-SdkPackages($sdkManager, $sdkRoot) {
  Write-Host "Installing Android SDK packages..."
  & $sdkManager --sdk_root=$sdkRoot "platform-tools" "platforms;android-34" "build-tools;34.0.0"
}

function Write-LocalProperties($repoRoot, $sdkRoot) {
  $localPropertiesPath = Join-Path $repoRoot "android\local.properties"
  $sdkDir = ($sdkRoot -replace "\\", "/")
  Set-Content -Path $localPropertiesPath -Value "sdk.dir=$sdkDir"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$javaHome = Resolve-JavaHome
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

$sdkRoot = Get-SdkRoot
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot

$sdkManager = Install-CommandLineTools $sdkRoot
Confirm-AndroidLicenses $sdkManager $sdkRoot
Install-SdkPackages $sdkManager $sdkRoot
Write-LocalProperties $repoRoot $sdkRoot

Write-Host "ANDROID_HOME=$sdkRoot"
Write-Host "local.properties written to android/local.properties"
