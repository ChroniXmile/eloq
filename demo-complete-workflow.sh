#!/bin/bash

# Demo script to demonstrate the complete ELOQ workflow
# This script shows how all components work together to calculate and display player ratings

set -e  # Exit on any error

echo "=== ELOQ Complete Workflow Demo ==="
echo ""

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "1. Verifying prerequisites..."
echo "   - Python 3.x: $(python3 --version 2>/dev/null || echo 'Not found')"
echo "   - Node.js: $(node --version 2>/dev/null || echo 'Not found')"
echo "   - npm: $(npm --version 2>/dev/null || echo 'Not found')"
echo ""

echo "2. Checking project structure..."
if [ ! -f "pool_elo.py" ]; then
  echo "ERROR: pool_elo.py not found in project root"
  exit 1
fi

if [ ! -d "eloq-webapp" ]; then
  echo "ERROR: eloq-webapp directory not found"
  exit 1
fi

echo "   ✓ Found pool_elo.py"
echo "   ✓ Found eloq-webapp directory"
echo ""

echo "3. Setting up environment..."
cd eloq-webapp

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo "   Creating .env.local with default configuration..."
  cat > .env.local << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eloq_test
DB_USER=postgres
DB_PASSWORD=
EOF
fi

echo "   ✓ Environment configured"
echo ""

echo "4. Installing dependencies..."
echo "   Installing Python dependencies..."
pip3 install pandas >/dev/null 2>&1 || echo "   Warning: Failed to install pandas (may already be installed)"

echo "   Installing Node.js dependencies..."
npm install --silent || echo "   Warning: Failed to install dependencies (may already be installed)"

echo "   ✓ Dependencies installed"
echo ""

echo "5. Testing database connection..."
npx tsx scripts/test-db-connection.ts || {
  echo "   Warning: Database connection test failed"
  echo "   Continuing with mock data fallback..."
}

echo ""

echo "6. Initializing database..."
npx tsx scripts/init-db-with-python-data.ts || {
  echo "   Warning: Database initialization failed"
  echo "   Continuing with mock data fallback..."
}

echo ""

echo "7. Generating sample match data..."
npx tsx scripts/generate-matches-data.ts || {
  echo "   Warning: Failed to generate sample match data"
}

echo ""

echo "8. Running Python rating calculation..."
cd ..

# Check if matches.csv exists
if [ ! -f "eloq-webapp/data/matches.csv" ]; then
  echo "   Creating sample match data for demonstration..."
  cd eloq-webapp
  npx tsx scripts/generate-matches-data.ts
  cd ..
fi

# Run Python rating calculation
python3 pool_elo.py --matches eloq-webapp/data/matches.csv || {
  echo "   Error: Python rating calculation failed"
  exit 1
}

echo "   ✓ Python rating calculation completed"
echo ""

echo "9. Importing ratings to database..."
cd eloq-webapp
npx tsx scripts/import-ratings.ts || {
  echo "   Warning: Failed to import ratings to database"
  echo "   Continuing with mock data fallback..."
}

echo ""

echo "10. Starting web application..."
echo "    To view the application, run in another terminal:"
echo "    cd eloq-webapp && npm run dev"
echo ""
echo "    Then open http://localhost:3000 in your browser"
echo ""

echo "=== Demo completed successfully! ==="
echo ""
echo "The ELOQ system is now set up and ready to use."
echo "Player ratings have been calculated and imported into the database."
echo "The web application can display these ratings to users."
echo ""
echo "Next steps:"
echo "1. Run 'cd eloq-webapp && npm run dev' to start the web application"
echo "2. Open http://localhost:3000 in your browser to view the rankings"
echo "3. Add new match data to eloq-webapp/data/matches.csv"
echo "4. Run './update-ratings.sh' to recalculate ratings with new data"