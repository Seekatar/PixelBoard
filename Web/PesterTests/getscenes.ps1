$baseUri = "http://localhost:3000"
$id = 0
$scene = Invoke-RestMethod -Uri "$baseUri/api/scenes/$id" -Method Get
$scene 

Invoke-RestMethod -Uri "http://192.168.1.107/api/pixel"

$inst = Invoke-RestMethod -Uri "$baseUri/api/instruments?full=1" -Method Get
$inst | ft
