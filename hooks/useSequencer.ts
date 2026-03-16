'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as Tone from 'tone';
import { NoteEvent, PlaybackState } from '@/types';
import {
  GRID_NOTES, DRUM_ROWS, GRID_STEPS,
  makeEmptyGrid, quantizeToGrid, quantizeDrumsToGrid,
} from '@/audio/sequencer';

export type GridMode = 'synth' | 'drums';

export function useSequencer() {
  const [gridMode, setGridModeState] = useState<GridMode>('synth');
  const [rowLabels, setRowLabels] = useState<string[]>(GRID_NOTES);
  const [grid, setGrid] = useState<boolean[][]>(makeEmptyGrid);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentStep, setCurrentStep] = useState(-1);

  const seqRef = useRef<Tone.Sequence | null>(null);
  const rafRef = useRef<number>(0);
  const gridRef = useRef<boolean[][]>(grid);
  const numRowsRef = useRef<number>(GRID_NOTES.length);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { numRowsRef.current = rowLabels.length; }, [rowLabels]);

  const stopPlayback = useCallback(() => {
    seqRef.current?.stop();
    seqRef.current?.dispose();
    seqRef.current = null;
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    cancelAnimationFrame(rafRef.current);
    setPlaybackState('stopped');
    setCurrentStep(-1);
  }, []);

  // One-shot linear playback (SYN / PAD mode)
  // triggerNote: (note, absoluteTime, duration) => void
  const startLinearPlayback = useCallback((
    events: NoteEvent[],
    triggerNote: (note: string, time: number, duration: number) => void,
  ) => {
    if (events.length === 0) return;
    stopPlayback();

    const now = Tone.now();
    events.forEach((e) => triggerNote(e.note, now + e.time, e.duration));

    const totalMs = (events.reduce((max, e) => Math.max(max, e.time + e.duration), 0) + 0.5) * 1000;
    setPlaybackState('playing');
    setTimeout(() => setPlaybackState('stopped'), totalMs);
  }, [stopPlayback]);

  // Looping sequencer (SEQ mode)
  // triggerRow: (rowIdx, audioTime) => void
  const startLoopPlayback = useCallback((
    triggerRow: (rowIdx: number, time: Tone.Unit.Time) => void,
    bpm: number,
  ) => {
    stopPlayback();

    Tone.getTransport().bpm.value = bpm;
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = '1m';

    const steps = Array.from({ length: GRID_STEPS }, (_, i) => i);
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        const g = gridRef.current;
        const n = numRowsRef.current;
        for (let rowIdx = 0; rowIdx < n; rowIdx++) {
          if (g[rowIdx]?.[step as number]) {
            triggerRow(rowIdx, time);
          }
        }
      },
      steps,
      '16n'
    );

    seqRef.current.start(0);
    Tone.getTransport().start();
    setPlaybackState('playing');

    const ppq = Tone.getTransport().PPQ;
    function trackStep() {
      const ticks = Tone.getTransport().ticks;
      const step = Math.floor(ticks / (ppq / 4)) % GRID_STEPS;
      setCurrentStep(step);
      rafRef.current = requestAnimationFrame(trackStep);
    }
    rafRef.current = requestAnimationFrame(trackStep);
  }, [stopPlayback]);

  const toggleStep = useCallback((row: number, step: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][step] = !next[row][step];
      return next;
    });
  }, []);

  const populateFromRecording = useCallback((events: NoteEvent[], bpm: number) => {
    setGridModeState('synth');
    setRowLabels(GRID_NOTES);
    numRowsRef.current = GRID_NOTES.length;
    setGrid(quantizeToGrid(events, bpm));
  }, []);

  const populateFromDrums = useCallback((events: NoteEvent[], bpm: number) => {
    setGridModeState('drums');
    setRowLabels(DRUM_ROWS);
    numRowsRef.current = DRUM_ROWS.length;
    setGrid(quantizeDrumsToGrid(events, bpm));
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(makeEmptyGrid(numRowsRef.current));
  }, []);

  useEffect(() => {
    return () => { stopPlayback(); };
  }, [stopPlayback]);

  return {
    grid,
    gridMode,
    rowLabels,
    toggleStep,
    clearGrid,
    playbackState,
    currentStep,
    startLinearPlayback,
    startLoopPlayback,
    stopPlayback,
    populateFromRecording,
    populateFromDrums,
  };
}
