import { json, methodNotAllowed, required, hashPassword } from "../_utils.js";

export async function onRequestPost({ request, env }) {
  if (request.method !== "POST") return methodNotAllowed();

  const body = await request.json().catch(() => ({}));
  const err = required(body, ["name", "surname", "email", "password", "role"]);
  if (err) return json({ error: err }, 400);

  const role = body.role === "prof" || body.role === "personnel" ? body.role : "prof";
  const classe = body.classe ?? null;

  // déjà existant ?
  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(body.email).first();
  if (exists) return json({ error: "Un compte existe déjà avec cet e-mail." }, 409);

  const { hash, salt } = await hashPassword(body.password);

  await env.DB.prepare(`
    INSERT INTO users (name, surname, email, pass_hash, pass_salt, role, classe, validated, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))
  `).bind(body.name, body.surname, body.email, hash, salt, role, classe).run();

  // Ici tu reçois déjà les formulaires via ton système — on renvoie un message propre au site
  return json({ message: "Inscription enregistrée. Validation par l’administrateur requise." }, 201);
}
