import * as Tone from 'tone';
import { rotationToFilter, rotationToReverb, rotationToAttack, rotationToVolume } from './params';

export type WaveType = 'square' | 'sawtooth' | 'sine' | 'triangle';

export interface AudioEngine {
  synth: Tone.PolySynth;
  filter: Tone.Filter;
  reverb: Tone.Reverb;
  gain: Tone.Gain;
  analyser: Tone.Analyser;
  triggerNote: (note: string) => void;
  releaseNote: (note: string) => void;
  setFilterAngle: (deg: number) => void;
  setReverbAngle: (deg: number) => void;
  setAttackAngle: (deg: number) => void;
  setVolumeAngle: (deg: number) => void;
  setWaveform: (type: WaveType) => void;
  dispose: () => void;
}

export async function createAudioEngine(): Promise<AudioEngine> {
  await Tone.start();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'square' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.8 },
  });
  synth.maxPolyphony = 8;

  const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 2000,
    rolloff: -24,
  });

  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 });

  const gain = new Tone.Gain(0.75);

  const analyser = new Tone.Analyser({ type: 'fft', size: 128 });

  // Signal chain
  synth.connect(filter);
  filter.connect(reverb);
  reverb.connect(gain);
  gain.connect(analyser);
  analyser.toDestination();

  function triggerNote(note: string) {
    synth.triggerAttack(note, Tone.now());
  }

  function releaseNote(note: string) {
    synth.triggerRelease(note, Tone.now());
  }

  function setFilterAngle(deg: number) {
    filter.frequency.rampTo(rotationToFilter(deg), 0.05);
  }

  function setReverbAngle(deg: number) {
    reverb.wet.rampTo(rotationToReverb(deg), 0.05);
  }

  function setAttackAngle(deg: number) {
    synth.set({ envelope: { attack: rotationToAttack(deg) } });
  }

  function setVolumeAngle(deg: number) {
    gain.gain.rampTo(rotationToVolume(deg), 0.05);
  }

  function setWaveform(type: WaveType) {
    // Small timeout to avoid oscillator swap glitch
    setTimeout(() => {
      synth.set({ oscillator: { type } });
    }, 50);
  }

  function dispose() {
    synth.dispose();
    filter.dispose();
    reverb.dispose();
    gain.dispose();
    analyser.dispose();
  }

  return {
    synth,
    filter,
    reverb,
    gain,
    analyser,
    triggerNote,
    releaseNote,
    setFilterAngle,
    setReverbAngle,
    setAttackAngle,
    setVolumeAngle,
    setWaveform,
    dispose,
  };
}
