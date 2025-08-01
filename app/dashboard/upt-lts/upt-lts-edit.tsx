"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UPTLTSEdit({ uptId, onSuccess }: { uptId: number; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/upt-lts/${uptId}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDepartment(data.department);
        setJabatan(data.jabatan);
      });
  }, [uptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/upt-lts/${uptId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, department, jabatan }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Data berhasil diperbarui.");
      onSuccess();
    } else {
      alert("Gagal memperbarui data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Departemen</Label>
        <Input value={department} onChange={(e) => setDepartment(e.target.value)} required />
      </div>
      <div>
        <Label>Jabatan</Label>
        <Input value={jabatan} onChange={(e) => setJabatan(e.target.value)} required />
      </div>
      <Button type="submit" className="bg-blue-600 text-white" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
