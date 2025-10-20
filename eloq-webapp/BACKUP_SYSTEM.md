# Database Backup and Recovery System

The ELOQ application includes a robust database backup and recovery system to ensure data availability and reliability.

## Features

- **Automatic Backups**: Scheduled database backups at configurable intervals
- **Manual Backups**: Create backups on-demand via API or UI
- **Backup Fallback**: When the database is unavailable, the system automatically falls back to the latest backup
- **Restore Functionality**: Complete database restoration from backup files
- **API Endpoints**:
  - `POST /api/data/backup` - Create a new backup
  - `POST /api/data/restore` - Restore from a backup
  - `GET /api/data/restore` - List available backups

## How It Works

### Backup Process
1. The system periodically exports all data from the PostgreSQL database
2. Data is saved to JSON files in the `./backups/` directory
3. Files are named with timestamps: `db-backup-YYYY-MM-DDTHH:MM:SSZ.json`

### Fallback Process
1. Application requests data via `data-connection.ts`
2. System tries to fetch from PostgreSQL database
3. If database is unavailable, system falls back to the latest backup
4. If no backup is available, system falls back to mock data

### Configuration
- Set `BACKUP_INTERVAL_MINUTES` environment variable to change backup frequency (default: 60 minutes)
- Backups are stored in the `./backups/` directory

## API Endpoints

### Create Backup
```
POST /api/data/backup
```

Creates a new database backup and returns the backup file path.

### Restore from Backup
```
POST /api/data/restore
```

Restores the database from the latest backup. Optionally, specify a backup file in the request body:
```json
{
  "backupFile": "db-backup-2023-06-15T10:30:00Z.json"
}
```

### List Available Backups
```
GET /api/data/restore
```

Returns a list of available backup files.

## UI Management

Access the backup management UI at `/data/backup-management` to:
- Create new backups
- View available backups
- Configure backup settings

## Implementation Details

The backup system is implemented in:
- `src/lib/db/backup-service.ts`: Core backup and restore functionality
- `src/lib/db/backup-scheduler.ts`: Automatic backup scheduling
- `src/app/api/data/`: API routes for backup operations
- `src/app/data/backup-management/page.tsx`: UI for backup management
- `src/lib/data-connection.ts`: Updated fallback logic to use backups