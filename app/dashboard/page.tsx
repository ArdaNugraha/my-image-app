"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("Title + file required");
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const payload = { title, description: desc, data: dataUrl };
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      setLoading(false);
      if (j.ok) {
        alert("Uploaded!");
        router.refresh();
      } else {
        alert("Upload error: " + (j.error ?? "unknown"));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow max-w-xl"
      >
        <label className="block mb-2">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Description
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          File
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
