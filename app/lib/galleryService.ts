import { db } from "./firebase";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export async function saveGalleryImage(
  title: string,
  description: string,
  imageUrl: string
) {
  return await addDoc(collection(db, "gallery"), {
    title,
    description,
    imageUrl,
    createdAt: serverTimestamp(),
  });
}

export async function deleteGalleryImage(id: string) {
  await deleteDoc(doc(db, "gallery", id));
}

export async function updateGalleryImage(
  id: string,
  title: string,
  description: string
) {
  await updateDoc(doc(db, "gallery", id), {
    title,
    description,
  });
}