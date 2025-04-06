import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from '@/lib/api';

interface RecommendationCardProps {
  item: Item;
  predictedRating: number;
  onClick?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  predictedRating,
  onClick,
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <div className="text-sm text-muted-foreground">Category: {item.category}</div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <div className="relative h-40 w-full overflow-hidden rounded-md">
            <img
              src={item.imageUrl || "https://placehold.co/400x300?text=No+Image"}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">{item.tags.join(', ')}</span>
            <span className="font-semibold">Predicted Rating: {predictedRating.toFixed(1)}</span>
          </div>
          <p className="text-sm line-clamp-2 mt-1">{item.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecommendationsListProps {
  recommendations: {
    item: Item;
    predicted_rating: number;
  }[];
  onItemClick?: (itemId: number) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onItemClick,
}) => {
  if (!recommendations || recommendations.length === 0) {
    return <div className="text-center p-4">No recommendations available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.item.id}
          item={recommendation.item}
          predictedRating={recommendation.predicted_rating}
          onClick={() => onItemClick && onItemClick(recommendation.item.id)}
        />
      ))}
    </div>
  );
};

export default RecommendationCard;
