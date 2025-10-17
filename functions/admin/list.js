import { json } from "../_utils.js";

/**
 * Liste les comptes en attente + validés (accès admin via ADMIN_KEY)
 * GET /admin/list?status=pending|all|validated
 */
export async function onRequestGet({ request, env }) {
  const key = request.headers.get("X-ADMIN-KEY");
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return json({ error: "Accès refusé." }, 401);

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "pending";

  let query = "SELECT id, name, surname, email, role, classe, validated FROM users";
  if (status === "pending") query += " WHERE validated = 0";
  if (status === "validated") query += " WHERE validated = 1";
  query += " ORDER BY created_at DESC";

  const { results } = await env.DB.prepare(query).all();
  return json({ users: results ?? [] });
}
