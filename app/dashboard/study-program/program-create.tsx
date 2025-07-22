"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Faculty {
  id: number;
  name: string;
}

interface ProgramCreateProps {
  onSuccess: () => void;
}

export default function ProgramCreate({ onSuccess }: ProgramCreateProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState<number | "">("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch("/api/faculties");
        const data = await res.json();
        setFaculties(data);
      } catch (error) {
        console.error("Gagal memuat fakultas:", error);
      }
    };
    fetchFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !facultyId) {
      alert("Semua field wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/study-programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code_prodi: code,
          name,
          faculty_id: Number(facultyId),
        }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan program studi");
      alert("Program studi berhasil ditambahkan.");
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan.");
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
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
