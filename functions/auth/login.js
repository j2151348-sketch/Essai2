import { json, methodNotAllowed, required, verifyPassword } from "../_utils.js";

export async function onRequestPost({ request, env }) {
  if (request.method !== "POST") return methodNotAllowed();

  const body = await request.json().catch(() => ({}));
  const err = required(body, ["email", "password"]);
  if (err) return json({ error: err }, 400);

  const u = await env.DB.prepare(`
    SELECT id, name, surname, email, pass_hash, pass_salt, role, classe, validated
    FROM users WHERE email = ?
  `).bind(body.email).first();

  if (!u) return json({ error: "Identifiants invalides." }, 401);
  if (!u.validated) return json({ error: "Compte non validé par l’administrateur." }, 403);

  const ok = await verifyPassword(body.password, u.pass_salt, u.pass_hash);
  if (!ok) return json({ error: "Identifiants invalides." }, 401);

  // Pas de JWT ici pour aller au plus simple : on renvoie le profil
  const safe = { id: u.id, name: u.name, surname: u.surname, email: u.email, role: u.role, classe: u.classe };
  return json({ message: "Connexion réussie.", user: safe });
}
