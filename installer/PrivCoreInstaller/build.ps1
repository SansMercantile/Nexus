param(
    [string]$CertificateThumbprint,
    [string]$TimestampServer = 'http://timestamp.digicert.com',
    [switch]$RefreshEngine
)

$ErrorActionPreference = 'Stop'
$projectDirectory = $PSScriptRoot
$workspaceRoot = (Resolve-Path (Join-Path $projectDirectory '..\..\..')).Path
$engineSource = Join-Path $workspaceRoot 'constellation\priv\installer\dist\PrivCoreSetup.exe'
$payloadDirectory = Join-Path $projectDirectory 'Payload'
$engineDestination = Join-Path $payloadDirectory 'PrivCoreSetupEngine.exe'
$outputDirectory = Join-Path $projectDirectory 'dist'
$installerPath = Join-Path $outputDirectory 'Priv Core Installer.exe'
$iconGenerator = Join-Path $projectDirectory 'generate-icon.ps1'

if (-not (Test-Path $engineSource)) {
    throw "Installer engine not found at '$engineSource'. Build constellation/priv/installer first."
}

New-Item -ItemType Directory -Path $payloadDirectory -Force | Out-Null
& $iconGenerator
if (-not (Test-Path (Join-Path $projectDirectory 'Assets\PrivCore.ico'))) {
    throw 'Installer icon generation failed.'
}

if (-not (Test-Path $engineDestination) -or $RefreshEngine) {
    Copy-Item -LiteralPath $engineSource -Destination $engineDestination -Force
} else {
    Write-Output 'Using the existing local setup-engine payload. Pass -RefreshEngine to replace it.'
}

$localDotnet = Join-Path $env:LOCALAPPDATA 'dotnet-sdk-10\dotnet.exe'
if (Test-Path $localDotnet) {
    $dotnetPath = $localDotnet
} else {
    $dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
    if (-not $dotnet) {
        throw 'The .NET 10 SDK was not found on PATH or in the local SDK directory.'
    }
    $dotnetPath = $dotnet.Source
}

& $dotnetPath publish (Join-Path $projectDirectory 'PrivCoreInstaller.csproj') `
    --configuration Release `
    --runtime win-x64 `
    --self-contained true `
    --property:PublishSingleFile=true `
    --property:IncludeNativeLibrariesForSelfExtract=true `
    --property:EnableCompressionInSingleFile=true `
    --property:DebugType=None `
    --property:DebugSymbols=false `
    --source 'https://api.nuget.org/v3/index.json' `
    --output $outputDirectory
if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish failed with exit code $LASTEXITCODE."
}

if (-not (Test-Path $installerPath)) {
    throw "Publish completed without producing '$installerPath'."
}

if ($CertificateThumbprint) {
    $normalizedThumbprint = $CertificateThumbprint -replace '\s', ''
    $codeSigningOid = '1.3.6.1.5.5.7.3.3'
    $certificate = @(
        Get-ChildItem Cert:\CurrentUser\My, Cert:\LocalMachine\My |
            Where-Object {
                $_.Thumbprint -eq $normalizedThumbprint -and
                $_.HasPrivateKey -and
                $_.EnhancedKeyUsageList.ObjectId -contains $codeSigningOid
            }
    ) | Select-Object -First 1

    if (-not $certificate) {
        throw 'The requested code-signing certificate was not found with a private key in the current-user or local-machine certificate store.'
    }

    $signature = Set-AuthenticodeSignature `
        -FilePath $installerPath `
        -Certificate $certificate `
        -TimestampServer $TimestampServer `
        -HashAlgorithm SHA256
    if ($signature.Status -ne 'Valid') {
        throw "Authenticode signing failed: $($signature.StatusMessage)"
    }

    Write-Output "Signed with: $($certificate.Subject)"
} else {
    Write-Warning 'This is an unsigned preview build. Do not publish it; Windows SmartScreen will still report an unknown publisher.'
}

Get-Item $installerPath | Select-Object FullName, Length, LastWriteTime
Get-AuthenticodeSignature $installerPath | Select-Object Status, @{Name='Signer'; Expression={$_.SignerCertificate.Subject}}
