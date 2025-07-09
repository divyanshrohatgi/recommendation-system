export interface User {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface Rating {
  userId: number;
  itemId: number;
  rating: number;
  review?: string;
  timestamp: Date;
}

// Sample Users
export const users: User[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "Diana Prince" },
  { id: 5, name: "Edward Cullen" },
  { id: 6, name: "Frank Castle" },
  { id: 7, name: "Grace Kelly" },
  { id: 8, name: "Henry Ford" },
  { id: 9, name: "Irene Adler" },
  { id: 10, name: "John Watson" },
];

// Sample Movies
export const items: Item[] = [
  {
    id: 1,
    name: "The Shawshank Redemption",
    category: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  },
  {
    id: 2,
    name: "The Godfather",
    category: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
  },
  {
    id: 3,
    name: "The Dark Knight",
    category: "Action",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  {
    id: 4,
    name: "Pulp Fiction",
    category: "Crime",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
  },
  {
    id: 5,
    name: "Forrest Gump",
    category: "Drama",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart."
  },
  {
    id: 6,
    name: "Inception",
    category: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
  },
  {
    id: 7,
    name: "The Matrix",
    category: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence."
  },
  {
    id: 8,
    name: "Titanic",
    category: "Romance",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
  },
  {
    id: 9,
    name: "Avatar",
    category: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
    description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home."
  },
  {
    id: 10,
    name: "Interstellar",
    category: "Sci-Fi",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  }
];

// Sample ratings with some reviews (some positive, some negative, some neutral)
export const ratings: Rating[] = [
  { userId: 1, itemId: 1, rating: 5, review: "Absolutely incredible. One of the best films ever made!", timestamp: new Date("2023-01-15") },
  { userId: 1, itemId: 2, rating: 4, review: "A true classic. Brando's performance is legendary.", timestamp: new Date("2023-01-20") },
  { userId: 1, itemId: 3, rating: 5, review: "Heath Ledger's Joker makes this a masterpiece.", timestamp: new Date("2023-02-05") },
  { userId: 1, itemId: 6, rating: 4, timestamp: new Date("2023-02-10") },
  { userId: 1, itemId: 9, rating: 3, review: "Visually stunning but the story is a bit predictable.", timestamp: new Date("2023-03-01") },

  { userId: 2, itemId: 1, rating: 4, timestamp: new Date("2023-01-10") },
  { userId: 2, itemId: 3, rating: 5, review: "Best superhero movie ever!", timestamp: new Date("2023-01-30") },
  { userId: 2, itemId: 5, rating: 2, review: "Too long and sentimental for my taste.", timestamp: new Date("2023-02-15") },
  { userId: 2, itemId: 7, rating: 5, review: "Revolutionary when it came out. Still holds up.", timestamp: new Date("2023-02-25") },
  { userId: 2, itemId: 10, rating: 4, timestamp: new Date("2023-03-15") },

  { userId: 3, itemId: 2, rating: 5, review: "Cannot be topped. Perfect in every way.", timestamp: new Date("2023-01-05") },
  { userId: 3, itemId: 4, rating: 5, review: "Tarantino at his best. Iconic dialogue and characters.", timestamp: new Date("2023-01-25") },
  { userId: 3, itemId: 6, rating: 3, review: "Interesting concept but can be confusing.", timestamp: new Date("2023-02-20") },
  { userId: 3, itemId: 8, rating: 2, review: "Too melodramatic and clichéd. Great effects though.", timestamp: new Date("2023-03-05") },
  { userId: 3, itemId: 10, rating: 4, timestamp: new Date("2023-03-20") },

  { userId: 4, itemId: 1, rating: 5, timestamp: new Date("2023-01-12") },
  { userId: 4, itemId: 3, rating: 4, review: "Great but a bit overhyped.", timestamp: new Date("2023-02-01") },
  { userId: 4, itemId: 5, rating: 5, review: "Heartwarming and profound. Tom Hanks is perfect.", timestamp: new Date("2023-02-22") },
  { userId: 4, itemId: 7, rating: 3, timestamp: new Date("2023-03-10") },
  { userId: 4, itemId: 9, rating: 4, review: "James Cameron's vision is breathtaking.", timestamp: new Date("2023-03-25") },

  { userId: 5, itemId: 2, rating: 4, timestamp: new Date("2023-01-08") },
  { userId: 5, itemId: 4, rating: 3, review: "Good but not for everyone. Very violent.", timestamp: new Date("2023-01-28") },
  { userId: 5, itemId: 6, rating: 5, review: "Mind-blowing! Christopher Nolan's masterpiece.", timestamp: new Date("2023-02-18") },
  { userId: 5, itemId: 8, rating: 4, review: "A beautiful love story with spectacular disaster scenes.", timestamp: new Date("2023-03-08") },
  { userId: 5, itemId: 10, rating: 5, review: "Scientifically accurate and emotionally powerful.", timestamp: new Date("2023-03-28") },

  { userId: 6, itemId: 1, rating: 4, review: "Powerful prison drama with excellent performances.", timestamp: new Date("2023-01-14") },
  { userId: 6, itemId: 3, rating: 5, timestamp: new Date("2023-02-03") },
  { userId: 6, itemId: 5, rating: 3, review: "Enjoyable but a bit simplistic.", timestamp: new Date("2023-02-24") },
  { userId: 6, itemId: 7, rating: 5, review: "Revolutionized action sci-fi forever. Iconic.", timestamp: new Date("2023-03-12") },
  { userId: 6, itemId: 9, rating: 2, review: "Just a fancy tech demo with derivative plot.", timestamp: new Date("2023-03-27") },

  { userId: 7, itemId: 2, rating: 5, timestamp: new Date("2023-01-06") },
  { userId: 7, itemId: 4, rating: 4, review: "Brilliant structure and memorable characters.", timestamp: new Date("2023-01-26") },
  { userId: 7, itemId: 6, rating: 4, timestamp: new Date("2023-02-16") },
  { userId: 7, itemId: 8, rating: 3, review: "The love story is touching but overly dramatic.", timestamp: new Date("2023-03-06") },
  { userId: 7, itemId: 10, rating: 5, review: "A perfect blend of hard science and emotional depth.", timestamp: new Date("2023-03-26") },

  { userId: 8, itemId: 1, rating: 5, review: "One of the greatest redemption stories ever told.", timestamp: new Date("2023-01-16") },
  { userId: 8, itemId: 3, rating: 4, timestamp: new Date("2023-02-06") },
  { userId: 8, itemId: 5, rating: 5, review: "A beautiful journey through American history. Heartwarming.", timestamp: new Date("2023-02-26") },
  { userId: 8, itemId: 7, rating: 4, review: "The action and philosophy make this a standout.", timestamp: new Date("2023-03-14") },
  { userId: 8, itemId: 9, rating: 3, timestamp: new Date("2023-03-29") },

  { userId: 9, itemId: 2, rating: 4, review: "A cornerstone of American cinema. Essential viewing.", timestamp: new Date("2023-01-09") },
  { userId: 9, itemId: 4, rating: 5, timestamp: new Date("2023-01-29") },
  { userId: 9, itemId: 6, rating: 3, review: "Clever but needlessly complicated in parts.", timestamp: new Date("2023-02-19") },
  { userId: 9, itemId: 8, rating: 4, timestamp: new Date("2023-03-09") },
  { userId: 9, itemId: 10, rating: 2, review: "Too long and pretentious. Style over substance.", timestamp: new Date("2023-03-30") },

  { userId: 10, itemId: 1, rating: 4, timestamp: new Date("2023-01-18") },
  { userId: 10, itemId: 3, rating: 5, review: "Redefines what a superhero movie can be. Perfect.", timestamp: new Date("2023-02-08") },
  { userId: 10, itemId: 5, rating: 4, review: "A charming American fable with heart and humor.", timestamp: new Date("2023-02-28") },
  { userId: 10, itemId: 7, rating: 5, timestamp: new Date("2023-03-16") },
  { userId: 10, itemId: 9, rating: 4, review: "Technologically groundbreaking with dazzling visuals.", timestamp: new Date("2023-04-01") },
];
