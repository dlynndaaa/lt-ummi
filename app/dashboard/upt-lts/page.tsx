"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UPTLTSCreate from "./upt-lts-create";
import UPTLTSEdit from "./upt-lts-edit";

interface UPT {
  id: number;
  name: string;
  department: string;
  jabatan: string;
  no?: number;
}

export default function UPTLTSPage() {
  const [data, setData] = useState<UPT[]>([]);
  const [allData, setAllData] = useState<UPT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    const res = await fetch("/api/upt-lts");
    const json = await res.json();
    const numbered = json.map((item: UPT, index: number) => ({
      ...item,
      no: index + 1,
    }));
    setData(numbered);
    setAllData(numbered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = allData.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  }, [searchTerm]);

  const handleDelete = async (item: UPT) => {
    if (!confirm(`Hapus ${item.name}?`)) return;
    await fetch(`/api/upt-lts/${item.id}`, { method: "DELETE" });
    loadData();
  };

  const columns = [
    { key: "no", title: "No", render: (_: any, item: UPT) => item.no },
    {
      key: "name",
      title: "Nama UPT-LT",
      render: (_: any, item: UPT) => <div className="font-medium">{item.name}</div>,
    },
    {
      key: "department",
      title: "Departemen",
      render: (_: any, item: UPT) => item.department,
    },
    {
      key: "jabatan",
      title: "Jabatan",
      render: (_: any, item: UPT) => item.jabatan,
    },
    {
      key: "aksi",
      title: "Aksi",
      render: (_: any, item: UPT) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditId(item.id)}>
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
      <div className="px-6 pt-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Daftar UPT-LTS</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2 py-1 border rounded-md text-sm"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      <DataTable title="" data={data} columns={columns} isLoading={false} />

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <UPTLTSCreate
            onSuccess={() => {
              setIsCreating(false);
              loadData();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editId !== null} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          {editId && (
            <UPTLTSEdit
              uptId={editId}
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
