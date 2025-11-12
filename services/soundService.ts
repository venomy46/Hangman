let audioContext: AudioContext | null = null;

const createAudioContext = (): AudioContext | null => {
  if (audioContext) return audioContext;
  try {
    // Safari requires the webkit prefix
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioContext;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser");
    return null;
  }
};

export const playSound = (type: 'correct' | 'incorrect' | 'win' | 'lose') => {
  const ctx = createAudioContext();
  if (!ctx) return;

  // Browsers may suspend the AudioContext, it needs to be resumed on user interaction.
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Set initial volume and a quick fade-in to prevent clicks
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);

  switch (type) {
    case 'correct':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
      break;
    case 'incorrect':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.25);
      break;
    case 'win':
      oscillator.type = 'triangle';
      const winNotes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 arpeggio
      winNotes.forEach((freq, i) => {
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      });
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      break;
    case 'lose':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
      break;
  }

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 1); // Clean up the oscillator node
};
