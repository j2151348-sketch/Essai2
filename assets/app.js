const $ = (s)=>document.querySelector(s);
const log = (el,msg,ok=false)=>{ el.textContent = msg || ''; el.className = ok ? 'log ok':'log err'; };

$('#btnLogin')?.addEventListener('click', async ()=>{
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPass').value;
  const el = $('#loginLog');
  el.textContent = 'Connexion…';
  try{
    const r = await fetch('/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const d = await r.json();
    if(!r.ok) return log(el,d.error||'Erreur');
    log(el, 'Connecté : ' + d.user.name + ' ' + d.user.surname, true);
  }catch(e){ log(el, e.message); }
});

$('#btnRegister')?.addEventListener('click', async ()=>{
  const name = $('#regName').value.trim();
  const surname = $('#regSurname').value.trim();
  const email = $('#regEmail').value.trim();
  const password = $('#regPass').value;
  const role = $('#regRole').value;
  const classe = $('#regClasse').value.trim();
  const el = $('#regLog');
  el.textContent = 'Envoi…';
  try{
    const r = await fetch('/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,surname,email,password,role,classe})});
    const d = await r.json();
    if(!r.ok) return log(el,d.error||'Erreur');
    log(el,d.message,true);
  }catch(e){ log(el, e.message); }
});
