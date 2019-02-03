# AppUi

To run, `ng serve --host 192.168.1.104` for a dev server. Navigate to `http://192.168.1.104:4200/`. The app will automatically reload if you change any of the source files.

Using the IP is important since the API Server allows that IP via CORS

```powershell
# PowerShell to get IP
$ip =  Get-NetIPAddress | ? { $_.AddressFamily -eq "Ipv4" -and $_.InterfaceAlias -eq 'Wi-Fi' }
ng server -host ($ip.IpAddress)
```

If you get the message `You seem to not be depending on "@angular/core". This is an error.` Run `npm install`
