/**
 * CamOS owner-only invite Edge Function.
 *
 * POST JSON:
 *   { "email": "user@example.com", "mode": "email" | "link" }
 *
 * - mode "email": Supabase sends the invite email.
 * - mode "link":  returns a one-time invite action_link to copy.
 *
 * Auth: Authorization Bearer <user access token>
 * Only profiles.role = 'admin' may call this.
 * Uses the service_role key only on the server; never exposed to the client.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const INVITE_REDIRECT = "https://camos.uwon.workers.dev/welcome";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Body = {
  email?: string;
  mode?: "email" | "link";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: "Server is missing Supabase credentials." }, 500);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return json({ error: "Sign in required." }, 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return json({ error: "Invalid or expired session." }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("id, role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return json({ error: "Could not verify admin status." }, 500);
  }
  if (!profile || profile.role !== "admin") {
    return json({ error: "Only the CamOS admin can send invites." }, 403);
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Expected JSON body." }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const mode = body.mode === "link" ? "link" : "email";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "A valid email is required." }, 400);
  }

  if (mode === "link") {
    const { data, error } = await adminClient.auth.admin.generateLink({
      type: "invite",
      email,
      options: { redirectTo: INVITE_REDIRECT },
    });
    if (error) {
      return json({ error: error.message }, 400);
    }
    const actionLink =
      data?.properties?.action_link ??
      (data as { action_link?: string } | null)?.action_link ??
      null;
    if (!actionLink) {
      return json({ error: "Invite link was not returned." }, 500);
    }
    await adminClient.from("security_events").insert({
      owner_id: user.id,
      kind: "invite-link",
      detail: email,
    });
    return json({ ok: true, mode: "link", email, link: actionLink });
  }

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: INVITE_REDIRECT,
  });
  if (error) {
    return json({ error: error.message }, 400);
  }

  await adminClient.from("security_events").insert({
    owner_id: user.id,
    kind: "invite-email",
    detail: email,
  });

  return json({
    ok: true,
    mode: "email",
    email,
    userId: data?.user?.id ?? null,
  });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
