/**
 * API client for interacting with the recommendation and sentiment analysis backend
 * (Using mock data for demonstration)
 */
import axios from 'axios';
import { mockUsers, mockItems, mockRatings, getMockRecommendations, getMockSimilarItems, getMockSentimentAnalysis } from './mockData';

// API base URL (not used in mock mode)
const API_BASE_URL = 'http://localhost:5000/api';

// Flag to enable/disable mock mode
const USE_MOCK_DATA = true;

// API client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces
export interface User {
  id: number;
  name: string;
  preferences: string[];
}

export interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

export interface Rating {
  userId: number;
  itemId: number;
  rating: number;
  review: string;
  timestamp: number;
}

export interface RecommendationResult {
  user: User;
  recommendations: {
    item: Item;
    predicted_rating: number;
    similarity_score: number;
  }[];
}

export interface SimilarUsersResult {
  user: User;
  similar_users: {
    user: User;
    similarity_score: number;
  }[];
}

export interface SimilarItemsResult {
  item: Item;
  similar_items: {
    item: Item;
    similarity_score: number;
  }[];
}

export interface SentimentResult {
  item: {
    id: number;
    name: string;
    category: string;
    description: string;
  };
  reviews_count: number;
  sentiment_counts: {
    positive: number;
    negative: number;
    neutral: number;
  };
  avg_compound: number;
  avg_positive: number;
  avg_negative: number;
  avg_neutral: number;
  top_aspects: [string, number][];
  visualization: string;
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API methods
export const api = {
  // User endpoints
  getUsers: async (): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      await delay(300); // Simulate network delay
      return mockUsers;
    }
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUser: async (userId: number): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error(`User with ID ${userId} not found`);
      return user;
    }
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Item endpoints
  getItems: async (): Promise<Item[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockItems;
    }
    const response = await apiClient.get('/items');
    return response.data;
  },

  getItem: async (itemId: number): Promise<Item> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const item = mockItems.find(i => i.id === itemId);
      if (!item) throw new Error(`Item with ID ${itemId} not found`);
      return item;
    }
    const response = await apiClient.get(`/items/${itemId}`);
    return response.data;
  },

  // Rating endpoints
  getRatings: async (): Promise<Rating[]> => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockRatings;
    }
    const response = await apiClient.get('/ratings');
    return response.data;
  },

  getUserRatings: async (userId: number): Promise<Rating[]> => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockRatings.filter(r => r.userId === userId);
    }
    const response = await apiClient.get(`/ratings/${userId}`);
    return response.data;
  },

  addRating: async (rating: Omit<Rating, 'timestamp'>): Promise<Rating> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newRating = {
        ...rating,
        timestamp: Date.now()
      };
      // In a real implementation, we would add this to mockRatings
      return newRating;
    }
    const response = await apiClient.post('/ratings', rating);
    return response.data.rating;
  },

  // Recommendation endpoints
  getRecommendations: async (userId: number, count = 5): Promise<RecommendationResult> => {
    if (USE_MOCK_DATA) {
      await delay(800); // Longer delay to simulate ML processing
      return getMockRecommendations(userId);
    }
    const response = await apiClient.get(`/recommendations/${userId}?n=${count}`);
    return response.data;
  },

  getSimilarUsers: async (userId: number, count = 3): Promise<SimilarUsersResult> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error(`User with ID ${userId} not found`);

      // Get random users that aren't the current user
      const otherUsers = mockUsers.filter(u => u.id !== userId);
      const similarUsers = otherUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
        .map((user, index) => ({
          user,
          similarity_score: 0.9 - (index * 0.1)
        }));

      return {
        user,
        similar_users: similarUsers
      };
    }
    const response = await apiClient.get(`/similar-users/${userId}?n=${count}`);
    return response.data;
  },

  getSimilarItems: async (itemId: number, count = 4): Promise<SimilarItemsResult> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      return getMockSimilarItems(itemId);
    }
    const response = await apiClient.get(`/similar-items/${itemId}?n=${count}`);
    return response.data;
  },

  // Sentiment analysis endpoint
  getSentimentAnalysis: async (itemId: number): Promise<SentimentResult> => {
    if (USE_MOCK_DATA) {
      await delay(1000); // Longer delay to simulate NLP processing
      return getMockSentimentAnalysis(itemId);
    }
    const response = await apiClient.get(`/sentiment/${itemId}`);
    return response.data;
  },
};
