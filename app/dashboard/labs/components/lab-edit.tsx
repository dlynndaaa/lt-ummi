"use client";

import { useEffect, useState } from "react";

interface PLP {
  id: number;
  name: string;
}

interface LabData {
  name: string;
  location: string;
  plp_id: number | string;
  capacity: string;
  description: string;
  photos: string[];
}

interface LabEditProps {
  labId: number;
  onSuccess: () => void;
}

export default function LabEdit({ labId, onSuccess }: LabEditProps) {
  const [lab, setLab] = useState<LabData>({
    name: "",
    location: "",
    plp_id: "",
    capacity: "",
    description: "",
    photos: [],
  });

  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [plps, setPlps] = useState<PLP[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labRes, plpRes] = await Promise.all([
          fetch(`/api/labs/${labId}/detail`),
          fetch("/api/plps"),
        ]);
        const labData = await labRes.json();
        const plpData = await plpRes.json();

        setLab({
          name: labData.name,
          location: labData.location,
          plp_id: labData.plp_id ?? "",
          capacity: labData.capacity?.toString() || "",
          description: labData.description || "",
          photos: labData.photos || [],
        });

        setPlps(plpData);
        setLoading(false);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };

    fetchData();
  }, [labId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLab((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPhotos(Array.from(e.target.files));
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;

    const res = await fetch(`/api/labs/${labId}/upload`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl }),
    });

    if (res.ok) {
      setLab((prev) => ({
        ...prev,
        photos: prev.photos.filter((url) => url !== photoUrl),
      }));
    } else {
      alert("Gagal menghapus foto.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Menyimpan...");

    try {
      const res = await fetch(`/api/labs/${labId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lab.name,
          location: lab.location,
          plp_id: parseInt(lab.plp_id.toString()),
          capacity: parseInt(lab.capacity),
          description: lab.description,
        }),
      });

      if (!res.ok) {
        setMessage("Gagal menyimpan data.");
        return;
      }

      if (newPhotos.length > 0) {
        const formData = new FormData();
        newPhotos.forEach((file) => formData.append("photos", file));

        const uploadRes = await fetch(`/api/labs/${labId}/upload`, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploaded = await uploadRes.json();
          setLab((prev) => ({
            ...prev,
            photos: [...prev.photos, ...uploaded.uploadedPaths],
          }));
          setNewPhotos([]);
        } else {
          setMessage("Gagal mengunggah foto.");
          return;
        }
      }

      setMessage("Berhasil disimpan!");
      onSuccess();
    } catch (err) {
      console.error("Error:", err);
      setMessage("Terjadi kesalahan.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Laboratorium</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nama</label>
          <input
            name="name"
            value={lab.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Lokasi</label>
          <input
            name="location"
            value={lab.location}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">PLP Laboratorium</label>
          <select
            name="plp_id"
            value={lab.plp_id}
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
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Unggah Foto Baru</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block"
          />
        </div>

        {lab.photos.length > 0 && (
          <div>
            <label className="block text-sm mb-1">Foto Saat Ini</label>
            <div className="flex flex-wrap gap-3">
              {lab.photos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-32 h-24 border rounded overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`foto-${idx}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-1"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
