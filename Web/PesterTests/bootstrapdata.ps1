$baseUri = "http://localhost:3000"

if ($true)
{
    $body = @{ typeName  = "NeoPixel Diffused 8mm Through-Hole LED"
        typeShortName  = "8mm Diffused"
        manufacturer = "Adafruit"
        url          = "https://www.adafruit.com/product/1734"
    }
    $eightMMResp = Invoke-RestMethod -Uri $baseUri/api/instrumentTypes -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json" -verbose
        
    $body = @{ typeName     = "NeoPixel Stick - 8 x 5050 RGB LED"
        typeShortName = "8Pixel Stick"
        manufacturer    = "Adafruit"
        url             = "https://www.adafruit.com/product/1426"
        instrumentCount = 8
        colorScheme = "GRB"
    }
    $eightStickResp = Invoke-RestMethod -Uri $baseUri/api/instrumentTypes -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"

}

$eightMM =  $eightMMResp._id #  "5aa8496b5e9ebb0a3807a102"
$eightStick = $eightStickResp._id #"5aa8496b5e9ebb0a3807a103"


for($i = 0; $i -lt 9; $i++)
{
        $body = @{ name = "Diffuse #$i"
                   socket = $i
                   instrumentType = $eightMM}
        Invoke-RestMethod -Uri $baseUri/api/instruments -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"
}

$body = @{ name = "Eight LED Stick"
                   socket = 9
                   instrumentType = $eightStick}
        Invoke-RestMethod -Uri $baseUri/api/instruments -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"