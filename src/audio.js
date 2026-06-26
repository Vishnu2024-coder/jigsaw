let audioContext;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone({ frequency, type = "sine", duration = 0.15, volume = 0.12 }) {
  const context = getAudioContext();
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function playSound(name, muted = false) {
  if (muted) return;

  if (name === "pick") playTone({ frequency: 420, type: "triangle", duration: 0.09, volume: 0.08 });
  if (name === "drop") playTone({ frequency: 220, type: "sine", duration: 0.11, volume: 0.07 });
  if (name === "correct") playTone({ frequency: 660, type: "triangle", duration: 0.18, volume: 0.12 });

  if (name === "victory") {
    [523, 659, 784, 1046].forEach((frequency, index) => {
      window.setTimeout(() => playTone({ frequency, type: "triangle", duration: 0.28, volume: 0.12 }), index * 120);
    });
  }
}

export function playMusicTick(muted = false) {
  if (muted) return;
  const notes = [196, 246, 293, 392];
  const frequency = notes[Math.floor(Date.now() / 800) % notes.length];
  playTone({ frequency, type: "sine", duration: 0.35, volume: 0.025 });
}
