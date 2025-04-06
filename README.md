# Recommendation System with Sentiment Analysis

This project implements a recommendation system with sentiment analysis using collaborative filtering and machine learning. It consists of a Python backend for the recommendation algorithms and sentiment analysis, and a React frontend for the user interface.

## Features

- **Collaborative Filtering Recommendations**: Using SVD matrix factorization
- **Sentiment Analysis**: Analyzing user reviews to extract sentiment and key aspects
- **User Similarity**: Finding similar users based on their preferences
- **Item Similarity**: Finding similar items based on user ratings
- **Interactive Visualizations**: Visualizing sentiment analysis results

## Project Structure

The project is organized into two main components:

### Backend (Python)
- `backend/app.py`: Flask API server
- `backend/data.py`: Sample data management
- `backend/collaborative_filtering.py`: Recommendation model using collaborative filtering
- `backend/sentiment_analysis.py`: Sentiment analysis model for reviews

### Frontend (React)
- `src/App.tsx`: Main application component
- `src/components/`: UI components
- `src/lib/api.ts`: API client for communicating with the backend

## Setup and Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- Bun or npm

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd recommendation-sentiment-app/backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```
   python app.py
   ```
   The server will start at http://localhost:5000

### Frontend Setup
1. Navigate to the project root directory:
   ```
   cd recommendation-sentiment-app
   ```

2. Install dependencies:
   ```
   bun install / (used pnpm install)
   ```

3. Start the development server:
   ```
   bun run dev / (pnpm run dev)
   ```
   The application will be available at http://localhost:5173

## Usage

1. Select a user from the dropdown to see personalized recommendations
2. Click on any recommended item to view its sentiment analysis
3. Explore similar items and user reviews
4. Navigate between recommendations and sentiment analysis using the tabs

## Detailed Implementation

### Collaborative Filtering
The recommendation system uses Singular Value Decomposition (SVD) for matrix factorization to predict user ratings for items they haven't rated yet. It captures latent factors that explain user preferences and item characteristics.

#### How Collaborative Filtering Works in This Project:
1. A user-item rating matrix is constructed from user review data
2. The matrix is normalized by subtracting the mean rating
3. SVD decomposes the matrix into user factors and item factors
4. These factors capture latent preferences and item characteristics
5. New ratings are predicted by multiplying user and item factors
6. The system recommends items with the highest predicted ratings that the user hasn't rated yet

```python
# Key SVD implementation in collaborative_filtering.py
u, sigma, vt = svds(rating_matrix_normalized, k=min(self.n_factors, min(rating_matrix.shape)-1))
sigma_diag = np.diag(sigma)
self.user_factors = u
self.item_factors = vt.T
self.predicted_ratings = self.rating_mean + np.dot(np.dot(u, sigma_diag), vt)
```

### Sentiment Analysis

The sentiment analysis system analyzes user reviews to extract insights about products. This is a critical component that enriches the recommendation system by providing qualitative information about why users liked or disliked certain items.

#### Sentiment Analysis Architecture
The sentiment analysis pipeline consists of multiple stages:

1. **Review Collection**:
   - Reviews are collected for each item
   - Each review includes text content, rating, and timestamp

2. **Text Preprocessing**:
   - Conversion to lowercase
   - Removal of punctuation and numbers
   - Tokenization (splitting text into individual words)
   - Stopword removal (filtering out common words like "the", "and", etc.)
   - Lemmatization (reducing words to their base form)

3. **Sentiment Scoring**:
   - VADER (Valence Aware Dictionary and sEntiment Reasoner) is used for sentiment analysis
   - VADER is specifically tuned for social media content and product reviews
   - For each review, it generates:
     - Compound score (overall sentiment from -1 to 1)
     - Positive score (proportion of positive content)
     - Negative score (proportion of negative content)
     - Neutral score (proportion of neutral content)

4. **Sentiment Classification**:
   - Reviews are classified based on their compound score:
     - Positive: compound score ≥ 0.05
     - Negative: compound score ≤ -0.05
     - Neutral: compound score between -0.05 and 0.05

5. **Aspect Extraction**:
   - Identifies key topics or features mentioned in reviews
   - Current implementation uses frequency analysis
   - More advanced implementations could use part-of-speech tagging to extract nouns specifically

6. **Aggregation**:
   - Sentiment scores are aggregated across all reviews for an item
   - Calculates average compound, positive, negative, and neutral scores
   - Counts reviews in each sentiment category
   - Ranks aspects by frequency of mention

7. **Visualization**:
   - Generates visualizations of sentiment distribution
   - Shows distribution of compound scores
   - Displays top mentioned aspects
   - Presents average sentiment scores

#### Key Code Components

The sentiment analysis implementation is in `backend/sentiment_analysis.py`:

```python
class SentimentAnalyzer:
    def __init__(self):
        # Initialize VADER sentiment analyzer, lemmatizer, and stopwords
        self.sia = SentimentIntensityAnalyzer()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def get_sentiment(self, text):
        # Get raw sentiment scores from VADER
        return self.sia.polarity_scores(text)

    def classify_sentiment(self, text):
        # Classify text as positive, negative, or neutral
        scores = self.get_sentiment(text)
        compound = scores['compound']

        if compound >= 0.05:
            return 'positive'
        elif compound <= -0.05:
            return 'negative'
        else:
            return 'neutral'
```

#### Integration with Recommendations

The sentiment analysis is integrated with the recommendation system in several ways:

1. **Enhanced Item Information**:
   - Provides qualitative insights beyond just ratings
   - Shows why users liked or disliked an item

2. **User Experience**:
   - After receiving recommendations, users can explore sentiment analysis
   - Helps users make more informed decisions

3. **Visualization**:
   - Interactive visualizations make insights accessible
   - Shows sentiment distribution and key aspects

The Flask API integrates both systems:

```python
@app.route('/api/sentiment/<int:item_id>', methods=['GET'])
def get_sentiment_analysis(item_id):
    # Analyze the reviews for this item
    results = analyze_item_reviews(item_id)
    # Generate visualizations
    # Return response including sentiment scores, classification, aspects
```


## License

MIT
