// Custom cursor
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

(function ani() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(ani);
})();

document.querySelectorAll('a, button, .proj-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '52px';
    ring.style.height = '52px';
    ring.style.borderColor = 'rgba(0,229,255,.7)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(0,229,255,.35)';
  });
});

// Scroll reveal — all animation classes
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('vis');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .slide-left, .slide-right, .slide-top, .slide-bottom').forEach(el => obs.observe(el));

// Typewriter effect in terminal
const phrases = ['git clone repo', 'php artisan serve', 'javac Main.java', 'npm run dev', 'adb logcat'];
let pi = 0, ci = 0, del = false;
const tel = document.getElementById('typed');

function type() {
  const p = phrases[pi];
  if (!del) {
    tel.textContent = p.slice(0, ++ci);
    if (ci === p.length) { del = true; setTimeout(type, 1400); return; }
  } else {
    tel.textContent = p.slice(0, --ci);
    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
  }
  setTimeout(type, del ? 50 : 90);
}
setTimeout(type, 800);

// Contact form → localStorage
function sendMsg() {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value.trim();
  const msg     = document.getElementById('f-msg').value.trim();
  const st      = document.getElementById('form-status');

  if (!name || !email || !msg) {
    st.innerHTML = '<span class="status-err">Please fill in all required fields.</span>';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    st.innerHTML = '<span class="status-err">Please enter a valid email address.</span>';
    return;
  }

  const msgs = JSON.parse(localStorage.getItem('al-fahad_msgs') || '[]');
  msgs.push({
    id: Date.now(),
    name,
    email,
    subject: subject || '(no subject)',
    message: msg,
    time: new Date().toISOString(),
    read: false
  });
  localStorage.setItem('al-fahad_msgs', JSON.stringify(msgs));

  st.innerHTML = '<span class="status-ok">✓ Message sent! I\'ll get back to you soon.</span>';
  document.getElementById('f-name').value    = '';
  document.getElementById('f-email').value   = '';
  document.getElementById('f-subject').value = '';
  document.getElementById('f-msg').value     = '';

  setTimeout(() => { st.textContent = ''; }, 5000);
}
