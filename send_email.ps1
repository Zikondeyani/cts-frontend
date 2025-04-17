param (
    [string]$zipPath,
    [string]$timestamp
)

$smtpServer = 'smtp.gmail.com'
$smtpPort = 587
$emailFrom = 'mailing.immalawi@gmail.com'
$emailTo = 'dodmasystems@gmail.com'
$subject = "CTS Backup - $timestamp"
$body = 'Attached is the latest CTS backup.'
$password = ConvertTo-SecureString 'jxqcbsqugfjysdyz' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($emailFrom, $password)

# Custom 'From' display name
$displayFrom = "CTS BACKUP SERVICE <$emailFrom>"

Send-MailMessage -From $displayFrom -To $emailTo -Subject $subject -Body $body -SmtpServer $smtpServer -Port $smtpPort -UseSsl -Credential $cred -Attachments $zipPath
