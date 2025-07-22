"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PengampuCreate from "./pengampu-create";
import PengampuEdit from "./pengampu-edit";

interface Pengampu {
  id: number;
  lecturer: string;
  subject: string;
  class: string;
  semester: string;
  study_program: string;
  no?: number;
}

export default function PengampuPage() {
  const [data, setData] = useState<Pengampu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/pengampu");
      const fetched = await res.json();

      const numbered = fetched.map((d: Pengampu, idx: number) => ({
        ...d,
        no: idx + 1,
      }));

      setData(numbered);
    } catch (err) {
      console.error("Gagal mengambil data pengampu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`/api/pengampu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      alert("Data berhasil dihapus.");
      loadData();
    } catch (e) {
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const columns = [
    { key: "no", title: "No", render: (_: any, item: Pengampu) => item.no },
    { key: "lecturer", title: "Dosen", render: (_: any, item: Pengampu) => item.lecturer },
    { key: "subject", title: "Mata Kuliah", render: (_: any, item: Pengampu) => item.subject },
    { key: "class", title: "Kelas", render: (_: any, item: Pengampu) => item.class },
    { key: "semester", title: "Semester", render: (_: any, item: Pengampu) => item.semester },
    { key: "study_program", title: "Program Studi", render: (_: any, item: Pengampu) => item.study_program },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: Pengampu) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditId(item.id)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between px-6 pt-6">
        <h1 className="text-2xl font-semibold">Daftar Pengampu</h1>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Tambah Pengampu
        </Button>
      </div>

      <div className="p-6">
        <DataTable title="" data={data} columns={columns} isLoading={isLoading} />
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <PengampuCreate
            onSuccess={() => {
              setIsCreating(false);
              loadData();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editId !== null} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          {editId !== null && (
            <PengampuEdit
              id={editId}
              onSuccess={() => {
                setEditId(null);
                loadData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
