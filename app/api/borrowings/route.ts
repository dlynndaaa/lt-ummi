import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/connection";
import { withAuth } from "@/lib/auth/middleware";

async function getBorrowingsHandler(request: NextRequest & { user: any }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    let whereClause = "WHERE b.is_active = true AND b.is_deleted = false";
    const queryParams: any[] = [];
    let paramCount = 0;

    if (request.user.role === "user") {
      paramCount++;
      whereClause += ` AND b.borrower_id = $${paramCount}`;
      queryParams.push(request.user.userId);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (u.name ILIKE $${paramCount} OR i.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND b.status = $${paramCount}`;
      queryParams.push(status);
    }

    const countQuery = `
      SELECT COUNT(*) 
      FROM borrowings b
      JOIN users u ON b.borrower_id = u.id
      JOIN items i ON b.item_id = i.id
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const total = Number.parseInt(countResult.rows[0].count);

    const borrowingsQuery = `
      SELECT 
        b.id, b.quantity, b.borrow_date, b.return_date, b.actual_return_date,
        b.purpose, b.status, b.borrowing_letter_file_ids, b.notes, b.approved_date,
        b.created_date, b.updated_date,
        u.id as borrower_id, u.name as borrower_name, u.email as borrower_email,
        u.phone as borrower_phone, u.whatsapp as borrower_whatsapp, u.student_id as borrower_student_id,
        i.id as item_id, i.name as item_name, i.code as item_code,
        approver.name as approved_by_name
      FROM borrowings b
      JOIN users u ON b.borrower_id = u.id
      JOIN items i ON b.item_id = i.id
      LEFT JOIN users approver ON b.approved_by = approver.id
      ${whereClause}
      ORDER BY b.created_date DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const borrowingsResult = await pool.query(borrowingsQuery, queryParams);

    // Hitung penalty jika status "approved" dan return_date lewat dari hari ini
    const today = new Date();
    const borrowingsWithPenalty = borrowingsResult.rows.map((b: any) => {
      let penalty = null;
      if (b.status === "approved" && b.return_date && new Date(b.return_date) < today) {
        const daysLate = Math.ceil(
          (today.getTime() - new Date(b.return_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        penalty = daysLate * 5000;
      }
      return {
        ...b,
        penalty,
      };
    });

    return NextResponse.json({
      borrowings: borrowingsWithPenalty,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get borrowings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getBorrowingsHandler);
