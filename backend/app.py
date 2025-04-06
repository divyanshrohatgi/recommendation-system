"""
Flask API for recommendation system and sentiment analysis.
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
import numpy as np
from data import users, items, ratings, save_to_json
from collaborative_filtering import CollaborativeFilteringRecommender, train_recommender, get_item_info, get_user_info
from sentiment_analysis import analyze_item_reviews
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the recommendation model
model = train_recommender()
print(f"Recommendation model trained. Rating matrix shape: {model.rating_matrix.shape}")

@app.route('/', methods=['GET'])
def index():
    """Return information about the API or redirect to frontend"""
    return jsonify({
        "message": "Recommendation and Sentiment Analysis API",
        "version": "1.0",
        "endpoints": {
            "users": "/api/users",
            "items": "/api/items", 
            "ratings": "/api/ratings",
            "recommendations": "/api/recommendations/<user_id>",
            "sentiment": "/api/sentiment/<item_id>",
            "similar_users": "/api/similar-users/<user_id>",
            "similar_items": "/api/similar-items/<item_id>"
        }
    })

@app.route('/favicon.ico')
def favicon():
    return "", 204  # No content response

@app.route('/api/users', methods=['GET'])
def get_users():
    """Return all users"""
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Return a specific user"""
    user = get_user_info(user_id)
    if user:
        return jsonify(user)
    return jsonify({"error": f"User with ID {user_id} not found"}), 404

@app.route('/api/items', methods=['GET'])
def get_items():
    """Return all items"""
    return jsonify(items)

@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Return a specific item"""
    item = get_item_info(item_id)
    if item:
        return jsonify(item)
    return jsonify({"error": f"Item with ID {item_id} not found"}), 404

@app.route('/api/ratings', methods=['GET'])
def get_all_ratings():
    """Return all ratings"""
    return jsonify(ratings)

@app.route('/api/ratings/<int:user_id>', methods=['GET'])
def get_user_ratings(user_id):
    """Return ratings for a specific user"""
    user_ratings = [r for r in ratings if r['userId'] == user_id]
    if user_ratings:
        return jsonify(user_ratings)
    return jsonify({"error": f"No ratings found for user with ID {user_id}"}), 404

@app.route('/api/ratings/<int:user_id>/<int:item_id>', methods=['GET'])
def get_specific_rating(user_id, item_id):
    """Return a specific rating"""
    for rating in ratings:
        if rating['userId'] == user_id and rating['itemId'] == item_id:
            return jsonify(rating)
    return jsonify({"error": f"Rating not found for user {user_id} and item {item_id}"}), 404

@app.route('/api/ratings', methods=['POST'])
def add_rating():
    """Add a new rating"""
    data = request.json

    # Validate required fields
    required_fields = ['userId', 'itemId', 'rating', 'review']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Add timestamp if not provided
    if 'timestamp' not in data:
        import time
        data['timestamp'] = time.time()

    # Add the new rating
    ratings.append(data)

    # Save to JSON file
    save_to_json()

    # Retrain the model
    global model
    model = train_recommender()

    return jsonify({"message": "Rating added successfully", "rating": data})

@app.route('/api/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Get recommendations for a user"""
    if user_id not in model.user_to_idx:
        return jsonify({"error": f"User with ID {user_id} not found"}), 404

    try:
        # Get number of recommendations from query param or use default
        n_recommendations = int(request.args.get('n', 5))

        # Get recommendations
        user_idx = model.user_to_idx[user_id]
        recommendations = model.recommend_items(user_idx, n_recommendations)

        # Format the results
        result = []
        for item_idx, predicted_rating in recommendations:
            item_id = model.idx_to_item[item_idx]
            item_info = get_item_info(item_id)

            # Include recommendation details
            result.append({
                'item': item_info,
                'predicted_rating': float(predicted_rating),
                'similarity_score': 0.0  # Placeholder for item similarity
            })

        # Get user info
        user_info = get_user_info(user_id)

        return jsonify({
            'user': user_info,
            'recommendations': result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/similar-users/<int:user_id>', methods=['GET'])
def get_similar_users(user_id):
    """Get users similar to the given user"""
    if user_id not in model.user_to_idx:
        return jsonify({"error": f"User with ID {user_id} not found"}), 404

    try:
        # Get number of similar users from query param or use default
        n_similar = int(request.args.get('n', 3))

        # Get similar users
        user_idx = model.user_to_idx[user_id]
        similar_users = model.get_similar_users(user_idx, n_similar)

        # Format the results
        result = []
        for sim_user_idx, similarity_score in similar_users:
            sim_user_id = model.idx_to_user[sim_user_idx]
            sim_user_info = get_user_info(sim_user_id)

            # Include similarity details
            result.append({
                'user': sim_user_info,
                'similarity_score': float(similarity_score)
            })

        # Get user info
        user_info = get_user_info(user_id)

        return jsonify({
            'user': user_info,
            'similar_users': result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/similar-items/<int:item_id>', methods=['GET'])
def get_similar_items(item_id):
    """Get items similar to the given item"""
    if item_id not in model.item_to_idx:
        return jsonify({"error": f"Item with ID {item_id} not found"}), 404

    try:
        # Get number of similar items from query param or use default
        n_similar = int(request.args.get('n', 4))

        # Get similar items
        item_idx = model.item_to_idx[item_id]
        similar_items = model.get_similar_items(item_idx, n_similar)

        # Format the results
        result = []
        for sim_item_idx, similarity_score in similar_items:
            sim_item_id = model.idx_to_item[sim_item_idx]
            sim_item_info = get_item_info(sim_item_id)

            # Include similarity details
            result.append({
                'item': sim_item_info,
                'similarity_score': float(similarity_score)
            })

        # Get item info
        item_info = get_item_info(item_id)

        return jsonify({
            'item': item_info,
            'similar_items': result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sentiment/<int:item_id>', methods=['GET'])
def get_sentiment_analysis(item_id):
    """Get sentiment analysis for a specific item"""
    try:
        # Analyze the reviews
        results = analyze_item_reviews(item_id)

        if 'error' in results:
            return jsonify({"error": results['error']}), 404

        # Generate visualization
        plt.figure(figsize=(15, 10))

        # Plot 1: Sentiment Distribution
        plt.subplot(2, 2, 1)
        sentiment_counts = results['sentiment_counts']
        labels = sentiment_counts.keys()
        sizes = sentiment_counts.values()
        plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=['green', 'red', 'gray'])
        plt.title(f"Sentiment Distribution for {results['item']['name']}")

        # Plot 2: Average Sentiment Scores
        plt.subplot(2, 2, 2)
        scores = [
            results['avg_positive'],
            results['avg_negative'],
            results['avg_neutral']
        ]
        categories = ['Positive', 'Negative', 'Neutral']
        colors = ['green', 'red', 'blue']
        plt.bar(categories, scores, color=colors)
        plt.title('Average Sentiment Scores')
        plt.ylim(0, 1)

        # Plot 3: Top Aspects
        plt.subplot(2, 2, 3)
        if results['top_aspects']:
            aspects, counts = zip(*results['top_aspects'][:5])  # Get top 5 aspects
            plt.bar(aspects, counts)
            plt.title('Top 5 Aspects Mentioned in Reviews')
            plt.xticks(rotation=45, ha='right')
        else:
            plt.text(0.5, 0.5, 'No aspects extracted', ha='center', va='center')
            plt.title('Aspects Mentioned in Reviews')

        # Plot 4: Compound Score Distribution
        plt.subplot(2, 2, 4)
        compound_scores = [r['sentiment']['compound'] for r in results['individual_results']]
        sns.histplot(compound_scores, kde=True)
        plt.title('Distribution of Compound Sentiment Scores')
        plt.axvline(x=0, color='r', linestyle='--')

        plt.tight_layout()

        # Save the figure to a bytes buffer
        buf = BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)

        # Encode the image as base64
        img_str = base64.b64encode(buf.read()).decode('utf-8')

        # Add visualization to results
        results['visualization'] = f"data:image/png;base64,{img_str}"

        # Remove individual results to reduce payload size
        if 'individual_results' in results:
            del results['individual_results']

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create data directory and JSON files if they don't exist
    if not os.path.exists('data'):
        save_to_json()

    app.run(host='0.0.0.0', port=5000, debug=True)
