import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

export interface CommitteeMember {
  id?: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  image: string;
  displayOrder: number;
  active?: boolean;
}

const committeeCollection = collection(
  db,
  "committee"
);

/*
 * Get all committee members
 */
export async function getCommitteeMembers(): Promise<
  CommitteeMember[]
> {
  const q = query(
    committeeCollection,
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,

      name: String(data.name || ""),
      designation: String(
        data.designation || ""
      ),
      phone: String(data.phone || ""),
      email: String(data.email || ""),
      image: String(data.image || ""),

      displayOrder: Number(
        data.displayOrder || 0
      ),

      active:
        data.active === false
          ? false
          : true,
    };
  });
}

/*
 * Add committee member
 */
export async function addCommitteeMember(
  member: CommitteeMember
): Promise<void> {
  await addDoc(committeeCollection, {
    name: member.name.trim(),
    designation: member.designation.trim(),
    phone: member.phone.trim(),
    email: member.email.trim(),
    image: member.image.trim(),
    displayOrder: Number(
      member.displayOrder
    ),
    active:
      member.active === false
        ? false
        : true,
  });
}

/*
 * Update committee member
 */
export async function updateCommitteeMember(
  id: string,
  member: CommitteeMember
): Promise<void> {
  await updateDoc(
    doc(db, "committee", id),
    {
      name: member.name.trim(),
      designation: member.designation.trim(),
      phone: member.phone.trim(),
      email: member.email.trim(),
      image: member.image.trim(),
      displayOrder: Number(
        member.displayOrder
      ),
      active:
        member.active === false
          ? false
          : true,
    }
  );
}

/*
 * Delete committee member
 */
export async function deleteCommitteeMember(
  id: string
): Promise<void> {
  await deleteDoc(
    doc(db, "committee", id)
  );
}