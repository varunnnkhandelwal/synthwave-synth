// Computer keyboard → note names (relative, octave added by caller)
export const WHITE_KEY_MAP: Record<string, string> = {
  // Octave base
  a: 'C', s: 'D', d: 'E', f: 'F', g: 'G', h: 'A', j: 'B',
  // Octave +1
  k: 'C', l: 'D', ';': 'E', "'": 'F', z: 'G', x: 'A', c: 'B',
  // Octave +2
  v: 'C',
};

export const BLACK_KEY_MAP: Record<string, string> = {
  // Octave base
  w: 'C#', e: 'D#', t: 'F#', y: 'G#', u: 'A#',
  // Octave +1
  i: 'C#', o: 'D#', '[': 'F#', ']': 'G#', '\\': 'A#',
};

// Keys that resolve to octave+1
export const UPPER_OCTAVE_KEYS = new Set(['k', 'l', ';', "'", 'z', 'x', 'c', 'i', 'o', '[', ']', '\\']);
// Keys that resolve to octave+2
export const UPPER_OCTAVE_2_KEYS = new Set(['v']);

export const ALL_KEY_MAP: Record<string, string> = { ...WHITE_KEY_MAP, ...BLACK_KEY_MAP };

export function keyToNote(key: string, octave: number): string | null {
  const lower = key.toLowerCase();
  if (WHITE_KEY_MAP[lower] !== undefined) {
    let extra = 0;
    if (UPPER_OCTAVE_KEYS.has(lower)) extra = 1;
    if (UPPER_OCTAVE_2_KEYS.has(lower)) extra = 2;
    return `${WHITE_KEY_MAP[lower]}${octave + extra}`;
  }
  if (BLACK_KEY_MAP[lower] !== undefined) {
    const extra = UPPER_OCTAVE_KEYS.has(lower) ? 1 : 0;
    return `${BLACK_KEY_MAP[lower]}${octave + extra}`;
  }
  return null;
}
