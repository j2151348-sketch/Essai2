export async function onRequestPost({ request, env }) {
  const data = await request.json();
  const { email, password } = data;

  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).first();

  if (!user) {
    return new Response(JSON.stringify({ error: "Identifiants invalides" }), { status: 401 });
  }

  if (!user.validated) {
    return new Response(JSON.stringify({ error: "Compte non validé" }), { status: 403 });
  }

  return new Response(JSON.stringify({ message: "Connexion réussie", user }), {
    headers: { "Content-Type": "application/json" },
  });
}
