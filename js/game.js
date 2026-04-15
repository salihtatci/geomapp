/* =========================================================
   game.js
   Tek kelimelik tahmin modu:
   - Üstte: terimin tanımı (terimler.txt'ten)
   - Ortada: hedef kelimenin boş kutucukları
   - Altta: harf havuzu (kelimenin harfleri, karışık)
   ========================================================= */

const Game = (() => {
  let levels = [];
  let currentLevelIdx = 0;
  let currentLevel = null;
  let solved = false;
  let score = 0;
  let revealedPositions = new Set();
  let timerId = null;
  let timeLeft = 0;
  // Masaüstünde 6 sn, mobilde 15 sn
  const TIME_PER_WORD = 30;

  const $ = id => document.getElementById(id);
  const els = {};

  async function init() {
    els.clueText = $('clue-text');
    els.gridContainer = $('grid-container');
    els.levelNumber = $('level-number');
    els.scoreValue = $('score-value');
    els.btnNext = $('btn-next');
    els.timerBar = document.querySelector('.timer-bar');
    els.timerFill = $('timer-fill');
    els.timerText = $('timer-text');

    try {
      const res = await fetch('data/levels.json');
      const data = await res.json();
      levels = data.levels;
      // Seviyeleri karıştır - her oyun farklı sırada gelsin
      for (let i = levels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [levels[i], levels[j]] = [levels[j], levels[i]];
      }
    } catch (err) {
      Toast.show('Seviye verileri yüklenemedi');
      return;
    }
    loadLevel(0);
  }

  function loadLevel(idx) {
    if (idx >= levels.length) {
      Modal.show('Tebrikler! 🎉', `Tüm ${levels.length} seviyeyi tamamladın! Toplam puan: ${score}`, () => loadLevel(0));
      return;
    }
    currentLevelIdx = idx;
    currentLevel = levels[idx];
    solved = false;
    revealedPositions = new Set();

    els.levelNumber.textContent = currentLevelIdx + 1;
    els.clueText.textContent = currentLevel.meaning;
    els.btnNext.textContent = 'Atla →';
    els.btnNext.classList.remove('highlight');

    renderBoxes();
    const letters = shuffleArray([...currentLevel.word]);
    WordWheel.setLetters(letters);
    startTimer();
  }

  function startTimer() {
    stopTimer();
    timeLeft = TIME_PER_WORD * 10; // 0.1s çözünürlük
    updateTimerUI();
    timerId = setInterval(() => {
      timeLeft--;
      updateTimerUI();
      if (timeLeft <= 0) {
        stopTimer();
        onTimeUp();
      }
    }, 100);
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function updateTimerUI() {
    const seconds = Math.ceil(timeLeft / 10);
    const percent = (timeLeft / (TIME_PER_WORD * 10)) * 100;
    els.timerFill.style.width = percent + '%';
    els.timerText.textContent = seconds;
    if (seconds <= 2) els.timerBar.classList.add('danger');
    else els.timerBar.classList.remove('danger');
  }

  function onTimeUp() {
    // Süre bitti - puan sıfırlanır, sonraki kelimeye geç
    score = 0;
    els.scoreValue.textContent = score;
    Toast.show('⏱ Süre bitti! Puanın sıfırlandı');
    setTimeout(() => loadLevel(currentLevelIdx + 1), 1200);
  }

  function renderBoxes() {
    els.gridContainer.innerHTML = '';
    const word = currentLevel.word;
    els.gridContainer.style.gridTemplateColumns = `repeat(${word.length}, minmax(0, 1fr))`;
    for (let i = 0; i < word.length; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell hidden';
      cell.dataset.pos = i;
      cell.textContent = word[i];
      els.gridContainer.appendChild(cell);
    }
  }

  function updateCurrent(typed) {
    // Sürükleme sırasında kutucuklarda önizleme yok - boş kalsınlar
    return;
  }

  function submitWord(typed) {
    if (solved || !typed) return;
    if (typed === currentLevel.word) {
      solved = true;
      stopTimer();
      score += currentLevel.word.length * 10;
      els.scoreValue.textContent = score;
      const cells = els.gridContainer.querySelectorAll('.cell');
      cells.forEach((cell, i) => {
        cell.textContent = currentLevel.word[i];
        cell.classList.remove('hidden', 'typing');
        cell.classList.add('revealed');
      });
      Toast.show(`Doğru! +${currentLevel.word.length * 10} puan`);
      // Otomatik olarak sonraki kelimeye geç
      setTimeout(() => loadLevel(currentLevelIdx + 1), 1200);
    } else {
      // Yanlış - sadece kutuları kırmızı yanıp sönsün, kelimeyi gösterme
      const cells = els.gridContainer.querySelectorAll('.cell');
      cells.forEach((cell, i) => {
        if (revealedPositions.has(i)) return;
        cell.classList.add('wrong');
        setTimeout(() => {
          cell.classList.remove('wrong');
        }, 500);
      });
    }
  }

  function useHint() {
    if (solved) return;
    if (score < 10) { Toast.show('Yeterli puan yok (10 gerek)'); return; }
    const word = currentLevel.word;
    const hidden = [];
    for (let i = 0; i < word.length; i++) if (!revealedPositions.has(i)) hidden.push(i);
    if (hidden.length === 0) return;
    const pos = hidden[Math.floor(Math.random() * hidden.length)];
    revealedPositions.add(pos);
    score -= 10;
    els.scoreValue.textContent = score;
    const cell = els.gridContainer.querySelector(`.cell[data-pos="${pos}"]`);
    cell.textContent = word[pos];
    cell.classList.remove('hidden');
    cell.classList.add('revealed');
    Toast.show(`İpucu: "${word[pos]}"`);
  }

  function showDictionary() {
    Modal.show(currentLevel.display || currentLevel.word, currentLevel.meaning);
  }

  function nextLevel() {
    stopTimer();
    loadLevel(currentLevelIdx + 1);
  }

  function shuffle() { WordWheel.shuffle(); }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return { init, updateCurrent, submitWord, useHint, showDictionary, shuffle, nextLevel };
})();
