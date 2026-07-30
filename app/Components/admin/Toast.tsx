"use client";

interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error";
}

export default function Toast({
  show,
  message,
  type = "success",
}: ToastProps) {
  if (!show) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 rounded-xl px-6 py-4 text-white shadow-xl transition-all ${
        type === "success"
          ? "bg-green-600"
          : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}