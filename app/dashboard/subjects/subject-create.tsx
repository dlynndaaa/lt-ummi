"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StudyProgram {
  id: number;
  name: string;
}

interface SubjectCreateProps {
  onSuccess: () => void;
}

export default function SubjectCreate({ onSuccess }: SubjectCreateProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credit, setCredit] = useState<number | "">("");
  const [studyProgramId, setStudyProgramId] = useState<number | "">("");
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/study-programs");
        const data = await res.json();
        setStudyPrograms(data);
      } catch (error) {
        console.error("Gagal memuat program studi:", error);
      }
    };
    fetchPrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !credit || !studyProgramId) {
      alert("Semua field wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          credit: Number(credit),
          study_program_id: Number(studyProgramId),
        }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan mata kuliah");
      alert("Mata kuliah berhasil ditambahkan.");
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
        <Label htmlFor="code">Kode Mata Kuliah</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="name">Nama Mata Kuliah</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="credit">SKS</Label>
        <Input
          id="credit"
          type="number"
          value={credit}
          onChange={(e) => setCredit(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="studyProgram">Program Studi</Label>
        <select
          id="studyProgram"
          value={studyProgramId}
          onChange={(e) => setStudyProgramId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Pilih Program Studi
          </option>
          {studyPrograms.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
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
