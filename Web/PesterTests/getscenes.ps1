$baseUri = "http://localhost:3000"
$id = 0
$scene = Invoke-RestMethod -Uri "$baseUri/api/scenes/$id" -Method Get
$scene

$ip = (& (Join-Path $PSScriptRoot "../../tests/Get-BoardIpFromCOnfig.ps1"))

Invoke-RestMethod -Uri "http://$ip/api/pixel"

$inst = Invoke-RestMethod -Uri "$baseUri/api/instruments?full=1" -Method Get
$inst | Format-Table
