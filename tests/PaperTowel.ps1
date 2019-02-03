$RED = 0xff0000
$BLUE = 0xff
$GREEN = 0xff00
$WHITE = 0xffffff
$BLACK = 0
$PURPLE = 0xff00ff
$DKPURPLE = 0x800080
$DKBLUE = 0x80

send (setone 1 $DKPURPLE)
send (setrange 1 2 $PURPLE)
send (setone 7 $BLUE)
send (setone 9 $RED)

send (setone 7 $BLACK)
send (setone 9 $BLACK)

setFlood $BLACK
