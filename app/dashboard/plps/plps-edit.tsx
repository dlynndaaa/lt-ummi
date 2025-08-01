"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Plp {
  id: number;
  name: string;
  nip: string;
}

export default function PlpEdit({ plpId, onSuccess }: { plpId: number; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/plps/${plpId}`)
      .then((res) => res.json())
      .then((data: Plp) => {
        setName(data.name);
        setNip(data.nip);
      });
  }, [plpId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`/api/plps/${plpId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nip }),
      });

      if (!res.ok) throw new Error("Gagal update");

      alert("PLP berhasil diperbarui.");
      onSuccess();
    } catch (err) {
      console.error(err);
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
        <Button type="submit" className="bg-blue-600 text-white" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
