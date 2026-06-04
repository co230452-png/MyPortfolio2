let msgs = [];
let openId = null;

function load() {
  msgs = JSON.parse(localStorage.getItem('al-fahad_msgs') || '[]');
  msgs.sort((a, b) => b.id - a.id);
  render();
}

function render() {
  const list   = document.getElementById('msg-list');
  const empty  = document.getElementById('empty');
  const total  = document.getElementById('total-badge');
  const unread = document.getElementById('unread-badge');

  const unreadCount = msgs.filter(m => !m.read).length;
  total.textContent = msgs.length + ' total';

  if (unreadCount > 0) {
    unread.style.display = '';
    unread.textContent = unreadCount + ' unread';
  } else {
    unread.style.display = 'none';
  }

  if (msgs.length === 0) {
    empty.style.display = 'block';
    list.innerHTML = '';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = msgs.map(m => `
    <div class="msg-card ${m.read ? '' : 'unread'}" onclick="openMsg(${m.id})">
      ${!m.read ? '<div class="unread-dot"></div>' : ''}
      <div class="msg-top">
        <span class="msg-sender">${esc(m.name)}</span>
        <span class="msg-time">${fmtTime(m.time)}</span>
      </div>
      <div class="msg-subject">${esc(m.subject)}</div>
      <div class="msg-email">${esc(m.email)}</div>
      <div class="msg-preview">${esc(m.message)}</div>
    </div>
  `).join('');
}

function openMsg(id) {
  const m = msgs.find(x => x.id === id);
  if (!m) return;
  openId = id;

  // Mark as read
  m.read = true;
  localStorage.setItem('al-fahad_msgs', JSON.stringify(msgs));

  document.getElementById('modal-subject').textContent = m.subject;
  document.getElementById('modal-name').textContent    = m.name;
  document.getElementById('modal-email').textContent   = m.email;
  document.getElementById('modal-time').textContent    = new Date(m.time).toLocaleString();
  document.getElementById('modal-msg').textContent     = m.message;
  document.getElementById('modal-reply-btn').href =
    `mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}&body=Hi ${encodeURIComponent(m.name)},%0D%0A%0D%0A`;

  document.getElementById('modal-overlay').classList.add('open');
  render();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  openId = null;
}

function deleteMsg() {
  if (openId === null) return;
  msgs = msgs.filter(m => m.id !== openId);
  localStorage.setItem('al-fahad_msgs', JSON.stringify(msgs));
  closeModal();
  render();
}

function clearAll() {
  if (msgs.length === 0) return;
  if (confirm('Delete all messages? This cannot be undone.')) {
    localStorage.removeItem('al-fahad_msgs');
    msgs = [];
    render();
  }
}

document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtTime(iso) {
  const d    = new Date(iso);
  const now  = new Date();
  const diff = now - d;
  if (diff < 60000)    return 'Just now';
  if (diff < 3600000)  return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString();
}

load();
