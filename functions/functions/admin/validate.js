export async function onRequestPost({ request, env }) {
  const data = await request.json();
  const { userId, validated } = data;

  try {
    await env.DB.prepare("UPDATE users SET validated = ? WHERE id = ?")
      .bind(validated ? 1 : 0, userId)
      .run();

    return new Response(JSON.stringify({ message: "Compte mis à jour" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
