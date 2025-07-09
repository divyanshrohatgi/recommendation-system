
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RecommendationsList
} from "@/components/recommendation/RecommendationsCard";
import SentimentAnalysis from "@/components/sentiment/SentimentAnalysis";
import UserSelection from "@/components/common/UserSelection";
import {
  api,
  Item,
  RecommendationResult,
  SentimentResult,
  SimilarItemsResult,
  Rating
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function App() {
  // Selected user and item
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);

  // Data
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentResult | null>(null);
  const [similarItems, setSimilarItems] = useState<SimilarItemsResult | null>(null);
  const [itemRatings, setItemRatings] = useState<Rating[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Loading and error states
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  const [loadingSimilarItems, setLoadingSimilarItems] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState("recommendations");

  // Load all items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.getItems();
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    fetchItems();
  }, []);

  // Fetch recommendations when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      const fetchRecommendations = async () => {
        try {
          setLoadingRecommendations(true);
          setError(null);
          const data = await api.getRecommendations(selectedUserId);
          setRecommendations(data);
        } catch (err) {
          console.error('Error fetching recommendations:', err);
          setError('Failed to load recommendations. Please try again later.');
          setRecommendations(null);
        } finally {
          setLoadingRecommendations(false);
        }
      };

      fetchRecommendations();
    } else {
      setRecommendations(null);
    }
  }, [selectedUserId]);

  // Fetch sentiment analysis and similar items when an item is selected
  useEffect(() => {
    if (selectedItemId) {
      // Fetch sentiment analysis
      const fetchSentimentAnalysis = async () => {
        try {
          setLoadingSentiment(true);
          setError(null);
          const data = await api.getSentimentAnalysis(selectedItemId);
          setSentimentData(data);
        } catch (err) {
          console.error('Error fetching sentiment analysis:', err);
          setError('Failed to load sentiment analysis. Please try again later.');
          setSentimentData(null);
        } finally {
          setLoadingSentiment(false);
        }
      };

      // Fetch similar items
      const fetchSimilarItems = async () => {
        try {
          setLoadingSimilarItems(true);
          const data = await api.getSimilarItems(selectedItemId);
          setSimilarItems(data);
        } catch (err) {
          console.error('Error fetching similar items:', err);
          setSimilarItems(null);
        } finally {
          setLoadingSimilarItems(false);
        }
      };

      // Fetch item ratings
      const fetchItemRatings = async () => {
        try {
          const ratings = await api.getRatings();
          const filteredRatings = ratings.filter(r => r.itemId === selectedItemId);
          setItemRatings(filteredRatings);
        } catch (err) {
          console.error('Error fetching item ratings:', err);
          setItemRatings([]);
        }
      };

      fetchSentimentAnalysis();
      fetchSimilarItems();
      fetchItemRatings();

      // Switch to sentiment tab
      setActiveTab("sentiment");
    } else {
      setSentimentData(null);
      setSimilarItems(null);
      setItemRatings([]);
    }
  }, [selectedItemId]);

  // Handler for selecting an item from recommendations
  const handleItemSelect = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  // Handler for going back to recommendations
  const handleBackToRecommendations = () => {
    setSelectedItemId(undefined);
    setActiveTab("recommendations");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Recommendation System with Sentiment Analysis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <UserSelection
            onUserSelect={setSelectedUserId}
            selectedUserId={selectedUserId}
          />
        </div>

        <div className="md:col-span-3">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger
                value="recommendations"
                disabled={!selectedUserId}
                className="flex-1"
              >
                Recommendations
              </TabsTrigger>
              <TabsTrigger
                value="sentiment"
                disabled={!selectedItemId}
                className="flex-1"
              >
                Sentiment Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations">
              {selectedUserId ? (
                loadingRecommendations ? (
                  <div className="text-center p-8">Loading recommendations...</div>
                ) : recommendations?.recommendations?.length ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">
                      Recommendations for {recommendations.user.name}
                    </h2>
                    <RecommendationsList
                      recommendations={recommendations.recommendations}
                      onItemClick={handleItemSelect}
                    />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    No recommendations available for this user.
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  Please select a user to see recommendations.
                </div>
              )}
            </TabsContent>

            <TabsContent value="sentiment">
              {selectedItemId ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                      {sentimentData?.item.name || "Item"} Sentiment Analysis
                    </h2>
                    <button
                      onClick={handleBackToRecommendations}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Back to Recommendations
                    </button>
                  </div>

                  {loadingSentiment ? (
                    <div className="text-center p-8">Loading sentiment analysis...</div>
                  ) : sentimentData ? (
                    <SentimentAnalysis sentimentData={sentimentData} />
                  ) : (
                    <div className="text-center p-8">
                      No sentiment data available for this item.
                    </div>
                  )}

                  {/* Similar Items Section */}
                  {similarItems && similarItems.similar_items.length > 0 && (
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Similar Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {similarItems.similar_items.map((similar) => (
                            <Card key={similar.item.id} className="cursor-pointer hover:shadow-lg" onClick={() => handleItemSelect(similar.item.id)}>
                              <CardContent className="p-4">
                                <div className="relative h-32 w-full overflow-hidden rounded-md mb-2">
                                  <img
                                    src={similar.item.imageUrl || "https://placehold.co/400x300?text=No+Image"}
                                    alt={similar.item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <h3 className="font-medium">{similar.item.name}</h3>
                                <p className="text-sm text-muted-foreground">{similar.item.category}</p>
                                <div className="text-xs mt-1">Similarity: {(similar.similarity_score * 100).toFixed(0)}%</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Item Reviews Section */}
                  {itemRatings.length > 0 && (
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>User Reviews ({itemRatings.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {itemRatings.map((rating, index) => (
                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">User ID: {rating.userId}</div>
                                <div className="flex items-center">
                                  <span className="mr-1">Rating:</span>
                                  <span className="font-bold">{rating.rating}/5</span>
                                </div>
                              </div>
                              <p className="text-sm">{rating.review}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  Please select an item to view sentiment analysis.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
