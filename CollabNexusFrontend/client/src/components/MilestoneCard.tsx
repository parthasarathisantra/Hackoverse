import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { Milestone } from "@shared/schema";

interface MilestoneCardProps {
  milestone: Milestone;
  index?: number;
}

export function MilestoneCard({ milestone, index = 0 }: MilestoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      data-testid={`milestone-card-${index}`}
    >
      <Card className="p-6 hover-elevate">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
            milestone.isCompleted 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          }`}>
            {milestone.isCompleted ? (
              <CheckCircle2 className="w-6 h-6" data-testid="icon-completed" />
            ) : (
              <Circle className="w-6 h-6" data-testid="icon-pending" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg" data-testid="text-milestone-title">
                {milestone.title}
              </h3>
              <Badge variant={milestone.isCompleted ? "default" : "secondary"} className="flex-shrink-0">
                <Award className="w-3 h-3 mr-1" />
                +{milestone.xpReward} XP
              </Badge>
            </div>
            
            {milestone.description && (
              <p className="text-sm text-muted-foreground mb-3" data-testid="text-milestone-description">
                {milestone.description}
              </p>
            )}

            {milestone.isCompleted && milestone.completedAt && (
              <p className="text-xs text-muted-foreground" data-testid="text-completed-date">
                Completed {new Date(milestone.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
