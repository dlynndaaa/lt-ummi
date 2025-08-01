"use client";

import { useEffect, useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  id: number;
  name?: string;
  semester_no?: string;
  slot?: string;
  start_time?: string;
  end_time?: string;
  lecturer?: string;
  credit?: number; // ✅ Tambahkan credit
}

interface JadwalFormData {
  practicum_assignment_id: number;
  day_id: number;
  time_slot_id: number;
  lab_id: number;
  subject_id: number;
  study_program_id: number;
  class_id: number;
  semester_id: number;
}

interface JadwalPraktikumCreateProps {
  onSuccess: () => void;
}

export default function JadwalPraktikumCreate({
  onSuccess,
}: JadwalPraktikumCreateProps) {
  const [formData, setFormData] = useState<JadwalFormData>({
    practicum_assignment_id: 0,
    day_id: 0,
    time_slot_id: 0,
    lab_id: 0,
    subject_id: 0,
    study_program_id: 0,
    class_id: 0,
    semester_id: 0,
  });

  const [assignments, setAssignments] = useState<Option[]>([]);
  const [days, setDays] = useState<Option[]>([]);
  const [times, setTimes] = useState<Option[]>([]);
  const [labs, setLabs] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [programs, setPrograms] = useState<Option[]>([]);
  const [classes, setClasses] = useState<Option[]>([]);
  const [semesters, setSemesters] = useState<Option[]>([]);

  const fetchOptions = async () => {
    const fetchData = async (url: string) => {
      const res = await fetch(url);
      return res.json();
    };

    const [
      assignmentData,
      dayData,
      timeData,
      labData,
      subjectData,
      programData,
      classData,
      semesterData,
    ] = await Promise.all([
      fetchData("/api/pengampu"),
      fetchData("/api/days"),
      fetchData("/api/waktu"),
      fetchData("/api/labs"),
      fetchData("/api/subjects"),
      fetchData("/api/study-programs"),
      fetchData("/api/classes"),
      fetchData("/api/semesters"),
    ]);

    setAssignments(assignmentData);
    setDays(dayData);
    setTimes(timeData);
    setLabs(labData);
    setSubjects(subjectData);
    setPrograms(programData);
    setClasses(classData);
    setSemesters(semesterData);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (key: keyof JadwalFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/jadwal-praktikum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSuccess();
    } else {
      console.error("Gagal menambahkan jadwal praktikum");
    }
  };

  return (
    <DialogContent className="bg-white text-black backdrop-blur-sm">
      <DialogHeader>
        <DialogTitle>Tambah Jadwal Praktikum</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {[
          {
            label: "Pengampu",
            key: "practicum_assignment_id",
            data: assignments,
            render: (opt: Option) => opt.lecturer ?? `ID: ${opt.id}`,
          },
          {
            label: "Hari",
            key: "day_id",
            data: days,
            render: (opt: Option) => opt.name ?? `ID: ${opt.id}`,
          },
          {
            label: "Waktu",
            key: "time_slot_id",
            data: times,
            render: (opt: Option) =>
              opt.start_time && opt.end_time
                ? `${opt.start_time} - ${opt.end_time}`
                : `ID: ${opt.id}`,
          },
          {
            label: "Laboratorium",
            key: "lab_id",
            data: labs,
            render: (opt: Option) => opt.name ?? `ID: ${opt.id}`,
          },
          {
            label: "Mata Kuliah",
            key: "subject_id",
            data: subjects,
            render: (opt: Option) =>
              opt.name
                ? `${opt.name}${opt.credit ? ` (${opt.credit} SKS)` : ""}`
                : `ID: ${opt.id}`, // ✅ Tampilkan SKS di sini
          },
          {
            label: "Program Studi",
            key: "study_program_id",
            data: programs,
            render: (opt: Option) => opt.name ?? `ID: ${opt.id}`,
          },
          {
            label: "Kelas",
            key: "class_id",
            data: classes,
            render: (opt: Option) => opt.name ?? `ID: ${opt.id}`,
          },
          {
            label: "Semester",
            key: "semester_id",
            data: semesters,
            render: (opt: Option) => opt.semester_no ?? `ID: ${opt.id}`,
          },
        ].map((item) => (
          <div key={item.key}>
            <Label>{item.label}</Label>
            <Select
              onValueChange={(val) =>
                handleChange(item.key as keyof JadwalFormData, val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`Pilih ${item.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {item.data.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id.toString()}>
                    {item.render(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <Button type="submit" className="mt-4 w-full">
          Simpan
        </Button>
      </form>
    </DialogContent>
  );
}
