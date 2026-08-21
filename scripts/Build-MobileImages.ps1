param(
    [string]$ProjectRoot = "C:\Users\rickt\OneDrive\デスクトップ\web\project",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$ImagesRoot = Join-Path $ProjectRoot "images"
$MobileRoot = Join-Path $ImagesRoot "mobile"
$ReportDirectory = Join-Path $ProjectRoot "reports"
$ReportPath = Join-Path $ReportDirectory "mobile-image-audit.csv"

$MagickCommand = Get-Command magick.exe -ErrorAction SilentlyContinue
if (-not $MagickCommand) {
    $MagickCommand = Get-Command magick -ErrorAction SilentlyContinue
}
if (-not $MagickCommand) {
    throw @"
ImageMagick 7 の magick コマンドが見つかりません。
生成済みの mobile 画像はそのまま使用できます。
今後このスクリプトで再生成する場合は、次のいずれかで ImageMagick を導入してください。

winget install ImageMagick.ImageMagick
"@
}
$Magick = $MagickCommand.Source

function New-Rule {
    param(
        [Nullable[int]]$MaxWidth,
        [Nullable[int]]$MaxHeight,
        [int]$Quality,
        [int]$AlphaQuality = 88,
        [bool]$Animated,
        [string]$Group
    )

    [pscustomobject]@{
        MaxWidth    = $MaxWidth
        MaxHeight   = $MaxHeight
        Quality     = $Quality
        AlphaQuality = $AlphaQuality
        Animated    = $Animated
        Group       = $Group
    }
}

function Get-MobileRule {
    param([string]$RelativePath)

    $Path = $RelativePath.Replace("\", "/")

    switch -Regex ($Path) {
        '^images/gallery/live2d/models/.+/.+-anime-logo\.webp$' {
            # Galleryの遷移アニメーションロゴはデスクトップ専用。
            return $null
        }
        '^images/gallery/live2d/models/.+/.+-bu-(face|body)\.webp$' {
            # 512px素材のため現状維持。
            return $null
        }
        '^images/gallery/live2d/models/.+/.+-model(?:_\d+)?\.webp$' {
            return New-Rule -MaxWidth 1600 -MaxHeight 2200 -Quality 78 -Animated $false -Group "gallery-live2d-model"
        }
        '^images/gallery/live2d/models/.+/.+-kv(?:-bg|-fg)?\.webp$' {
            # 通常表示で大きく拡大するため、モデル画像より高めの解像度と品質を確保する。
            return New-Rule -MaxWidth 2800 -MaxHeight $null -Quality 88 -AlphaQuality 96 -Animated $false -Group "gallery-live2d-kv"
        }
        '^images/gallery/live2d/models/.+/.+-(2view|3view)\.webp$' {
            return New-Rule -MaxWidth 2000 -MaxHeight $null -Quality 78 -Animated $false -Group "gallery-live2d-view"
        }
        '^images/gallery/live2d/models/.+/.+-logo\.webp$' {
            return New-Rule -MaxWidth 960 -MaxHeight $null -Quality 82 -Animated $false -Group "gallery-live2d-logo"
        }
        '^images/gallery/illustration/.+\.webp$' {
            return New-Rule -MaxWidth 1280 -MaxHeight $null -Quality 78 -Animated $false -Group "gallery-illustration"
        }
        '^images/gallery/works/.+\.webp$' {
            return New-Rule -MaxWidth 960 -MaxHeight $null -Quality 76 -Animated $false -Group "gallery-works"
        }
        '^images/order/custom/(model|model-shadow)\.webp$' {
            return New-Rule -MaxWidth 1800 -MaxHeight $null -Quality 78 -Animated $false -Group "order"
        }
        '^images/music/jacket/.+\.webp$' {
            return New-Rule -MaxWidth 1080 -MaxHeight $null -Quality 78 -Animated $false -Group "music-jacket"
        }
        '^images/music/thumbnail(?:\(cover\))?/.+\.webp$' {
            return New-Rule -MaxWidth 960 -MaxHeight $null -Quality 76 -Animated $false -Group "music-thumbnail"
        }
        '^images/profile/(KotoUrara-prof|YumikakaWimina-prof)\.webp$' {
            return New-Rule -MaxWidth $null -MaxHeight 1800 -Quality 78 -Animated $false -Group "profile-character"
        }
        '^images/profile/PV-thumbnail\.webp$' {
            return New-Rule -MaxWidth 960 -MaxHeight $null -Quality 76 -Animated $false -Group "profile-thumbnail"
        }
        '^images/profile/PV-digest\.webp$' {
            return New-Rule -MaxWidth 360 -MaxHeight $null -Quality 72 -Animated $true -Group "profile-animation"
        }
        '^images/top/hero-hand-anim-960\.webp$' {
            return New-Rule -MaxWidth 640 -MaxHeight $null -Quality 72 -Animated $true -Group "top-animation"
        }
        default {
            return $null
        }
    }
}

function Get-ImageInfo {
    param([string]$Path)

    $Probe = & $Magick identify -format "%w,%h,%n" "$Path[0]" 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($Probe)) {
        throw "画像情報を取得できませんでした: $Path"
    }

    $Parts = $Probe.Trim().Split(",")
    [pscustomobject]@{
        Width  = [int]$Parts[0]
        Height = [int]$Parts[1]
        Frames = if ($Parts.Count -ge 3) { [int]$Parts[2] } else { 1 }
    }
}

New-Item -ItemType Directory -Force -Path $MobileRoot | Out-Null
New-Item -ItemType Directory -Force -Path $ReportDirectory | Out-Null

$Results = [System.Collections.Generic.List[object]]::new()
$Files = Get-ChildItem -LiteralPath $ImagesRoot -Recurse -File -Filter "*.webp" |
    Where-Object { $_.FullName -notlike "$MobileRoot*" }

foreach ($File in $Files) {
    $RelativePath = $File.FullName.Substring($ProjectRoot.Length).TrimStart("\")
    $Rule = Get-MobileRule -RelativePath $RelativePath
    if (-not $Rule) {
        continue
    }

    $SourceInfo = Get-ImageInfo -Path $File.FullName
    $NeedsResize =
        ($null -ne $Rule.MaxWidth -and $SourceInfo.Width -gt $Rule.MaxWidth) -or
        ($null -ne $Rule.MaxHeight -and $SourceInfo.Height -gt $Rule.MaxHeight)

    if (-not $NeedsResize -and -not $Rule.Animated) {
        continue
    }

    $ImagesRelative = $RelativePath.Substring("images\".Length)
    $OutputPath = Join-Path $MobileRoot $ImagesRelative
    $OutputDirectory = Split-Path -Parent $OutputPath
    New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

    $OutputExists = Test-Path -LiteralPath $OutputPath
    $ShouldGenerate = $Force -or -not $OutputExists

    if ($OutputExists -and -not $Force) {
        $OutputTime = (Get-Item -LiteralPath $OutputPath).LastWriteTimeUtc
        $ShouldGenerate = $OutputTime -lt $File.LastWriteTimeUtc
        if (-not $ShouldGenerate) {
            Write-Host "既存を使用: $RelativePath"
        }
    }

    if ($ShouldGenerate) {

        if ($null -ne $Rule.MaxWidth -and $null -ne $Rule.MaxHeight) {
            $Geometry = "$($Rule.MaxWidth)x$($Rule.MaxHeight)>"
        }
        elseif ($null -ne $Rule.MaxWidth) {
            $Geometry = "$($Rule.MaxWidth)x>"
        }
        else {
            $Geometry = "x$($Rule.MaxHeight)>"
        }

        $Arguments = [System.Collections.Generic.List[string]]::new()
        $Arguments.Add($File.FullName)

        if ($Rule.Animated) {
            $Arguments.Add("-coalesce")
        }

        $Arguments.Add("-resize")
        $Arguments.Add($Geometry)
        $Arguments.Add("-strip")
        $Arguments.Add("-define")
        $Arguments.Add("webp:method=6")
        $Arguments.Add("-define")
        $Arguments.Add("webp:alpha-quality=$($Rule.AlphaQuality)")
        $Arguments.Add("-quality")
        $Arguments.Add([string]$Rule.Quality)

        if ($Rule.Animated) {
            $Arguments.Add("-loop")
            $Arguments.Add("0")
        }

        $Arguments.Add($OutputPath)

        Write-Host "生成: $RelativePath"
        & $Magick @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "モバイル画像の生成に失敗しました: $RelativePath"
        }
    }

    $OutputInfo = Get-ImageInfo -Path $OutputPath
    $OutputFile = Get-Item -LiteralPath $OutputPath
    $Saving = if ($File.Length -gt 0) {
        [math]::Round((1 - ($OutputFile.Length / $File.Length)) * 100, 1)
    }
    else {
        0
    }

    $Results.Add([pscustomobject]@{
        original_path   = $RelativePath.Replace("\", "/")
        mobile_path     = $OutputPath.Substring($ProjectRoot.Length).TrimStart("\").Replace("\", "/")
        group           = $Rule.Group
        original_width  = $SourceInfo.Width
        original_height = $SourceInfo.Height
        mobile_width    = $OutputInfo.Width
        mobile_height   = $OutputInfo.Height
        frames          = $OutputInfo.Frames
        original_bytes  = $File.Length
        mobile_bytes    = $OutputFile.Length
        saving_percent  = $Saving
        quality         = $Rule.Quality
    })
}

$SortedResults = $Results | Sort-Object group, original_path
$SortedResults |
    Export-Csv -LiteralPath $ReportPath -NoTypeInformation -Encoding UTF8

# Live2D通常表示用：上端基準を維持したまま2200pxで下側だけを切り、
# 全身表示用とは別の高解像度素材を作る。横幅・透明余白・正中線は変更しない。
$CloseModelFiles = Get-ChildItem -LiteralPath (Join-Path $ImagesRoot "gallery\live2d\models") -Recurse -File -Filter "*.webp" |
    Where-Object { $_.Name -match '-model(?:_\d+)?\.webp$' }
foreach ($File in $CloseModelFiles) {
    $RelativeToModels = $File.FullName.Substring((Join-Path $ImagesRoot "gallery\live2d\models").Length).TrimStart("\")
    $OutputDirectory = Join-Path $MobileRoot (Join-Path "gallery\live2d\models" (Join-Path (Split-Path $RelativeToModels -Parent) "close"))
    $OutputPath = Join-Path $OutputDirectory $File.Name
    New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

    $SourceInfo = Get-ImageInfo -Path $File.FullName
    $CropHeight = [math]::Min(2200, $SourceInfo.Height)
    $ShouldGenerate = $Force -or -not (Test-Path -LiteralPath $OutputPath)
    if ((Test-Path -LiteralPath $OutputPath) -and -not $Force) {
        $ShouldGenerate = (Get-Item -LiteralPath $OutputPath).LastWriteTimeUtc -lt $File.LastWriteTimeUtc
    }

    if ($ShouldGenerate) {
        Write-Host "生成（Live2D通常表示）: $RelativeToModels"
        & $Magick $File.FullName -crop "$($SourceInfo.Width)x$CropHeight+0+0" +repage -strip `
            -define "webp:method=6" -define "webp:alpha-quality=92" -quality 84 $OutputPath
        if ($LASTEXITCODE -ne 0) {
            throw "Live2D通常表示画像の生成に失敗しました: $RelativeToModels"
        }
    }
}

$Manifest = [ordered]@{}
foreach ($Result in ($Results | Sort-Object original_path)) {
    $Manifest[$Result.original_path] = [ordered]@{
        src            = $Result.mobile_path
        originalWidth  = [int]$Result.original_width
        originalHeight = [int]$Result.original_height
        width          = [int]$Result.mobile_width
        height         = [int]$Result.mobile_height
        animated       = [bool]($Result.frames -gt 1)
    }
}

$ManifestJson = $Manifest | ConvertTo-Json -Depth 5
$ManifestTemplate = @'
(() => {
    "use strict";

    const MOBILE_QUERY = window.matchMedia(
        "(max-width: 1099px), (hover: none), (pointer: coarse)"
    );
    const RICH_DESKTOP_QUERY = window.matchMedia(
        "(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    const MOBILE_ASSETS = Object.freeze(__MOBILE_ASSET_JSON__);

    function splitAssetUrl(url) {
        const value = String(url || "");
        const match = value.match(/^([^?#]*)(.*)$/);
        return {
            path: match ? match[1] : value,
            suffix: match ? match[2] : ""
        };
    }

    function normalizePath(path) {
        return String(path || "")
            .replace(/^\.\//, "")
            .replace(/^\//, "");
    }

    function entry(url) {
        const { path } = splitAssetUrl(url);
        return MOBILE_ASSETS[normalizePath(path)] || null;
    }

    function resolve(url) {
        if (!MOBILE_QUERY.matches) return url;
        const parts = splitAssetUrl(url);
        const asset = MOBILE_ASSETS[normalizePath(parts.path)];
        return asset ? `${asset.src}${parts.suffix}` : url;
    }

    function metadata(url) {
        return entry(url);
    }

    function isMobile() {
        return MOBILE_QUERY.matches;
    }

    function isRichDesktop() {
        return RICH_DESKTOP_QUERY.matches;
    }

    window.KotonoUraAssets = Object.freeze({
        resolve,
        metadata,
        isMobile,
        isRichDesktop,
        mobileQuery: MOBILE_QUERY,
        richDesktopQuery: RICH_DESKTOP_QUERY
    });
})();
'@
$ManifestScript = $ManifestTemplate.Replace("__MOBILE_ASSET_JSON__", $ManifestJson)
$ManifestPath = Join-Path $ProjectRoot "js\mobile-assets.js"
[System.IO.File]::WriteAllText($ManifestPath, $ManifestScript, [System.Text.UTF8Encoding]::new($false))

$OriginalTotal = ($Results | Measure-Object original_bytes -Sum).Sum
$MobileTotal = ($Results | Measure-Object mobile_bytes -Sum).Sum
$TotalSaving = if ($OriginalTotal -gt 0) {
    [math]::Round((1 - ($MobileTotal / $OriginalTotal)) * 100, 1)
}
else {
    0
}

Write-Host ""
Write-Host "完了"
Write-Host "対象: $($Results.Count) ファイル"
Write-Host ("元容量: {0:N2} MB" -f ($OriginalTotal / 1MB))
Write-Host ("モバイル容量: {0:N2} MB" -f ($MobileTotal / 1MB))
Write-Host "削減率: $TotalSaving%"
Write-Host "レポート: $ReportPath"
Write-Host "マニフェスト: $ManifestPath"
