"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface DonationData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  upiId: string;
  qrImage: string;
  message: string;
}

export default function Donation() {
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonation();
  }, []);

  async function loadDonation() {
    try {
      const snap = await getDoc(doc(db, "donation", "details"));

      if (snap.exists()) {
        setDonation(snap.data() as DonationData);
      }
    } catch (error) {
      console.error("Failed to load donation:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="donation"
      className="scroll-mt-20 py-24 bg-orange-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <h3 className="text-center text-orange-600 uppercase tracking-[0.3em]">
          Support The Temple
        </h3>

        <h2 className="text-5xl font-bold text-center mt-4 text-gray-900">
          Make a Donation
        </h2>

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center text-gray-600">
            Loading donation details...
          </div>
        ) : !donation ? (
          <div className="py-20 text-center text-gray-600">
            Donation details are currently unavailable.
          </div>
        ) : (
          <>
            {/* Message */}
            <p className="text-center text-gray-600 mt-5 max-w-3xl mx-auto">
              {donation.message}
            </p>

            {/* Donation Content */}
            <div className="grid lg:grid-cols-2 gap-12 mt-16">

              {/* Bank Details */}
              <div className="bg-white rounded-3xl shadow-xl p-8">

                <h3 className="text-2xl font-bold mb-6 text-orange-600">
                  Bank Details
                </h3>

                <div className="space-y-4 text-gray-700">

                  <p>
                    <strong>Account Holder:</strong>
                    <br />
                    {donation.accountName}
                  </p>

                  <p>
                    <strong>Bank:</strong>
                    <br />
                    {donation.bankName}
                  </p>

                  <p>
                    <strong>Account Number:</strong>
                    <br />
                    {donation.accountNumber}
                  </p>

                  <p>
                    <strong>IFSC:</strong>
                    <br />
                    {donation.ifsc}
                  </p>

                  <p>
                    <strong>UPI ID:</strong>
                    <br />
                    <span className="text-orange-600 font-semibold">
                      {donation.upiId}
                    </span>
                  </p>

                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

                <h3 className="text-2xl font-bold mb-6 text-orange-600">
                  Scan & Donate
                </h3>

                {donation.qrImage ? (
                  <img
                    src={donation.qrImage}
                    alt="QR Code"
                    className="mx-auto w-72 h-72 object-contain border rounded-xl"
                  />
                ) : (
                  <div className="mx-auto w-72 h-72 flex items-center justify-center border rounded-xl text-gray-500">
                    QR Code Not Available
                  </div>
                )}

                <p className="mt-6 text-gray-600">
                  Scan this QR Code using any UPI app
                  to make your contribution.
                </p>

              </div>

            </div>
          </>
        )}

      </div>
    </section>
  );
}