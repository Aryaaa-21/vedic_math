import { useStore } from "@/store/useStore";

/**
 * Synthesizes high-fidelity sound feedback using native Web Audio API
 * without requiring any external mp3 files.
 */
export const playAudioFeedback = (isCorrect: boolean) => {
  if (typeof window === "undefined") return;

  const { audioEnabled } = useStore.getState();
  if (!audioEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    
    if (isCorrect) {
      // High-pitched pleasant success chime (two rapid notes)
      const playNote = (freq: number, startOffset: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startOffset);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startOffset + duration - 0.01);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + startOffset);
        osc.stop(audioCtx.currentTime + startOffset + duration);
      };
      
      playNote(523.25, 0, 0.15); // C5
      playNote(659.25, 0.08, 0.25); // E5
    } else {
      // Low dull error buzz
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, audioCtx.currentTime); // Low A2
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (err) {
    console.warn("Web Audio API not supported or blocked by browser policy:", err);
  }
};

/**
 * Triggers tactile vibration using Web Vibration API if supported by the client device.
 */
export const triggerVibrationFeedback = (isCorrect: boolean) => {
  if (typeof window === "undefined" || !navigator.vibrate) return;

  const { vibrationEnabled } = useStore.getState();
  if (!vibrationEnabled) return;

  if (!isCorrect) {
    // Single short buzz for validation error
    navigator.vibrate(150);
  }
};
