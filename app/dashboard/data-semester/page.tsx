"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import SemesterCreate from "./semester-create";
import SemesterEdit from "./semester-edit";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Tambahan untuk dropdown

interface Semester {
  id: number;
  year: string;
  type: string;
  semester_no: number;
  is_active: boolean;
}

export default function SemesterPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [filteredSemesters, setFilteredSemesters] = useState<Semester[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // Tambahan
  const [isCreating, setIsCreating] = useState(false);
  const [editSemesterId, setEditSemesterId] = useState<number | null>(null);

  const loadSemesters = async () => {
    const res = await fetch("/api/semesters");
    const data = await res.json();
    setSemesters(data);
    setFilteredSemesters(data);
  };

  useEffect(() => {
    loadSemesters();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus semester ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/semesters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus semester");
      alert("Semester berhasil dihapus.");
      const updated = semesters.filter((s) => s.id !== id);
      setSemesters(updated);
      setFilteredSemesters(updated);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus.");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const lowerValue = value.toLowerCase();

    const filtered = semesters.filter(
      (item) =>
        (item.year.toLowerCase().includes(lowerValue) ||
          item.type.toLowerCase().includes(lowerValue)) &&
        (selectedType === "all" || item.type.toLowerCase() === selectedType)
    );

    setFilteredSemesters(filtered);
  };

  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
    const lowerValue = search.toLowerCase();

    const filtered = semesters.filter(
      (item) =>
        (item.year.toLowerCase().includes(lowerValue) ||
          item.type.toLowerCase().includes(lowerValue)) &&
        (value === "all" || item.type.toLowerCase() === value)
    );

    setFilteredSemesters(filtered);
  };

  const columns = [
    { key: "year", title: "Tahun" },
    { key: "type", title: "Tipe" },
    { key: "semester_no", title: "Semester" },
    {
      key: "is_active",
      title: "Aktif",
      render: (value: boolean) => (value ? "Ya" : "Tidak"),
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: any, item: Semester) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditSemesterId(item.id)}
          >
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

  return (
    <DashboardLayout>
      <div className="px-6 pt-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Data Semester</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Tahun / Tipe..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Dropdown Filter Tipe Semester */}
              <Select value={selectedType} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="ganjil">Ganjil</SelectItem>
                  <SelectItem value="genap">Genap</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="bg-blue-600 text-white"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable title="" data={filteredSemesters} columns={columns} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <SemesterCreate
            onSuccess={() => {
              setIsCreating(false);
              loadSemesters();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editSemesterId !== null}
        onOpenChange={() => setEditSemesterId(null)}
      >
        <DialogContent>
          {editSemesterId !== null && (
            <SemesterEdit
              semesterId={editSemesterId}
              onSuccess={() => {
                setEditSemesterId(null);
                loadSemesters();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
