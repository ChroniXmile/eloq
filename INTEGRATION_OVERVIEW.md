# ELOQ Integration Overview

## System Architecture

The ELOQ system consists of two main components that work together to provide a complete pool/billiards rating solution:

1. **Python Rating Engine** (`pool_elo.py`) - Core rating calculation algorithm
2. **Next.js Web Application** (`eloq-webapp`) - User interface for displaying ratings and managing data

## Integration Workflow

### 1. Data Flow

```
Match Data (CSV) 
    ↓
Python Rating Engine (pool_elo.py)
    ↓
Calculated Ratings (CSV Output)
    ↓
TypeScript Import Scripts
    ↓
PostgreSQL Database
    ↓
Next.js Web Application
```

### 2. Key Integration Points

#### Python Rating Engine
- Located at: `pool_elo.py`
- Processes match data from CSV files
- Calculates Elo-like ratings with pool-specific adaptations
- Generates output CSV files with final ratings and detailed reports

#### Web Application Integration Layer
- Located in: `eloq-webapp/src/lib/db/`
- Provides database services for storing and retrieving player ratings
- Includes import functionality to load Python-generated CSV data
- Offers fallback to mock data when database is unavailable

#### Automation Scripts
- Shell scripts for orchestrating the complete workflow
- TypeScript scripts for database operations
- API endpoints for programmatic access

## File Structure

```
eloq/
├── pool_elo.py                 # Python rating calculation engine
├── pool_rating_spec.md         # Rating system specification
├── update-ratings.sh           # Main automation script
├── run-rating-calculation.py   # Script to run Python rating engine
├── demo-rating-update.sh       # Demonstration script
├── run-complete-rating-update.sh # Complete workflow script
├── eloq-webapp/                # Next.js web application
│   ├── src/
│   │   ├── lib/db/             # Database integration layer
│   │   │   ├── database-service.ts  # Main database service
│   │   │   ├── import-python-ratings.ts  # CSV import functionality
│   │   │   └── ...              # Other database utilities
│   │   ├── scripts/            # Automation scripts
│   │   │   ├── import-ratings.ts     # Import Python CSV to database
│   │   │   ├── update-player-ratings.ts  # Full rating update workflow
│   │   │   └── ...               # Other utility scripts
│   │   └── ...                 # Other application code
│   └── ...                     # Other webapp files
└── specs/                      # Feature specifications
    └── 001-i-am-building/      # Main feature specification
```

## Usage Patterns

### Manual Rating Update

```bash
# Update ratings with a single command
./update-ratings.sh

# Or run the complete workflow manually
python3 pool_elo.py --matches eloq-webapp/data/matches.csv
cd eloq-webapp
npx tsx scripts/import-ratings.ts
```

### Programmatic Rating Update

```bash
# Via TypeScript script
npx tsx eloq-webapp/scripts/update-player-ratings.ts

# Via API endpoint
curl -X POST http://localhost:3000/api/ratings/update
```

### Database Initialization

```bash
# Initialize database with Python-generated data
cd eloq-webapp
npx tsx scripts/init-db-with-python-data.ts
```

## Key Features of Integration

1. **Seamless Data Flow**: Match data flows from CSV files through the Python engine to the database and finally to the web UI
2. **Error Handling**: Robust error handling with fallback to mock data when database is unavailable
3. **Caching**: Implemented caching for better performance
4. **Validation**: Data validation at multiple layers
5. **Automation**: Complete automation scripts for end-to-end workflow
6. **Flexibility**: Support for both manual and programmatic rating updates
7. **Extensibility**: Modular design that allows easy extension

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live rating updates
2. **Scheduled Processing**: Cron jobs for automatic rating calculations
3. **Advanced Analytics**: Enhanced statistical analysis and visualization
4. **Data Validation**: Improved input validation for match data
5. **Performance Optimization**: Database indexing and query optimization
6. **Multi-tenancy**: Support for multiple leagues/organizations
7. **Historical Tracking**: Rating history and trend analysis

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials in `.env.local`
   - Ensure database schema is created

2. **Python Script Errors**
   - Verify Python 3.x is installed
   - Check match data CSV format
   - Ensure required Python packages are installed

3. **Import Failures**
   - Verify CSV output files exist
   - Check file permissions
   - Ensure database tables exist

### Debugging Steps

1. Run database connection test:
   ```bash
   cd eloq-webapp
   npx tsx test-db-connection.ts
   ```

2. Check Python script output:
   ```bash
   python3 pool_elo.py --matches eloq-webapp/data/matches.csv --verbose
   ```

3. Verify imported data:
   ```bash
   cd eloq-webapp
   npx tsx scripts/check-imported-data.ts
   ```

## Conclusion

The integration provides a robust, scalable solution for calculating and displaying pool/billiards player ratings. The system leverages the mathematical rigor of the Python rating engine while providing a modern, responsive web interface for users to view and interact with the data.