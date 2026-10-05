const form = qs('#loginForm');
const passwordInput = qs('#password');
const errorMsg = qs('#errorMsg');
const accessBtn = qs('#accessBtn');
const togglePassword = qs('#togglePassword');
const ADMIN_HASH = 'fed17da66d03e6bc0c1c944b5064d7ae0378d339733dcefea51d3ca5e7d636aa';

if(sessionStorage.getItem('ferrn_admin') === '1'){
  location.replace('/vault.html');
}

async function sha256(value){
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

togglePassword.addEventListener('click', () => {
  const reveal = passwordInput.type === 'password';
  passwordInput.type = reveal ? 'text' : 'password';
  togglePassword.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  errorMsg.textContent = '';
  const password = passwordInput.value;
  if(!password){ passwordInput.focus(); return; }

  accessBtn.disabled = true;
  accessBtn.querySelector('span').textContent = 'Checking access';

  const hash = await sha256(password);
  if(hash === ADMIN_HASH){
    sessionStorage.setItem('ferrn_admin', '1');
    accessBtn.querySelector('span').textContent = 'Access granted';
    location.replace('/vault.html');
    return;
  }

  form.classList.remove('shake');
  void form.offsetWidth;
  form.classList.add('shake');
  errorMsg.innerHTML = '<span aria-hidden="true">×</span> Access denied. Check the password and try again.';
  passwordInput.select();
  accessBtn.disabled = false;
  accessBtn.querySelector('span').textContent = 'Login to admin';
});
