const $ = sel => document.querySelector(sel);

async function call(url, opts={}){
  try{
    const res = await fetch(url, {credentials:'include', ...opts});
    const text = await res.text();
    return `${res.status} ${res.statusText}\n` + text;
  }catch(e){
    return 'ERREUR: ' + e.message;
  }
}

document.getElementById('ping').addEventListener('click', async ()=>{
  document.getElementById('pingLog').textContent = 'Appel en cours…';
  document.getElementById('pingLog').textContent = await call('/hello');
});

document.getElementById('login').addEventListener('click', async ()=>{
  const body = JSON.stringify({email: document.getElementById('email').value, password: document.getElementById('pass').value});
  document.getElementById('loginLog').textContent = 'Appel en cours…';
  document.getElementById('loginLog').textContent = await call('/auth/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body
  });
});
