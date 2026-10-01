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

export interface Guru {
  id?: string;
  name: string;
  subtitle: string;
  description1: string;
  description2: string;
  description3: string;
  image: string;
  displayOrder: number;
}

const gurusCollection = collection(db, "gurus");

// Get all Gurus
export async function getGurus(): Promise<Guru[]> {
  const q = query(
    gurusCollection,
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Guru, "id">),
  }));
}

// Add Guru
export async function addGuru(
  data: Omit<Guru, "id">
): Promise<void> {
  await addDoc(gurusCollection, {
    name: data.name,
    subtitle: data.subtitle,
    description1: data.description1,
    description2: data.description2,
    description3: data.description3,
    image: data.image,
    displayOrder: Number(data.displayOrder),
  });
}

// Update Guru
export async function updateGuru(
  id: string,
  data: Omit<Guru, "id">
): Promise<void> {
  await updateDoc(doc(db, "gurus", id), {
    name: data.name,
    subtitle: data.subtitle,
    description1: data.description1,
    description2: data.description2,
    description3: data.description3,
    image: data.image,
    displayOrder: Number(data.displayOrder),
  });
}

// Delete Guru
export async function deleteGuru(
  id: string
): Promise<void> {
  await deleteDoc(doc(db, "gurus", id));
}