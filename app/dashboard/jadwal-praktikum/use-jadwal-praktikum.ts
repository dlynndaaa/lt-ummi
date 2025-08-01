import { useEffect, useState } from "react";

interface RawSchedule {
  id: number;
  subject: string;
  instructor: string;
  credit: number; // ✅ Tambahkan credit
  day: string;
  time: string;
  lab: string;
  study_program: string;
  class: string;
  semester: string;
  semester_type: string;
  academic_year: string;
}

interface Schedule {
  id: number;
  subject: string;
  instructor: string;
  credit: number; // ✅ Tambahkan credit
  day: string;
  time: string;
  lab: string;
  study_program: string;
  class: string;
  semester_no: string;
  semester_type: string;
  academic_year: string;
  no?: number;
}

interface Option {
  id: number;
  name?: string;
  nama?: string;
  year?: string;
}

export default function useJadwalPraktikum() {
  const [data, setData] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [labs, setLabs] = useState<Option[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
    loadDropdownOptions();
  }, []);

  async function loadDropdownOptions() {
    try {
      const resLabs = await fetch("/api/labs");
      setLabs(await resLabs.json());
    } catch (error) {
      console.error("Gagal memuat opsi dropdown:", error);
    }
  }

  async function loadData() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/jadwal-praktikum");
      const result: RawSchedule[] = await res.json();

      const transformed: Schedule[] = result.map((item, index) => ({
        id: item.id,
        subject: item.subject,
        instructor: item.instructor,
        credit: Number(item.credit) || 0, // ✅ Tambahkan mapping credit
        day: item.day,
        time: item.time,
        lab: item.lab,
        study_program: item.study_program,
        class: item.class,
        semester_no: item.semester,
        semester_type: item.semester_type,
        academic_year: item.academic_year,
        no: index + 1,
      }));

      setData(transformed);
    } catch (err) {
      console.error("Gagal memuat jadwal:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      await fetch(`/api/jadwal-praktikum/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  }

  async function handleGenerate() {
    if (!selectedSemester || !selectedLab || !selectedYear) {
      alert("Silakan pilih semester, tahun akademik, dan laboratorium.");
      return;
    }

    try {
      setIsGenerating(true);

      const res = await fetch("/api/jadwal-praktikum/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester_id: parseInt(selectedSemester),
          lab_id: parseInt(selectedLab),
          academic_year: selectedYear,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result?.error || "Gagal generate jadwal (server tidak memberikan pesan).";
        console.error("Error generate:", errorMessage);
        alert("Gagal generate jadwal: " + errorMessage);
        return;
      }

      if (Array.isArray(result) && result.length === 0) {
        alert("Generate berhasil, tetapi tidak ada jadwal yang dibuat.");
        return;
      }

      alert("Jadwal berhasil digenerate!");
      loadData();
    } catch (err: any) {
      console.error("Gagal generate:", err);
      alert("Terjadi kesalahan saat generate: " + (err?.message || "Tidak diketahui."));
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    data,
    isLoading,
    isCreating,
    setIsCreating,
    editId,
    setEditId,
    searchTerm,
    setSearchTerm,
    labs,
    selectedSemester,
    setSelectedSemester,
    selectedYear,
    setSelectedYear,
    selectedLab,
    setSelectedLab,
    isGenerating,
    handleDelete,
    handleGenerate,
    loadData,
  };
}
