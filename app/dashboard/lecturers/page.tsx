"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/crop-image";

interface Lecturer {
  id: string;
  name: string;
  nidn: string;
  email: string;
  phone?: string;
  department: string;
  photo?: string;
  no?: number;
}

export default function LecturerPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [dialogViewOpen, setDialogViewOpen] = useState(false);
  const [dialogAddOpen, setDialogAddOpen] = useState(false);
  const [dialogCropOpen, setDialogCropOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [nidn, setNidn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLecturers();
  }, []);

  const loadLecturers = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.getLecturers();
      const numberedLecturers = res.lecturers.map((lec: Lecturer, index: number) => ({
        ...lec,
        no: index + 1,
      }));
      setLecturers(numberedLecturers);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setDialogCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const saveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    setPhoto(file);
    setDialogCropOpen(false);
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setSelectedLecturer(null);
    setName("");
    setNidn("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setPhoto(null);
    setDialogAddOpen(true);
  };

  const handleView = (lec: Lecturer) => {
    setSelectedLecturer(lec);
    setDialogViewOpen(true);
  };

  const handleEdit = (lec: Lecturer) => {
    setSelectedLecturer(lec);
    setName(lec.name);
    setNidn(lec.nidn);
    setEmail(lec.email);
    setPhone(lec.phone || "");
    setDepartment(lec.department);
    setPhoto(null);
    setIsEditing(true);
    setDialogAddOpen(true);
  };

  const handleDelete = async (lec: Lecturer) => {
    if (confirm(`Hapus ${lec.name}?`)) {
      try {
        await apiClient.deleteLecturer(lec.id);
        await loadLecturers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("nidn", nidn);
      form.append("email", email);
      form.append("phone", phone);
      form.append("department", department);
      if (photo) form.append("photo", photo);

      if (isEditing && selectedLecturer) {
        form.append("id", selectedLecturer.id);
        await apiClient.updateLecturer(form);
      } else {
        await apiClient.createLecturer(form);
      }

      setDialogAddOpen(false);
      await loadLecturers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLecturers = lecturers.filter((lec) =>
    lec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "no",
      title: "No.",
      render: (_: any, item: Lecturer) => item.no,
    },
    {
      key: "name",
      title: "Nama Dosen",
      render: (_: any, item: Lecturer) => (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            {item.photo ? (
              <img
                src={item.photo}
                alt={item.name}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <AvatarFallback className="bg-green-600 text-white text-sm">
                {item.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <span>{item.name}</span>
        </div>
      ),
    },
    { key: "nidn", title: "NIDN" },
    { key: "department", title: "Program Studi" },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, item: Lecturer) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 gap-4">
        <h1 className="text-2xl font-semibold">Daftar Dosen</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </span>
            <Input
              className="pl-9 pr-4 py-2 border rounded-md w-full"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={openAddDialog} className="bg-blue-600 text-white whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Dosen
          </Button>
        </div>
      </div>

      <DataTable
        title=""
        data={filteredLecturers}
        columns={columns}
        isLoading={isLoading}
        hideActions
      />

      {/* Dialog Crop Foto */}
      <Dialog open={dialogCropOpen} onOpenChange={setDialogCropOpen}>
        <DialogContent className="max-w-2xl h-[500px]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Sesuaikan Foto</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px] bg-gray-200">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, cropped) => setCroppedAreaPixels(cropped)}
              />
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <Button onClick={saveCroppedImage}>Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah/Edit */}
      <Dialog open={dialogAddOpen} onOpenChange={setDialogAddOpen}>
        <DialogContent className="max-w-xl" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Dosen" : "Tambah Dosen"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                {photo ? (
                  <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover" />
                ) : selectedLecturer?.photo ? (
                  <img src={selectedLecturer.photo} alt={selectedLecturer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                    <span className="text-gray-600 text-xl">{name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full border cursor-pointer z-20 shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l3-3h4l3 3h4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <Label>Nama</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>NIDN</Label>
                <Input value={nidn} onChange={(e) => setNidn(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>No. Telepon</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Program Studi</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : isEditing ? "Update" : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Detail */}
      <Dialog open={dialogViewOpen} onOpenChange={setDialogViewOpen}>
        <DialogContent className="max-w-xl select-none" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Detail Dosen</DialogTitle>
          </DialogHeader>
          {selectedLecturer && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                {selectedLecturer.photo ? (
                  <img src={selectedLecturer.photo} alt={selectedLecturer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex justify-center items-center">
                    <span className="text-gray-600 text-xl">
                      {selectedLecturer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div>
                  <Label>Nama</Label>
                  <Input value={selectedLecturer.name} readOnly />
                </div>
                <div>
                  <Label>NIDN</Label>
                  <Input value={selectedLecturer.nidn} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input value={selectedLecturer.email} readOnly />
                </div>
                <div>
                  <Label>No. Telepon</Label>
                  <Input value={selectedLecturer.phone || "-"} readOnly />
                </div>
                <div>
                  <Label>Program Studi</Label>
                  <Input value={selectedLecturer.department} readOnly />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
