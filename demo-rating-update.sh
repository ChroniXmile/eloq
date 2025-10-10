#!/bin/bash

# Demo script to show how to run the complete rating update workflow
# This script demonstrates the entire process of updating player ratings

set -e  # Exit on any error

echo "=== ELOQ Rating System Demo ==="
echo ""

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "1. Checking prerequisites..."
echo "   - Python 3.x: $(python3 --version)"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo ""

echo "2. Verifying project structure..."
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

echo "3. Preparing sample data..."
cd eloq-webapp

# Create data directory if it doesn't exist
mkdir -p data

# Generate sample matches data if it doesn't exist
if [ ! -f "data/matches.csv" ]; then
  echo "   Generating sample matches data..."
  npx tsx scripts/generate-matches-data.ts
else
  echo "   Using existing matches.csv"
fi

echo ""

echo "4. Running Python rating calculation..."
cd ..

# Run Python rating calculation
python3 pool_elo.py --matches eloq-webapp/data/matches.csv

echo ""
echo "   Generated files:"
echo "   - eloq-webapp/data/pool_ratings_report.csv"
echo "   - eloq-webapp/data/pool_final_ratings.csv"
echo ""

echo "5. Importing ratings to database..."
cd eloq-webapp

# Import results to database
npx tsx scripts/import-ratings.ts

echo ""

echo "6. Starting web application..."
echo "   To view the updated ratings, run in another terminal:"
echo "   cd eloq-webapp && npm run dev"
echo ""

echo "=== Demo completed successfully! ==="
echo ""
echo "Player ratings have been updated based on the match data."
echo "The web application will now display the updated rankings."