"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PLP {
  id: number;
  name: string;
}

export default function LabCreateForm() {
  const [plps, setPlps] = useState<PLP[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    plp_id: "",
    capacity: "",
    description: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPlps = async () => {
      try {
        const res = await fetch("/api/plps");
        const data = await res.json();
        setPlps(data);
      } catch (error) {
        console.error("Gagal memuat data PLP:", error);
      }
    };

    fetchPlps();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Menyimpan...");

    const payload = {
      ...formData,
      plp_id: parseInt(formData.plp_id),
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    };

    try {
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
        const formDataUpload = new FormData();
        photos.forEach((file) => formDataUpload.append("photos", file));

        await fetch(`/api/labs/${newLabId}/upload`, {
          method: "POST",
          body: formDataUpload,
        });
      }

      setMessage("Berhasil ditambahkan!");
      router.refresh();
      router.push("/dashboard/labs");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setMessage("Terjadi kesalahan saat menyimpan.");
    }
  };

  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">Tambah Laboratorium</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nama</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Lokasi</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">PLP Laboratorium</label>
          <select
            name="plp_id"
            value={formData.plp_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Pilih PLP</option>
            {plps.map((plp) => (
              <option key={plp.id} value={plp.id}>
                {plp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Kapasitas</label>
          <input
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
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
