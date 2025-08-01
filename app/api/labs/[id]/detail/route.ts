import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/connection";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const labResult = await pool.query(
      `SELECT 
        l.id, l.name, l.location, l.description, l.capacity,
        l.supervisor_id,
        p.name AS supervisor
       FROM laboratories l
       LEFT JOIN plps p ON l.supervisor_id = p.id
       WHERE l.id = $1`,
      [id]
    );

    if (labResult.rows.length === 0) {
      return NextResponse.json({ error: "Laboratorium tidak ditemukan" }, { status: 404 });
    }

    const lab = labResult.rows[0];

    const photoResult = await pool.query(
      `SELECT photo_url FROM laboratory_photos WHERE lab_id = $1`,
      [id]
    );

    const photos = photoResult.rows.map((row) => row.photo_url);

    return NextResponse.json({ ...lab, photos });
  } catch (error) {
    console.error("Gagal ambil detail lab:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
