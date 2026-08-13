param(
  [string]$AvdName = "CTS_API34"
)

$ErrorActionPreference = "Stop"

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

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$sdkRoot = Resolve-AndroidSdkRoot
if (-not $sdkRoot) {
  throw "Android SDK not found. Run scripts/setup-android-emulator.ps1 first."
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot

$emulatorExe = Join-Path $sdkRoot "emulator\emulator.exe"
if (-not (Test-Path $emulatorExe)) {
  throw "emulator.exe not found at $emulatorExe. Run scripts/setup-android-emulator.ps1 first."
}

$availableAvds = & $emulatorExe -list-avds
if ($availableAvds -notcontains $AvdName) {
  Write-Host "AVD $AvdName not found. Creating it now..."
  & powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "setup-android-emulator.ps1") -AvdName $AvdName
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to prepare AVD $AvdName."
  }
}

Write-Host "Starting emulator: $AvdName"
Start-Process -FilePath $emulatorExe -ArgumentList "-avd $AvdName -netdelay none -netspeed full"
Write-Host "Emulator launch command sent."
