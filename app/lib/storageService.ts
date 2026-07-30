import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(
    storage,
    `gallery/${Date.now()}-${file.name}`
  );

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

export async function removeImage(imageUrl: string): Promise<void> {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
}