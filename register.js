export const onRequestPost = async ({ request }) => {
  const data = await request.json().catch(()=>({}));
  return new Response(JSON.stringify({ ok: true, received: data || null, note: 'Route /auth/register OK (démo).' }), {
    headers: { 'content-type': 'application/json' }
  });
};
