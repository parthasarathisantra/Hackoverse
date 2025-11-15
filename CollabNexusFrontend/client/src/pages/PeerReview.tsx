import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReviewCard } from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Star, Plus, X, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  reviewerName: string;
  revieweeName: string;
  rating: number;
  feedback: string;
  tags: string[];
  createdAt: Date;
}

export default function PeerReview() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    revieweeName: "",
    feedback: "",
    tags: [] as string[],
  });


  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      reviewerName: "You",
      revieweeName: formData.revieweeName,
      rating,
      feedback: formData.feedback,
      tags: formData.tags,
      createdAt: new Date(),
    };

    setReviews([newReview, ...reviews]);
    setDialogOpen(false);
    setFormData({ revieweeName: "", feedback: "", tags: [] });
    setRating(5);
    setTagInput("");
    
    toast({
      title: "Review submitted!",
      description: "Your feedback has been shared with your teammate",
    });
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-chart-4 to-chart-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Peer Reviews</h1>
          <p className="text-muted-foreground text-lg">
            Share feedback and grow together as a team
          </p>
        </motion.div>

        {/* Create Review Button */}
        <div className="mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" data-testid="button-write-review">
                <Plus className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write a Peer Review</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reviewee">Teammate Name</Label>
                  <Input
                    id="reviewee"
                    placeholder="Who are you reviewing?"
                    value={formData.revieweeName}
                    onChange={(e) => setFormData({ ...formData, revieweeName: e.target.value })}
                    required
                    data-testid="input-reviewee-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2" data-testid="rating-input">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className="hover-elevate rounded"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            i < rating
                              ? "fill-chart-4 text-chart-4"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts on working with this teammate..."
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    rows={6}
                    required
                    data-testid="input-feedback"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Great Communicator, Team Player"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      data-testid="input-tag"
                    />
                    <Button type="button" onClick={addTag} data-testid="button-add-tag">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover-elevate rounded-full">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" data-testid="button-submit-review">
                  Submit Review
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share feedback with your teammates
            </p>
            <Button onClick={() => setDialogOpen(true)} data-testid="button-write-first-review">
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Review
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} {...review} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
