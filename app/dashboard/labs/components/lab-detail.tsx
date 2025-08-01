"use client";

import { useEffect, useState } from "react";

interface LabDetailProps {
  labId: number;
}

interface LabData {
  id: number;
  name: string;
  location: string;
  description: string;
  supervisor: string;
  capacity?: number;
  photos: string[]; // photos sudah full URL path
}

export default function LabDetail({ labId }: LabDetailProps) {
  const [lab, setLab] = useState<LabData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchLabDetail();
  }, [labId]);

  const fetchLabDetail = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const res = await fetch(`/api/labs/${labId}/detail`);
      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err?.error || "Gagal mengambil data lab");
        return;
      }

      const data = await res.json();

      // langsung gunakan photos apa adanya dari API
      setLab({
        ...data,
        photos: data.photos || [],
      });
    } catch (error) {
      console.error("Gagal memuat detail lab:", error);
      setErrorMsg("Gagal memuat detail lab");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (errorMsg) return <div className="p-4 text-red-600">⚠️ {errorMsg}</div>;
  if (!lab) return <div className="p-4 text-red-600">Data tidak ditemukan</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Detail Laboratorium</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Nama Laboratorium</label>
          <div className="mt-1 border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm">
            {lab.name}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Lokasi</label>
          <div className="mt-1 border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm">
            {lab.location}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">PLP Laboratorium</label>
          <div className="mt-1 border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm">
            {lab.supervisor}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Kapasitas</label>
          <div className="mt-1 border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm">
            {lab.capacity ?? "-"}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Deskripsi</label>
          <div className="mt-1 border border-gray-300 bg-gray-50 rounded px-3 py-2 text-sm whitespace-pre-line">
            {lab.description || "-"}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Galeri Foto</h3>
        {lab.photos.length > 0 ? (
          <div className="overflow-x-auto flex space-x-4 pb-2">
            {lab.photos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Foto ${lab.name} #${idx + 1}`}
                className="w-60 h-40 object-cover rounded shadow"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Belum ada foto.</p>
        )}
      </div>
    </div>
  );
}
