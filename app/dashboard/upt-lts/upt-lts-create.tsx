"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UPTLTSCreate({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/upt-lts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, department, jabatan }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Berhasil menambahkan data.");
      onSuccess();
    } else {
      alert("Gagal menambahkan data.");
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
        {loading ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
