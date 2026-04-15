/* =========================================================
   wordwheel.js
   Dairesel harf seçici. Mouse ve dokunmatik girdilerini
   destekler. Seçilen harf dizisini callback ile bildirir.
   ========================================================= */

const WordWheel = (() => {
  let wheelEl, linesEl;
  let letters = [];
  let letterEls = [];
  let selected = []; // index dizisi
  let isDragging = false;
  let onUpdate = null;
  let onSubmit = null;

  /**
   * Wheel'i başlat.
   * @param {HTMLElement} wheelElement - .word-wheel container
   * @param {SVGElement} linesElement  - bağlantı çizgileri için svg
   * @param {Object} callbacks         - { onUpdate, onSubmit }
   */
  function init(wheelElement, linesElement, callbacks) {
    wheelEl = wheelElement;
    linesEl = linesElement;
    onUpdate = callbacks.onUpdate || (() => {});
    onSubmit = callbacks.onSubmit || (() => {});

    // Pointer event'leri (mouse + touch unified)
    wheelEl.addEventListener('pointerdown', handleDown);
    wheelEl.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  }

  /**
   * Wheel'e harfleri yükle.
   * @param {string[]} newLetters
   */
  function setLetters(newLetters) {
    letters = [...newLetters];
    render();
    clearSelection();
  }

  /**
   * Harfleri rastgele karıştır.
   */
  function shuffle() {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    render();
    clearSelection();
  }

  /**
   * Harfleri DOM'a yerleştir (dairesel).
   */
  function render() {
    wheelEl.innerHTML = '';
    letterEls = [];
    const count = letters.length;
    const radius = wheelEl.offsetWidth * 0.36; // dairenin merkezinden harf ortasına
    const cx = wheelEl.offsetWidth / 2;
    const cy = wheelEl.offsetHeight / 2;

    letters.forEach((ch, i) => {
      // -90 derece ile en üstten başlat
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      const el = document.createElement('div');
      el.className = 'letter';
      el.textContent = ch;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.dataset.index = i;
      el.dataset.letter = ch;
      wheelEl.appendChild(el);
      letterEls.push(el);
    });

    // SVG çizgi katmanını wheel boyutuna ayarla
    linesEl.setAttribute('viewBox', `0 0 ${wheelEl.offsetWidth} ${wheelEl.offsetHeight}`);
  }

  /**
   * Pointer aşağı: seçim başlat.
   */
  function handleDown(e) {
    isDragging = true;
    selected = [];
    const idx = pickLetter(e);
    if (idx !== -1) addToSelection(idx);
    e.preventDefault();
  }

  /**
   * Pointer hareket: harf üzerinden geçilirse seçime ekle.
   */
  function handleMove(e) {
    if (!isDragging) return;
    const idx = pickLetter(e);
    if (idx === -1) return;
    // Geri alma: önceki harfe dönersen son seçimi kaldır
    if (selected.length >= 2 && idx === selected[selected.length - 2]) {
      const removed = selected.pop();
      letterEls[removed].classList.remove('selected');
      drawLines();
      onUpdate(selected.map(i => letters[i]).join(''));
      return;
    }
    // Yeni harf ekle
    if (!selected.includes(idx)) {
      addToSelection(idx);
    }
    e.preventDefault();
  }

  /**
   * Pointer yukarı: seçim sonu, kelime gönder.
   */
  function handleUp() {
    if (!isDragging) return;
    isDragging = false;
    if (selected.length > 0) {
      const word = selected.map(i => letters[i]).join('');
      onSubmit(word);
    }
    setTimeout(clearSelection, 250);
  }

  /**
   * Pointer pozisyonundaki harfin index'ini bul (yarıçap toleransı ile).
   */
  function pickLetter(e) {
    const rect = wheelEl.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    for (let i = 0; i < letterEls.length; i++) {
      const el = letterEls[i];
      const lx = parseFloat(el.style.left);
      const ly = parseFloat(el.style.top);
      const dx = px - lx;
      const dy = py - ly;
      if (Math.sqrt(dx * dx + dy * dy) < el.offsetWidth / 2 +12) {
        return i;
      }
    }
    return -1;
  }

  function addToSelection(idx) {
    selected.push(idx);
    letterEls[idx].classList.add('selected');
    drawLines();
    onUpdate(selected.map(i => letters[i]).join(''));
  }

  function clearSelection() {
    selected = [];
    letterEls.forEach(el => el.classList.remove('selected'));
    linesEl.innerHTML = '';
    onUpdate('');
  }

  /**
   * Seçilen harfler arasında SVG çizgi çiz.
   */
  function drawLines() {
    linesEl.innerHTML = '';
    if (selected.length < 2) return;
    let path = '';
    selected.forEach((idx, i) => {
      const el = letterEls[idx];
      const x = parseFloat(el.style.left);
      const y = parseFloat(el.style.top);
      path += (i === 0 ? 'M' : 'L') + x + ',' + y + ' ';
    });
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', path);
    line.setAttribute('stroke', '#ffcf5c');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    line.setAttribute('fill', 'none');
    line.setAttribute('opacity', '0.85');
    linesEl.appendChild(line);
  }

  return { init, setLetters, shuffle };
})();
