import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  orderBy 
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, Review, Milestone } from "@shared/schema";

// Real-time task listener for a project
export function subscribeToTasks(
  projectId: string, 
  callback: (tasks: Task[]) => void
): () => void {
  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("projectId", "==", projectId), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    callback(tasks);
  });
}

// Real-time reviews listener for a project
export function subscribeToReviews(
  projectId: string,
  callback: (reviews: Review[]) => void
): () => void {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("projectId", "==", projectId), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const reviews: Review[] = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });
    callback(reviews);
  });
}

// Real-time milestones listener for a project
export function subscribeToMilestones(
  projectId: string,
  callback: (milestones: Milestone[]) => void
): () => void {
  const milestonesRef = collection(db, "milestones");
  const q = query(milestonesRef, where("projectId", "==", projectId), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const milestones: Milestone[] = [];
    snapshot.forEach((doc) => {
      milestones.push({ id: doc.id, ...doc.data() } as Milestone);
    });
    callback(milestones);
  });
}

// Add a task to Firestore
export async function addTask(task: Omit<Task, "id" | "createdAt">) {
  const tasksRef = collection(db, "tasks");
  const docRef = await addDoc(tasksRef, {
    ...task,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a task in Firestore
export async function updateTask(taskId: string, updates: Partial<Task>) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, updates);
}

// Delete a task from Firestore
export async function deleteTask(taskId: string) {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
}

// Add a review to Firestore
export async function addReview(review: Omit<Review, "id" | "createdAt">) {
  const reviewsRef = collection(db, "reviews");
  const docRef = await addDoc(reviewsRef, {
    ...review,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Add a milestone to Firestore
export async function addMilestone(milestone: Omit<Milestone, "id" | "createdAt">) {
  const milestonesRef = collection(db, "milestones");
  const docRef = await addDoc(milestonesRef, {
    ...milestone,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update a milestone in Firestore
export async function updateMilestone(milestoneId: string, updates: Partial<Milestone>) {
  const milestoneRef = doc(db, "milestones", milestoneId);
  await updateDoc(milestoneRef, updates);
}
