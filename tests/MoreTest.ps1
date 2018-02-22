$blue = 0xff
$red = 0xff0000
$green = 0xff00
$yellow = ($green+$red)
$white = 0xffffff
$purple= ($red+$blue)
$cyan = $blue+$green


setBack 0
setFlood 0
send (setall 0)

setCoyote $cyan
Start-Sleep -Seconds 2

setRR $green
Start-Sleep -Seconds 2

setFlood 0xff
Start-Sleep -Seconds 2

setBack $cyan
Start-Sleep -Seconds 2

send (setall 0)

# 7 is center

foreach ( $i in 1..50)
{
    setCoyote $red
    setCoyote $black
    setRR $cyan
    setRR $black
}
send (setall 0)

