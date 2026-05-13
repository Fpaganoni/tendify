/**
 * POST /api/auth/register
 *
 * Creates a new customer in WooCommerce via POST /wp-json/wc/v3/customers.
 * On success, logs the user in automatically (sets the session cookie).
 *
 * When WP is not available (USE_MOCKS=true), registers to the in-memory
 * mock store so the dev experience stays fluid.
 */
import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import type { User } from "@/lib/types";

const SESSION_COOKIE = "wp_session_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// Shared in-memory mock store (same pattern as login route)
const mockUsers: (User & { _mockPassword: string })[] = [
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

export async function POST(request: Request) {
  const { email, password, firstName, lastName } = await request.json();

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const WORDPRESS_URL = process.env.WORDPRESS_URL;
  const WP_USERNAME = process.env.WP_USERNAME;
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD?.replace(/\s/g, "");
  const useMocks = process.env.USE_MOCKS === "true";

  // ── Mock fallback ──────────────────────────────────────────────────────────
  if (useMocks || !WORDPRESS_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    const existing = mockUsers.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const newUser: User & { _mockPassword: string } = {
      id: mockUsers.length + 1,
      email,
      first_name: firstName,
      last_name: lastName,
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _mockPassword: password,
    };
    mockUsers.push(newUser);

    const { _mockPassword, ...user } = newUser;
    const response = NextResponse.json({ user }, { status: 201 });
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

  // ── WooCommerce customer creation ──────────────────────────────────────────
  const adminToken = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64");

  try {
    const wcResponse = await axios.post(
      `${WORDPRESS_URL}/wp-json/wc/v3/customers`,
      {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
      },
      {
        headers: {
          Authorization: `Basic ${adminToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const data = wcResponse.data;
    const user: User = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: (data.role as string) ?? "customer",
      created_at: data.date_created ?? new Date().toISOString(),
      updated_at: data.date_modified ?? new Date().toISOString(),
    };

    // Auto-login: set session cookie using the new user's credentials
    const userToken = Buffer.from(`${email}:${password}`).toString("base64");
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string; code?: string }>;
    const wcMessage = axiosErr.response?.data?.message;
    const wcCode = axiosErr.response?.data?.code;

    // WooCommerce returns "registration-error-email-exists" for duplicate emails
    if (wcCode?.includes("email") || axiosErr.response?.status === 409) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    console.error("[/api/auth/register]", wcMessage ?? axiosErr.message);
    return NextResponse.json(
      { error: wcMessage ?? "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
