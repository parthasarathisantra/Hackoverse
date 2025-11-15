import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/api";
import type { InsertTask, Task } from "@shared/schema";

export function useTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "tasks"],
    queryFn: () => projectId ? getTasks(projectId) : [],
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId: string) {
  return useMutation({
    mutationFn: (task: InsertTask) => createTask(projectId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(projectId, taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
    },
  });
}
