/**
 * GET  /api/auth/me   — Returns the current user from the session cookie.
 * DELETE /api/auth/me — Logs the user out by clearing the session cookie.
 */
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import type { User } from "@/lib/types";

const SESSION_COOKIE = "wp_session_token";

// ── Mock users (mirrored from login/register routes) ─────────────────────────
const MOCK_USERS: User[] = [
  {
    id: 1,
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const WORDPRESS_URL = process.env.WORDPRESS_URL;
  const useMocks = process.env.USE_MOCKS === "true";

  // ── Mock fallback ──────────────────────────────────────────────────────────
  if (useMocks || !WORDPRESS_URL) {
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const email = decoded.split(":")[0];
      const user = MOCK_USERS.find((u) => u.email === email);
      return NextResponse.json({ user: user ?? null });
    } catch {
      return NextResponse.json({ user: null });
    }
  }

  // ── Validate session token against WordPress ───────────────────────────────
  try {
    const wpUser = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Basic ${token}` },
      params: { context: "edit" },
      timeout: 5000,
    });

    const data = wpUser.data;
    const user: User = {
      id: data.id,
      email: data.email ?? "",
      first_name: data.first_name ?? data.name?.split(" ")[0] ?? "",
      last_name: data.last_name ?? data.name?.split(" ").slice(1).join(" ") ?? "",
      role: (data.roles?.[0] as string) ?? "customer",
      created_at: data.registered_date ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (err) {
    const axiosErr = err as AxiosError;
    // 401/403 = token expired or invalid — clear the cookie
    if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
    // Network/timeout error — don't kill the session, surface error
    console.warn("[/api/auth/me] Could not reach WordPress:", axiosErr.message);
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  });
  return response;
}
