"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, isAfter, differenceInCalendarDays } from "date-fns";
import { id } from "date-fns/locale";
import { apiClient } from "@/lib/api/client";
import { useTableData } from "@/hooks/use-table-data";
import { BorrowingStatusBadge } from "@/components/ui/borrowing-status-badge";
import { Search } from "lucide-react";

interface Borrowing {
  id: string;
  borrower_name: string;
  item_name: string;
  borrow_date: string;
  return_date: string;
  status: "pending" | "approved" | "rejected" | "returned";
  penalty?: number;
}

export default function BorrowingStatusPage() {
  const [allData, setAllData] = useState<Borrowing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [penaltyPerDay, setPenaltyPerDay] = useState(5000);
  const [saving, setSaving] = useState(false);

  const { paginatedData, handleSearch, pagination } = useTableData({
    data: allData,
    pageSize: 8,
    searchFields: ["borrower_name", "item_name"],
  });

  useEffect(() => {
    fetchPenalty();
  }, []);

  useEffect(() => {
    loadBorrowings();
  }, [penaltyPerDay]);

  const fetchPenalty = async () => {
    try {
      const res = await fetch("/api/penalty");
      const data = await res.json();
      setPenaltyPerDay(data.penalty);
    } catch (err) {
      console.error("Error fetching penalty:", err);
    }
  };

  const savePenalty = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/penalty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ penalty: penaltyPerDay }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Sanksi berhasil disimpan ke database.");
      } else {
        alert("Gagal menyimpan ke database.");
      }
    } catch (err) {
      console.error("Error saving penalty:", err);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const loadBorrowings = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBorrowings();
      const today = new Date();

      const data = response.borrowings.map((b: any) => {
        let penalty = 0;
        const returnDate = new Date(b.return_date);

        if (b.status === "approved" && isAfter(today, returnDate)) {
          const lateDays = differenceInCalendarDays(today, returnDate);
          penalty = lateDays * penaltyPerDay;
        }

        return {
          id: b.id,
          borrower_name: b.borrower_name,
          item_name: b.item_name,
          borrow_date: b.borrow_date,
          return_date: b.return_date,
          status: b.status,
          penalty,
        };
      });

      setAllData(data);
    } catch (error) {
      console.error("Failed to load borrowings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: "borrower_name" as keyof Borrowing,
      title: "Peminjam",
      render: (value: string) => (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {value.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{value}</span>
        </div>
      ),
    },
    { key: "item_name", title: "Nama Barang" },
    {
      key: "borrow_date",
      title: "Tanggal Pinjam",
      render: (value: string) =>
        format(new Date(value), "dd-MM-yyyy", { locale: id }),
    },
    {
      key: "return_date",
      title: "Tanggal Kembali",
      render: (value: string) =>
        format(new Date(value), "dd-MM-yyyy", { locale: id }),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => {
        const map = {
          pending: "Menunggu",
          approved: "Dipinjam",
          rejected: "Ditolak",
          returned: "Dikembalikan",
        };
        return (
          <BorrowingStatusBadge status={value as any}>
            {map[value as keyof typeof map]}
          </BorrowingStatusBadge>
        );
      },
    },
    {
      key: "penalty",
      title: "Sanksi",
      render: (value: number) =>
        value > 0 ? `Rp ${value.toLocaleString("id-ID")}` : "-",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-0">
          <h2 className="text-2xl font-bold">Status Peminjaman</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="penaltyPerDay" className="text-sm">
                Sanksi/Hari:
              </label>
              <input
                id="penaltyPerDay"
                type="number"
                value={penaltyPerDay}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setPenaltyPerDay(isNaN(value) ? 0 : value);
                }}
                className="w-24 px-2 py-1 border rounded text-sm"
              />
              <button
                onClick={savePenalty}
                disabled={saving}
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
              >
                {saving ? "..." : "Simpan"}
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama atau barang..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-9 pr-3 py-2 border rounded w-64 text-sm"
              />
            </div>
          </div>
        </div>

        <DataTable
          title=""
          data={paginatedData}
          columns={columns}
          searchPlaceholder=""
          pagination={pagination}
          isLoading={isLoading}
          hideActions
        />
      </div>
    </DashboardLayout>
  );
}
