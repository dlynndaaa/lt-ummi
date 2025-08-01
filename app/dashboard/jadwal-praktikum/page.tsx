"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import JadwalPraktikumCreate from "./jadwal-praktikum-create";
import JadwalPraktikumEdit from "./jadwal-praktikum-edit";
import GenerateSection from "./generate";
import ScheduleTable from "./table";
import useJadwalPraktikum from "./use-jadwal-praktikum";

interface Schedule {
  id: number;
  subject: string;
  instructor: string;
  credit: number; // ✅ Diganti dari sks ke credit
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

export default function JadwalPraktikumPage() {
  const {
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
  } = useJadwalPraktikum();

  console.log("Data raw dari API:", data); // Debug data dari API

  const mappedData: Schedule[] = data.map((item: any, index: number) => {
    const creditNum = Number(item.credit) || 0;

    return {
      id: item.id,
      subject: item.subject,
      instructor: item.instructor,
      credit: creditNum, // ✅ Diganti dari sks: sksNum
      day: item.day,
      time: item.time,
      lab: item.lab,
      study_program: item.study_program,
      class: item.class,
      semester_no: item.semester_no,
      semester_type: item.semester_type,
      academic_year: item.academic_year,
      no: index + 1,
    };
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 gap-4">
        <h1 className="text-2xl font-semibold">Jadwal Praktikum</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari..."
              className="border pl-8 pr-3 py-2 rounded-md text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>
      </div>

      <GenerateSection
        labs={labs}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedLab={selectedLab}
        setSelectedLab={setSelectedLab}
        onGenerate={handleGenerate}
      />

      <ScheduleTable
        data={mappedData}
        searchTerm={searchTerm}
        isLoading={isLoading || isGenerating}
        setEditId={setEditId}
        handleDelete={handleDelete}
      />

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <JadwalPraktikumCreate
            onSuccess={() => {
              setIsCreating(false);
              loadData();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editId !== null} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          {editId !== null && (
            <JadwalPraktikumEdit
              id={editId}
              onClose={() => setEditId(null)}
              onRefresh={loadData}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
