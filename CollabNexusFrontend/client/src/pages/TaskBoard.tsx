import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/TaskCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Plus, ArrowLeft } from "lucide-react";

export default function TaskBoard() {
  const params = useParams();
  const projectId = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // -------------------------------------
  // LOAD TASKS
  // -------------------------------------
  const loadTasks = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/projects/${projectId}/tasks`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // -------------------------------------
  // CREATE TASK
  // -------------------------------------
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`http://127.0.0.1:5000/projects/${projectId}/tasks`, {
        title: formData.title,
        description: formData.description,
        status: "Not Started",
      });

      toast({
        title: "Task Added",
        description: "Your task was created successfully!",
      });

      setDialogOpen(false);
      setFormData({ title: "", description: "" });
      loadTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  // -------------------------------------
  // DELETE TASK
  // -------------------------------------
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/projects/${projectId}/tasks/${taskId}`);

      toast({
        title: "Task Deleted",
        description: "Task removed successfully!",
      });

      loadTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  // -------------------------------------
  // UPDATE TASK STATUS
  // -------------------------------------
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await axios.put(`http://127.0.0.1:5000/projects/${projectId}/tasks/${taskId}`, {
        status: newStatus,
      });

      loadTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  // -------------------------------------
  // KANBAN COLUMNS
  // -------------------------------------
  const columns = [
    { id: "Not Started", title: "Not Started", color: "border-muted" },
    { id: "In Progress", title: "In Progress", color: "border-blue-400" },
    { id: "Done", title: "Completed", color: "border-green-500" },
  ];

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  // -------------------------------------
  // LOADING SKELETONS
  // -------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-24 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------
  // UI RENDER
  // -------------------------------------
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation("/projects")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Task Board</h1>
              <p className="text-muted-foreground text-lg">
                Organize and track your tasks
              </p>
            </div>

            {/* Create Task Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Example: Build Homepage"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the task..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Task
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className={`border-l-4 ${column.color} pl-4`}>
                  <h3 className="font-semibold uppercase text-sm text-muted-foreground">
                    {column.title}
                  </h3>
                  <p className="text-2xl font-bold">
                    {getTasksByStatus(column.id).length}
                  </p>
                </div>

                <div className="space-y-3">
                  {getTasksByStatus(column.id).length === 0 ? (
                    <Card className="p-8 text-center border-dashed">
                      <p className="text-sm text-muted-foreground">No tasks</p>
                    </Card>
                  ) : (
                    getTasksByStatus(column.id).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
