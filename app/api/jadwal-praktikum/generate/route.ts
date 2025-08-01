import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";
import { generateScheduleWithGA } from "@/lib/geneticAlgorithm";

// Tambahkan tipe agar time_slot_ids dikenali secara eksplisit
type GeneratedSchedule = {
  practicum_assignment_id: number;
  day_id: number;
  lab_id: number;
  time_slot_ids: number[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { semester_id, lab_id } = body;

    if (!semester_id || !lab_id) {
      return NextResponse.json(
        { error: "semester_id dan lab_id wajib diisi." },
        { status: 400 }
      );
    }

    // Ambil semua jadwal yang sudah ada agar bisa dicegah bentrok
    const existingResult = await pool.query(
      `SELECT day_id, time_slot_id, duration, lab_id FROM practicum_schedules WHERE semester_id = $1`,
      [semester_id]
    );

    const usedSlots: { [key: string]: Set<number> } = {};

    for (const row of existingResult.rows) {
      const key = `${row.day_id}-${row.lab_id}`;
      if (!usedSlots[key]) usedSlots[key] = new Set();

      const start = row.time_slot_id;
      const end = row.time_slot_id + row.duration - 1;

      for (let i = start; i <= end; i++) {
        usedSlots[key].add(i);
      }
    }

    // Berikan data slot terpakai ke fungsi GA
    const generatedSchedules: GeneratedSchedule[] = await generateScheduleWithGA(
      semester_id,
      lab_id,
      usedSlots
    );

    if (!generatedSchedules || generatedSchedules.length === 0) {
      return NextResponse.json(
        {
          error: "Data gagal digenerate. Pastikan data pengampu tersedia dan lengkap.",
        },
        { status: 400 }
      );
    }

    // Hapus jadwal sebelumnya untuk semester dan lab terkait
    await pool.query(
      `DELETE FROM practicum_schedules WHERE semester_id = $1 AND lab_id = $2`,
      [semester_id, lab_id]
    );

    let insertedCount = 0;
    const skippedAssignments: number[] = [];
    const detailedSchedules: any[] = [];

    for (const schedule of generatedSchedules) {
      const assignmentQuery = await pool.query(
        `
        SELECT pa.subject_id, pa.study_program_id, pa.class_id,
               pa.semester_id, pa.lecturer_id, pa.duration_slot, s.credit
        FROM practicum_assignments pa
        JOIN subjects s ON pa.subject_id = s.id
        WHERE pa.id = $1
        `,
        [schedule.practicum_assignment_id]
      );

      if (assignmentQuery.rows.length === 0) {
        skippedAssignments.push(schedule.practicum_assignment_id);
        continue;
      }

      const assignment = assignmentQuery.rows[0];
      const timeSlots = Array.isArray(schedule.time_slot_ids) ? schedule.time_slot_ids : [];
      const startSlot = timeSlots[0];
      const duration = assignment.duration_slot || 1;

      // Cek validitas slot
      if (!startSlot || duration <= 0 || timeSlots.length < duration) {
        skippedAssignments.push(schedule.practicum_assignment_id);
        continue;
      }

      // Cek bentrok ulang saat insert (lapisan tambahan)
      const occupiedCheck = await pool.query(
        `
        SELECT 1
        FROM practicum_schedules
        WHERE day_id = $1
          AND lab_id = $2
          AND semester_id = $3
          AND NOT (
            time_slot_id + duration - 1 < $4 OR time_slot_id > $5
          )
        `,
        [
          schedule.day_id,
          schedule.lab_id,
          assignment.semester_id,
          startSlot,
          startSlot + duration - 1,
        ]
      );

      if (occupiedCheck.rows.length > 0) {
        skippedAssignments.push(schedule.practicum_assignment_id);
        continue;
      }

      await pool.query(
        `
        INSERT INTO practicum_schedules (
          practicum_assignment_id,
          day_id,
          time_slot_id,
          duration,
          lab_id,
          subject_id,
          study_program_id,
          class_id,
          semester_id,
          lecturer_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          schedule.practicum_assignment_id,
          schedule.day_id,
          startSlot,
          duration,
          schedule.lab_id,
          assignment.subject_id,
          assignment.study_program_id,
          assignment.class_id,
          assignment.semester_id,
          assignment.lecturer_id,
        ]
      );

      insertedCount++;

      detailedSchedules.push({
        practicum_assignment_id: schedule.practicum_assignment_id,
        day_id: schedule.day_id,
        time_slot_id: startSlot,
        duration,
        lab_id: schedule.lab_id,
        subject_id: assignment.subject_id,
        credit: assignment.credit,
      });
    }

    return NextResponse.json({
      message: "Jadwal berhasil digenerate dan disimpan.",
      total_generated: generatedSchedules.length,
      total_saved: insertedCount,
      total_skipped: skippedAssignments.length,
      skipped_assignment_ids: skippedAssignments,
      data: detailedSchedules,
    });
  } catch (error: any) {
    console.error("GENERATE error:", error);
    return NextResponse.json(
      {
        error: "Gagal generate",
        detail: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
