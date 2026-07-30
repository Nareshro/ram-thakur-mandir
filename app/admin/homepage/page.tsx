"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
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

  facebook: string;
  instagram: string;
  youtube: string;
}

export default function HomepagePage() {
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  const [form, setForm] = useState<HomepageForm>({
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

    facebook: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    try {
      const snap = await getDoc(doc(db, "homepage", "main"));

      if (snap.exists()) {
        setForm((prev) => ({
          ...prev,
          ...(snap.data() as HomepageForm),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function saveHomepage() {
  try {
    setLoading(true);

    await setDoc(doc(db, "homepage", "main"), form);

    toast.success("Homepage updated successfully!");
  } catch (error) {
    console.error(error);

    toast.error("Failed to save homepage.");
  } finally {
    setLoading(false);
  }
}

  return ( 
    <div className="max-w-6xl mx-auto p-8 space-y-8">

  {/* Header */}
  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      Homepage Management
    </h1>

    <p className="mt-2 text-gray-600">
      Manage your homepage content.
    </p>
  </div>

  {/* Hero Section */}
  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      Hero Section
    </h2>

    <div>
      <label className="block font-medium text-gray-700">
        Temple Name
      </label>

      <input
        className={inputClass}
        value={form.templeName}
        onChange={(e)=>
          setForm({...form,templeName:e.target.value})
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Hero Title
      </label>

      <input
        className={inputClass}
        value={form.heroTitle}
        onChange={(e)=>
          setForm({...form,heroTitle:e.target.value})
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Subtitle
      </label>

      <input
        className={inputClass}
        value={form.subtitle}
        onChange={(e)=>
          setForm({...form,subtitle:e.target.value})
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Hero Description
      </label>

      <textarea
        rows={4}
        className={inputClass}
        value={form.heroDescription}
        onChange={(e)=>
          setForm({...form,heroDescription:e.target.value})
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Hero Image Path
      </label>

      <input
        className={inputClass}
        placeholder="/images/hero/banner.jpg"
        value={form.heroImage}
        onChange={(e)=>
          setForm({...form,heroImage:e.target.value})
        }
      />
    </div>

  </div>

  {/* About Section */}

  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      About Section
    </h2>

    <div>
      <label className="block font-medium text-gray-700">
        About Title
      </label>

      <input
        className={inputClass}
        value={form.aboutTitle}
        onChange={(e)=>
          setForm({...form,aboutTitle:e.target.value})
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
        onChange={(e)=>
          setForm({...form,aboutHeading:e.target.value})
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
        onChange={(e)=>
          setForm({...form,about:e.target.value})
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
        onChange={(e)=>
          setForm({...form,mission:e.target.value})
        }
      />
    </div>

    <div className="grid md:grid-cols-3 gap-6">

      <div>
        <label className="block font-medium text-gray-700">
          Daily Aarti
        </label>

        <input
          className={inputClass}
          value={form.dailyAarti}
          onChange={(e)=>
            setForm({...form,dailyAarti:e.target.value})
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
          onChange={(e)=>
            setForm({...form,devotees:e.target.value})
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
          onChange={(e)=>
            setForm({...form,peaceService:e.target.value})
          }
        />
      </div>

    </div>

  </div>
            {/* Contact Section */}
  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      Contact Information
    </h2>

    <div>
      <label className="block font-medium text-gray-700">
        Address
      </label>

      <textarea
        rows={3}
        className={inputClass}
        value={form.address}
        onChange={(e) =>
          setForm({
            ...form,
            address: e.target.value,
          })
        }
      />
    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <label className="block font-medium text-gray-700">
          Phone
        </label>

        <input
          className={inputClass}
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
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
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />
      </div>

    </div>

  </div>

  {/* Social Media */}

  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      Social Media
    </h2>

    <div>
      <label className="block font-medium text-gray-700">
        Facebook
      </label>

      <input
        className={inputClass}
        value={form.facebook}
        onChange={(e) =>
          setForm({
            ...form,
            facebook: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Instagram
      </label>

      <input
        className={inputClass}
        value={form.instagram}
        onChange={(e) =>
          setForm({
            ...form,
            instagram: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        YouTube
      </label>

      <input
        className={inputClass}
        value={form.youtube}
        onChange={(e) =>
          setForm({
            ...form,
            youtube: e.target.value,
          })
        }
      />
    </div>

  </div>

  <div className="flex justify-end">

    <button
      onClick={saveHomepage}
      disabled={loading}
      className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
    >
      {loading ? "Saving..." : "Save Homepage"}
    </button>

  </div>

</div>
  );
}