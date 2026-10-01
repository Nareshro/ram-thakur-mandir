import { db } from "./firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export interface Activity {
  id?: string;
  category: "social" | "puja";
  title: string;
  description: string;
  image: string;
  displayOrder: number;
}

const activitiesCollection = collection(db, "activities");

// Get all activities
export async function getActivities(): Promise<Activity[]> {
  const q = query(
    activitiesCollection,
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Activity, "id">),
  }));
}

// Add activity
export async function addActivity(
  data: Omit<Activity, "id">
): Promise<void> {
  await addDoc(activitiesCollection, {
    category: data.category,
    title: data.title,
    description: data.description,
    image: data.image,
    displayOrder: data.displayOrder,
  });
}

// Update activity
export async function updateActivity(
  id: string,
  data: Omit<Activity, "id">
): Promise<void> {
  await updateDoc(doc(db, "activities", id), {
    category: data.category,
    title: data.title,
    description: data.description,
    image: data.image,
    displayOrder: data.displayOrder,
  });
}

// Delete activity
export async function deleteActivity(
  id: string
): Promise<void> {
  await deleteDoc(doc(db, "activities", id));
}