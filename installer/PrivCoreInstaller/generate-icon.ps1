$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName PresentationCore, WindowsBase

$projectDirectory = $PSScriptRoot
$iconPath = Join-Path $projectDirectory 'Assets\PrivCore.ico'
New-Item -ItemType Directory -Path (Split-Path $iconPath -Parent) -Force | Out-Null

$sizes = @(16, 32, 48, 256)
$pngImages = [System.Collections.Generic.List[byte[]]]::new()

foreach ($size in $sizes) {
    $visual = [System.Windows.Media.DrawingVisual]::new()
    $context = $visual.RenderOpen()
    $context.PushTransform([System.Windows.Media.ScaleTransform]::new($size / 100.0, $size / 100.0))
    $context.DrawRoundedRectangle(
        [System.Windows.Media.SolidColorBrush]::new([System.Windows.Media.Color]::FromRgb(9, 9, 11)),
        $null,
        [System.Windows.Rect]::new(4, 4, 92, 92),
        18,
        18)

    $gradient = [System.Windows.Media.LinearGradientBrush]::new()
    $gradient.StartPoint = [System.Windows.Point]::new(0, 0)
    $gradient.EndPoint = [System.Windows.Point]::new(1, 1)
    $gradient.GradientStops.Add([System.Windows.Media.GradientStop]::new(
        [System.Windows.Media.Color]::FromRgb(255, 75, 114), 0))
    $gradient.GradientStops.Add([System.Windows.Media.GradientStop]::new(
        [System.Windows.Media.Color]::FromRgb(225, 29, 72), 0.5))
    $gradient.GradientStops.Add([System.Windows.Media.GradientStop]::new(
        [System.Windows.Media.Color]::FromRgb(159, 18, 57), 1))

    $outer = [System.Windows.Media.Geometry]::Parse('M 50,15 L 85,50 L 50,85 L 15,50 Z')
    $pen = [System.Windows.Media.Pen]::new($gradient, 6)
    $pen.LineJoin = [System.Windows.Media.PenLineJoin]::Round
    $context.DrawGeometry($null, $pen, $outer)

    $inner = [System.Windows.Media.Geometry]::Parse('M 50,28 L 72,50 L 50,72 L 28,50 Z')
    $innerBrush = $gradient.Clone()
    $innerBrush.Opacity = 0.35
    $context.DrawGeometry($innerBrush, $null, $inner)
    $context.DrawEllipse([System.Windows.Media.Brushes]::White, $null,
        [System.Windows.Point]::new(50, 50), 8, 8)
    $context.Pop()
    $context.Close()

    $bitmap = [System.Windows.Media.Imaging.RenderTargetBitmap]::new(
        $size, $size, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $bitmap.Render($visual)
    $encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($bitmap))
    $pngStream = [System.IO.MemoryStream]::new()
    $encoder.Save($pngStream)
    $pngImages.Add($pngStream.ToArray())
    $pngStream.Dispose()
}

# ICO directory entries point to PNG frames for crisp rendering at common sizes.
$stream = [System.IO.File]::Create($iconPath)
$writer = [System.IO.BinaryWriter]::new($stream)
try {
    $writer.Write([UInt16]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]$sizes.Count)
    $offset = 6 + (16 * $sizes.Count)

    for ($index = 0; $index -lt $sizes.Count; $index++) {
        $size = $sizes[$index]
        $dimension = if ($size -eq 256) { [byte]0 } else { [byte]$size }
        $writer.Write($dimension)
        $writer.Write($dimension)
        $writer.Write([byte]0)
        $writer.Write([byte]0)
        $writer.Write([UInt16]1)
        $writer.Write([UInt16]32)
        $writer.Write([UInt32]$pngImages[$index].Length)
        $writer.Write([UInt32]$offset)
        $offset += $pngImages[$index].Length
    }

    foreach ($pngImage in $pngImages) {
        $writer.Write($pngImage)
    }
}
finally {
    $writer.Dispose()
}