export async function onRequestPost({ request, env }) {
  const data = await request.json();
  const { name, surname, email, password, role, classe } = data;

  // vérifie les champs
  if (!email || !password || !role) {
    return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
  }

  const users = env.DB.prepare(
    "INSERT INTO users (name, surname, email, password, role, classe, validated) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(name, surname, email, password, role, classe, 0);

  try {
    await users.run();
    return new Response(JSON.stringify({ message: "Inscription en attente de validation" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
