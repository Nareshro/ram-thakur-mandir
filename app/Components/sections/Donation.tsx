"use client";

import { useEffect, useState } from "react";

import {
  DonationDetails,
  getDonationDetails,
} from "@/app/lib/donationService";

export default function Donation() {
  const [donation, setDonation] =
    useState<DonationDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDonation() {
      try {
        const data =
          await getDonationDetails();

        setDonation(data);
      } catch (error) {
        console.error(
          "Failed to load donation details:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDonation();
  }, []);

  return (
    <section
      id="donation"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6 text-center">

        {/* Header */}

        <h3 className="text-amber-500 uppercase tracking-[0.3em]">
          Donation
        </h3>

        <h2 className="mt-4 text-5xl font-bold">
          Support Our Temple
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-gray-600">
          Your generous donation helps us conduct
          daily poojas, festivals, annadanam, temple
          maintenance and spiritual activities.
        </p>

        {/* Loading */}

        {loading ? (

          <div className="py-20 text-center text-gray-500">
            Loading donation details...
          </div>

        ) : !donation ? (

          <div className="mt-12 rounded-3xl bg-gray-50 p-12 text-center shadow-lg">
            <p className="text-lg text-gray-500">
              Donation details are currently
              unavailable.
            </p>
          </div>

        ) : (

          <div className="mt-12 grid gap-10 md:grid-cols-2">

            {/* Bank Details */}

            <div className="rounded-3xl bg-gray-50 p-8 text-left shadow-lg">

              <h3 className="mb-6 text-2xl font-bold">
                Bank Details
              </h3>

              <div className="space-y-4 text-lg">

                {donation.bankName && (
                  <p>
                    <strong>Bank:</strong>{" "}
                    {donation.bankName}
                  </p>
                )}

                {donation.accountName && (
                  <p>
                    <strong>
                      Account Name:
                    </strong>{" "}
                    {donation.accountName}
                  </p>
                )}

                {donation.accountNumber && (
                  <p>
                    <strong>
                      Account No:
                    </strong>{" "}
                    {donation.accountNumber}
                  </p>
                )}

                {donation.ifsc && (
                  <p>
                    <strong>IFSC:</strong>{" "}
                    {donation.ifsc}
                  </p>
                )}

                {donation.upiId && (
                  <p>
                    <strong>UPI:</strong>{" "}
                    {donation.upiId}
                  </p>
                )}

              </div>

              {/* Donation Message */}

              {donation.message && (
                <p className="mt-8 border-t border-gray-200 pt-6 text-gray-600">
                  {donation.message}
                </p>
              )}

            </div>

            {/* QR Code */}

            <div className="rounded-3xl bg-gray-50 p-8 shadow-lg">

              <h3 className="mb-6 text-2xl font-bold">
                Scan & Pay
              </h3>

              {donation.qrImage ? (

                <img
                  src={donation.qrImage}
                  alt="Donation QR Code"
                  className="mx-auto h-72 w-72 rounded-xl object-contain"
                />

              ) : (

                <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                  QR Code Not Available
                </div>

              )}

              <p className="mt-6 text-gray-600">
                Thank you for supporting the temple.
              </p>

            </div>

          </div>

        )}

      </div>
    </section>
  );
}