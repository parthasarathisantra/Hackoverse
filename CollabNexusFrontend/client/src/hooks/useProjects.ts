import { useQuery } from "@tanstack/react-query";
import { getProjectsForUser } from "@/services/api";

export function useProjects(uid: string) {
  return useQuery({
    queryKey: ["projects", uid],
    queryFn: () => getProjectsForUser(uid).then((res) => res.data.projects),
  });
}
