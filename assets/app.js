async function postJSON(url, data){
  const r = await fetch(url, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  const txt = await r.text();
  let json;
  try{ json = JSON.parse(txt) }catch{ json = {ok:false, error:txt} }
  return { ok: r.ok && json.ok !== false, status:r.status, data:json };
}

document.getElementById('loginForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = 'Connexion en cours…'; msg.className='msg';
  if(!email || !pass){ msg.textContent='Remplis e-mail et mot de passe.'; msg.className='msg err'; return; }
  const res = await postJSON('/auth/login', { email, password: pass });
  if(res.ok){
    msg.textContent = 'Connecté. Redirection…'; msg.className='msg ok';
    location.href = '/admin.html';
  }else{
    msg.textContent = res.data?.error || 'Échec de connexion';
    msg.className='msg err';
  }
});

document.getElementById('regForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = {
    name:   document.getElementById('regNom').value.trim(),
    surname:document.getElementById('regPrenom').value.trim(),
    role:   document.getElementById('regRole').value,
    classe: document.getElementById('regClasse').value.trim(),
    email:  document.getElementById('regEmail').value.trim(),
    password: document.getElementById('regPass').value
  };
  const msg = document.getElementById('regMsg');
  msg.textContent = 'Envoi…'; msg.className='msg';
  if(!data.name || !data.surname || !data.email || !data.password){
    msg.textContent='Tous les champs obligatoires doivent être remplis.';
    msg.className='msg err'; return;
  }
  const res = await postJSON('/auth/register', data);
  if(res.ok){
    msg.textContent = 'Inscription envoyée. Un admin doit valider.';
    msg.className='msg ok';
    e.target.reset();
  }else{
    msg.textContent = res.data?.error || 'Échec de l’inscription';
    msg.className='msg err';
  }
});
