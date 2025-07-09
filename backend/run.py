"""
Simple script to run the recommendation and sentiment analysis backend
"""
import os
from data import save_to_json
from app import app

if __name__ == "__main__":
    # Create data files if they don't exist
    if not os.path.exists('data'):
        print("Initializing data...")
        save_to_json()

    # Run the Flask app
    print("Starting recommendation and sentiment analysis API...")
    app.run(host='0.0.0.0', port=5000, debug=True)
