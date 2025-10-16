export async function onRequestGet(context) {
  return new Response(JSON.stringify({ message: "Fonctions Cloudflare actives ✅" }), {
    headers: { "Content-Type": "application/json" },
  });
}
