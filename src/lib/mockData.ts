import { User, Item, Rating, RecommendationResult, SentimentResult, SimilarItemsResult } from './api';

// Mock users
export const mockUsers: User[] = [
  { id: 1, name: "Alice", preferences: ["electronics", "books", "music"] },
  { id: 2, name: "Bob", preferences: ["sports", "electronics", "outdoor"] },
  { id: 3, name: "Charlie", preferences: ["books", "cooking", "movies"] },
  { id: 4, name: "Diana", preferences: ["travel", "music", "photography"] },
  { id: 5, name: "Evan", preferences: ["electronics", "gaming", "movies"] },
];

// Mock items
export const mockItems: Item[] = [
  {
    id: 1,
    name: "Smartphone XYZ",
    category: "electronics",
    description: "Latest smartphone with advanced camera and long battery life",
    tags: ["electronics", "smartphone", "technology"],
    imageUrl: "https://placehold.co/400x300?text=Smartphone",
  },
  {
    id: 2,
    name: "Fantasy Novel",
    category: "books",
    description: "Bestselling fantasy novel set in a magical world",
    tags: ["books", "fantasy", "fiction"],
    imageUrl: "https://placehold.co/400x300?text=Novel",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "electronics",
    description: "Noise-cancelling wireless headphones with premium sound",
    tags: ["electronics", "music", "audio"],
    imageUrl: "https://placehold.co/400x300?text=Headphones",
  },
  {
    id: 4,
    name: "Camping Tent",
    category: "outdoor",
    description: "Spacious waterproof tent for 4 people",
    tags: ["outdoor", "camping", "travel"],
    imageUrl: "https://placehold.co/400x300?text=Tent",
  },
  {
    id: 5,
    name: "Basketball",
    category: "sports",
    description: "Official size basketball with superior grip",
    tags: ["sports", "basketball", "outdoor"],
    imageUrl: "https://placehold.co/400x300?text=Basketball",
  },
  {
    id: 6,
    name: "Cookbook",
    category: "cooking",
    description: "International recipes with easy-to-follow instructions",
    tags: ["cooking", "books", "food"],
    imageUrl: "https://placehold.co/400x300?text=Cookbook",
  },
  {
    id: 7,
    name: "Action Movie",
    category: "movies",
    description: "High-octane action film with stunning visual effects",
    tags: ["movies", "action", "entertainment"],
    imageUrl: "https://placehold.co/400x300?text=Movie",
  },
  {
    id: 8,
    name: "Digital Camera",
    category: "photography",
    description: "Professional-grade digital camera with 4K video capability",
    tags: ["photography", "electronics", "technology"],
    imageUrl: "https://placehold.co/400x300?text=Camera",
  },
];

// Mock ratings
export const mockRatings: Rating[] = [
  {
    userId: 1,
    itemId: 1,
    rating: 5,
    review: "This smartphone is amazing! The camera quality exceeded my expectations and battery life is excellent.",
    timestamp: Date.now() - 1000000,
  },
  {
    userId: 1,
    itemId: 3,
    rating: 4,
    review: "Great headphones with excellent sound quality. Noise cancellation works well but they're a bit heavy.",
    timestamp: Date.now() - 900000,
  },
  {
    userId: 1,
    itemId: 2,
    rating: 5,
    review: "Couldn't put this book down! The world-building is phenomenal and characters are well-developed.",
    timestamp: Date.now() - 800000,
  },
  {
    userId: 2,
    itemId: 5,
    rating: 5,
    review: "Perfect basketball, great grip and bounce. Exactly what I needed for my games.",
    timestamp: Date.now() - 700000,
  },
  {
    userId: 2,
    itemId: 4,
    rating: 4,
    review: "Solid tent, easy to set up. Kept us dry during a rainy weekend but a bit heavy to carry.",
    timestamp: Date.now() - 600000,
  },
  {
    userId: 3,
    itemId: 6,
    rating: 5,
    review: "Best cookbook I've ever used! Every recipe I've tried has turned out perfect.",
    timestamp: Date.now() - 400000,
  },
  {
    userId: 3,
    itemId: 2,
    rating: 4,
    review: "Great story with memorable characters. The ending was a bit rushed though.",
    timestamp: Date.now() - 300000,
  },
];

// Mock recommendations for each user
export const getMockRecommendations = (userId: number): RecommendationResult => {
  const user = mockUsers.find(u => u.id === userId)!;

  // Map of user IDs to recommended item IDs with predicted ratings
  const recommendationMap: Record<number, { itemIds: number[], ratings: number[] }> = {
    1: {
      itemIds: [6, 7, 5, 8],
      ratings: [4.8, 4.6, 4.3, 4.1]
    },
    2: {
      itemIds: [1, 3, 7, 8],
      ratings: [4.9, 4.7, 4.4, 4.2]
    },
    3: {
      itemIds: [1, 3, 4, 5],
      ratings: [4.7, 4.5, 4.3, 4.0]
    },
    4: {
      itemIds: [1, 2, 6, 7],
      ratings: [4.8, 4.6, 4.4, 4.1]
    },
    5: {
      itemIds: [2, 4, 5, 6],
      ratings: [4.9, 4.7, 4.5, 4.2]
    }
  };

  const userRecommendations = recommendationMap[userId] || { itemIds: [1, 2, 3], ratings: [4.5, 4.3, 4.0] };

  return {
    user,
    recommendations: userRecommendations.itemIds.map((itemId, index) => {
      const item = mockItems.find(i => i.id === itemId)!;
      return {
        item,
        predicted_rating: userRecommendations.ratings[index],
        similarity_score: 0.85 - (index * 0.05)
      };
    })
  };
};

// Mock similar items
export const getMockSimilarItems = (itemId: number): SimilarItemsResult => {
  const item = mockItems.find(i => i.id === itemId)!;

  // Get 3 random items that aren't the current item
  const otherItems = mockItems.filter(i => i.id !== itemId);
  const similarItems = otherItems
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((item, index) => ({
      item,
      similarity_score: 0.9 - (index * 0.1)
    }));

  return {
    item,
    similar_items: similarItems
  };
};

// Mock sentiment analysis
export const getMockSentimentAnalysis = (itemId: number): SentimentResult => {
  const item = mockItems.find(i => i.id === itemId)!;
  const itemRatings = mockRatings.filter(r => r.itemId === itemId);

  // Generate mock sentiment distribution based on actual ratings
  const positiveCount = itemRatings.filter(r => r.rating >= 4).length;
  const negativeCount = itemRatings.filter(r => r.rating <= 2).length;
  const neutralCount = itemRatings.length - positiveCount - negativeCount;

  // Calculate mock compound score based on ratings
  const avgRating = itemRatings.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, itemRatings.length);
  const normalizedCompound = ((avgRating - 1) / 4) * 2 - 1; // Convert 1-5 to -1 to 1

  // Extract mock aspects from reviews
  const aspects: [string, number][] = [];
  if (item.category === "electronics") {
    aspects.push(["quality", 3], ["battery", 2], ["camera", 2], ["price", 1]);
  } else if (item.category === "books") {
    aspects.push(["story", 3], ["characters", 2], ["writing", 2], ["ending", 1]);
  } else if (item.category === "outdoor") {
    aspects.push(["durability", 3], ["size", 2], ["weight", 2], ["waterproof", 1]);
  } else {
    aspects.push(["quality", 3], ["design", 2], ["value", 2], ["performance", 1]);
  }

  // Create a mock base64 image for visualization
  // This is a tiny transparent PNG
  const mockVisualization = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  return {
    item: {
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description
    },
    reviews_count: itemRatings.length || Math.floor(Math.random() * 10) + 5,
    sentiment_counts: {
      positive: positiveCount || Math.floor(Math.random() * 8) + 2,
      negative: negativeCount || Math.floor(Math.random() * 2),
      neutral: neutralCount || Math.floor(Math.random() * 3) + 1
    },
    avg_compound: normalizedCompound || Math.random() * 0.8,
    avg_positive: 0.7,
    avg_negative: 0.1,
    avg_neutral: 0.2,
    top_aspects: aspects,
    visualization: mockVisualization
  };
};
