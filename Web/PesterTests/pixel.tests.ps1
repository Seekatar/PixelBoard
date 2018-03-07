[CmdletBinding()]
param()

$baseUri = "http://localhost:3000"

Describe "PixelTests" {
    It "added a pixel" {

        $body = @{ name = "ThirdOne"
                   socket = 3}
        $pixel = Invoke-RestMethod -Uri $baseUri/api/pixels -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"
        $pixel | Should not be $null
    }

    It "deletes a pixel" {
        $id = "5a975c51e2061525780160f1"
        $pixel = Invoke-RestMethod -Uri "$baseUri/api/pixels/$id" -Method Get 
        $pixel | Should not be $null
        
    } -Skip
}

Describe "GetPixels" {
    It "gets current scene" {
        $pixel = Invoke-RestMethod -Uri $baseUri/api/pixels -Method Get
        $pixel | Should not be $null
        
    }
}