"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Semester {
  id: number;
  year: string;
  type: string; 
  semester_no: number;
  is_active: boolean;
}

interface LabOption {
  id: number;
  name?: string;
  nama?: string;
}

interface GenerateProps {
  labs: LabOption[];
  selectedSemester: string;
  setSelectedSemester: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  selectedLab: string;
  setSelectedLab: (val: string) => void;
  onGenerate: () => void;
}

export default function GenerateSection({
  labs,
  selectedSemester,
  setSelectedSemester,
  selectedYear,
  setSelectedYear,
  selectedLab,
  setSelectedLab,
  onGenerate,
}: GenerateProps) {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [semesterType, setSemesterType] = useState<string>("");

  useEffect(() => {
    fetch("/api/semesters")
      .then((res) => res.json())
      .then((data: Semester[]) => {
        setSemesters(data);

        const uniqueYears = Array.from(new Set(data.map((s) => s.year)));
        setAcademicYears(uniqueYears);
      });
  }, []);

  useEffect(() => {
    if (selectedYear && semesterType) {
      const matched = semesters.find(
        (s) => s.year === selectedYear && s.type === semesterType
      );
      if (matched) {
        setSelectedSemester(matched.id.toString());
      } else {
        setSelectedSemester(""); 
      }
    }
  }, [selectedYear, semesterType, semesters]);

  const isGenerateDisabled =
    !selectedSemester || !selectedYear || !selectedLab;

  return (
    <>
      <div className="px-6 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Jenis Semester */}
        <Select value={semesterType} onValueChange={setSemesterType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Jenis Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ganjil">Ganjil</SelectItem>
            <SelectItem value="Genap">Genap</SelectItem>
          </SelectContent>
        </Select>

        {/* Tahun Akademik */}
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Tahun Akademik" />
          </SelectTrigger>
          <SelectContent>
            {academicYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Laboratorium */}
        <Select value={selectedLab} onValueChange={setSelectedLab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Laboratorium" />
          </SelectTrigger>
          <SelectContent>
            {labs.map((lab) => (
              <SelectItem key={lab.id} value={lab.id.toString()}>
                {lab.name ?? lab.nama ?? `ID: ${lab.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          className="bg-green-600 text-white px-6 py-2 rounded-md"
          onClick={() => {
            if (!isGenerateDisabled) onGenerate();
          }}
          disabled={isGenerateDisabled}
        >
          Generate Jadwal
        </Button>
      </div>

      <hr className="mt-6 mb-2 border-t border-gray-300 mx-6" />
    </>
  );
}
