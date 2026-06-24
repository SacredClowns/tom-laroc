// Admin auth config. Override both in .env.local for production.
// ADMIN_PASSWORD: what Tom types to log in.
// ADMIN_TOKEN: the opaque value stored in the session cookie.

export const ADMIN_COOKIE = "tl_admin";
// No insecure defaults — the repo is public. Admin is LOCKED until both
// ADMIN_PASSWORD and ADMIN_TOKEN are set in the environment (e.g. Vercel).
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
export const ADMIN_CONFIGURED = Boolean(ADMIN_PASSWORD && ADMIN_TOKEN);
