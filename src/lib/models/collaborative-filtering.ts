import { Matrix } from 'ml-matrix';
import { euclidean } from 'ml-distance';
import { Rating, User, Item } from '../data/sample-data';

interface RatingMatrix {
  matrix: Matrix;
  userIdToIndex: Map<number, number>;
  itemIdToIndex: Map<number, number>;
  indexToUserId: Map<number, number>;
  indexToItemId: Map<number, number>;
}

/**
 * Convert raw ratings data to a user-item matrix for collaborative filtering
 */
export function createRatingMatrix(ratings: Rating[], users: User[], items: Item[]): RatingMatrix {
  const userIdToIndex = new Map<number, number>();
  const itemIdToIndex = new Map<number, number>();
  const indexToUserId = new Map<number, number>();
  const indexToItemId = new Map<number, number>();

  // Map user IDs to matrix indices
  users.forEach((user, index) => {
    userIdToIndex.set(user.id, index);
    indexToUserId.set(index, user.id);
  });

  // Map item IDs to matrix indices
  items.forEach((item, index) => {
    itemIdToIndex.set(item.id, index);
    indexToItemId.set(index, item.id);
  });

  // Create an empty matrix filled with zeros (users × items)
  const matrix = Matrix.zeros(users.length, items.length);

  // Fill the matrix with ratings
  for (const { userId, itemId, rating } of ratings) {
    const userIndex = userIdToIndex.get(userId);
    const itemIndex = itemIdToIndex.get(itemId);

    if (userIndex !== undefined && itemIndex !== undefined) {
      matrix.set(userIndex, itemIndex, rating);
    }
  }

  return { matrix, userIdToIndex, itemIdToIndex, indexToUserId, indexToItemId };
}

/**
 * Find similar users based on rating patterns
 */
export function findSimilarUsers(
  ratingMatrix: RatingMatrix,
  targetUserId: number,
  numberOfUsers: number = 3
): { userId: number; similarity: number }[] {
  const { matrix, userIdToIndex, indexToUserId } = ratingMatrix;
  const targetUserIndex = userIdToIndex.get(targetUserId);

  if (targetUserIndex === undefined) {
    return [];
  }

  const targetUserRatings = matrix.getRow(targetUserIndex);
  const similarities: { userId: number; similarity: number }[] = [];

  // Calculate similarity between target user and all other users
  for (let i = 0; i < matrix.rows; i++) {
    if (i === targetUserIndex) continue;

    const userRatings = matrix.getRow(i);

    // Filter out items that neither user has rated
    const commonIndices: number[] = [];
    const targetValues: number[] = [];
    const otherValues: number[] = [];

    for (let j = 0; j < targetUserRatings.length; j++) {
      if (targetUserRatings[j] > 0 && userRatings[j] > 0) {
        commonIndices.push(j);
        targetValues.push(targetUserRatings[j]);
        otherValues.push(userRatings[j]);
      }
    }

    // Skip if no common ratings
    if (commonIndices.length === 0) continue;

    // Calculate cosine similarity - normalize vectors and take dot product
    const targetNorm = Math.sqrt(targetValues.reduce((sum, val) => sum + val * val, 0));
    const otherNorm = Math.sqrt(otherValues.reduce((sum, val) => sum + val * val, 0));

    if (targetNorm === 0 || otherNorm === 0) continue;

    const dotProduct = targetValues.reduce((sum, val, idx) => sum + val * otherValues[idx], 0);
    const similarity = dotProduct / (targetNorm * otherNorm);

    const userId = indexToUserId.get(i);
    if (userId !== undefined) {
      similarities.push({ userId, similarity });
    }
  }

  // Sort by similarity (descending) and take top N
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, numberOfUsers);
}

/**
 * Generate personalized recommendations for a user
 */
export function generateRecommendations(
  ratingMatrix: RatingMatrix,
  targetUserId: number,
  numberOfItems: number = 5
): { itemId: number; predictedRating: number }[] {
  const { matrix, userIdToIndex, itemIdToIndex, indexToItemId } = ratingMatrix;
  const targetUserIndex = userIdToIndex.get(targetUserId);

  if (targetUserIndex === undefined) {
    return [];
  }

  const similarUsers = findSimilarUsers(ratingMatrix, targetUserId, 3);
  const targetUserRatings = matrix.getRow(targetUserIndex);

  // Items the user hasn't rated yet
  const candidateItems: { itemId: number; index: number }[] = [];
  for (let j = 0; j < targetUserRatings.length; j++) {
    if (targetUserRatings[j] === 0) {
      const itemId = indexToItemId.get(j);
      if (itemId !== undefined) {
        candidateItems.push({ itemId, index: j });
      }
    }
  }

  // Make predictions for unrated items
  const predictions: { itemId: number; predictedRating: number }[] = [];

  for (const { itemId, index: itemIndex } of candidateItems) {
    let weightedSum = 0;
    let similaritySum = 0;

    for (const { userId, similarity } of similarUsers) {
      const userIndex = userIdToIndex.get(userId);
      if (userIndex === undefined) continue;

      const rating = matrix.get(userIndex, itemIndex);
      if (rating > 0) {
        weightedSum += similarity * rating;
        similaritySum += similarity;
      }
    }

    // Skip if no similar users have rated this item
    if (similaritySum === 0) continue;

    const predictedRating = weightedSum / similaritySum;
    predictions.push({ itemId, predictedRating });
  }

  // Sort by predicted rating (descending) and take top N
  return predictions
    .sort((a, b) => b.predictedRating - a.predictedRating)
    .slice(0, numberOfItems);
}

/**
 * Get item-based recommendations (items similar to ones the user liked)
 */
export function getItemBasedRecommendations(
  ratingMatrix: RatingMatrix,
  targetUserId: number,
  numberOfItems: number = 5
): { itemId: number; similarity: number }[] {
  const { matrix, userIdToIndex, itemIdToIndex, indexToItemId } = ratingMatrix;
  const targetUserIndex = userIdToIndex.get(targetUserId);

  if (targetUserIndex === undefined) {
    return [];
  }

  const targetUserRatings = matrix.getRow(targetUserIndex);

  // Find items the user rated highly (4 or 5)
  const highlyRatedItems: number[] = [];
  for (let j = 0; j < targetUserRatings.length; j++) {
    if (targetUserRatings[j] >= 4) {
      highlyRatedItems.push(j);
    }
  }

  if (highlyRatedItems.length === 0) {
    return [];
  }

  // Calculate item-item similarity
  const itemSimilarities: Record<number, { itemId: number; similarity: number }[]> = {};

  for (const itemIndex of highlyRatedItems) {
    const itemVector = matrix.getColumn(itemIndex);
    itemSimilarities[itemIndex] = [];

    for (let j = 0; j < matrix.columns; j++) {
      // Skip the item itself and items the user has already rated
      if (j === itemIndex || targetUserRatings[j] > 0) {
        continue;
      }

      const otherItemVector = matrix.getColumn(j);

      // Calculate similarity between items based on user ratings
      // Filter out users who haven't rated both items
      const commonIndices: number[] = [];
      const itemValues: number[] = [];
      const otherItemValues: number[] = [];

      for (let k = 0; k < itemVector.length; k++) {
        if (itemVector[k] > 0 && otherItemVector[k] > 0) {
          commonIndices.push(k);
          itemValues.push(itemVector[k]);
          otherItemValues.push(otherItemVector[k]);
        }
      }

      // Skip if no common users
      if (commonIndices.length < 2) continue;

      // Calculate cosine similarity
      const itemNorm = Math.sqrt(itemValues.reduce((sum, val) => sum + val * val, 0));
      const otherNorm = Math.sqrt(otherItemValues.reduce((sum, val) => sum + val * val, 0));

      if (itemNorm === 0 || otherNorm === 0) continue;

      const dotProduct = itemValues.reduce((sum, val, idx) => sum + val * otherItemValues[idx], 0);
      const similarity = dotProduct / (itemNorm * otherNorm);

      const otherItemId = indexToItemId.get(j);
      if (otherItemId !== undefined) {
        itemSimilarities[itemIndex].push({ itemId: otherItemId, similarity });
      }
    }

    // Sort by similarity (descending)
    itemSimilarities[itemIndex].sort((a, b) => b.similarity - a.similarity);
  }

  // Combine recommendations from all highly rated items
  const allRecommendations: { itemId: number; similarity: number }[] = [];
  for (const itemIndex of highlyRatedItems) {
    allRecommendations.push(...itemSimilarities[itemIndex]);
  }

  // Remove duplicates and sort by similarity
  const seen = new Set<number>();
  const uniqueRecommendations = allRecommendations.filter(rec => {
    if (seen.has(rec.itemId)) {
      return false;
    }
    seen.add(rec.itemId);
    return true;
  });

  // Sort by similarity (descending) and take top N
  return uniqueRecommendations
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, numberOfItems);
}
