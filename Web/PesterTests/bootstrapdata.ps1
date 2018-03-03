$baseUri = "http://localhost:3000"

if ($false)
{
    $body = @{ name  = "NeoPixel Diffused 8mm Through-Hole LED"
        manufacturer = "Adafruit"
        url          = "https://www.adafruit.com/product/1734"
    }
    Invoke-RestMethod -Uri $baseUri/api/instrumentTypes -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"
        
    $body = @{ name     = "NeoPixel Stick - 8 x 5050 RGB LED"
        manufacturer    = "Adafruit"
        url             = "https://www.adafruit.com/product/1426"
        instrumentCount = 8
    }
    Invoke-RestMethod -Uri $baseUri/api/instrumentTypes -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"

}

$eightMM = "5a9ad1f6b13c8d23649f07e0"
$eigthStick = "5a9ad1f7b13c8d23649f07e1"

for($i = 0; $i -lt 9; $i++)
{
        $body = @{ name = "Diffuse #$i"
                   socket = $i
                   instrumentType_id = $eightMM}
        Invoke-RestMethod -Uri $baseUri/api/instruments -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"
}

$body = @{ name = "Eight LED Stick"
                   socket = 9
                   instrumentType_id = $eightStick}
        Invoke-RestMethod -Uri $baseUri/api/instruments -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"