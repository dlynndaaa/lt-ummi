"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PlpCreate({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Nama wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nip }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan");

      alert("PLP berhasil ditambahkan.");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama Laboran</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>NIP</Label>
        <Input value={nip} onChange={(e) => setNip(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-blue-600 text-white">
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
