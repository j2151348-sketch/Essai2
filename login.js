export const onRequestPost = async ({ request }) => {
  const data = await request.json().catch(()=>({}));
  const { email, password } = data;
  const ok = Boolean(email && password);
  return new Response(JSON.stringify({ ok, email: email || null, note: 'Route /auth/login OK (démo, sans D1).' }), {
    headers: { 'content-type': 'application/json' }
  });
};
