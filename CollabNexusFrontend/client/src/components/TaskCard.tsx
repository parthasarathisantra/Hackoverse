import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
  };
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

export function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 hover-elevate group cursor-pointer">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-sm flex-1">{task.title}</h4>

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Status Badge */}
          <Badge variant="secondary" className="text-xs capitalize">
            {task.status}
          </Badge>

          {/* Status Controls */}
          {onStatusChange && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(task.id, "Not Started")}
              >
                Not Started
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(task.id, "In Progress")}
              >
                In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(task.id, "Done")}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
