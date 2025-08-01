"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import PlpCreate from "./plps-create";
import PlpEdit from "./plps-edit";

interface Plp {
  id: number;
  name: string;
  nip: string;
  no?: number;
}

export default function PlpsPage() {
  const [plps, setPlps] = useState<Plp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editPlpId, setEditPlpId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPlps();
  }, []);

  const loadPlps = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/plps");
      const data = await res.json();
      const numbered = data.map((item: Plp, index: number) => ({
        ...item,
        no: index + 1,
      }));
      setPlps(numbered);
    } catch (err) {
      console.error("Gagal memuat PLP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (plp: Plp) => {
    const confirmDelete = confirm(`Yakin ingin menghapus "${plp.name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/plps/${plp.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      alert("PLP berhasil dihapus.");
      loadPlps();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  };

  const filteredPlps = plps.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "no", title: "No", render: (_: any, item: Plp) => item.no },
    {
      key: "name",
      title: "Nama Laboran",
      render: (_: any, item: Plp) => item.name,
    },
    {
      key: "nip",
      title: "NIP",
      render: (_: any, item: Plp) => item.nip || "–",
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: Plp) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setEditPlpId(item.id)}>
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
      <div className="flex justify-between items-center px-6 pt-6">
        <h1 className="text-2xl font-semibold">Daftar PLP</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari laboran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border pl-8 pr-3 py-2 rounded-md text-sm"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      <DataTable title="" data={filteredPlps} columns={columns} isLoading={isLoading} />

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <PlpCreate onSuccess={() => {
            setIsCreating(false);
            loadPlps();
          }} />
        </DialogContent>
      </Dialog>

      <Dialog open={editPlpId !== null} onOpenChange={() => setEditPlpId(null)}>
        <DialogContent>
          {editPlpId && (
            <PlpEdit plpId={editPlpId} onSuccess={() => {
              setEditPlpId(null);
              loadPlps();
            }} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
