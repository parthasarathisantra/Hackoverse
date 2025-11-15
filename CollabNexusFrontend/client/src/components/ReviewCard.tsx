import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewCardProps {
  reviewerName: string;
  revieweeName: string;
  rating: number;
  feedback: string;
  tags: string[];
  createdAt: Date;
  index?: number;
}

export function ReviewCard({
  reviewerName,
  revieweeName,
  rating,
  feedback,
  tags,
  createdAt,
  index = 0,
}: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      data-testid={`review-card-${index}`}
    >
      <Card className="p-6 hover-elevate">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>
              {reviewerName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-medium text-sm" data-testid="text-reviewer-name">
                {reviewerName}
              </p>
              <p className="text-xs text-muted-foreground" data-testid="text-review-date">
                {createdAt.toLocaleDateString()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground" data-testid="text-reviewee-name">
              reviewed {revieweeName}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3" data-testid="rating-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? "fill-chart-4 text-chart-4"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
        </div>

        {/* Feedback */}
        <p className="text-sm mb-3 leading-relaxed" data-testid="text-feedback">
          {feedback}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-tag-${i}`}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
