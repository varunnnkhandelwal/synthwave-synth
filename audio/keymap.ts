// Computer keyboard → note names (relative, octave added by caller)
export const WHITE_KEY_MAP: Record<string, string> = {
  a: 'C',
  s: 'D',
  d: 'E',
  f: 'F',
  g: 'G',
  h: 'A',
  j: 'B',
  k: 'C',  // C+1 octave offset handled in hook
  l: 'D',  // D+1
};

export const BLACK_KEY_MAP: Record<string, string> = {
  w: 'C#',
  e: 'D#',
  t: 'F#',
  y: 'G#',
  u: 'A#',
};

// Keys that need +1 octave
export const UPPER_OCTAVE_KEYS = new Set(['k', 'l']);

export const ALL_KEY_MAP: Record<string, string> = { ...WHITE_KEY_MAP, ...BLACK_KEY_MAP };

export function keyToNote(key: string, octave: number): string | null {
  const lower = key.toLowerCase();
  if (WHITE_KEY_MAP[lower] !== undefined) {
    const extraOctave = UPPER_OCTAVE_KEYS.has(lower) ? 1 : 0;
    return `${WHITE_KEY_MAP[lower]}${octave + extraOctave}`;
  }
  if (BLACK_KEY_MAP[lower] !== undefined) {
    return `${BLACK_KEY_MAP[lower]}${octave}`;
  }
  return null;
}
