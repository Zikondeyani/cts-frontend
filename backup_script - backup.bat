@echo off
set DB_NAME=commodity_tracking_db
set DB_USER=postgres
set PGPASSWORD=guido
set BACKUP_DIR=C:\frontends\CTS_FRONTEND\backups
set TIMESTAMP=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set DUMP_FILE=%BACKUP_DIR%\%DB_NAME%_backup_%TIMESTAMP%.sql
set ZIP_FILE=%DUMP_FILE%.zip

echo Backing up database: %DB_NAME%
pg_dump -U %DB_USER% -F p -f "%DUMP_FILE%" %DB_NAME%

IF %ERRORLEVEL% EQU 0 (
    powershell -NoLogo -NoProfile -Command "Compress-Archive -Path '%DUMP_FILE%' -DestinationPath '%ZIP_FILE%'"
    del "%DUMP_FILE%"
    echo Backup successful: %ZIP_FILE%

    rem ==== CALL POWERSHELL TO SEND EMAIL ====
    powershell -ExecutionPolicy Bypass -File "send_email.ps1" -zipPath "%ZIP_FILE%" -timestamp "%TIMESTAMP%"
) ELSE (
    echo Backup failed!
)
