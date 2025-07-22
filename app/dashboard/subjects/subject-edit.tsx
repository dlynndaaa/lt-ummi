"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StudyProgram {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
  credit: number;
  study_program_id: number;
}

interface SubjectEditProps {
  subjectId: number;
  onSuccess: () => void;
}

export default function SubjectEdit({ subjectId, onSuccess }: SubjectEditProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credit, setCredit] = useState<number | "">("");
  const [studyProgramId, setStudyProgramId] = useState<number | "">("");
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil daftar program studi
    fetch("/api/study-programs")
      .then((res) => res.json())
      .then((data) => setStudyPrograms(data))
      .catch((err) => console.error("Gagal memuat program studi:", err));

    // Ambil data mata kuliah berdasarkan ID
    fetch(`/api/subjects/${subjectId}`)
      .then((res) => res.json())
      .then((data: Subject) => {
        setCode(data.code);
        setName(data.name);
        setCredit(data.credit);
        setStudyProgramId(data.study_program_id);
      })
      .catch((err) => console.error("Gagal memuat data mata kuliah:", err));
  }, [subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !credit || !studyProgramId) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/subjects/${subjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          credit: Number(credit),
          study_program_id: Number(studyProgramId),
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui mata kuliah");

      alert("Mata kuliah berhasil diperbarui.");
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
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
