import { json, methodNotAllowed, required } from "../_utils.js";

/**
 * Valide / invalide un compte
 * POST body: { userId: number, validated: boolean }
 * Header requis: X-ADMIN-KEY = <ton secret>
 */
export async function onRequestPost({ request, env }) {
  if (request.method !== "POST") return methodNotAllowed();

  const key = request.headers.get("X-ADMIN-KEY");
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return json({ error: "Accès refusé." }, 401);

  const body = await request.json().catch(() => ({}));
  const err = required(body, ["userId", "validated"]);
  if (err) return json({ error: err }, 400);

  await env.DB.prepare("UPDATE users SET validated = ? WHERE id = ?")
    .bind(body.validated ? 1 : 0, body.userId)
    .run();

  return json({ message: "Compte mis à jour." });
}
