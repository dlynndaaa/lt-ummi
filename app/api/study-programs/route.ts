// app/api/study-programs/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT sp.id, sp.name, sp.code_prodi, f.name AS faculty
      FROM study_programs sp
      JOIN faculties f ON sp.faculty_id = f.id
      ORDER BY sp.id
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching study programs:", error);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code_prodi, faculty_id } = body;

    if (!name || !code_prodi || !faculty_id) {
      return NextResponse.json(
        { error: "Field nama, kode prodi, dan fakultas wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO study_programs (name, code_prodi, faculty_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, code_prodi,
        (SELECT name FROM faculties WHERE id = $3) AS faculty
      `,
      [name, code_prodi, faculty_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating study program:", error);
    return NextResponse.json({ error: "Gagal menambahkan program studi." }, { status: 500 });
  }
}
