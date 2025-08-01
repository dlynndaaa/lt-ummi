"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  id: number;
  onClose: () => void;
  onRefresh: () => void;
}

export default function JadwalPraktikumEdit({ id, onClose, onRefresh }: Props) {
  const [formData, setFormData] = useState({
    subject: "",
    instructor: "",
    day: "",
    time: "",
    lab: "",
    study_program: "",
    class: "",
    semester: "",
  });

  useEffect(() => {
    fetch(`/api/jadwal-praktikum/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/jadwal-praktikum/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    onRefresh();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>Edit Jadwal Praktikum</DialogHeader>
      <div className="grid gap-4 py-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={key} className="capitalize">
              {key.replace("_", " ")}
            </Label>
            <Input
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </DialogFooter>
    </form>
  );
}
