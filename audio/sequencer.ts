import { NoteEvent } from '@/types';
import { DRUM_PAD_IDS } from './drums';

// 2 octaves chromatic, top (B5) to bottom (C4)
export const GRID_NOTES: string[] = [
  'B5', 'A#5', 'A5', 'G#5', 'G5', 'F#5', 'F5', 'E5', 'D#5', 'D5', 'C#5', 'C5',
  'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4', 'E4', 'D#4', 'D4', 'C#4', 'C4',
];

export const DRUM_ROWS: string[] = [...DRUM_PAD_IDS];

export const GRID_STEPS = 16;

export function makeEmptyGrid(numRows = GRID_NOTES.length): boolean[][] {
  return Array.from({ length: numRows }, () => new Array(GRID_STEPS).fill(false));
}

// Quantize recorded NoteEvents onto the 16-step synth grid
export function quantizeToGrid(events: NoteEvent[], bpm: number): boolean[][] {
  const grid = makeEmptyGrid(GRID_NOTES.length);
  const stepDuration = 60 / bpm / 4;

  events.forEach((event) => {
    const rowIdx = GRID_NOTES.indexOf(event.note);
    if (rowIdx === -1) return;
    const step = Math.round(event.time / stepDuration) % GRID_STEPS;
    grid[rowIdx][step] = true;
  });

  return grid;
}

// Quantize recorded drum NoteEvents onto the 16-row drum grid
export function quantizeDrumsToGrid(events: NoteEvent[], bpm: number): boolean[][] {
  const grid = makeEmptyGrid(DRUM_ROWS.length);
  const stepDuration = 60 / bpm / 4;

  events.forEach((event) => {
    const rowIdx = DRUM_ROWS.indexOf(event.note);
    if (rowIdx === -1) return;
    const step = Math.round(event.time / stepDuration) % GRID_STEPS;
    grid[rowIdx][step] = true;
  });

  return grid;
}
