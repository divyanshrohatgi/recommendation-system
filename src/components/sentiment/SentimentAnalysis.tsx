import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SentimentResult } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface SentimentAnalysisProps {
  sentimentData: SentimentResult;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentimentData }) => {
  if (!sentimentData) {
    return <div className="text-center p-4">No sentiment data available.</div>;
  }

  const {
    item,
    reviews_count,
    sentiment_counts,
    avg_compound,
    top_aspects,
    visualization
  } = sentimentData;

  const getSentimentColor = (compound: number) => {
    if (compound >= 0.05) return 'text-green-600';
    if (compound <= -0.05) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis for {item.name}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Based on {reviews_count} reviews
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Sentiment Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Positive:</span>
                  <span className="font-medium text-green-600">
                    {sentiment_counts.positive || 0} reviews
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Neutral:</span>
                  <span className="font-medium text-gray-600">
                    {sentiment_counts.neutral || 0} reviews
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Negative:</span>
                  <span className="font-medium text-red-600">
                    {sentiment_counts.negative || 0} reviews
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Overall Sentiment:</span>
                  <span className={`font-bold ${getSentimentColor(avg_compound)}`}>
                    {avg_compound >= 0.05 ? 'Positive' : avg_compound <= -0.05 ? 'Negative' : 'Neutral'}
                    ({avg_compound.toFixed(2)})
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-2">Top Mentioned Aspects</h3>
              <div className="flex flex-wrap gap-2">
                {top_aspects && top_aspects.map(([aspect, count], index) => (
                  <div key={index} className="flex items-center">
                    <Badge variant={index < 3 ? "default" : "outline"} className="mr-1">
                      {count}
                    </Badge>
                    <span>{aspect}</span>
                  </div>
                ))}
                {(!top_aspects || top_aspects.length === 0) && (
                  <span className="text-sm text-muted-foreground">No significant aspects found</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Visualization</h3>
              {visualization ? (
                <img
                  src={visualization}
                  alt="Sentiment Visualization"
                  className="w-full rounded-md border"
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                  <span className="text-gray-500">Visualization not available</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
