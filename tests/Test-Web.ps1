$ErrorActionPreference  = "Stop"

$pixelCount = 17
function setAll( $color )
{
    $channels = @()
    foreach ( $i in 0..($pixelCount-1))
    {
        if ( $i -ge 9 )
        {
            $thiscolor = (($color -band 0xff00) -shl 8) `
                        -bor ($color -band 0xff) `
                        -bor (($color -band 0xff0000) -shr 8)
        }
        else
        {
            $thiscolor = $color
        }
        $channels += @{circuit=$i;value=$thiscolor}
    }
    @{
        channels = $channels
    }

}

function send
{
[CmdletBinding()]
param(
$body
)

    write-Verbose (ConvertTo-Json $body)
    (Measure-Command {
    Invoke-RestMethod -Body (ConvertTo-Json $body)`
                 -Uri "http://192.168.1.107/poop" `
                 -UseBasicParsing `
                 -Method Post `
                 -ContentType "application/json" 
                 }).TotalSeconds

}

send (setAll 0xff )
Start-Sleep -Seconds 2
send (setAll 0xff00 )
Start-Sleep -Seconds 2
send (setAll 0xff0000 )
Start-Sleep -Seconds 2
send (setAll 0 )
Start-Sleep -Seconds 2

foreach ( $i in 1..20)
{
    if ( $i % 2 )
    {
        $body = @{
                channels = @(
                    @{circuit=0;value=0xff0000},
                    @{circuit=1;value=0x0000ff}
                    )
            }
    }
    else
    {
        $body = @{
                channels = @(
                    @{circuit=1;value=0xff0000},
                    @{circuit=0;value=0x0000ff}
                    )
            }
    }
    send $body

}

send (setAll 0 )