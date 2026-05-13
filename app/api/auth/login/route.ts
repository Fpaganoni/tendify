/**
 * POST /api/auth/login
 *
 * Validates user credentials against WordPress using Basic Auth.
 * On success, sets a secure httpOnly cookie with the session token
 * (base64-encoded "username:password" — the same format WordPress expects)
 * and returns the user profile.
 *
 * When WP is not available (USE_MOCKS=true), falls back to mock users so
 * the dev experience is uninterrupted.
 */
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import type { User } from "@/lib/types";

// ─── Mock users for development fallback ─────────────────────────────────────
const MOCK_USERS: (User & { _mockPassword: string })[] = [
  {
    id: 1,
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    _mockPassword: "password",
  },
  {
    id: 2,
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    _mockPassword: "password",
  },
];

const SESSION_COOKIE = "wp_session_token";
// 30-day session lifetime
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const WORDPRESS_URL = process.env.WORDPRESS_URL;
  const useMocks = process.env.USE_MOCKS === "true";

  // ── Mock fallback ──────────────────────────────────────────────────────────
  if (useMocks || !WORDPRESS_URL) {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u._mockPassword === password
    );
    if (!found) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
    const { _mockPassword, ...user } = found;

    const response = NextResponse.json({ user });
    // Even in mock mode we set the cookie so the session pattern is consistent
    const token = Buffer.from(`${email}:${password}`).toString("base64");
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  }

  // ── WordPress Basic Auth validation ───────────────────────────────────────
  // WordPress Application Passwords / REST API accepts Basic Auth on the
  // /wp/v2/users/me endpoint. If the credentials are wrong, it returns 401.
  const token = Buffer.from(`${email}:${password}`).toString("base64");

  try {
    const wpUser = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Basic ${token}` },
      params: { context: "edit" },
      timeout: 8000,
    });

    const data = wpUser.data;
    const user: User = {
      id: data.id,
      email: data.email ?? email,
      first_name: data.first_name ?? data.name?.split(" ")[0] ?? "",
      last_name: data.last_name ?? data.name?.split(" ").slice(1).join(" ") ?? "",
      role: (data.roles?.[0] as string) ?? "customer",
      created_at: data.registered_date ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = NextResponse.json({ user });
    // Store the Base64 token in a secure httpOnly cookie
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const status = axiosErr.response?.status;

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    console.error("[/api/auth/login]", axiosErr.message);
    return NextResponse.json(
      { error: "Authentication service unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
