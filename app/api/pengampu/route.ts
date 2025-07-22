import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        pa.id,
        l.name AS lecturer,
        s.name AS subject,
        c.name AS class,
        sem.semester_no AS semester,
        sp.name AS study_program
      FROM practicum_assignments pa
      JOIN lecturers l ON pa.lecturer_id = l.id
      JOIN subjects s ON pa.subject_id = s.id
      JOIN classes c ON pa.class_id = c.id
      JOIN semesters sem ON pa.semester_id = sem.id
      JOIN study_programs sp ON pa.study_program_id = sp.id
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      lecturer_id,
      subject_id,
      class_id,
      semester_id,
      study_program_id
    } = await req.json();

    await pool.query(
      `INSERT INTO practicum_assignments 
        (lecturer_id, subject_id, class_id, semester_id, study_program_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [lecturer_id, subject_id, class_id, semester_id, study_program_id]
    );

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json({ error: "Failed to create data" }, { status: 500 });
  }
}
