import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/connection";

// GET /api/labs/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const result = await pool.query(
      `SELECT id, name, location, supervisor_id, capacity, description
       FROM laboratories
       WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return new NextResponse("Lab tidak ditemukan", { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET error:", error);
    return new NextResponse("Gagal mengambil data", { status: 500 });
  }
}

// PUT /api/labs/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();
  const { name, location, supervisor, capacity, description } = body;

  try {
    const parsedCapacity = capacity !== "" ? parseInt(capacity) : null;

    await pool.query(
      `UPDATE laboratories
       SET name = $1, location = $2, supervisor_id = $3, capacity = $4, description = $5
       WHERE id = $6`,
      [name, location, supervisor || null, parsedCapacity, description || null, id]
    );

    return new NextResponse("Berhasil diperbarui", { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new NextResponse("Gagal memperbarui data", { status: 500 });
  }
}

// DELETE /api/labs/[id]
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    // Soft delete: set is_deleted = TRUE
    await pool.query(
      `UPDATE laboratories SET is_deleted = TRUE WHERE id = $1`,
      [id]
    );

    return new NextResponse("Laboratorium berhasil dihapus", { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new NextResponse("Gagal menghapus laboratorium", { status: 500 });
  }
}
