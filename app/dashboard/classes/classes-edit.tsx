"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ClassesEdit({
  data,
  onSuccess,
}: {
  data: any;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(data.name);
  const [type, setType] = useState(data.type);
  const [studentCount, setStudentCount] = useState(data.student_count);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [studyProgramId, setStudyProgramId] = useState(data.study_program_id);
  const [semesterId, setSemesterId] = useState(data.semesters_id);

  useEffect(() => {
    fetch("/api/study-programs").then((res) => res.json()).then(setStudyPrograms);
    fetch("/api/semesters").then((res) => res.json()).then(setSemesters);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/classes/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        student_count: parseInt(studentCount.toString()),
        study_program_id: parseInt(studyProgramId),
        semesters_id: parseInt(semesterId),
      }),
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama Kelas</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Tipe</Label>
        <Input value={type} onChange={(e) => setType(e.target.value)} required />
      </div>
      <div>
        <Label>Jumlah Mahasiswa</Label>
        <Input
          type="number"
          value={studentCount}
          onChange={(e) => setStudentCount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label>Program Studi</Label>
        <select
          className="w-full border rounded p-2"
          value={studyProgramId}
          onChange={(e) => setStudyProgramId(e.target.value)}
          required
        >
          <option value="">Pilih Program Studi</option>
          {studyPrograms.map((sp: any) => (
            <option key={sp.id} value={sp.id}>{sp.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Semester</Label>
        <select
          className="w-full border rounded p-2"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          required
        >
          <option value="">Pilih Semester</option>
          {semesters.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name || s.year}</option>
          ))}
        </select>
      </div>
      <Button type="submit">Update</Button>
    </form>
  );
}
