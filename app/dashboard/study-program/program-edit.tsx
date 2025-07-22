"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Faculty {
  id: number;
  name: string;
}

interface StudyProgram {
  id: number;
  code_prodi: string;
  name: string;
  faculty_id: number;
}

interface ProgramEditProps {
  programId: number;
  onSuccess: () => void;
}

export default function ProgramEdit({ programId, onSuccess }: ProgramEditProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState<number | "">("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data fakultas
    fetch("/api/faculties")
      .then((res) => res.json())
      .then((data) => setFaculties(data))
      .catch((err) => console.error("Gagal memuat fakultas:", err));

    // Fetch data program studi yang akan diedit
    fetch(`/api/study-programs/${programId}`)
      .then((res) => res.json())
      .then((data: StudyProgram) => {
        setCode(data.code_prodi);
        setName(data.name);
        setFacultyId(data.faculty_id);
      })
      .catch((err) => console.error("Gagal memuat data program studi:", err));
  }, [programId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !facultyId) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/study-programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code_prodi: code,
          name,
          faculty_id: Number(facultyId),
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui program studi");

      alert("Program studi berhasil diperbarui.");
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="code">Kode Program Studi</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="name">Nama Program Studi</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="faculty">Fakultas</Label>
        <select
          id="faculty"
          value={facultyId}
          onChange={(e) => setFacultyId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Pilih Fakultas
          </option>
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 text-white" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
