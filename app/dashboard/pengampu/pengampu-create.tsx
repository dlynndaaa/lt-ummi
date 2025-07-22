"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Option {
  id: number;
  name: string;
}

interface Semester {
  id: number;
  semester_no: string;
}

interface Props {
  onSuccess: () => void;
}

export default function PengampuCreate({ onSuccess }: Props) {
  const [lecturerId, setLecturerId] = useState<number>();
  const [subjectId, setSubjectId] = useState<number>();
  const [classId, setClassId] = useState<number>();
  const [semesterId, setSemesterId] = useState<number>();
  const [studyProgramId, setStudyProgramId] = useState<number>();

  const [lecturers, setLecturers] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [classes, setClasses] = useState<Option[]>([]);
  const [semesters, setSemesters] = useState<Option[]>([]);
  const [programs, setPrograms] = useState<Option[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [l, s, c, sem, sp] = await Promise.all([
          fetch("/api/lecturers").then(res => res.json()),
          fetch("/api/subjects").then(res => res.json()),
          fetch("/api/classes").then(res => res.json()),
          fetch("/api/semesters").then(res => res.json()),
          fetch("/api/study-programs").then(res => res.json()),
        ]);

        setLecturers(Array.isArray(l.lecturers) ? l.lecturers : []);
        setSubjects(Array.isArray(s) ? s : []);
        setClasses(Array.isArray(c) ? c : []);
        setSemesters(
          Array.isArray(sem)
            ? sem.map((s: Semester) => ({ id: s.id, name: s.semester_no }))
            : []
        );
        setPrograms(Array.isArray(sp) ? sp : []);
      } catch (err) {
        console.error("Gagal memuat data dropdown:", err);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecturerId || !subjectId || !classId || !semesterId || !studyProgramId) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/pengampu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lecturer_id: lecturerId,
          subject_id: subjectId,
          class_id: classId,
          semester_id: semesterId,
          study_program_id: studyProgramId
        }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan data.");
      alert("Data berhasil ditambahkan.");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Dosen</Label>
        <select
          required
          value={lecturerId ?? ""}
          onChange={(e) => setLecturerId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Dosen</option>
          {lecturers.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label>Mata Kuliah</Label>
        <select
          required
          value={subjectId ?? ""}
          onChange={(e) => setSubjectId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Mata Kuliah</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label>Kelas</Label>
        <select
          required
          value={classId ?? ""}
          onChange={(e) => setClassId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label>Semester</Label>
        <select
          required
          value={semesterId ?? ""}
          onChange={(e) => setSemesterId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label>Program Studi</Label>
        <select
          required
          value={studyProgramId ?? ""}
          onChange={(e) => setStudyProgramId(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Program Studi</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
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