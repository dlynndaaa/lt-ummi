import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        ps.id, 
        s.name AS subject,
        s.credit AS credit,
        pa.duration_slot,
        l.name AS instructor,
        d.name AS day,
        t.start_time AS start_time,
        (
          SELECT t2.end_time
          FROM time_slots t2
          WHERE t2.id = t.id + pa.duration_slot - 1
        ) AS end_time,
        lb.name AS lab,
        sp.name AS study_program,
        c.name AS class,
        sm.semester_no AS semester,
        sm.type AS semester_type,
        sm.year AS academic_year
      FROM practicum_schedules ps
      JOIN practicum_assignments pa ON ps.practicum_assignment_id = pa.id
      JOIN lecturers l ON pa.lecturer_id = l.id
      JOIN subjects s ON pa.subject_id = s.id
      JOIN days d ON ps.day_id = d.id
      JOIN time_slots t ON ps.time_slot_id = t.id
      JOIN laboratories lb ON ps.lab_id = lb.id
      JOIN study_programs sp ON pa.study_program_id = sp.id
      JOIN classes c ON pa.class_id = c.id
      JOIN semesters sm ON pa.semester_id = sm.id
      ORDER BY ps.id ASC;
    `);

    const formatted = result.rows.map((row) => ({
      ...row,
      time: `${row.start_time} - ${row.end_time}`,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      practicum_assignment_id,
      subject_id,
      lecturer_id,
      day_id,
      time_slot_id,
      lab_id,
      study_program_id,
      class_id,
      semester_id,
    } = body;

    await pool.query(
      `INSERT INTO practicum_schedules (
        practicum_assignment_id,
        subject_id,
        lecturer_id,
        day_id,
        time_slot_id,
        lab_id,
        study_program_id,
        class_id,
        semester_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        practicum_assignment_id,
        subject_id,
        lecturer_id,
        day_id,
        time_slot_id,
        lab_id,
        study_program_id,
        class_id,
        semester_id,
      ]
    );

    return NextResponse.json({ message: "Created successfully" });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create data" }, { status: 500 });
  }
}
