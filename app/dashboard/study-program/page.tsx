"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProgramCreate from "./program-create";
import ProgramEdit from "./program-edit";

interface StudyProgram {
  id: number;
  code_prodi: string;
  name: string;
  faculty: string;
  no?: number;
}

interface Faculty {
  id: number;
  name: string;
}

export default function StudyProgramPage() {
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [allPrograms, setAllPrograms] = useState<StudyProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editProgramId, setEditProgramId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadPrograms();
    loadFaculties();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [selectedFaculty, searchTerm, allPrograms]);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/study-programs");
      const data = await res.json();
      const numbered = data.map((program: StudyProgram, index: number) => ({
        ...program,
        no: index + 1,
      }));
      setAllPrograms(numbered);
      setPrograms(numbered);
    } catch (err) {
      console.error("Gagal memuat program studi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFaculties = async () => {
    try {
      const res = await fetch("/api/faculties");
      const data = await res.json();
      setFaculties(data);
    } catch (err) {
      console.error("Gagal memuat fakultas:", err);
    }
  };

  const handleDelete = async (program: StudyProgram) => {
    const confirmDelete = confirm(`Yakin ingin menghapus "${program.name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/study-programs/${program.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus program studi");

      alert("Program studi berhasil dihapus.");
      loadPrograms();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const filterPrograms = () => {
    let filtered = [...allPrograms];

    if (selectedFaculty !== "all") {
      filtered = filtered.filter(
        (p) => p.faculty.toLowerCase() === selectedFaculty.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setPrograms(filtered);
  };

  const columns = [
    { key: "no", title: "No.", render: (_: any, item: StudyProgram) => item.no },
    {
      key: "code_prodi",
      title: "Kode Prodi",
      render: (_: any, item: StudyProgram) => item.code_prodi,
    },
    {
      key: "name",
      title: "Nama Program Studi",
      render: (_: any, item: StudyProgram) => (
        <div className="min-w-[250px] font-medium">{item.name}</div>
      ),
    },
    {
      key: "faculty",
      title: "Fakultas",
      render: (_: any, item: StudyProgram) => item.faculty,
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: StudyProgram) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditProgramId(item.id)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 gap-4">
        <h1 className="text-2xl font-semibold">Daftar Program Studi</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              className="border pl-8 pr-3 py-2 rounded-md text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dropdown Fakultas */}
          <select
            className="border px-3 py-2 rounded-md text-sm w-full sm:w-[200px]"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="all">Semua Fakultas</option>
            {faculties.map((fak) => (
              <option key={fak.id} value={fak.name}>
                {fak.name}
              </option>
            ))}
          </select>

          {/* Tombol Tambah */}
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Program Studi
          </Button>
        </div>
      </div>

      <DataTable
        title=""
        data={programs}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Modal Tambah */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <ProgramCreate
            onSuccess={() => {
              setIsCreating(false);
              loadPrograms();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Edit */}
      <Dialog open={editProgramId !== null} onOpenChange={() => setEditProgramId(null)}>
        <DialogContent>
          {typeof editProgramId === "number" && (
            <ProgramEdit
              programId={editProgramId}
              onSuccess={() => {
                setEditProgramId(null);
                loadPrograms();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
