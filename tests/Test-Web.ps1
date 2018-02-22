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

function setRange( $start, $end, $color )
{
    $start -= 1
    $end -= 1

    $channels = @()
    foreach ( $i in $start..$end)
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

function setOne( $i, $color )
{
    $i -= 1 
    $channels = @()
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
    Invoke-RestMethod -Body (ConvertTo-Json $body -Compress)`
                 -Uri "http://192.168.1.107" `
                 -UseBasicParsing `
                 -Method Post `
                 -ContentType "application/json" 
                 }).TotalSeconds

}

function setCoyote($color)
{
    send (setRange 1 2 $color)
}
function setRR($color)
{
    send (setRange 3 4 $color)
}

function setBack( $color )
{
    send (setRange 5 8 $color)
}

function setFlood( $color )
{
    send (setRange 10 17 $color)
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
send( setRange 10 17 0x1f001f )

send (setAll 0 )