import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

// GET data pengampu by ID (dengan nama laboratorium)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      `
      SELECT 
        pa.id,
        pa.lecturer_id,
        pa.subject_id,
        pa.class_id,
        pa.semester_id,
        pa.study_program_id,
        pa.lab_id,
        l.name AS lecturer,
        s.name AS subject,
        c.name AS class,
        sem.semester_no AS semester,
        sp.name AS study_program,
        lab.name AS lab
      FROM practicum_assignments pa
      JOIN lecturers l ON pa.lecturer_id = l.id
      JOIN subjects s ON pa.subject_id = s.id
      JOIN classes c ON pa.class_id = c.id
      JOIN semesters sem ON pa.semester_id = sem.id
      JOIN study_programs sp ON pa.study_program_id = sp.id
      JOIN laboratories lab ON pa.lab_id = lab.id
      WHERE pa.id = $1
      `,
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// UPDATE data pengampu by ID (termasuk lab_id)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const {
      lecturer_id,
      subject_id,
      class_id,
      semester_id,
      study_program_id,
      lab_id
    } = await req.json();

    await pool.query(
      `
      UPDATE practicum_assignments
      SET lecturer_id = $1,
          subject_id = $2,
          class_id = $3,
          semester_id = $4,
          study_program_id = $5,
          lab_id = $6
      WHERE id = $7
      `,
      [
        lecturer_id,
        subject_id,
        class_id,
        semester_id,
        study_program_id,
        lab_id,
        params.id,
      ]
    );

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

// DELETE data pengampu by ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query("DELETE FROM practicum_assignments WHERE id = $1", [
      params.id,
    ]);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
