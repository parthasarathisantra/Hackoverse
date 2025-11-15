import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLabel?: boolean;
}

export function XPBar({ currentXP, maxXP, level, showLabel = true }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="space-y-2" data-testid="xp-bar">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" data-testid="text-level">
            Level {level}
          </span>
          <span className="text-sm text-muted-foreground" data-testid="text-xp">
            {currentXP} / {maxXP} XP
          </span>
        </div>
      )}
      <div className="relative">
        <Progress value={percentage} className="h-3" data-testid="progress-xp" />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
    </div>
  );
}
