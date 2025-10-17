export const json = (obj, status = 200, headers = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });

export const methodNotAllowed = () => json({ error: "Method Not Allowed" }, 405);

// Hash SHA-256 avec sel (gratuit, compatible Workers)
export async function hashPassword(password, salt = crypto.randomUUID()) {
  const data = new TextEncoder().encode(password + "::" + salt);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
  return { hash: hex, salt };
}

export async function verifyPassword(password, salt, hash) {
  const { hash: h } = await hashPassword(password, salt);
  return h === hash;
}

// Petit helper de validation simple
export function required(body, fields) {
  for (const f of fields) {
    if (!body?.[f]) return `Champ manquant: ${f}`;
  }
  return null;
}
