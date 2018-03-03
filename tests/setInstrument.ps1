param ($id,$color) 

$body = @{color = $color}


Invoke-RestMethod -Body (ConvertTo-Json $body -Compress)`
                 -Uri "http://localhost:3000/api/instruments/$id" `
                 -UseBasicParsing `
                 -Method Patch `
                 -ContentType "application/json"
                 
Invoke-RestMethod -Body (ConvertTo-Json $body -Compress)`
                 -Uri "http://localhost:3000/api/instruments/$id" `
                 -UseBasicParsing `
                 -Method Patch `
                 -ContentType "application/json"