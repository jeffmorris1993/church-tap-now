import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// FastAPI-style public endpoint for the "I'm New Here" visitor form.
// POST /api/public/visitor
//   body: { name, email, phone?, first_time, interests[] }
//   returns: { ok: true, id } or { ok: false, error }

const VisitorSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  first_time: z.boolean(),
  interests: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
});

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/visitor")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response(
            JSON.stringify({ ok: false, error: "Invalid JSON body" }),
            { status: 400, headers: corsHeaders },
          );
        }

        const parsed = VisitorSchema.safeParse(raw);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({
              ok: false,
              error: "Validation failed",
              issues: parsed.error.issues.map((i) => ({
                path: i.path,
                message: i.message,
              })),
            }),
            { status: 400, headers: corsHeaders },
          );
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!supabaseUrl || !supabaseKey) {
          console.error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
          return new Response(
            JSON.stringify({ ok: false, error: "Server misconfiguration" }),
            { status: 500, headers: corsHeaders },
          );
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data, error } = await supabase
          .from("visitors")
          .insert({
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone ?? null,
            first_time: parsed.data.first_time,
            interests: parsed.data.interests,
          })
          .select("id, created_at")
          .single();

        if (error) {
          console.error("visitor insert failed:", error);
          return new Response(
            JSON.stringify({ ok: false, error: error.message }),
            { status: 500, headers: corsHeaders },
          );
        }

        return new Response(
          JSON.stringify({
            ok: true,
            id: data.id,
            created_at: data.created_at,
          }),
          { status: 201, headers: corsHeaders },
        );
      },
    },
  },
});
