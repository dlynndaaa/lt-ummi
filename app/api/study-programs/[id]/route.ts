// app/api/study-programs/[id]/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ambil 1 data program studi
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      `SELECT id, name, code_prodi, faculty_id FROM study_programs WHERE id = $1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching program studi:", error);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

// Update program studi
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, code_prodi, faculty_id } = await req.json();

    if (!name || !code_prodi || !faculty_id) {
      return NextResponse.json(
        { error: "Field nama, kode prodi, dan fakultas wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE study_programs
      SET name = $1, code_prodi = $2, faculty_id = $3
      WHERE id = $4
      RETURNING id, name, code_prodi, faculty_id
      `,
      [name, code_prodi, faculty_id, params.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating program studi:", error);
    return NextResponse.json({ error: "Gagal memperbarui data." }, { status: 500 });
  }
}

// Hapus program studi
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query("DELETE FROM study_programs WHERE id = $1", [params.id]);

    return NextResponse.json({ message: "Program studi berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting program studi:", error);
    return NextResponse.json({ error: "Gagal menghapus program studi." }, { status: 500 });
  }
}
