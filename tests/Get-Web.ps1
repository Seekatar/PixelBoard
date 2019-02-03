$ip = (& (Join-Path $PSScriptRoot "GEt-BoardIpFromCOnfig.ps1"))
$result = Invoke-WebRequest -Uri "http://$ip/api/pixel" `
                 -UseBasicParsing `
                 -Method Get

$result = ConvertFrom-Json $result.Content
$result.channels | Select-Object channel, @{n="color";e={"0x{0:x}" -f $_.value}}