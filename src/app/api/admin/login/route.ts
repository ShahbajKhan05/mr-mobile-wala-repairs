import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth";



export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username aur password dono required hain." },
        { status: 400 },
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { message: "Invalid username ya password." },
        { status: 401 },
      );
    }

    const token = createAdminSession();

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { message: "Server configuration error. Check your .env.local file." },
      { status: 500 },
    );
  }
}