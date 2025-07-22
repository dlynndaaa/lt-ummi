import { NextResponse } from 'next/server';
import db from '@/lib/db/connection';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, type, study_program_id, student_count, semesters_id } = body;
    const id = parseInt(params.id);

    const result = await db.query(
      `UPDATE classes 
       SET name = $1, type = $2, study_program_id = $3, student_count = $4, semesters_id = $5
       WHERE id = $6 RETURNING *`,
      [name, type, study_program_id, student_count, semesters_id, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update class' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await db.query('DELETE FROM classes WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Class deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete class' }, { status: 500 });
  }
}
