"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SemesterCreate({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [year, setYear] = useState("");
  const [type, setType] = useState("Ganjil");
  const [semesterNo, setSemesterNo] = useState(1);
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/semesters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year,
        type,
        semester_no: semesterNo,
        is_active: isActive,
      }),
    });

    if (res.ok) {
      onSuccess();
    } else {
      alert("Gagal menambahkan semester.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Tambah Semester</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tahun</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Contoh: 2024/2025"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tipe</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Semester Ke-</label>
          <input
            type="number"
            value={semesterNo}
            onChange={(e) => setSemesterNo(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            min={1}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label>Aktif</label>
        </div>

        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
