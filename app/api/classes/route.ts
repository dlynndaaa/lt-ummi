import { NextResponse } from "next/server";
import pool from "@/lib/db/connection"; // Koneksi database PostgreSQL

// GET: Ambil semua data kelas dengan join nama prodi & tahun semester
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.type,
        c.student_count,
        sp.name AS study_program_name,
        s.year AS semester_year
      FROM 
        classes c
      LEFT JOIN 
        study_programs sp ON c.study_program_id = sp.id
      LEFT JOIN 
        semesters s ON c.semesters_id = s.id
      ORDER BY 
        c.id ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { message: "Gagal memuat data kelas" },
      { status: 500 }
    );
  }
}

// POST: Tambah data kelas baru tanpa set id manual
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, student_count, study_program_id, semesters_id } = body;

    const result = await pool.query(
      `
      INSERT INTO classes (name, type, student_count, study_program_id, semesters_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [name, type, student_count, study_program_id, semesters_id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding class:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan kelas", error },
      { status: 500 }
    );
  }
}
