// Sample data for recommendation system
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
  rating: number; // Scale of 1-5
  review: string;
  timestamp: number;
}

export const users: User[] = [
  { id: 1, name: "Alice", preferences: ["electronics", "books", "music"] },
  { id: 2, name: "Bob", preferences: ["sports", "electronics", "outdoor"] },
  { id: 3, name: "Charlie", preferences: ["books", "cooking", "movies"] },
  { id: 4, name: "Diana", preferences: ["travel", "music", "photography"] },
  { id: 5, name: "Evan", preferences: ["electronics", "gaming", "movies"] },
  { id: 6, name: "Fiona", preferences: ["cooking", "travel", "books"] },
  { id: 7, name: "George", preferences: ["sports", "outdoor", "health"] },
  { id: 8, name: "Hannah", preferences: ["photography", "art", "books"] },
  { id: 9, name: "Ian", preferences: ["gaming", "electronics", "movies"] },
  { id: 10, name: "Julia", preferences: ["travel", "cooking", "health"] },
];

export const items: Item[] = [
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
  {
    id: 9,
    name: "Gaming Console",
    category: "gaming",
    description: "Next-gen gaming console with cutting-edge graphics",
    tags: ["gaming", "electronics", "entertainment"],
    imageUrl: "https://placehold.co/400x300?text=Console",
  },
  {
    id: 10,
    name: "Travel Backpack",
    category: "travel",
    description: "Durable travel backpack with multiple compartments",
    tags: ["travel", "outdoor", "accessories"],
    imageUrl: "https://placehold.co/400x300?text=Backpack",
  },
  {
    id: 11,
    name: "Fitness Tracker",
    category: "health",
    description: "Advanced fitness tracker with heart rate monitoring",
    tags: ["health", "electronics", "fitness"],
    imageUrl: "https://placehold.co/400x300?text=Tracker",
  },
  {
    id: 12,
    name: "Art Supplies Set",
    category: "art",
    description: "Complete set of premium art supplies for professionals",
    tags: ["art", "creativity", "supplies"],
    imageUrl: "https://placehold.co/400x300?text=ArtSupplies",
  },
  {
    id: 13,
    name: "Sci-Fi Novel",
    category: "books",
    description: "Award-winning science fiction novel about space exploration",
    tags: ["books", "sci-fi", "fiction"],
    imageUrl: "https://placehold.co/400x300?text=SciFiBook",
  },
  {
    id: 14,
    name: "Wireless Earbuds",
    category: "electronics",
    description: "Compact wireless earbuds with immersive sound quality",
    tags: ["electronics", "music", "audio"],
    imageUrl: "https://placehold.co/400x300?text=Earbuds",
  },
  {
    id: 15,
    name: "Hiking Boots",
    category: "outdoor",
    description: "Waterproof hiking boots with superior traction",
    tags: ["outdoor", "hiking", "footwear"],
    imageUrl: "https://placehold.co/400x300?text=HikingBoots",
  },
];

export const ratings: Rating[] = [
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
    userId: 2,
    itemId: 1,
    rating: 3,
    review: "Decent phone but not worth the high price. Camera is good but battery drains too quickly.",
    timestamp: Date.now() - 500000,
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
  {
    userId: 3,
    itemId: 7,
    rating: 5,
    review: "Incredible movie! The special effects were mind-blowing and the story kept me on the edge of my seat.",
    timestamp: Date.now() - 200000,
  },
  {
    userId: 4,
    itemId: 10,
    rating: 5,
    review: "This backpack is perfect for my travel needs. So many useful compartments and very comfortable to wear.",
    timestamp: Date.now() - 100000,
  },
  {
    userId: 4,
    itemId: 8,
    rating: 4,
    review: "Excellent camera with amazing photo quality. The menu system is a bit confusing at first though.",
    timestamp: Date.now() - 90000,
  },
  {
    userId: 5,
    itemId: 9,
    rating: 5,
    review: "Best gaming console I've ever owned! The graphics are incredible and the game selection is fantastic.",
    timestamp: Date.now() - 80000,
  },
  {
    userId: 5,
    itemId: 7,
    rating: 4,
    review: "Great action movie with awesome effects. The plot was a bit predictable but still entertaining.",
    timestamp: Date.now() - 70000,
  },
  {
    userId: 5,
    itemId: 1,
    rating: 5,
    review: "This phone has revolutionized how I work. Fast, reliable, with an amazing display.",
    timestamp: Date.now() - 60000,
  },
  {
    userId: 6,
    itemId: 6,
    rating: 4,
    review: "Very good cookbook with beautiful photos. A few of the ingredients are hard to find though.",
    timestamp: Date.now() - 50000,
  },
  {
    userId: 6,
    itemId: 10,
    rating: 5,
    review: "This backpack has survived three continents with me. Durable, practical, and stylish!",
    timestamp: Date.now() - 40000,
  },
  {
    userId: 7,
    itemId: 5,
    rating: 4,
    review: "Good basketball, holds air well and has a nice feel. The grip could be slightly better.",
    timestamp: Date.now() - 30000,
  },
  {
    userId: 7,
    itemId: 4,
    rating: 5,
    review: "Excellent tent! Survived a major storm without a single leak and really easy to set up.",
    timestamp: Date.now() - 20000,
  },
  {
    userId: 7,
    itemId: 11,
    rating: 4,
    review: "Great fitness tracker, accurate measurements and long battery life. The app could use improvements.",
    timestamp: Date.now() - 10000,
  },
  {
    userId: 8,
    itemId: 8,
    rating: 5,
    review: "This camera has taken my photography to a new level. Incredible detail and color accuracy.",
    timestamp: Date.now() - 9000,
  },
  {
    userId: 8,
    itemId: 12,
    rating: 5,
    review: "Superb art supplies set! The quality of each item is exceptional, worth every penny.",
    timestamp: Date.now() - 8000,
  },
  {
    userId: 8,
    itemId: 2,
    rating: 4,
    review: "Really enjoyed this book. The author has a unique writing style that pulls you in.",
    timestamp: Date.now() - 7000,
  },
  {
    userId: 9,
    itemId: 9,
    rating: 5,
    review: "Absolutely love this gaming console! The controller feels perfect and loading times are minimal.",
    timestamp: Date.now() - 6000,
  },
  {
    userId: 9,
    itemId: 1,
    rating: 4,
    review: "Great smartphone with excellent performance. The camera could be better in low light though.",
    timestamp: Date.now() - 5000,
  },
  {
    userId: 9,
    itemId: 7,
    rating: 3,
    review: "Decent movie but not as good as the trailer suggested. Some scenes felt unnecessary.",
    timestamp: Date.now() - 4000,
  },
  {
    userId: 10,
    itemId: 10,
    rating: 5,
    review: "Perfect travel companion! This backpack has the perfect size and organization for all my trips.",
    timestamp: Date.now() - 3000,
  },
  {
    userId: 10,
    itemId: 6,
    rating: 5,
    review: "This cookbook has transformed my cooking. Every recipe is clearly explained with helpful tips.",
    timestamp: Date.now() - 2000,
  },
  {
    userId: 10,
    itemId: 11,
    rating: 4,
    review: "Very helpful fitness tracker. Helps me stay motivated and the sleep tracking is fascinating.",
    timestamp: Date.now() - 1000,
  },
  {
    userId: 1,
    itemId: 14,
    rating: 4,
    review: "These earbuds have great sound quality and fit comfortably. Battery life could be better though.",
    timestamp: Date.now() - 500,
  },
  {
    userId: 2,
    itemId: 15,
    rating: 5,
    review: "These hiking boots saved my trip! Incredible grip on wet rocks and totally waterproof.",
    timestamp: Date.now() - 250,
  },
];
