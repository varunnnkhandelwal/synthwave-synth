'use client';

import { useEffect, useRef } from 'react';
import { AudioEngine } from '@/audio/engine';
import { RecordingState, PlaybackState } from '@/types';

interface RadialVisualizerProps {
  engineRef: React.RefObject<AudioEngine | null>;
  activeNote: string | null;
  recordingState: RecordingState;
  playbackState: PlaybackState;
}

const NUM_BARS = 72;
const CENTER = 150;
const BAR_INNER = 56;
const BAR_MAX_LEN = 70;

export default function RadialVisualizer({
  engineRef, activeNote, recordingState, playbackState,
}: RadialVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bars = useRef<Float32Array>(new Float32Array(NUM_BARS).fill(0.05) as Float32Array);
  const energy = useRef(0);
  const rafId = useRef<number>(0);
  const idleTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stateRef = useRef({ recordingState, playbackState });

  // Keep stateRef in sync without restarting the draw loop
  useEffect(() => { stateRef.current = { recordingState, playbackState }; }, [recordingState, playbackState]);

  useEffect(() => {
    if (activeNote) {
      energy.current = 1;
      for (let i = 0; i < NUM_BARS; i++) {
        bars.current[i] = 0.5 + Math.random() * 0.5;
      }
    }
  }, [activeNote]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Subtle idle breathing — keeps bars alive at rest without fake spikes
    idleTimer.current = setInterval(() => {
      for (let i = 0; i < NUM_BARS; i++) {
        bars.current[i] = Math.max(0.01, Math.min(0.08, bars.current[i] + (Math.random() - 0.5) * 0.01));
      }
    }, 900);

    function draw() {
      ctx.clearRect(0, 0, 300, 300);

      const analyser = engineRef.current?.analyser;
      if (analyser) {
        const fft = analyser.getValue() as Float32Array;
        const usable = Math.floor(fft.length * 0.5);
        const logMin = Math.log2(1);
        const logMax = Math.log2(usable);
        const half = NUM_BARS / 2; // 36

        for (let i = 0; i < NUM_BARS; i++) {
          // Mirror: both halves run low→high so the full circle reacts uniformly
          const fi = i < half ? i : NUM_BARS - 1 - i;
          const t = fi / (half - 1);
          const binIdx = Math.min(usable - 1, Math.round(Math.pow(2, logMin + t * (logMax - logMin))));
          const db = fft[binIdx] as number;
          const normalized = Math.max(0, Math.min(1, (db + 70) / 55));
          bars.current[i] += (Math.max(0.01, normalized) - bars.current[i]) * 0.22;
        }
      }

      energy.current *= 0.985;
      const e = energy.current;

      const { recordingState: rs, playbackState: ps } = stateRef.current;
      // LED color: red when recording (intensified), green when playing, default red
      const ledColor = ps === 'playing' ? '74,230,138' : '232,89,60';
      const ledIntensity = rs === 'recording' ? Math.min(1, e + 0.4) : e;

      // Draw bars
      for (let i = 0; i < NUM_BARS; i++) {
        const angle = (i / NUM_BARS) * Math.PI * 2 - Math.PI / 2;
        const h = bars.current[i];
        const len = BAR_INNER + h * BAR_MAX_LEN;
        const alpha = 0.25 + h * 0.75;
        ctx.save();
        ctx.translate(CENTER, CENTER);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -BAR_INNER);
        ctx.lineTo(0, -len);
        ctx.strokeStyle = `rgba(228,226,221,${alpha})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }

      // Glow ring (r=38)
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 38, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ledColor},${0.04 + e * 0.18})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner solid ring (r=48)
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 48, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.08 + e * 0.06})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mid dashed ring (r=90)
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 90, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer dashed ring (r=130)
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 130, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.setLineDash([]);

      // Outer dots
      for (let i = 0; i < 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        const x = CENTER + Math.cos(a) * 136;
        const y = CENTER + Math.sin(a) * 136;
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.07)';
        ctx.fill();
      }

      // Center LED
      const ledSize = 5 + ledIntensity * 2;
      const glowRadius = 10 + ledIntensity * 6;
      const glow = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, glowRadius);
      glow.addColorStop(0, `rgba(${ledColor},${0.3 + ledIntensity * 0.5})`);
      glow.addColorStop(1, `rgba(${ledColor},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(CENTER - glowRadius, CENTER - glowRadius, glowRadius * 2, glowRadius * 2);

      const ledHex = ps === 'playing' ? '#4AE68A' : '#E8593C';
      ctx.fillStyle = ledHex;
      ctx.fillRect(CENTER - ledSize / 2, CENTER - ledSize / 2, ledSize, ledSize);

      rafId.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId.current);
      clearInterval(idleTimer.current);
    };
  }, [engineRef]);

  return <canvas ref={canvasRef} width={300} height={300} style={{ display: 'block' }} />;
}
