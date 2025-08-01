"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function WaktuCreate({ onSuccess }: { onSuccess: () => void }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/waktu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_time: start, end_time: end }),
    });

    if (res.ok) {
      setStart("");
      setEnd("");
      onSuccess();
    } else {
      alert("Gagal menambahkan data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Jam Mulai</Label>
      <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />

      <Label>Jam Selesai</Label>
      <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />

      <Button type="submit" className="bg-green-600 text-white">Tambah</Button>
    </form>
  );
}
