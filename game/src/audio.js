// Tiny WebAudio sound engine: no audio files, every sound is synthesized.
// All sounds are short and quiet; nothing plays until the player interacts.
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  unlock() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
  }

  tone(freq, start, dur, type = 'sine', vol = 0.08) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  found() {
    this.tone(880, 0, 0.16);
    this.tone(1318.5, 0.09, 0.22);
  }

  wrong() {
    this.tone(160, 0, 0.18, 'sawtooth', 0.05);
  }

  hint() {
    this.tone(1174.7, 0, 0.12);
  }

  roundClear() {
    this.tone(523.25, 0, 0.14);
    this.tone(659.25, 0.12, 0.14);
    this.tone(783.99, 0.24, 0.2);
    this.tone(1046.5, 0.36, 0.3);
  }

  victory() {
    const seq = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    seq.forEach((f, i) => this.tone(f, i * 0.13, 0.22));
  }
}
