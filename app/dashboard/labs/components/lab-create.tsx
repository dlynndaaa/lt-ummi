"use client";

import { useEffect, useState } from "react";

interface Lecturer {
  id: number;
  name: string;
}

interface Props {
  onSuccess: () => void;
}

export default function LabCreate({ onSuccess }: Props) {
  const [lab, setLab] = useState({
    name: "",
    location: "",
    supervisor: "", // ← masih string karena dari <select>
    capacity: "",
    description: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  useEffect(() => {
    const loadLecturers = async () => {
      const res = await fetch("/api/lecturers");
      const data = await res.json();
      setLecturers(data.lecturers);
    };
    loadLecturers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setLab({ ...lab, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Menyimpan...");

    // Convert supervisor ID to integer
    const payload = {
      ...lab,
      supervisor: parseInt(lab.supervisor), // convert string ke integer
    };

    const res = await fetch("/api/labs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage("Gagal menyimpan data.");
      return;
    }

    const { id: newLabId } = await res.json();

    if (photos.length > 0) {
      const formData = new FormData();
      photos.forEach((file) => formData.append("photos", file));

      await fetch(`/api/labs/${newLabId}/upload`, {
        method: "POST",
        body: formData,
      });
    }

    setMessage("Berhasil ditambahkan!");
    onSuccess();
  };

  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Tambah Laboratorium</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nama</label>
          <input
            name="name"
            value={lab.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Lokasi</label>
          <input
            name="location"
            value={lab.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Koordinator Laboratorium</label>
          <select
            name="supervisor"
            value={lab.supervisor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Pilih Koordinator</option>
            {lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Kapasitas</label>
          <input
            name="capacity"
            type="number"
            value={lab.capacity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Deskripsi</label>
          <textarea
            name="description"
            value={lab.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Upload Foto</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}
