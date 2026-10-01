"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddCommitteeModal from "@/app/Components/admin/AddCommitteeModal";

import {
  CommitteeMember,
  getCommitteeMembers,
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
} from "@/app/lib/committeeService";

export default function CommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingMember, setEditingMember] =
    useState<CommitteeMember | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setLoading(true);

      const data = await getCommitteeMembers();

      setMembers(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load committee members");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(member: CommitteeMember) {
    try {
      // Validation
      if (
        !member.name.trim() ||
        !member.designation.trim() ||
        !member.phone.trim() ||
        !member.email.trim() ||
        !member.image.trim()
      ) {
        toast.error("Please fill all fields");
        return;
      }

      if (editingMember?.id) {
        await updateCommitteeMember(
          editingMember.id,
          member
        );

        toast.success("Member updated successfully");
      } else {
        await addCommitteeMember(member);

        toast.success("Member added successfully");
      }

      setEditingMember(null);
      setIsModalOpen(false);

      await loadMembers();
    } catch (error) {
      console.error(error);

      toast.error("Operation failed");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this committee member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCommitteeMember(id);

      toast.success("Member deleted successfully");

      await loadMembers();
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  }

  // Search
  const filteredMembers = members.filter((member) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    return (
      member.name.toLowerCase().includes(keyword) ||
      member.designation.toLowerCase().includes(keyword) ||
      member.phone.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword)
    );
  });

  const totalMembers = members.length;

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Committee Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage temple executive committee members.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          + Add Member
        </button>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid gap-5 md:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Total Members
          </p>

          <p className="mt-2 text-3xl font-bold text-stone-800">
            {totalMembers}
          </p>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Search Results
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-500">
            {filteredMembers.length}
          </p>

        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="rounded-xl bg-white p-5 shadow">

        <input
          type="text"
          placeholder="Search by name, designation, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500"
        />

      </div>

      {/* ================= TABLE ================= */}

      {loading ? (

        <div className="rounded-xl bg-white py-20 text-center shadow">

          <p className="text-gray-500">
            Loading committee members...
          </p>

        </div>

      ) : (

        <div className="overflow-hidden rounded-xl bg-white shadow">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              {/* TABLE HEADER */}

              <thead className="bg-orange-500 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Photo
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Designation
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-center">
                    Order
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {filteredMembers.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="p-10 text-center text-gray-500"
                    >
                      {search
                        ? "No committee members match your search."
                        : "No committee members found."}
                    </td>

                  </tr>

                ) : (

                  filteredMembers.map((member) => (

                    <tr
                      key={member.id}
                      className="border-b hover:bg-gray-50"
                    >

                      {/* PHOTO */}

                      <td className="p-4">

                        {member.image ? (

                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />

                        ) : (

                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                            No Image
                          </div>

                        )}

                      </td>

                      {/* NAME */}

                      <td className="p-4 font-semibold text-black">
                        {member.name}
                      </td>

                      {/* DESIGNATION */}

                      <td className="p-4 text-gray-700">
                        {member.designation}
                      </td>

                      {/* PHONE */}

                      <td className="p-4 text-gray-700">
                        {member.phone}
                      </td>

                      {/* EMAIL */}

                      <td className="p-4 text-gray-700">
                        {member.email}
                      </td>

                      {/* ORDER */}

                      <td className="p-4 text-center text-black">
                        {member.displayOrder}
                      </td>

                      {/* ACTIONS */}

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => {
                              setEditingMember(member);
                              setIsModalOpen(true);
                            }}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => {
                              if (member.id) {
                                handleDelete(member.id);
                              }
                            }}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* ================= MODAL ================= */}

      <AddCommitteeModal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingMember(null);
          setIsModalOpen(false);
        }}
        onSave={handleSave}
        editingMember={editingMember}
      />

    </div>
  );
}