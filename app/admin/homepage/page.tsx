"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { uploadImage } from "@/app/lib/storageService";
import toast from "react-hot-toast";

interface HomepageForm {
  templeName: string;
  heroTitle: string;
  subtitle: string;
  heroDescription: string;

  aboutTitle: string;
  aboutHeading: string;
  about: string;
  mission: string;

  dailyAarti: string;
  devotees: string;
  peaceService: string;

  heroImage: string;

  address: string;
  phone: string;
  email: string;
  mapUrl: string;

  facebook: string;
  instagram: string;
  youtube: string;
}

const emptyForm: HomepageForm = {
  templeName: "",
  heroTitle: "",
  subtitle: "",
  heroDescription: "",

  aboutTitle: "",
  aboutHeading: "",
  about: "",
  mission: "",

  dailyAarti: "",
  devotees: "",
  peaceService: "",

  heroImage: "",

  address: "",
  phone: "",
  email: "",
  mapUrl: "",

  facebook: "",
  instagram: "",
  youtube: "",
};

export default function HomepagePage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] =
    useState(true);

  const [form, setForm] =
    useState<HomepageForm>(emptyForm);

  const [selectedHeroFile, setSelectedHeroFile] =
    useState<File | null>(null);

  const [heroPreview, setHeroPreview] =
    useState("");

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    try {
      setInitialLoading(true);

      const snap = await getDoc(
        doc(db, "homepage", "main")
      );

      if (snap.exists()) {
        const data =
          snap.data() as Partial<HomepageForm>;

        const loadedForm: HomepageForm = {
          ...emptyForm,
          ...data,
        };

        setForm(loadedForm);

        setHeroPreview(
          loadedForm.heroImage || ""
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load homepage"
      );
    } finally {
      setInitialLoading(false);
    }
  }

  function handleHeroFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Hero image must be less than 5 MB."
      );
      return;
    }

    setSelectedHeroFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setHeroPreview(objectUrl);
  }

  async function saveHomepage() {
    try {
      setLoading(true);

      let heroImageUrl =
        form.heroImage;

      /*
       * Upload a new hero image only when
       * the administrator selects one.
       */
      if (selectedHeroFile) {
        console.log(
          "Starting homepage hero upload:",
          selectedHeroFile.name
        );

        heroImageUrl =
          await uploadImage(
            selectedHeroFile,
            "homepage"
          );

        console.log(
          "Homepage hero uploaded:",
          heroImageUrl
        );
      }

      const updatedForm: HomepageForm = {
        ...form,
        heroImage: heroImageUrl,
      };

      await setDoc(
        doc(db, "homepage", "main"),
        updatedForm,
        { merge: true }
      );

      setForm(updatedForm);

      setHeroPreview(
        heroImageUrl || ""
      );

      setSelectedHeroFile(null);

      toast.success(
        "Homepage updated successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to save homepage:",
        error
      );

      toast.error(
        "Failed to save homepage."
      );
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-gray-500">
        Loading homepage...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Homepage Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your homepage content.
        </p>
      </div>

      {/* HERO */}

      <div className="space-y-6 rounded-2xl border bg-white p-8 shadow-lg">

        <h2 className="border-b pb-3 text-2xl font-bold text-amber-600">
          Hero Section
        </h2>

        {/* Temple Name */}

        <div>
          <label className="block font-medium text-gray-700">
            Temple Name
          </label>

          <input
            className={inputClass}
            value={form.templeName}
            onChange={(e) =>
              setForm({
                ...form,
                templeName:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Hero Title */}

        <div>
          <label className="block font-medium text-gray-700">
            Hero Title
          </label>

          <input
            className={inputClass}
            value={form.heroTitle}
            onChange={(e) =>
              setForm({
                ...form,
                heroTitle:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Subtitle */}

        <div>
          <label className="block font-medium text-gray-700">
            Subtitle
          </label>

          <input
            className={inputClass}
            value={form.subtitle}
            onChange={(e) =>
              setForm({
                ...form,
                subtitle:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Hero Description */}

        <div>
          <label className="block font-medium text-gray-700">
            Hero Description
          </label>

          <textarea
            rows={4}
            className={inputClass}
            value={form.heroDescription}
            onChange={(e) =>
              setForm({
                ...form,
                heroDescription:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Hero Image */}

        <div>

          <label className="block font-medium text-gray-700">
            Hero Image
          </label>

          <div className="mt-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">

            <input
              type="file"
              accept="image/*"
              onChange={
                handleHeroFileChange
              }
              disabled={loading}
              className="w-full text-gray-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500 file:px-5 file:py-2 file:text-white hover:file:bg-amber-600 disabled:opacity-50"
            />

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG or WEBP. Maximum
              size: 5 MB.
            </p>

            {selectedHeroFile && (
              <p className="mt-3 text-sm font-medium text-green-600">
                Selected:{" "}
                {selectedHeroFile.name}
              </p>
            )}

          </div>

          {/* Preview */}

          {heroPreview && (
            <div className="mt-5">

              <p className="mb-3 font-medium text-gray-700">
                Hero Image Preview
              </p>

              <img
                src={heroPreview}
                alt="Homepage hero preview"
                className="h-64 w-full max-w-3xl rounded-xl border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}

          {!heroPreview && (
            <div className="mt-4 rounded-xl bg-gray-100 p-6 text-center text-gray-500">
              No hero image configured.
            </div>
          )}

        </div>

      </div>

      {/* ABOUT */}

      <div className="space-y-6 rounded-2xl border bg-white p-8 shadow-lg">

        <h2 className="border-b pb-3 text-2xl font-bold text-amber-600">
          About Section
        </h2>

        <div>
          <label className="block font-medium text-gray-700">
            About Title
          </label>

          <input
            className={inputClass}
            value={form.aboutTitle}
            onChange={(e) =>
              setForm({
                ...form,
                aboutTitle:
                  e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            About Heading
          </label>

          <input
            className={inputClass}
            value={form.aboutHeading}
            onChange={(e) =>
              setForm({
                ...form,
                aboutHeading:
                  e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            About Description
          </label>

          <textarea
            rows={5}
            className={inputClass}
            value={form.about}
            onChange={(e) =>
              setForm({
                ...form,
                about:
                  e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Mission
          </label>

          <textarea
            rows={4}
            className={inputClass}
            value={form.mission}
            onChange={(e) =>
              setForm({
                ...form,
                mission:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div>
            <label className="block font-medium text-gray-700">
              Daily Aarti
            </label>

            <input
              className={inputClass}
              value={form.dailyAarti}
              onChange={(e) =>
                setForm({
                  ...form,
                  dailyAarti:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Devotees
            </label>

            <input
              className={inputClass}
              value={form.devotees}
              onChange={(e) =>
                setForm({
                  ...form,
                  devotees:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Peace & Service
            </label>

            <input
              className={inputClass}
              value={form.peaceService}
              onChange={(e) =>
                setForm({
                  ...form,
                  peaceService:
                    e.target.value,
                })
              }
            />
          </div>

        </div>

      </div>

      {/* CONTACT */}

      <div className="space-y-6 rounded-2xl border bg-white p-8 shadow-lg">

        <h2 className="border-b pb-3 text-2xl font-bold text-amber-600">
          Contact Information
        </h2>

        <div>
          <label className="block font-medium text-gray-700">
            Temple Address
          </label>

          <textarea
            rows={4}
            className={inputClass}
            placeholder="Shri Shri Ram Thakur Seva Mandir..."
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="block font-medium text-gray-700">
              Phone
            </label>

            <input
              type="tel"
              className={inputClass}
              placeholder="+91 97740 50010"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone:
                    e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              className={inputClass}
              placeholder="info@ramthakurmandir.org"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
            />
          </div>

        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Google Maps Embed URL
          </label>

          <input
            type="url"
            className={inputClass}
            placeholder="https://www.google.com/maps?q=Banamalipur%20Agartala&output=embed"
            value={form.mapUrl}
            onChange={(e) =>
              setForm({
                ...form,
                mapUrl:
                  e.target.value,
              })
            }
          />

          <p className="mt-2 text-sm text-gray-500">
            Use the Google Maps embed URL
            for the temple location.
          </p>
        </div>

      </div>

      {/* SOCIAL MEDIA */}

      <div className="space-y-6 rounded-2xl border bg-white p-8 shadow-lg">

        <h2 className="border-b pb-3 text-2xl font-bold text-amber-600">
          Social Media
        </h2>

        <div>
          <label className="block font-medium text-gray-700">
            Facebook
          </label>

          <input
            type="url"
            className={inputClass}
            placeholder="https://facebook.com/..."
            value={form.facebook}
            onChange={(e) =>
              setForm({
                ...form,
                facebook:
                  e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Instagram
          </label>

          <input
            type="url"
            className={inputClass}
            placeholder="https://instagram.com/..."
            value={form.instagram}
            onChange={(e) =>
              setForm({
                ...form,
                instagram:
                  e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            YouTube
          </label>

          <input
            type="url"
            className={inputClass}
            placeholder="https://youtube.com/..."
            value={form.youtube}
            onChange={(e) =>
              setForm({
                ...form,
                youtube:
                  e.target.value,
              })
            }
          />
        </div>

      </div>

      {/* SAVE */}

      <div className="flex justify-end">

        <button
          onClick={saveHomepage}
          disabled={loading}
          className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
        >
          {loading
            ? "Uploading..."
            : "Save Homepage"}
        </button>

      </div>

    </div>
  );
}