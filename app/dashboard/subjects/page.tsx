"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Search } from "lucide-react"; // tambahkan Search icon
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SubjectCreate from "./subject-create";
import SubjectEdit from "./subject-edit";

interface Subject {
  id: number;
  code: string;
  name: string;
  credit: number;
  study_program: string;
  no?: number;
}

interface StudyProgram {
  id: number;
  name: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editSubjectId, setEditSubjectId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadSubjects();
    loadStudyPrograms();
  }, []);

  useEffect(() => {
    filterSubjects();
  }, [selectedProgram, searchTerm, allSubjects]);

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/subjects");
      const data = await res.json();
      const numbered = data.map((subject: Subject, index: number) => ({
        ...subject,
        no: index + 1,
      }));
      setAllSubjects(numbered);
      setSubjects(numbered);
    } catch (err) {
      console.error("Gagal memuat mata kuliah:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudyPrograms = async () => {
    try {
      const res = await fetch("/api/study-programs");
      const data = await res.json();
      setStudyPrograms(data);
    } catch (err) {
      console.error("Gagal memuat program studi:", err);
    }
  };

  const handleDelete = async (subject: Subject) => {
    const confirmDelete = confirm(`Yakin ingin menghapus "${subject.name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/subjects/${subject.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus mata kuliah");

      alert("Mata kuliah berhasil dihapus.");
      loadSubjects();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const filterSubjects = () => {
    let filtered = [...allSubjects];

    if (selectedProgram !== "all") {
      filtered = filtered.filter(
        (s) =>
          s.study_program.toLowerCase() === selectedProgram.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSubjects(filtered);
  };

  const columns = [
    { key: "no", title: "No.", render: (_: any, item: Subject) => item.no },
    {
      key: "code",
      title: "Kode",
      render: (_: any, item: Subject) => item.code,
    },
    {
      key: "name",
      title: "Nama Mata Kuliah",
      render: (_: any, item: Subject) => (
        <div className="min-w-[250px] font-medium">{item.name}</div>
      ),
    },
    {
      key: "credit",
      title: "SKS",
      render: (_: any, item: Subject) => item.credit,
    },
    {
      key: "study_program",
      title: "Program Studi",
      render: (_: any, item: Subject) => item.study_program,
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: Subject) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditSubjectId(item.id)}>
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
        <h1 className="text-2xl font-semibold">Daftar Mata Kuliah</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search with Icon */}
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari mata kuliah..."
              className="border pl-8 pr-3 py-2 rounded-md text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border px-3 py-2 rounded-md text-sm w-full sm:w-[200px]"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            <option value="all">Semua Program Studi</option>
            {studyPrograms.map((prog) => (
              <option key={prog.id} value={prog.name}>
                {prog.name}
              </option>
            ))}
          </select>

          <Button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Mata Kuliah
          </Button>
        </div>
      </div>

      <DataTable
        title=""
        data={subjects}
        columns={columns}
        isLoading={isLoading}
      />

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <SubjectCreate
            onSuccess={() => {
              setIsCreating(false);
              loadSubjects();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editSubjectId !== null} onOpenChange={() => setEditSubjectId(null)}>
        <DialogContent>
          {typeof editSubjectId === "number" && (
            <SubjectEdit
              subjectId={editSubjectId}
              onSuccess={() => {
                setEditSubjectId(null);
                loadSubjects();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
