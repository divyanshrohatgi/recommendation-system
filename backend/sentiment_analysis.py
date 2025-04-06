"""
Sentiment Analysis module for analyzing user reviews.
"""
import nltk
import numpy as np
import pandas as pd
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
from collections import Counter
from data import ratings, items
import matplotlib.pyplot as plt
import seaborn as sns

# Download necessary NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('sentiment/vader_lexicon.zip')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('vader_lexicon')
    nltk.download('stopwords')
    nltk.download('wordnet')

class SentimentAnalyzer:
    """Sentiment analysis for product reviews"""

    def __init__(self):
        """Initialize the sentiment analyzer"""
        self.sia = SentimentIntensityAnalyzer()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def preprocess_text(self, text):
        """
        Preprocess text for analysis

        Parameters:
        -----------
        text : str
            The text to preprocess

        Returns:
        --------
        list
            List of preprocessed tokens
        """
        # Convert to lowercase
        text = text.lower()

        # Remove punctuation and numbers
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\d+', '', text)

        # Tokenize
        tokens = word_tokenize(text)

        # Remove stopwords
        tokens = [token for token in tokens if token not in self.stop_words]

        # Lemmatize
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens]

        return tokens

    def get_sentiment(self, text):
        """
        Get sentiment scores for text

        Parameters:
        -----------
        text : str
            The text to analyze

        Returns:
        --------
        dict
            Dictionary of sentiment scores
        """
        return self.sia.polarity_scores(text)

    def classify_sentiment(self, text):
        """
        Classify text sentiment as positive, negative, or neutral

        Parameters:
        -----------
        text : str
            The text to classify

        Returns:
        --------
        str
            Sentiment classification ('positive', 'negative', or 'neutral')
        """
        scores = self.get_sentiment(text)
        compound = scores['compound']

        if compound >= 0.05:
            return 'positive'
        elif compound <= -0.05:
            return 'negative'
        else:
            return 'neutral'

    def extract_aspects(self, text, n=5):
        """
        Extract the most frequent aspects (nouns) from text

        Parameters:
        -----------
        text : str
            The text to analyze
        n : int
            Number of aspects to extract

        Returns:
        --------
        list
            List of most frequent aspects
        """
        tokens = self.preprocess_text(text)

        # For a more sophisticated approach, we would use part-of-speech tagging
        # to extract only nouns, but for simplicity, we'll just use frequency
        counter = Counter(tokens)

        # Return the n most common words
        return [word for word, _ in counter.most_common(n)]

    def analyze_reviews(self, reviews):
        """
        Analyze multiple reviews and return aggregated sentiment

        Parameters:
        -----------
        reviews : list
            List of review strings

        Returns:
        --------
        dict
            Dictionary with aggregated sentiment analysis results
        """
        results = []
        for review in reviews:
            sentiment = self.get_sentiment(review)
            classification = self.classify_sentiment(review)
            aspects = self.extract_aspects(review)

            results.append({
                'text': review,
                'sentiment': sentiment,
                'classification': classification,
                'aspects': aspects
            })

        # Aggregate results
        sentiment_counts = Counter([r['classification'] for r in results])
        avg_compound = np.mean([r['sentiment']['compound'] for r in results])
        avg_positive = np.mean([r['sentiment']['pos'] for r in results])
        avg_negative = np.mean([r['sentiment']['neg'] for r in results])
        avg_neutral = np.mean([r['sentiment']['neu'] for r in results])

        # Get all aspects and count frequencies
        all_aspects = [aspect for r in results for aspect in r['aspects']]
        aspect_counts = Counter(all_aspects)
        top_aspects = aspect_counts.most_common(10)

        return {
            'reviews_count': len(reviews),
            'sentiment_counts': dict(sentiment_counts),
            'avg_compound': avg_compound,
            'avg_positive': avg_positive,
            'avg_negative': avg_negative,
            'avg_neutral': avg_neutral,
            'top_aspects': top_aspects,
            'individual_results': results
        }

def analyze_item_reviews(item_id):
    """
    Analyze reviews for a specific item

    Parameters:
    -----------
    item_id : int
        The ID of the item

    Returns:
    --------
    dict
        Sentiment analysis results for the item
    """
    # Filter reviews for the specified item
    item_reviews = [r['review'] for r in ratings if r['itemId'] == item_id]

    if not item_reviews:
        return {'error': f'No reviews found for item with ID {item_id}'}

    # Get item info
    item_info = None
    for item in items:
        if item['id'] == item_id:
            item_info = item
            break

    if not item_info:
        return {'error': f'Item with ID {item_id} not found'}

    # Analyze reviews
    analyzer = SentimentAnalyzer()
    results = analyzer.analyze_reviews(item_reviews)

    # Add item info to results
    results['item'] = {
        'id': item_id,
        'name': item_info['name'],
        'category': item_info['category'],
        'description': item_info['description']
    }

    return results

def visualize_sentiment(analysis_results, save_path=None):
    """
    Create visualizations for sentiment analysis results

    Parameters:
    -----------
    analysis_results : dict
        Results from analyze_item_reviews
    save_path : str, optional
        Path to save the visualization image

    Returns:
    --------
    None
    """
    plt.figure(figsize=(15, 10))

    # Plot 1: Sentiment Distribution
    plt.subplot(2, 2, 1)
    sentiment_counts = analysis_results['sentiment_counts']
    labels = sentiment_counts.keys()
    sizes = sentiment_counts.values()
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=['green', 'red', 'gray'])
    plt.title(f"Sentiment Distribution for {analysis_results['item']['name']}")

    # Plot 2: Average Sentiment Scores
    plt.subplot(2, 2, 2)
    scores = [
        analysis_results['avg_positive'],
        analysis_results['avg_negative'],
        analysis_results['avg_neutral']
    ]
    categories = ['Positive', 'Negative', 'Neutral']
    colors = ['green', 'red', 'blue']
    plt.bar(categories, scores, color=colors)
    plt.title('Average Sentiment Scores')
    plt.ylim(0, 1)

    # Plot 3: Top Aspects
    plt.subplot(2, 2, 3)
    if analysis_results['top_aspects']:
        aspects, counts = zip(*analysis_results['top_aspects'][:5])  # Get top 5 aspects
        plt.bar(aspects, counts)
        plt.title('Top 5 Aspects Mentioned in Reviews')
        plt.xticks(rotation=45, ha='right')
    else:
        plt.text(0.5, 0.5, 'No aspects extracted', ha='center', va='center')
        plt.title('Aspects Mentioned in Reviews')

    # Plot 4: Compound Score Distribution
    plt.subplot(2, 2, 4)
    compound_scores = [r['sentiment']['compound'] for r in analysis_results['individual_results']]
    sns.histplot(compound_scores, kde=True)
    plt.title('Distribution of Compound Sentiment Scores')
    plt.axvline(x=0, color='r', linestyle='--')

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path)
        plt.close()
    else:
        plt.show()

if __name__ == "__main__":
    # Analyze reviews for a few items
    for item_id in [1, 2, 6]:
        print(f"Analyzing item {item_id}...")
        results = analyze_item_reviews(item_id)

        if 'error' in results:
            print(results['error'])
            continue

        print(f"Item: {results['item']['name']}")
        print(f"Category: {results['item']['category']}")
        print(f"Number of reviews: {results['reviews_count']}")
        print(f"Sentiment distribution: {results['sentiment_counts']}")
        print(f"Average compound score: {results['avg_compound']:.2f}")
        print(f"Top aspects mentioned: {results['top_aspects']}")
        print("-" * 50)

        # Create and save visualization
        visualize_sentiment(results, f"item_{item_id}_sentiment.png")
