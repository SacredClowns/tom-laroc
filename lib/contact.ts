// Central contact config — safe to import on the client (no secrets here).
// The Resend API key lives only in env (server-side).

export const CONTACT_EMAIL = "brookeganster75@gmail.com"; // where inquiries land
export const SITE_DOMAIN = "tomlaroc.com";
export const FROM_EMAIL = `Tom Laroc <inquiries@${SITE_DOMAIN}>`; // verified-domain sender

export const FOCUS_AREAS = [
  "AI strategy & roadmap",
  "Content & creative production",
  "Automation & workflows",
  "Brand & aesthetic direction",
  "Team training & workshops",
  "Not sure yet — help me figure it out",
] as const;

export const TIMELINES = [
  "Exploring / no rush",
  "Within a month",
  "This quarter",
  "Urgent",
] as const;

export const BUDGETS = [
  "Not sure yet",
  "Under $5k",
  "$5k - $15k",
  "$15k - $50k",
  "$50k+",
] as const;
