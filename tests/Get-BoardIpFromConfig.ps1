$config = ConvertFrom-Json (Get-Content (Join-Path $PSScriptRoot "..\Web\app_api\config\default.json") -raw)
$config.pixelBoard.httpBoard.hostname