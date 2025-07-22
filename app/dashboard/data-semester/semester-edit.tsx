"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SemesterEdit({
  semesterId,
  onSuccess,
}: {
  semesterId: number;
  onSuccess: () => void;
}) {
  const [year, setYear] = useState("");
  const [type, setType] = useState("Ganjil");
  const [semesterNo, setSemesterNo] = useState(1);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await fetch(`/api/semesters/${semesterId}`);
        if (!res.ok) throw new Error("Gagal mengambil data semester");

        const data = await res.json();
        setYear(data.year);
        setType(data.type);
        setSemesterNo(data.semester_no);
        setIsActive(data.is_active);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data.");
      }
    };

    fetchSemester();
  }, [semesterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/semesters/${semesterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year,
          type,
          semester_no: semesterNo,
          is_active: isActive,
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui data");

      alert("Semester berhasil diperbarui.");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memperbarui.");
    }
  };

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle>Edit Semester</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <label className="block font-medium">Tahun</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tipe Semester</label>
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

        <div className="flex justify-end gap-2">
          <Button type="submit">Perbarui</Button>
        </div>
      </form>
    </div>
  );
}
