$result = Invoke-WebRequest -Uri "http://192.168.1.107/api/pixel" `
                 -UseBasicParsing `
                 -Method Get

$result = ConvertFrom-Json $result.Content
$result.channels | select channel, @{n="color";e={"0x{0:x}" -f $_.value}}