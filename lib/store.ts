// Data layer. Uses Supabase when configured (Tom's own free project), and
// transparently falls back to a local JSON file store otherwise — so the app
// runs with zero accounts and upgrades to a real DB by just adding env vars.

import { promises as fs } from "node:fs";
import path from "node:path";
import { getSupabase } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), ".data");

export type ContactStatus = "new" | "contacted" | "client";

export type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  website?: string;
  industry?: string;
  focus?: string[];
  challenge?: string;
  timeline?: string;
  budget?: string;
  notes?: string;
  status: ContactStatus;
  lastEmailedAt?: string | null;
  lastTemplate?: string | null;
};

export type Subscriber = {
  id: string;
  createdAt: string;
  email: string;
};

function localId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- file backend ----------
async function fileRead<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}
async function fileWrite<T>(file: string, rows: T[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), "utf8");
}

// ---------- mapping (DB snake_case <-> TS camelCase) ----------
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToInquiry(r: any): Inquiry {
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    company: r.company ?? undefined,
    role: r.role ?? undefined,
    website: r.website ?? undefined,
    industry: r.industry ?? undefined,
    focus: r.focus ?? undefined,
    challenge: r.challenge ?? undefined,
    timeline: r.timeline ?? undefined,
    budget: r.budget ?? undefined,
    notes: r.notes ?? undefined,
    status: r.status ?? "new",
    lastEmailedAt: r.last_emailed_at ?? null,
    lastTemplate: r.last_template ?? null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------- Inquiries ----------
export async function addInquiry(
  data: Omit<Inquiry, "id" | "createdAt" | "status" | "lastEmailedAt" | "lastTemplate">
): Promise<Inquiry> {
  const sb = getSupabase();
  if (sb) {
    const { data: row, error } = await sb
      .from("inquiries")
      .insert({
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.role,
        website: data.website,
        industry: data.industry,
        focus: data.focus,
        challenge: data.challenge,
        timeline: data.timeline,
        budget: data.budget,
        notes: data.notes,
        status: "new",
      })
      .select()
      .single();
    if (error) throw error;
    return rowToInquiry(row);
  }

  const rows = await fileRead<Inquiry>("inquiries.json");
  const record: Inquiry = {
    id: localId(),
    createdAt: new Date().toISOString(),
    status: "new",
    lastEmailedAt: null,
    lastTemplate: null,
    ...data,
  };
  rows.unshift(record);
  await fileWrite("inquiries.json", rows);
  return record;
}

export async function listInquiries(): Promise<Inquiry[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(rowToInquiry);
  }
  return fileRead<Inquiry>("inquiries.json");
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from("inquiries").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToInquiry(data) : null;
  }
  const rows = await fileRead<Inquiry>("inquiries.json");
  return rows.find((r) => r.id === id) || null;
}

export async function markContacted(id: string, templateId: string): Promise<void> {
  const now = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb
      .from("inquiries")
      .update({ status: "contacted", last_emailed_at: now, last_template: templateId })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const rows = await fileRead<Inquiry>("inquiries.json");
  const r = rows.find((x) => x.id === id);
  if (r) {
    r.status = r.status === "client" ? "client" : "contacted";
    r.lastEmailedAt = now;
    r.lastTemplate = templateId;
    await fileWrite("inquiries.json", rows);
  }
}

// ---------- Subscribers ----------
export async function addSubscriber(email: string): Promise<Subscriber> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("subscribers")
      .upsert({ email }, { onConflict: "email" })
      .select()
      .single();
    if (error) throw error;
    return { id: data.id, createdAt: data.created_at, email: data.email };
  }

  const rows = await fileRead<Subscriber>("subscribers.json");
  const existing = rows.find((r) => r.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const record: Subscriber = { id: localId(), createdAt: new Date().toISOString(), email };
  rows.unshift(record);
  await fileWrite("subscribers.json", rows);
  return record;
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((r) => ({ id: r.id, createdAt: r.created_at, email: r.email }));
  }
  return fileRead<Subscriber>("subscribers.json");
}
