import { NextResponse } from "next/server";
import pool from "@/lib/db/connection";

// GET by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query("SELECT * FROM time_slots WHERE id = $1", [params.id]);
    if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { start_time, end_time } = await req.json();
    await pool.query(
      "UPDATE time_slots SET start_time = $1, end_time = $2 WHERE id = $3",
      [start_time, end_time, params.id]
    );
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query("DELETE FROM time_slots WHERE id = $1", [params.id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
