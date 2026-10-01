import { db } from "./firebase";

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export interface DonationDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  upiId: string;
  qrImage: string;
  message: string;
}

const donationRef = doc(db, "donation", "details");

export async function getDonationDetails(): Promise<DonationDetails | null> {
  const snapshot = await getDoc(donationRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as DonationDetails;
}

export async function updateDonationDetails(
  data: DonationDetails
) {
  await setDoc(donationRef, data, {
    merge: true,
  });
}

export async function deleteDonationDetails() {
  await deleteDoc(donationRef);
}