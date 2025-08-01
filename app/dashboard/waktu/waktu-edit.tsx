"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function WaktuEdit({ id, onSuccess }: { id: number, onSuccess: () => void }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/waktu/${id}`);
      const data = await res.json();
      setStart(data.start_time);
      setEnd(data.end_time);
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/waktu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_time: start, end_time: end }),
    });

    if (res.ok) {
      onSuccess();
    } else {
      alert("Gagal memperbarui data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Jam Mulai</Label>
      <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />

      <Label>Jam Selesai</Label>
      <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />

      <Button type="submit" className="bg-blue-600 text-white">Update</Button>
    </form>
  );
}
