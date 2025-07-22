"use client";

import { useEffect, useState } from "react";
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

interface PengampuEditProps {
  id: number;
  onSuccess: () => void;
}

export default function PengampuEdit({ id, onSuccess }: PengampuEditProps) {
  const [form, setForm] = useState({
    lecturer_id: 0,
    subject_id: 0,
    class_id: 0,
    semester_id: 0,
    study_program_id: 0,
  });

  const [lecturers, setLecturers] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [classes, setClasses] = useState<Option[]>([]);
  const [semesters, setSemesters] = useState<Option[]>([]);
  const [programs, setPrograms] = useState<Option[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [l, s, c, sem, sp, current] = await Promise.all([
          fetch("/api/lecturers").then((res) => res.json()),
          fetch("/api/subjects").then((res) => res.json()),
          fetch("/api/classes").then((res) => res.json()),
          fetch("/api/semesters").then((res) => res.json()),
          fetch("/api/study-programs").then((res) => res.json()),
          fetch(`/api/pengampu/${id}`).then((res) => res.json()),
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

        setForm({
          lecturer_id: current.lecturer_id,
          subject_id: current.subject_id,
          class_id: current.class_id,
          semester_id: current.semester_id,
          study_program_id: current.study_program_id,
        });
      } catch (err) {
        console.error("Gagal memuat data edit:", err);
      }
    };

    fetchAll();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/pengampu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Data berhasil diperbarui.");
      onSuccess();
    } else {
      alert("Gagal memperbarui data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">Edit Pengampu</h2>

      <div>
        <Label>Dosen</Label>
        <select
          name="lecturer_id"
          value={form.lecturer_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Dosen</option>
          {lecturers.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Mata Kuliah</Label>
        <select
          name="subject_id"
          value={form.subject_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Mata Kuliah</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Kelas</Label>
        <select
          name="class_id"
          value={form.class_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Semester</Label>
        <select
          name="semester_id"
          value={form.semester_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Program Studi</Label>
        <select
          name="study_program_id"
          value={form.study_program_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Pilih Program Studi</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 text-white">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
