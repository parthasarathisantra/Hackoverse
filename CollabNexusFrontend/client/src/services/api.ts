import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// ======================
// AUTH
// ======================
export function signup(email: string, password: string) {
  return API.post("/signup", { email, password });
}

export function login(email: string, password: string) {
  return API.post("/login", { email, password });
}

// ======================
// PROJECTS
// ======================
export function createProject(data: { name: string; created_by: string }) {
  return API.post("/projects", data);
}

export function getProjectsForUser(uid: string) {
  return API.get(`/user/${uid}/projects`);
}

// ======================
// TASKS
// ======================
export function getTasks(projectId: string) {
  return API.get(`/projects/${projectId}/tasks`);
}

export function createTask(projectId: string, data: any) {
  return API.post(`/projects/${projectId}/tasks`, data);
}

export function updateTask(projectId: string, taskId: string, data: any) {
  return API.put(`/projects/${projectId}/tasks/${taskId}`, data);
}

export function deleteTask(projectId: string, taskId: string) {
  return API.delete(`/projects/${projectId}/tasks/${taskId}`);
}

// ======================
// PROFILE
// ======================
export function getUser(uid: string) {
  return API.get(`/users/${uid}`);
}

export function updateUser(uid: string, data: Record<string, any>) {
  return API.put(`/users/${uid}`, data);
}
