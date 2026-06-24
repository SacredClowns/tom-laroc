// Admin auth config. Override both in .env.local for production.
// ADMIN_PASSWORD: what Tom types to log in.
// ADMIN_TOKEN: the opaque value stored in the session cookie.

export const ADMIN_COOKIE = "tl_admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tomhq";
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "tl-admin-session-change-me";
