// Game state, input, timer, hints and scoring for Lantern Garden. The two
// panels are drawn from the same scene painter (scenes.js): the left canvas
// paints variant 0, the right canvas variant 1. Markers, hint pulses and
// wrong-click flashes are drawn on top of both panels.
import { ROUNDS } from './scenes.js';
import { SoundEngine } from './audio.js';

const WRONG_PENALTY_SEC = 5;
const FIND_POINTS = 100;

export class Game {
  constructor(doc) {
    this.doc = doc;
    this.left = doc.getElementById('left');
    this.right = doc.getElementById('right');
    this.lctx = this.left.getContext('2d');
    this.rctx = this.right.getContext('2d');
    this.roundLabel = doc.getElementById('roundLabel');
    this.counterEl = doc.getElementById('counter');
    this.timerEl = doc.getElementById('timer');
    this.scoreEl = doc.getElementById('score');
    this.hintBtn = doc.getElementById('hintBtn');
    this.soundBtn = doc.getElementById('soundBtn');
    this.messageEl = doc.getElementById('message');
    this.progressEl = doc.getElementById('progress');
    this.overlay = doc.getElementById('overlay');
    this.overlayCard = doc.getElementById('overlayCard');
    this.sound = new SoundEngine();

    this.state = 'title';
    this.roundIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.timeLeft = ROUNDS[0].timeLimit;
    this.hintsLeft = 3;
    this.wrongFlash = null; // {x, y, until}
    this.hintPulse = null; // {index, until}
    this.lastTick = 0;
    this.timerId = null;

    this.left.addEventListener('click', (e) => this.onPanelClick(e, 0));
    this.right.addEventListener('click', (e) => this.onPanelClick(e, 1));
    this.hintBtn.addEventListener('click', () => this.useHint());
    this.soundBtn.addEventListener('click', () => this.toggleSound());
    doc.addEventListener('keydown', (e) => {
      if ((e.key === 'h' || e.key === 'H') && this.state === 'play') this.useHint();
    });
  }

  round() {
    return ROUNDS[this.roundIndex];
  }

  start() {
    this.score = 0;
    this.startRound(0);
  }

  startRound(index) {
    this.roundIndex = index;
    this.found = new Set();
    this.hintsLeft = 3;
    this.timeLeft = this.round().timeLimit;
    this.wrongFlash = null;
    this.hintPulse = null;
    this.state = 'play';
    this.hideOverlay();
    this.setMessage(this.round().message);
    this.updateHud();
    this.startTimer();
    this.draw();
  }

  startTimer() {
    this.stopTimer();
    this.lastTick = performance.now();
    this.timerId = window.setInterval(() => this.tick(), 250);
  }

  stopTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  tick() {
    if (this.state !== 'play') return;
    const now = performance.now();
    const elapsed = (now - this.lastTick) / 1000;
    this.lastTick = now;
    this.timeLeft -= elapsed;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.updateHud();
      this.gameOver();
      return;
    }
    this.updateHud();
  }

  onPanelClick(event, panel) {
    this.sound.unlock();
    if (this.state !== 'play') return;
    const canvas = panel === 0 ? this.left : this.right;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const diffs = this.round().diffs;
    let best = -1;
    let bestDist = Infinity;
    diffs.forEach((d, i) => {
      if (this.found.has(i)) return;
      const dist = Math.hypot(d.x - x, d.y - y);
      if (dist < d.r + 10 && dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    });
    if (best >= 0) {
      this.found.add(best);
      this.score += FIND_POINTS;
      this.sound.found();
      const left = diffs.length - this.found.size;
      this.setMessage(
        left === 0
          ? 'That was the last one — beautiful eyes!'
          : `Found it! ${left} more ${left === 1 ? 'hides' : 'hide'} in this scene.`,
      );
      this.updateHud();
      this.draw();
      if (this.found.size === diffs.length) this.roundClear();
    } else {
      this.wrongFlash = { x, y, until: performance.now() + 450 };
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_PENALTY_SEC);
      this.sound.wrong();
      this.setMessage(`Nothing different there — ${WRONG_PENALTY_SEC} seconds drift away.`);
      this.updateHud();
      this.draw();
      window.setTimeout(() => this.draw(), 500);
    }
  }

  useHint() {
    if (this.state !== 'play') return;
    this.sound.unlock();
    if (this.hintsLeft <= 0) {
      this.setMessage('No hints left in this round — trust your eyes.');
      return;
    }
    const remaining = this.round().diffs.map((d, i) => i).filter((i) => !this.found.has(i));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.hintPulse = { index: pick, until: performance.now() + 2000 };
    this.sound.hint();
    this.setMessage(`Hint: ${this.round().diffs[pick].hint}`);
    this.updateHud();
    this.draw();
    window.setTimeout(() => this.draw(), 2100);
  }

  toggleSound() {
    this.sound.enabled = !this.sound.enabled;
    this.soundBtn.textContent = this.sound.enabled ? 'Sound: on' : 'Sound: off';
  }

  roundClear() {
    this.stopTimer();
    const bonus = Math.round(this.timeLeft) * 2;
    this.score += bonus;
    this.sound.roundClear();
    this.state = 'roundClear';
    const last = this.roundIndex === ROUNDS.length - 1;
    this.updateHud();
    this.showOverlay(
      `<h2>${last ? 'The garden is yours!' : 'Round clear!'}</h2>` +
        `<p class="big">All ${this.round().diffs.length} differences found.</p>` +
        `<p>Time bonus: +${bonus} points &nbsp;·&nbsp; Total score: ${this.score}</p>` +
        `<p>${last ? 'Three scenes, every difference found. The lanterns burn for you tonight.' : 'The next scene waits — sharper eyes needed.'}</p>` +
        `<button type="button" id="overlayBtn">${last ? 'See the celebration' : 'Next round'}</button>`,
    );
    this.doc.getElementById('overlayBtn').addEventListener('click', () => {
      this.sound.unlock();
      if (last) this.victory();
      else this.startRound(this.roundIndex + 1);
    });
  }

  victory() {
    this.state = 'victory';
    this.sound.victory();
    const stars = this.score >= 2600 ? 3 : this.score >= 2100 ? 2 : 1;
    this.showOverlay(
      `<h2>&#127878; Lantern Garden complete!</h2>` +
        `<p class="big">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</p>` +
        `<p class="big">Final score: ${this.score}</p>` +
        `<p>You found all ${ROUNDS.reduce((n, r) => n + r.diffs.length, 0)} hidden differences across three original scenes — dusk garden, morning harbor, starlit picnic.</p>` +
        `<button type="button" id="overlayBtn">Play again</button>`,
    );
    this.doc.getElementById('overlayBtn').addEventListener('click', () => {
      this.sound.unlock();
      this.start();
    });
  }

  gameOver() {
    this.stopTimer();
    this.state = 'gameOver';
    this.sound.wrong();
    const foundCount = this.found.size;
    const total = this.round().diffs.length;
    this.showOverlay(
      `<h2>Out of time</h2>` +
        `<p class="big">You found ${foundCount} of ${total} differences.</p>` +
        `<p>The lanterns burned down before the last ${total - foundCount} ${total - foundCount === 1 ? 'difference' : 'differences'} surfaced. The scene keeps its secrets — for now.</p>` +
        `<button type="button" id="overlayBtn">Try this round again</button>`,
    );
    this.doc.getElementById('overlayBtn').addEventListener('click', () => {
      this.sound.unlock();
      this.startRound(this.roundIndex);
    });
  }

  showTitle() {
    this.state = 'title';
    this.roundIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.timeLeft = ROUNDS[0].timeLimit;
    this.hintsLeft = 3;
    this.updateHud();
    this.draw();
    this.showOverlay(
      `<h2>&#127878; Lantern Garden</h2>` +
        `<p class="big">Spot the Difference</p>` +
        `<p>Two pictures hang side by side — almost the same. Find every difference before the timer runs out: click it on either picture and a golden ring marks it.</p>` +
        `<p>Three scenes · 23 differences · hints on <b>H</b> · a wrong click costs 5 seconds.</p>` +
        `<button type="button" id="overlayBtn">Light the lanterns</button>`,
    );
    this.doc.getElementById('overlayBtn').addEventListener('click', () => {
      this.sound.unlock();
      this.start();
    });
  }

  showOverlay(html) {
    this.overlayCard.innerHTML = html;
    this.overlay.classList.add('show');
  }

  hideOverlay() {
    this.overlay.classList.remove('show');
    this.overlayCard.innerHTML = '';
  }

  setMessage(msg) {
    this.messageEl.textContent = msg;
  }

  formatTime(sec) {
    const s = Math.max(0, Math.ceil(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  updateHud() {
    const r = this.round();
    this.roundLabel.textContent = r.name;
    this.counterEl.innerHTML = `Found <b>${this.found.size}</b> · ${r.diffs.length - this.found.size} to go`;
    this.timerEl.innerHTML = `&#9201; <b>${this.formatTime(this.timeLeft)}</b>`;
    this.timerEl.classList.toggle('low', this.timeLeft <= 30 && this.state === 'play');
    this.scoreEl.innerHTML = `Score <b>${this.score}</b>`;
    this.hintBtn.textContent = `Hint (${this.hintsLeft})`;
    this.hintBtn.disabled = this.state !== 'play' || this.hintsLeft <= 0;
    this.progressEl.innerHTML = ROUNDS.map((round, i) => {
      const cls = i < this.roundIndex ? 'done' : i === this.roundIndex ? 'now' : '';
      return `<span><span class="dot ${cls}"></span>${round.short}</span>`;
    }).join('<span> &nbsp;·&nbsp; </span>');
  }

  drawMarker(ctx, d) {
    ctx.strokeStyle = '#7ee787';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(126, 231, 135, 0.35)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#7ee787';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(d.x - 8, d.y);
    ctx.lineTo(d.x - 2, d.y + 7);
    ctx.lineTo(d.x + 9, d.y - 7);
    ctx.stroke();
  }

  draw() {
    const r = this.round();
    r.paint(this.lctx, 600, 600, 0);
    r.paint(this.rctx, 600, 600, 1);
    const now = performance.now();
    for (const i of this.found) {
      this.drawMarker(this.lctx, r.diffs[i]);
      this.drawMarker(this.rctx, r.diffs[i]);
    }
    if (this.hintPulse && now < this.hintPulse.until) {
      const d = r.diffs[this.hintPulse.index];
      const pulse = 1 + 0.25 * Math.sin(now / 120);
      for (const ctx of [this.lctx, this.rctx]) {
        ctx.strokeStyle = '#ffd23e';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(d.x, d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    if (this.wrongFlash && now < this.wrongFlash.until) {
      for (const ctx of [this.lctx, this.rctx]) {
        ctx.strokeStyle = '#ff7a6b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.wrongFlash.x - 9, this.wrongFlash.y - 9);
        ctx.lineTo(this.wrongFlash.x + 9, this.wrongFlash.y + 9);
        ctx.moveTo(this.wrongFlash.x + 9, this.wrongFlash.y - 9);
        ctx.lineTo(this.wrongFlash.x - 9, this.wrongFlash.y + 9);
        ctx.stroke();
      }
    }
  }
}
