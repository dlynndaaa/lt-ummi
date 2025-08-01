"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Edit, Trash2, Plus } from "lucide-react";
import WaktuCreate from "./waktu-create";
import WaktuEdit from "./waktu-edit";

interface Waktu {
  id: number;
  start_time: string;
  end_time: string;
  no?: number;
}

export default function WaktuPage() {
  const [data, setData] = useState<Waktu[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadData = async () => {
    const res = await fetch("/api/waktu");
    const raw = await res.json();
    const formatted = raw.map((r: Waktu, i: number) => ({
      ...r,
      no: i + 1,
    }));
    setData(formatted);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus waktu ini?")) return;
    const res = await fetch(`/api/waktu/${id}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

  const columns = [
    { key: "no", title: "No", render: (_: any, d: Waktu) => d.no },
    {
      key: "jam",
      title: "Jam",
      render: (_: any, d: Waktu) => `${d.start_time} - ${d.end_time}`,
    },
    {
      key: "aksi",
      title: "Aksi",
      render: (_: any, d: Waktu) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditId(d.id)}
            className="text-blue-600 hover:bg-blue-100"
          >
            <Edit />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(d.id)}
            className="text-red-600 hover:bg-red-100"
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between px-6 pt-6">
        <h1 className="text-2xl font-semibold">Daftar Waktu</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white"
        >
          <Plus className="mr-2 w-4 h-4" /> Tambah Waktu
        </Button>
      </div>

      <div className="p-6">
        <DataTable title="" data={data} columns={columns} />
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <WaktuCreate
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
            <WaktuEdit
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
