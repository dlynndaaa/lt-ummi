import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db/connection"
import { hashPassword } from "@/lib/auth/password"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      password,
      role = "user",
      phone,
      faculty,
      study_program,
      student_id,
      whatsapp,
    } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Cek apakah email sudah terdaftar
    const checkQuery = `SELECT id FROM users WHERE email = $1 AND is_deleted = false`
    const checkResult = await pool.query(checkQuery, [email])

    if (checkResult.rows.length > 0) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const userId = uuidv4()

    const insertQuery = `
      INSERT INTO users (
        id, name, email, password_hash, role,
        phone, faculty, study_program, student_id, whatsapp,
        is_active, is_deleted, status, created_date
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        true, false, 'active', CURRENT_TIMESTAMP
      )
      RETURNING id, name, email, role, phone, faculty, study_program, student_id, whatsapp
    `

    const insertResult = await pool.query(insertQuery, [
      userId,
      name,
      email,
      hashedPassword,
      role,
      phone,
      faculty,
      study_program,
      student_id,
      whatsapp,
    ])

    const newUser = insertResult.rows[0]

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: newUser,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("💥 Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
