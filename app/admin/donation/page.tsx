"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  DonationDetails,
  getDonationDetails,
  updateDonationDetails,
  deleteDonationDetails,
} from "@/app/lib/donationService";

import { uploadImage } from "@/app/lib/storageService";

const emptyDonation: DonationDetails = {
  accountName: "",
  accountNumber: "",
  bankName: "",
  ifsc: "",
  upiId: "",
  qrImage: "",
  message: "",
};

export default function DonationManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [exists, setExists] = useState(false);

  const [donation, setDonation] =
    useState<DonationDetails>(emptyDonation);

  const [selectedQRFile, setSelectedQRFile] =
    useState<File | null>(null);

  const [qrPreview, setQrPreview] =
    useState("");

  useEffect(() => {
    loadDonation();
  }, []);

  async function loadDonation() {
    try {
      setLoading(true);

      const data = await getDonationDetails();

      if (data) {
        setDonation({
          accountName: data.accountName || "",
          accountNumber: data.accountNumber || "",
          bankName: data.bankName || "",
          ifsc: data.ifsc || "",
          upiId: data.upiId || "",
          qrImage: data.qrImage || "",
          message: data.message || "",
        });

        setQrPreview(data.qrImage || "");
        setExists(true);
      } else {
        setDonation(emptyDonation);
        setQrPreview("");
        setExists(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to load donation details"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof DonationDetails,
    value: string
  ) {
    setDonation((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleQRFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid QR image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "QR image must be less than 5 MB."
      );
      return;
    }

    setSelectedQRFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setQrPreview(objectUrl);
  }

  async function handleSave() {
    if (
      !donation.accountName.trim() ||
      !donation.accountNumber.trim() ||
      !donation.bankName.trim() ||
      !donation.ifsc.trim() ||
      !donation.upiId.trim()
    ) {
      toast.error(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setSaving(true);

      let qrImageUrl =
        donation.qrImage;

      /*
       * Upload a new QR image only when
       * the user selects one.
       */
      if (selectedQRFile) {
        console.log(
          "Starting QR image upload:",
          selectedQRFile.name
        );

        qrImageUrl = await uploadImage(
          selectedQRFile,
          "donation"
        );

        console.log(
          "QR image uploaded:",
          qrImageUrl
        );
      }

      const updatedDonation: DonationDetails = {
        ...donation,
        accountName:
          donation.accountName.trim(),
        accountNumber:
          donation.accountNumber.trim(),
        bankName:
          donation.bankName.trim(),
        ifsc: donation.ifsc.trim(),
        upiId: donation.upiId.trim(),
        qrImage: qrImageUrl,
        message:
          donation.message.trim(),
      };

      await updateDonationDetails(
        updatedDonation
      );

      setDonation(updatedDonation);
      setQrPreview(qrImageUrl);
      setSelectedQRFile(null);

      setExists(true);
      setEditing(false);

      toast.success(
        "Donation details updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update donation details:",
        error
      );

      toast.error(
        "Failed to update donation details."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete the donation details?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteDonationDetails();

      setDonation(emptyDonation);
      setQrPreview("");
      setSelectedQRFile(null);

      setExists(false);
      setEditing(false);

      toast.success(
        "Donation details deleted successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete donation details."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    loadDonation();

    setSelectedQRFile(null);
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const inputClass =
    "w-full mt-2 border border-gray-300 rounded-lg p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-black">
            Donation Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage temple donation and bank details.
          </p>
        </div>

        {/* Actions */}

        <div className="flex gap-3">

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              disabled={saving}
              className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              Edit
            </button>
          )}

          {editing && (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg bg-gray-500 px-5 py-3 font-medium text-white hover:bg-gray-600 disabled:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:bg-gray-400"
              >
                {saving
                  ? "Uploading..."
                  : "Save Details"}
              </button>
            </>
          )}

          {exists && !editing && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-lg bg-red-500 px-5 py-3 font-medium text-white hover:bg-red-600 disabled:bg-gray-400"
            >
              Delete
            </button>
          )}

        </div>
      </div>

      {/* Main Card */}

      <div className="rounded-xl bg-white p-8 shadow">

        {/* Status */}

        <div className="mb-6">

          {exists ? (
            <div className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Donation details configured
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-yellow-700">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Donation details not configured
            </div>
          )}

        </div>

        {/* Form */}

        <div className="grid gap-6 md:grid-cols-2">

          {/* Account Holder */}

          <div>
            <label className="font-semibold text-black">
              Account Holder
            </label>

            <input
              type="text"
              value={donation.accountName}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "accountName",
                  e.target.value
                )
              }
              className={`${inputClass} ${
                !editing
                  ? "cursor-not-allowed bg-gray-100"
                  : ""
              }`}
            />
          </div>

          {/* Account Number */}

          <div>
            <label className="font-semibold text-black">
              Account Number
            </label>

            <input
              type="text"
              value={donation.accountNumber}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "accountNumber",
                  e.target.value
                )
              }
              className={`${inputClass} ${
                !editing
                  ? "cursor-not-allowed bg-gray-100"
                  : ""
              }`}
            />
          </div>

          {/* Bank Name */}

          <div>
            <label className="font-semibold text-black">
              Bank Name
            </label>

            <input
              type="text"
              value={donation.bankName}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "bankName",
                  e.target.value
                )
              }
              className={`${inputClass} ${
                !editing
                  ? "cursor-not-allowed bg-gray-100"
                  : ""
              }`}
            />
          </div>

          {/* IFSC */}

          <div>
            <label className="font-semibold text-black">
              IFSC Code
            </label>

            <input
              type="text"
              value={donation.ifsc}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "ifsc",
                  e.target.value
                )
              }
              className={`${inputClass} ${
                !editing
                  ? "cursor-not-allowed bg-gray-100"
                  : ""
              }`}
            />
          </div>

          {/* UPI */}

          <div className="md:col-span-2">

            <label className="font-semibold text-black">
              UPI ID
            </label>

            <input
              type="text"
              value={donation.upiId}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "upiId",
                  e.target.value
                )
              }
              className={`${inputClass} ${
                !editing
                  ? "cursor-not-allowed bg-gray-100"
                  : ""
              }`}
            />

          </div>

          {/* QR Upload */}

          <div className="md:col-span-2">

            <label className="font-semibold text-black">
              Donation QR Image
            </label>

            {editing && (
              <div className="mt-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleQRFileChange
                  }
                  disabled={saving}
                  className="w-full text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-500 file:px-5 file:py-2 file:text-white file:cursor-pointer hover:file:bg-orange-600 disabled:opacity-50"
                />

                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG or WEBP.
                  Maximum size: 5 MB.
                </p>

                {selectedQRFile && (
                  <p className="mt-3 text-sm font-medium text-green-600">
                    Selected:{" "}
                    {selectedQRFile.name}
                  </p>
                )}

              </div>
            )}

            {/* QR Preview */}

            {qrPreview && (
              <div className="mt-5">

                <label className="mb-3 block font-semibold text-black">
                  QR Preview
                </label>

                <div className="flex justify-center">

                  <img
                    src={qrPreview}
                    alt="Donation QR Code"
                    className="h-56 w-56 rounded-xl border object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>

              </div>
            )}

            {!qrPreview && !editing && (
              <div className="mt-3 text-sm text-gray-500">
                No QR image configured.
              </div>
            )}

          </div>

          {/* Message */}

          <div className="md:col-span-2">

            <label className="font-semibold text-black">
              Donation Message
            </label>

            <textarea
              rows={5}
              value={donation.message}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "message",
                  e.target.value
                )
              }
              className={`${inputClass} ${
                !editing
                  ? "cursor-not-allowed bg-gray-100"
                  : ""
              }`}
            />

          </div>

        </div>

        {/* Bottom Actions */}

        {editing && (
          <div className="mt-8 flex justify-end gap-3 border-t pt-6">

            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg bg-gray-500 px-6 py-3 text-white hover:bg-gray-600 disabled:bg-gray-400"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 disabled:bg-gray-400"
            >
              {saving
                ? "Uploading..."
                : "Save Details"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}