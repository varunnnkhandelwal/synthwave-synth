// Map knob rotation (-150° to +150°) to audio parameter values

export function rotationToFilter(deg: number): number {
  // -150° = 100Hz, +150° = 8000Hz
  const t = (deg + 150) / 300;
  return 100 + t * 7900;
}

export function rotationToReverb(deg: number): number {
  // -150° = 0, +150° = 1
  return (deg + 150) / 300;
}

export function rotationToAttack(deg: number): number {
  // -150° = 0.001s, +150° = 2s
  const t = (deg + 150) / 300;
  return 0.001 + t * 1.999;
}

export function rotationToVolume(deg: number): number {
  // -150° = 0, +150° = 1
  return (deg + 150) / 300;
}

// Default knob angles (degrees)
export const DEFAULT_ANGLES = {
  filter: -40,
  reverb: 50,
  attack: -70,
  volume: 15,
} as const;

export type KnobName = keyof typeof DEFAULT_ANGLES;
