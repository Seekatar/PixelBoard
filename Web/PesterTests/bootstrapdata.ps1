$baseUri = "http://localhost:3000"

        $body = @{ name = "ThirdOne"
                   socket = 3}
        $pixel = Invoke-RestMethod -Uri $baseUri/api/pixels -Method Post -Body (ConvertTo-Json $body) -ContentType "application/json"
        

