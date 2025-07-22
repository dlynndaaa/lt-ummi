// app/api/subjects/[id]/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET satu mata kuliah
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      `SELECT id, code, name, credit, study_program_id FROM subjects WHERE id = $1`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Mata kuliah tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

// UPDATE mata kuliah
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { code, name, credit, study_program_id } = await req.json();

    if (!code || !name || !credit || !study_program_id) {
      return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }

    const result = await pool.query(
      `
      UPDATE subjects
      SET code = $1, name = $2, credit = $3, study_program_id = $4
      WHERE id = $5
      RETURNING id, code, name, credit, study_program_id
      `,
      [code, name, credit, study_program_id, params.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json({ error: "Gagal memperbarui data." }, { status: 500 });
  }
}

// DELETE mata kuliah
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query(`DELETE FROM subjects WHERE id = $1`, [params.id]);
    return NextResponse.json({ message: "Mata kuliah berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json({ error: "Gagal menghapus data." }, { status: 500 });
  }
}
