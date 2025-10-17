// Petite aide pour afficher un message
function show(el, txt, ok=false){
  el.style.display = 'block';
  el.className = 'msg ' + (ok ? 'ok':'err');
  el.textContent = txt;
}

const loginForm = document.querySelector('#loginForm');
const loginMsg  = document.querySelector('#loginMsg');
const regForm   = document.querySelector('#registerForm');
const regMsg    = document.querySelector('#regMsg');

// ---------- LOGIN ----------
loginForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  loginMsg.style.display='none';

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;          // <- name="password" obligatoire

  try{
    const r = await fetch('/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });

    const data = await r.json().catch(()=>({}));
    if(!r.ok){
      show(loginMsg, data.error || `Erreur ${r.status}`, false);
      return;
    }
    show(loginMsg, 'Connexion réussie. Redirection…', true);
    // exemple : aller sur /admin.html si role admin, ou tableau de bord plus tard
    setTimeout(()=>{ location.href = '/admin.html'; }, 800);
  }catch(err){
    show(loginMsg, 'Réseau indisponible', false);
  }
});

// ---------- REGISTER ----------
regForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  regMsg.style.display='none';

  const payload = {
    name:     regForm.name.value.trim(),
    surname:  regForm.surname.value.trim(),
    role:     regForm.role.value,
    classe:   regForm.classe.value.trim(),
    email:    regForm.email.value.trim(),
    password: regForm.password.value                // <- name="password" obligatoire
  };

  try{
    const r = await fetch('/auth/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(()=>({}));
    if(!r.ok){
      show(regMsg, data.error || `Erreur ${r.status}`, false);
      return;
    }
    show(regMsg, 'Demande envoyée. Vérifiez vos e-mails, puis attendez la validation.', true);
    regForm.reset();
  }catch(err){
    show(regMsg, 'Réseau indisponible', false);
  }
});

// ---------- NAV simple Accueil/Admin (sur une page) ----------
document.querySelector('#gotoAdmin')?.addEventListener('click',(e)=>{
  e.preventDefault();
  document.querySelector('#home').style.display='none';
  document.querySelector('#admin').style.display='block';
});

document.querySelector('#gotoHome')?.addEventListener('click',(e)=>{
  e.preventDefault();
  document.querySelector('#admin').style.display='none';
  document.querySelector('#home').style.display='block';
});

// ---------- Portillon admin avec header x-admin-key ----------
const adminGate = document.querySelector('#adminGate');
const adminMsg  = document.querySelector('#adminMsg');
const adminPanel= document.querySelector('#adminPanel');
const pendingUl = document.querySelector('#pendingList');

adminGate?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  adminMsg.style.display='none';
  try{
    // on envoie le code dans un header ; la Function le compare à env.ADMIN_KEY
    const key = document.querySelector('#adminCode').value;
    const r = await fetch('/admin/list', { headers:{ 'x-admin-key': key } });
    const data = await r.json().catch(()=>({}));

    if(!r.ok){
      show(adminMsg, data.error || `Accès refusé (${r.status})`, false);
      return;
    }

    // ok, on affiche la liste
    adminPanel.style.display = 'block';
    pendingUl.innerHTML = '';
    (data.pending || []).forEach(u=>{
      const li = document.createElement('li');
      li.textContent = `${u.id} – ${u.surname} ${u.name} <${u.email}> (${u.role}${u.classe? ' / '+u.classe : ''})`;
      const btn = document.createElement('button');
      btn.textContent = 'Valider';
      btn.style.marginLeft = '8px';
      btn.addEventListener('click', async ()=>{
        const res = await fetch('/admin/validate', {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'x-admin-key': key
          },
          body: JSON.stringify({ user_id: u.id, can_edit: 1, scope: 'documents' })
        });
        if(res.ok){ li.remove(); }
      });
      li.appendChild(btn);
      pendingUl.appendChild(li);
    });
    show(adminMsg, 'Accès admin accordé.', true);
  }catch(err){
    show(adminMsg, 'Réseau indisponible', false);
  }
});
