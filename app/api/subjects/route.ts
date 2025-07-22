// app/api/subjects/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ambil semua mata kuliah
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT s.id, s.code, s.name, s.credit, sp.name AS study_program
      FROM subjects s
      LEFT JOIN study_programs sp ON s.study_program_id = sp.id
      ORDER BY s.id
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

// Tambah mata kuliah
export async function POST(req: Request) {
  try {
    const { code, name, credit, study_program_id } = await req.json();

    if (!code || !name || !credit || !study_program_id) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO subjects (code, name, credit, study_program_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, code, name, credit,
        (SELECT name FROM study_programs WHERE id = $4) AS study_program
      `,
      [code, name, credit, study_program_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json({ error: "Gagal menambahkan mata kuliah." }, { status: 500 });
  }
}
