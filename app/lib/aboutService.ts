import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export async function getHistory() {
  const snap = await getDoc(doc(db, "about", "history"));
  return snap.data();
}

export async function updateHistory(data: any) {
  await setDoc(doc(db, "about", "history"), data);
}

export async function getGlance() {
  const snap = await getDoc(doc(db, "about", "glance"));
  return snap.data();
}

export async function updateGlance(data: any) {
  await setDoc(doc(db, "about", "glance"), data);
}