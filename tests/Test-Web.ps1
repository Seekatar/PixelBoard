$ErrorActionPreference  = "Stop"

$pixelCount = 17
function setAll( $color, $transition = 1 )
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
        transition = "${transition}secs"
    }

}

function setRange( $start, $end, $color, $transition = 1  )
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
        transition = "${transition}secs"
    }
}

function setOne( $i, $color, $transition = 1  )
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
        transition = "${transition}secs"    
     }

}

function send
{
[CmdletBinding()]
param(
$body
)

    write-Verbose (ConvertTo-Json $body)
    try 
    {
        $resp = Invoke-WebRequest -Body (ConvertTo-Json $body -Compress)`
                 -Uri "http://192.168.1.107/api/pixel" `
                 -UseBasicParsing `
                 -Method Post `
                 -ContentType "application/json" 
        if ( $resp.StatusCode -eq 200 )
        {
            ConvertFrom-Json $resp.Content
        }
    }
    catch 
    {
        Write-Error $_
    }
}

function setCoyote($color, $transition = 1 )
{
    send (setRange 1 2 $color $transition)
}

function setRR($color, $transition = 1 )
{
    send (setRange 3 4 $color $transition)
}

function setBack( $color, $transition = 1  )
{
    send (setRange 5 8 $color $transition)
}

function setFlood( $color, $transition = 1  )
{
    send (setRange 10 17 $color $transition)
}


send (setAll 0xff 1 )
Start-Sleep -Seconds 2
send (setAll 0xff00 )
Start-Sleep -Seconds 2
measure-command { send (setAll 0xff0000 2) }
Start-Sleep -Seconds 2
measure-command { send (setAll 0 ) }
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
send (setRange 10 17 0x1f001f)

send (setAll 0 )

setFlood 0xffffff 5
Measure-Command  { setFlood 0x0 5 }

setCoyote 0xff0000
setRR 0xff00 