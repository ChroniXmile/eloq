#!/usr/bin/env python3
"""
Script to run the pool rating calculation and generate CSV output files.
This script can be called from the web application to update player ratings.
"""

import subprocess
import sys
import os
import argparse

def run_rating_calculation(matches_file, seeds_file=None):
    """
    Run the pool rating calculation script with the specified input files.
    
    Args:
        matches_file (str): Path to the matches CSV file
        seeds_file (str, optional): Path to the seeds CSV file
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Ensure the pool_elo.py script exists
        script_path = os.path.join(os.path.dirname(__file__), 'pool_elo.py')
        if not os.path.exists(script_path):
            print(f"Error: pool_elo.py script not found at {script_path}")
            return False
        
        # Build the command
        cmd = [sys.executable, script_path, '--matches', matches_file]
        if seeds_file:
            cmd.extend(['--seeds', seeds_file])
        
        # Run the script
        print(f"Running rating calculation: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("Rating calculation completed successfully")
            print(result.stdout)
            return True
        else:
            print("Rating calculation failed:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"Error running rating calculation: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run pool rating calculation")
    parser.add_argument("--matches", required=True, help="Path to matches CSV file")
    parser.add_argument("--seeds", help="Optional path to seeds CSV file")
    
    args = parser.parse_args()
    
    success = run_rating_calculation(args.matches, args.seeds)
    sys.exit(0 if success else 1)