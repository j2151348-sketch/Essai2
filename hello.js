export async function onRequest() {
  return new Response(JSON.stringify({ ok: true, ts: Date.now(), route: '/hello' }), {
    headers: { 'content-type': 'application/json' }
  });
}
