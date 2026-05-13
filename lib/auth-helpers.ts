/**
 * Authentication helpers for server-side requests.
 *
 * getWCAdminHeaders()  — Basic Auth using WP admin Application Password.
 *                        Used for privileged WC API calls (create orders, etc.).
 *
 * getUserAuthHeaders() — Basic Auth using the user's session token stored in
 *                        the httpOnly cookie. Pass the token from the request's
 *                        cookies; never read it from the client.
 *
 * These helpers only run on the server (API Routes, Server Actions).
 */

/**
 * Returns Authorization header for the WP admin account.
 * Uses the Application Password configured in .env.local.
 */
export function getWCAdminHeaders(): { Authorization: string; "Content-Type": string } {
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_APP_PASSWORD?.replace(/\s/g, "");

  if (!username || !password) {
    throw new Error(
      "Missing WP_USERNAME or WP_APP_PASSWORD environment variables."
    );
  }

  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Returns Authorization header for an authenticated user.
 * @param sessionToken — the raw value from the wp_session_token cookie.
 */
export function getUserAuthHeaders(
  sessionToken: string
): { Authorization: string } {
  return { Authorization: `Basic ${sessionToken}` };
}

/**
 * Checks whether the WordPress integration is configured.
 * Returns false in mock/dev mode or when env vars are missing.
 */
export function isWPConfigured(): boolean {
  if (process.env.USE_MOCKS === "true") return false;
  return Boolean(
    process.env.WORDPRESS_URL &&
      process.env.WP_USERNAME &&
      process.env.WP_APP_PASSWORD
  );
}
