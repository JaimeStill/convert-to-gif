[CmdletBinding()]
Param(
	[Parameter()]
	[string]$exec = "ffmpeg.exe",
    [Parameter()]
    [string]$origin,
    [Parameter()]
    [string]$destination,
	[Parameter()]
	[string]$fps = "25",
    [Parameter()]
    [string]$scale = "900",
	[Parameter()]
	[string]$flags = "bicubic",
    [Parameter()]
    [string]$log = "panic"
)

$palette = "${env:TEMP}\palette.png"
$filters = "fps=$fps,scale=$scale`:-1:flags=$flags"
& $exec -v $log -i $origin -vf "$filters,palettegen" -y $palette
& $exec -v $log -i $origin -i $palette -lavfi "$filters [x]; [x][1:v] paletteuse" -y $destination