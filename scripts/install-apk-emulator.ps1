param(
  [string]$ApkPath = "android\app\build\outputs\apk\debug\app-debug.apk",
  [string]$PackageId = "org.mw.dodma.cts",
  [int]$TimeoutSeconds = 180,
  [ValidateSet("true", "false")]
  [string]$CleanInstall = "true"
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

function Get-RunningEmulatorId($adbExe) {
  $lines = & $adbExe devices
  foreach ($line in $lines) {
    if ($line -match "^(emulator-\d+)\s+device$") {
      return $Matches[1]
    }
  }
  return $null
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$fullApkPath = Join-Path $repoRoot $ApkPath
if (-not (Test-Path $fullApkPath)) {
  throw "APK not found at $fullApkPath. Build first with npm run apk:debug"
}

$sdkRoot = Resolve-AndroidSdkRoot
if (-not $sdkRoot) {
  throw "Android SDK not found."
}

$adbExe = Join-Path $sdkRoot "platform-tools\adb.exe"
if (-not (Test-Path $adbExe)) {
  throw "adb not found at $adbExe"
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot

$shouldCleanInstall = $CleanInstall -eq "true"

& $adbExe start-server | Out-Null

$deviceId = $null
$start = Get-Date
while (-not $deviceId) {
  $deviceId = Get-RunningEmulatorId $adbExe
  if ($deviceId) {
    break
  }

  if (((Get-Date) - $start).TotalSeconds -gt $TimeoutSeconds) {
    throw "No running emulator detected within $TimeoutSeconds seconds. Start it with npm run android:emulator:start"
  }

  Start-Sleep -Seconds 2
}

Write-Host "Using emulator device: $deviceId"
& $adbExe -s $deviceId wait-for-device

$bootStart = Get-Date
while ($true) {
  $bootStatus = (& $adbExe -s $deviceId shell getprop sys.boot_completed | Out-String).Trim()
  if ($bootStatus -eq "1") {
    break
  }

  if (((Get-Date) - $bootStart).TotalSeconds -gt $TimeoutSeconds) {
    throw "Emulator did not finish booting within $TimeoutSeconds seconds."
  }

  Start-Sleep -Seconds 2
}

Write-Host "Installing APK: $fullApkPath"
if ($shouldCleanInstall) {
  Write-Host "Performing clean install (uninstall old app and clear cached data)..."
  & $adbExe -s $deviceId uninstall $PackageId | Out-Null
}

& $adbExe -s $deviceId install -r $fullApkPath
if ($LASTEXITCODE -ne 0) {
  throw "APK install failed."
}

Write-Host "Launching app: $PackageId"
& $adbExe -s $deviceId shell monkey -p $PackageId -c android.intent.category.LAUNCHER 1 | Out-Null

Write-Host "APK installed and launched successfully on emulator $deviceId"
