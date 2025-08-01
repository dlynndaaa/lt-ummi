"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export interface Schedule {
  id: number;
  subject: string;
  instructor: string;
  credit: number; // <-- disesuaikan
  day: string;
  time: string;
  lab: string;
  study_program: string;
  class: string;
  semester_no: string;
  semester_type: string;
  academic_year: string;
  no?: number;
}

interface TableProps {
  data: Schedule[];
  searchTerm: string;
  isLoading: boolean;
  setEditId: (id: number) => void;
  handleDelete: (id: number) => void;
}

export default function ScheduleTable({
  data,
  searchTerm,
  isLoading,
  setEditId,
  handleDelete,
}: TableProps) {
  const columns = [
    {
      key: "no",
      title: "No",
      render: (_: any, item: Schedule) => item.no ?? "-",
    },
    {
      key: "subject",
      title: "Mata Praktikum",
      render: (_: any, item: Schedule) => item.subject,
    },
    {
      key: "instructor",
      title: "Pengampu",
      render: (_: any, item: Schedule) => item.instructor,
    },
    {
      key: "credit",
      title: "SKS", // tetap tampilkan sebagai "SKS"
      render: (_: any, item: Schedule) => item.credit ?? "-",
    },
    {
      key: "day",
      title: "Hari",
      render: (_: any, item: Schedule) => item.day,
    },
    {
      key: "time",
      title: "Jam",
      render: (_: any, item: Schedule) => item.time,
    },
    {
      key: "lab",
      title: "Lab",
      render: (_: any, item: Schedule) => item.lab || "-",
    },
    {
      key: "study_program",
      title: "Prodi",
      render: (_: any, item: Schedule) => item.study_program,
    },
    {
      key: "class",
      title: "Kelas",
      render: (_: any, item: Schedule) => item.class,
    },
    {
      key: "semester_no",
      title: "Semester",
      render: (_: any, item: Schedule) => item.semester_no,
    },
    {
      key: "semester_type",
      title: "Tipe Semester",
      render: (_: any, item: Schedule) => item.semester_type,
    },
    {
      key: "academic_year",
      title: "Tahun Akademik",
      render: (_: any, item: Schedule) => item.academic_year,
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: Schedule) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditId(item.id)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = data.filter((d) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      d.subject.toLowerCase().includes(lowerTerm) ||
      d.instructor.toLowerCase().includes(lowerTerm) ||
      d.lab.toLowerCase().includes(lowerTerm) ||
      d.study_program.toLowerCase().includes(lowerTerm) ||
      d.class.toLowerCase().includes(lowerTerm) ||
      d.academic_year.toLowerCase().includes(lowerTerm)
    );
  });

  return (
    <div className="px-6 pb-6">
      <DataTable
        title=""
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
}
