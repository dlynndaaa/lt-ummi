"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Search } from "lucide-react"; // ✅ Tambah ikon Search
import ClassCreate from "./classes-create";
import ClassEdit from "./classes-edit";

interface ClassData {
  id: number;
  name: string;
  type: string;
  student_count: number;
  semesters_id: number;
  study_program_id: number;
  semester_year: string;
  study_program_name: string;
}

interface StudyProgram {
  id: number;
  name: string;
}

export default function ClassPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ Tambah searchTerm
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<ClassData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();

      if (Array.isArray(data)) {
        setClasses(data);
        setAllClasses(data);
        setError(null);
      } else {
        console.error("Data yang diterima bukan array:", data);
        setClasses([]);
        setAllClasses([]);
        setError("Gagal memuat data kelas.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Terjadi kesalahan saat mengambil data kelas.");
      setClasses([]);
      setAllClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyPrograms = async () => {
    try {
      const res = await fetch("/api/study-programs");
      const data = await res.json();
      setStudyPrograms(data);
    } catch (err) {
      console.error("Gagal memuat program studi:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudyPrograms();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedProgram(selected);
    filterClasses(selected, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterClasses(selectedProgram, value);
  };

  const filterClasses = (program: string, keyword: string) => {
    let filtered = allClasses;

    if (program !== "all") {
      filtered = filtered.filter(
        (cls) => cls.study_program_name.toLowerCase() === program.toLowerCase()
      );
    }

    if (keyword.trim() !== "") {
      filtered = filtered.filter((cls) =>
        cls.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setClasses(filtered);
  };

  const handleDelete = async (item: ClassData) => {
    const res = await fetch(`/api/classes/${item.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchClasses();
    }
  };

  const columns = [
    { key: "id", title: "No." },
    { key: "name", title: "Nama Kelas" },
    { key: "type", title: "Tipe" },
    { key: "student_count", title: "Jumlah Mahasiswa" },
    { key: "semester_year", title: "Tahun Semester" },
    { key: "study_program_name", title: "Program Studi" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 gap-4">
        <h1 className="text-2xl font-semibold">Daftar Kelas</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* 🔍 Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Cari kelas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* 🔽 Filter Program Studi */}
          <select
            className="border px-3 py-2 rounded-md text-sm"
            value={selectedProgram}
            onChange={handleFilterChange}
          >
            <option value="all">Semua Program Studi</option>
            {studyPrograms.map((prog) => (
              <option key={prog.id} value={prog.name}>
                {prog.name}
              </option>
            ))}
          </select>

          {/* ➕ Tombol Tambah */}
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kelas
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-4 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <DataTable
        title=""
        columns={columns}
        data={classes}
        isLoading={loading}
        onEdit={(item) => {
          setSelected(item);
          setShowEdit(true);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <ClassCreate
            onSuccess={() => {
              setShowCreate(false);
              fetchClasses();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          {selected && (
            <ClassEdit
              data={selected}
              onSuccess={() => {
                setShowEdit(false);
                fetchClasses();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
