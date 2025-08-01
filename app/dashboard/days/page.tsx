"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";

interface Day {
  id: number;
  name: string;
  no?: number;
}

export default function DaysPage() {
  const [data, setData] = useState<Day[]>([]);

  const loadData = async () => {
    const res = await fetch("/api/days");
    const rows = await res.json();
    setData(rows.map((d: Day, i: number) => ({ ...d, no: i + 1 })));
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    { key: "no", title: "No", render: (_: any, row: Day) => row.no },
    { key: "name", title: "Hari", render: (_: any, row: Day) => row.name },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable title="Daftar Hari" data={data} columns={columns} />
      </div>
    </DashboardLayout>
  );
}
