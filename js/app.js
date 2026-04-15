/* =========================================================
   app.js
   Uygulama önyüklemesi: ekran geçişleri, butonlar,
   modal ve toast yardımcıları.
   ========================================================= */

// ---- Modal yardımcısı ----
const Modal = (() => {
  const el = document.getElementById('modal');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  let onClose = null;

  function show(title, body, callback = null) {
    titleEl.textContent = title;
    bodyEl.textContent = body;
    onClose = callback;
    el.classList.remove('hidden');
  }
  function hide() {
    el.classList.add('hidden');
    if (onClose) { onClose(); onClose = null; }
  }
  closeBtn.addEventListener('click', hide);
  el.addEventListener('click', e => { if (e.target === el) hide(); });

  return { show, hide };
})();

// ---- Toast yardımcısı ----
const Toast = (() => {
  const el = document.getElementById('toast');
  let timer = null;
  function show(msg, duration = 1500) {
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), duration);
  }
  return { show };
})();

// ---- Ekran geçişleri ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ---- Bootstrap ----
document.addEventListener('DOMContentLoaded', () => {
  // Word wheel'i başlat
  WordWheel.init(
    document.getElementById('word-wheel'),
    document.getElementById('wheel-lines'),
    {
      onUpdate: word => Game.updateCurrent(word),
      onSubmit: word => Game.submitWord(word)
    }
  );

  // Ana ekran -> oyun
  document.getElementById('btn-start').addEventListener('click', async () => {
    showScreen('game-screen');
    await Game.init();
  });

  // Oyun -> ana ekran
  document.getElementById('btn-back').addEventListener('click', () => {
    showScreen('home-screen');
  });

  // Aksiyon butonları
  document.getElementById('btn-shuffle').addEventListener('click', () => Game.shuffle());
  document.getElementById('btn-hint').addEventListener('click', () => Game.useHint());
  document.getElementById('btn-dictionary').addEventListener('click', () => Game.showDictionary());
  document.getElementById('btn-next').addEventListener('click', () => Game.nextLevel());
});
