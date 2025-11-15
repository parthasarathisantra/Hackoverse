import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  index?: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      data-testid={`feature-card-${index}`}
    >
      <Card className="p-8 h-full flex flex-col hover-elevate group cursor-pointer">
        {/* Icon container */}
        <div className={`w-14 h-14 rounded-lg ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-3 tracking-tight" data-testid="text-feature-title">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-6 flex-1" data-testid="text-feature-description">
          {description}
        </p>

        {/* CTA */}
        <a href={href}>
          <Button variant="ghost" className="group/btn px-0">
            Explore
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </a>
      </Card>
    </motion.div>
  );
}
