import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const result = await pool.query(
      `
      SELECT 
        ps.*, 
        s.name AS subject_name,
        s.credit AS subject_credit
      FROM practicum_schedules ps
      JOIN subjects s ON ps.subject_id = s.id
      WHERE ps.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const {
      practicum_assignment_id,
      subject_id,
      day_id,
      time_slot_id,
      lab_id,
      study_program_id,
      class_id,
      semester_id,
    } = await req.json();

    await pool.query(
      `UPDATE practicum_schedules SET
        practicum_assignment_id = $1,
        subject_id = $2,
        day_id = $3,
        time_slot_id = $4,
        lab_id = $5,
        study_program_id = $6,
        class_id = $7,
        semester_id = $8
      WHERE id = $9`,
      [
        practicum_assignment_id,
        subject_id,
        day_id,
        time_slot_id,
        lab_id,
        study_program_id,
        class_id,
        semester_id,
        id,
      ]
    );

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await pool.query(`DELETE FROM practicum_schedules WHERE id = $1`, [id]);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
