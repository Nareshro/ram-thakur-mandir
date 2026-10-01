"use client";

import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  async function handleChangePassword() {
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      toast.error("No admin user is logged in.");
      return;
    }

    try {
      setLoading(true);

      await updatePassword(user, newPassword);

      toast.success(
        "Password changed successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);

      if (
        error?.code ===
        "auth/requires-recent-login"
      ) {
        toast.error(
          "Please logout and login again before changing your password."
        );
      } else {
        toast.error(
          "Failed to change password."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-stone-800">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your administrator account settings.
        </p>
      </div>

      {/* Admin Account */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
          Admin Account
        </h2>

        <div className="mt-6 space-y-6">

          {/* Email */}

          <div>
            <label className="block font-medium text-gray-700">
              Admin Email
            </label>

            <input
              type="email"
              value={
                auth.currentUser?.email || ""
              }
              readOnly
              className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-100 p-3 text-gray-700"
            />

            <p className="mt-2 text-sm text-gray-500">
              This is the email address currently
              logged into the admin panel.
            </p>
          </div>

        </div>

      </div>

      {/* Change Password */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
          Change Password
        </h2>

        <div className="mt-6 space-y-6">

          {/* New Password */}

          <div>
            <label className="block font-medium text-gray-700">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label className="block font-medium text-gray-700">
              Confirm New Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Button */}

          <div className="flex justify-end">

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
            >
              {loading
                ? "Updating..."
                : "Change Password"}
            </button>

          </div>

        </div>

      </div>

      {/* Security Information */}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">

        <h3 className="font-bold text-amber-800">
          Security Note
        </h3>

        <p className="mt-2 text-amber-700 text-sm leading-6">
          Use a strong password containing a
          combination of uppercase letters,
          lowercase letters, numbers and special
          characters. Never share your admin
          credentials with anyone.
        </p>

      </div>

    </div>
  );
}