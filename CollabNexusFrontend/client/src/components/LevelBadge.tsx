import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function LevelBadge({ level, size = "md", animate = false }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <motion.div
      initial={animate ? { scale: 0, rotate: -180 } : false}
      animate={animate ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: "spring", duration: 0.8 }}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-chart-3 flex flex-col items-center justify-center border-4 border-primary/20 shadow-lg relative`}
      data-testid="level-badge"
    >
      <Trophy className={`${iconSizes[size]} text-primary-foreground absolute -top-1`} />
      <span className="font-bold text-primary-foreground mt-2" data-testid="text-level-number">
        {level}
      </span>
    </motion.div>
  );
}
