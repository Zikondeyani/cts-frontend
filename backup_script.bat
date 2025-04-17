@echo off
setlocal

REM === Configuration ===
set "DB_NAME=commodity_tracking_db"
set "DB_USER=postgres"
set "PGPASSWORD=guido"
set "BACKUP_DIR=C:\frontends\CTS_FRONTEND\backups"
set "TIMESTAMP=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "DUMP_FILE=%BACKUP_DIR%\%DB_NAME%_backup_%TIMESTAMP%.sql"
set "ZIP_FILE=%DUMP_FILE%.zip"

REM === Backing up database ===
echo Backing up database: %DB_NAME%
set "PG_DUMP_PATH=C:\Program Files\PostgreSQL\16\bin\pg_dump.exe"

REM Run pg_dump and handle spaces in the path correctly
"%PG_DUMP_PATH%" -U %DB_USER% -F p -f "%DUMP_FILE%" %DB_NAME%

IF %ERRORLEVEL% EQU 0 (
    echo Compressing backup... 
    powershell -NoLogo -NoProfile -Command "Compress-Archive -Path '%DUMP_FILE%' -DestinationPath '%ZIP_FILE%'"
    
    REM Delete the uncompressed dump file
    del "%DUMP_FILE%"

    echo Backup successful: %ZIP_FILE%

    REM ==== CALL POWERSHELL TO SEND EMAIL ====
    powershell -ExecutionPolicy Bypass -File "send_email.ps1" -zipPath "%ZIP_FILE%" -timestamp "%TIMESTAMP%"

) ELSE (
    echo Backup failed!
)

endlocal
