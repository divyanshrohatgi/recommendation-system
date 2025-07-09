"""
Collaborative Filtering recommendation model using SVD matrix factorization.
"""
import numpy as np
from scipy.sparse.linalg import svds
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from data import create_rating_matrix, users, items, ratings

class CollaborativeFilteringRecommender:
    """Collaborative Filtering recommender using SVD matrix factorization"""

    def __init__(self, n_factors=20):
        """
        Initialize the recommender system

        Parameters:
        -----------
        n_factors : int
            Number of latent factors to use in matrix factorization
        """
        self.n_factors = n_factors
        self.user_to_idx = None
        self.item_to_idx = None
        self.idx_to_user = None
        self.idx_to_item = None
        self.user_factors = None
        self.item_factors = None
        self.rating_mean = None
        self.rating_matrix = None
        self.rating_matrix_normalized = None

    def fit(self, rating_matrix):
        """
        Fit the collaborative filtering model to the rating matrix

        Parameters:
        -----------
        rating_matrix : numpy.ndarray
            User-item rating matrix
        """
        self.rating_matrix = rating_matrix

        # Normalize the ratings (center around the mean)
        self.rating_mean = np.mean(rating_matrix[rating_matrix > 0])
        rating_matrix_normalized = rating_matrix.copy()
        rating_matrix_normalized[rating_matrix > 0] -= self.rating_mean
        self.rating_matrix_normalized = rating_matrix_normalized

        # Apply SVD
        u, sigma, vt = svds(rating_matrix_normalized, k=min(self.n_factors, min(rating_matrix.shape)-1))

        # Convert sigma to diagonal matrix
        sigma_diag = np.diag(sigma)

        # Save latent factors
        self.user_factors = u
        self.item_factors = vt.T

        # Predict ratings using matrix factorization
        self.predicted_ratings = self.rating_mean + np.dot(np.dot(u, sigma_diag), vt)

        return self

    def recommend_items(self, user_idx, n_recommendations=5, exclude_rated=True):
        """
        Generate recommendations for a user

        Parameters:
        -----------
        user_idx : int
            User index in the rating matrix
        n_recommendations : int
            Number of recommendations to generate
        exclude_rated : bool
            Whether to exclude items that the user has already rated

        Returns:
        --------
        recommendations : list of tuples
            List of (item_idx, predicted_rating) tuples
        """
        # Get user's predicted ratings
        user_ratings = self.predicted_ratings[user_idx, :]

        # If excluding rated items, set their ratings to -inf
        if exclude_rated:
            already_rated = self.rating_matrix[user_idx, :] > 0
            user_ratings[already_rated] = -np.inf

        # Get top N item indices
        top_indices = np.argsort(user_ratings)[::-1][:n_recommendations]

        # Return recommendations as (item_idx, predicted_rating) tuples
        return [(idx, user_ratings[idx]) for idx in top_indices]

    def get_similar_users(self, user_idx, n_similar=5):
        """
        Find users similar to the given user

        Parameters:
        -----------
        user_idx : int
            User index in the rating matrix
        n_similar : int
            Number of similar users to find

        Returns:
        --------
        similar_users : list of tuples
            List of (user_idx, similarity_score) tuples
        """
        # Compute cosine similarity between users
        user_similarity = cosine_similarity(self.user_factors)

        # Get similarity scores for the specified user
        similarities = user_similarity[user_idx, :]

        # Set self-similarity to -inf to exclude from results
        similarities[user_idx] = -np.inf

        # Get top N similar user indices
        top_indices = np.argsort(similarities)[::-1][:n_similar]

        # Return similar users as (user_idx, similarity) tuples
        return [(idx, similarities[idx]) for idx in top_indices]

    def get_similar_items(self, item_idx, n_similar=5):
        """
        Find items similar to the given item

        Parameters:
        -----------
        item_idx : int
            Item index in the rating matrix
        n_similar : int
            Number of similar items to find

        Returns:
        --------
        similar_items : list of tuples
            List of (item_idx, similarity_score) tuples
        """
        # Compute cosine similarity between items
        item_similarity = cosine_similarity(self.item_factors)

        # Get similarity scores for the specified item
        similarities = item_similarity[item_idx, :]

        # Set self-similarity to -inf to exclude from results
        similarities[item_idx] = -np.inf

        # Get top N similar item indices
        top_indices = np.argsort(similarities)[::-1][:n_similar]

        # Return similar items as (item_idx, similarity) tuples
        return [(idx, similarities[idx]) for idx in top_indices]

def train_recommender():
    """Train the collaborative filtering recommender using the sample data"""
    # Create rating matrix
    rating_matrix, user_to_idx, item_to_idx = create_rating_matrix()

    # Create inverse mappings
    idx_to_user = {idx: user_id for user_id, idx in user_to_idx.items()}
    idx_to_item = {idx: item_id for item_id, idx in item_to_idx.items()}

    # Initialize and train model
    model = CollaborativeFilteringRecommender(n_factors=10)
    model.fit(rating_matrix)

    # Store mappings
    model.user_to_idx = user_to_idx
    model.item_to_idx = item_to_idx
    model.idx_to_user = idx_to_user
    model.idx_to_item = idx_to_item

    return model

def get_item_info(item_id):
    """Get item information by ID"""
    for item in items:
        if item["id"] == item_id:
            return item
    return None

def get_user_info(user_id):
    """Get user information by ID"""
    for user in users:
        if user["id"] == user_id:
            return user
    return None

def print_recommendations(model, user_id, n_recommendations=5):
    """Print recommendations for a user in a readable format"""
    if user_id not in model.user_to_idx:
        print(f"User ID {user_id} not found.")
        return

    user_idx = model.user_to_idx[user_id]
    recommendations = model.recommend_items(user_idx, n_recommendations)

    user_info = get_user_info(user_id)
    print(f"Recommendations for {user_info['name']} (ID: {user_id}):")

    for i, (item_idx, predicted_rating) in enumerate(recommendations, 1):
        item_id = model.idx_to_item[item_idx]
        item_info = get_item_info(item_id)
        print(f"{i}. {item_info['name']} (ID: {item_id}) - Predicted rating: {predicted_rating:.2f}")
        print(f"   Category: {item_info['category']}")
        print(f"   Description: {item_info['description']}")
        print()

if __name__ == "__main__":
    # Train the recommender
    model = train_recommender()

    # Print recommendations for a few users
    for user_id in [1, 3, 5]:
        print_recommendations(model, user_id)
        print("-" * 50)
