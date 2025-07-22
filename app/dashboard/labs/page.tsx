"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import LabDetail from "./components/lab-detail";
import LabEdit from "./components/lab-edit";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LabCreate from "./components/lab-create";

interface Lab {
  id: number;
  name: string;
  location: string;
  no?: number;
}

export default function LabPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [editLabId, setEditLabId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/labs");
      const data = await res.json();
      const numbered = data.map((lab: Lab, index: number) => ({
        ...lab,
        no: index + 1,
      }));
      setLabs(numbered);
    } catch (err) {
      console.error("Gagal memuat lab:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (lab: Lab) => setSelectedLabId(lab.id);
  const handleEdit = (lab: Lab) => setEditLabId(lab.id);

  const handleDelete = async (lab: Lab) => {
    const confirmDelete = confirm(`Yakin ingin menghapus lab "${lab.name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/labs/${lab.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      alert("Laboratorium berhasil dihapus.");
      loadLabs();
    } catch (err) {
      console.error("Error delete:", err);
      alert("Gagal menghapus laboratorium.");
    }
  };

  const columns = [
    { key: "no", title: "No.", render: (_: any, item: Lab) => item.no },
    {
      key: "name",
      title: "Nama Laboratorium",
      render: (_: any, item: Lab) => (
        <div className="min-w-[300px] font-medium">{item.name}</div>
      ),
    },
    {
      key: "location",
      title: "Lokasi",
      render: (_: any, item: Lab) => item.location || "-",
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: Lab) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
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
        <h1 className="text-2xl font-semibold">Daftar Laboratorium</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Laboratorium
        </Button>
      </div>

      <DataTable title="" data={labs} columns={columns} isLoading={isLoading} hideActions />

      {/* Modal Tambah */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <LabCreate
            onSuccess={() => {
              setIsCreating(false);
              loadLabs();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Detail */}
      <Dialog open={selectedLabId !== null} onOpenChange={() => setSelectedLabId(null)}>
        <DialogContent>
          {typeof selectedLabId === "number" && (
            <LabDetail labId={selectedLabId} />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Edit */}
      <Dialog open={editLabId !== null} onOpenChange={() => setEditLabId(null)}>
        <DialogContent>
          {typeof editLabId === "number" && (
            <LabEdit
              labId={editLabId}
              onSuccess={() => {
                setEditLabId(null);
                loadLabs();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
