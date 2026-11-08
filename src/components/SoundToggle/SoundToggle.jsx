import { useState, useCallback, useRef } from 'react';
import './SoundToggle.css';

/**
 * SoundToggle — Mute/unmute toggle for firework sound effects.
 * Uses Web Audio API to generate synthetic firework burst sounds.
 * Muted by default to respect autoplay policies.
 */
function SoundToggle({ onBurstRef }) {
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef(null);

  // Initialize AudioContext on first unmute (user gesture required)
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  // Generate a synthetic firework burst sound
  const playBurstSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // White noise burst
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for crackle effect
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      filter.Q.value = 1;

      // Gain envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.4);
    } catch {
      // Silently fail if audio isn't available
    }
  }, [getAudioContext]);

  // Wire up the burst callback
  const handleToggle = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);

    if (!newMuted) {
      getAudioContext();
      if (onBurstRef) {
        onBurstRef.current = playBurstSound;
      }
    } else {
      if (onBurstRef) {
        onBurstRef.current = null;
      }
    }
  }, [muted, getAudioContext, playBurstSound, onBurstRef]);

  return (
    <button
      className="sound-toggle"
      onClick={handleToggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      )}
    </button>
  );
}

export default SoundToggle;
