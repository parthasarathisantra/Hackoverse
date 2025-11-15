import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Award } from "lucide-react";
import { motion } from "framer-motion";
import type { TeammateMatch } from "@shared/schema";

interface TeammateSuggestionCardProps {
  match: TeammateMatch;
  index?: number;
  onConnect?: (userId: string) => void;
}

export function TeammateSuggestionCard({ match, index = 0, onConnect }: TeammateSuggestionCardProps) {
  const { user, matchPercentage, matchingSkills } = match;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      data-testid={`teammate-card-${index}`}
    >
      <Card className="p-6 hover-elevate text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar with match percentage */}
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarFallback className="text-2xl">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold shadow-lg">
              {matchPercentage}%
            </div>
          </div>

          {/* Name and level */}
          <div>
            <h3 className="font-semibold text-lg mb-1" data-testid="text-username">
              {user.username}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span data-testid="text-level">Level {user.level}</span>
            </div>
          </div>

          {/* Matching skills */}
          <div className="w-full">
            <p className="text-xs text-muted-foreground mb-2">Matching Skills</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {matchingSkills.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-skill-${i}`}>
                  {skill}
                </Badge>
              ))}
              {matchingSkills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{matchingSkills.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Connect button */}
          <Button
            className="w-full"
            onClick={() => onConnect?.(user.id)}
            data-testid="button-connect"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
