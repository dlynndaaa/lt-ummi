"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUploadService } from "@/lib/utils/file-upload";

interface AdminProfileData {
  name: string;
  email: string;
  employeeId: string;
  role: string;
  workUnit: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}

interface UserProfileData {
  name: string;
  email: string;
  studentId: string;
  studyProgram: string;
  faculty: string;
  whatsapp: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}

type ProfileData = AdminProfileData | UserProfileData;

interface ProfileFormProps {
  userType: "admin" | "user";
  initialData: ProfileData;
  onSubmit?: (data: ProfileData) => void;
  className?: string;
}

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "staff", label: "Staff" },
];

const workUnitOptions = [
  { value: "teknik-informatika", label: "Teknik Informatika" },
  { value: "sistem-informasi", label: "Sistem Informasi" },
  { value: "teknik-komputer", label: "Teknik Komputer" },
];

export function ProfileForm({
  userType,
  initialData,
  onSubmit,
  className,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(initialData);

    if (initialData.avatar) {
      loadAvatarPreview(initialData.avatar);
    }
  }, [initialData]);

  const loadAvatarPreview = async (fileId: string) => {
    try {
      const fileData = await FileUploadService.getFile(fileId);
      if (fileData) {
        const previewUrl = FileUploadService.getPreviewUrl(fileId);
        setAvatarPreview(previewUrl);
      }
    } catch (error) {
      console.error("Failed to load avatar:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nama lengkap harus diisi";
    if (!formData.email.trim()) newErrors.email = "Email harus diisi";

    if (userType === "admin") {
      const adminData = formData as AdminProfileData;
      if (!adminData.employeeId.trim())
        newErrors.employeeId = "ID Pegawai harus diisi";
      if (!adminData.role) newErrors.role = "Role harus dipilih";
      if (!adminData.workUnit) newErrors.workUnit = "Unit kerja harus dipilih";
      if (!adminData.phone.trim())
        newErrors.phone = "Nomor telepon harus diisi";
    } else {
      const userData = formData as UserProfileData;
      if (!userData.studentId.trim())
        newErrors.studentId = "Nomor Induk Mahasiswa harus diisi";
      if (!userData.studyProgram)
        newErrors.studyProgram = "Program studi harus diisi";
      if (!userData.faculty) newErrors.faculty = "Fakultas harus diisi";
      if (!userData.whatsapp.trim())
        newErrors.whatsapp = "Nomor WhatsApp harus diisi";
    }

    if (showPasswordFields) {
      if (!formData.currentPassword?.trim())
        newErrors.currentPassword = "Password saat ini harus diisi";
      if (!formData.newPassword?.trim())
        newErrors.newPassword = "Password baru harus diisi";
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password tidak cocok";
      }
      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = "Password minimal 8 karakter";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    try {
      let avatarFileId = formData.avatar;

      if (avatarFile) {
        const uploadResult = await FileUploadService.uploadFile(
          avatarFile,
          "avatars",
          "users"
        );
        if (uploadResult.success && uploadResult.file) {
          avatarFileId = uploadResult.file.id;
        } else {
          throw new Error("Failed to upload avatar");
        }
      }

      const updatedData = { ...formData, avatar: avatarFileId };
      onSubmit?.(updatedData);
      setShowConfirmation(false);
      setShowPasswordFields(false);
      setAvatarFile(null);

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        avatar: avatarFileId,
      }));

      toast({
        title: "Profil berhasil diperbarui",
        description: "Perubahan profil Anda telah disimpan.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Gagal memperbarui profil",
        description: "Terjadi kesalahan saat menyimpan profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  type AllProfileFields = keyof AdminProfileData | keyof UserProfileData;

  const handleInputChange = (field: AllProfileFields, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isAdmin = userType === "admin";
  const adminData = formData as AdminProfileData;
  const userData = formData as UserProfileData;

  return (
    <>
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={avatarPreview || "/placeholder.svg"}
                alt="Profile"
              />
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {formData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdmin ? "Administrator" : "User"}
            </h2>
            <p className="text-gray-600">{formData.email}</p>
            <button
              onClick={handleAvatarClick}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1"
            >
              Ubah Foto
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Nama Lengkap"
              placeholder="Masukkan Nama Lengkap Anda"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
            />

            {isAdmin ? (
              <FormField
                label="ID Pegawai"
                placeholder="Masukkan ID Pegawai Anda"
                value={adminData.employeeId}
                onChange={(e) =>
                  handleInputChange("employeeId", e.target.value)
                }
                error={errors.employeeId}
                required
              />
            ) : (
              <FormField
                label="Nomor Induk Mahasiswa"
                placeholder="Masukkan NIM Anda"
                value={userData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                error={errors.studentId}
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isAdmin ? (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={adminData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Peran" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Kerja <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={adminData.workUnit}
                    onValueChange={(value) =>
                      handleInputChange("workUnit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Masukkan Unit Kerja Anda" />
                    </SelectTrigger>
                    <SelectContent>
                      {workUnitOptions.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <FormField
                  label="Program Studi"
                  value={userData.studyProgram}
                  onChange={() => {}}
                  disabled
                />
                <FormField
                  label="Fakultas"
                  value={userData.faculty}
                  onChange={() => {}}
                  disabled
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={isAdmin ? "Nomor Telepon" : "No. WhatsApp"}
              placeholder={
                isAdmin ? "Masukkan No. Telp Anda" : "Masukkan No. WhatsApp Anda"
              }
              value={isAdmin ? adminData.phone : userData.whatsapp}
              onChange={(e) =>
                handleInputChange(isAdmin ? "phone" : "whatsapp", e.target.value)
              }
              error={isAdmin ? errors.phone : errors.whatsapp}
              required
            />
          </div>

          <div className="flex justify-start pt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-8"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Konfirmasi Simpan"
        description="Apakah Anda yakin ingin menyimpan perubahan profil ini?"
        confirmText="Ya, Simpan"
        cancelText="Batal"
        onConfirm={handleConfirmSave}
      />
    </>
  );
}
