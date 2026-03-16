import * as Tone from 'tone';

export const DRUM_PAD_IDS = [
  'KICK', 'SNARE', 'CLAP', 'RIM',
  'HH-CL', 'HH-OP', 'CRASH', 'RIDE',
  'TOM-HI', 'TOM-LO', 'CONGA', '808',
] as const;

export type DrumPadId = typeof DRUM_PAD_IDS[number];

export const DRUM_PAD_GRID: { id: DrumPadId; key: string }[] = [
  { id: 'KICK',   key: '1' },
  { id: 'SNARE',  key: '2' },
  { id: 'CLAP',   key: '3' },
  { id: 'RIM',    key: '4' },
  { id: 'HH-CL',  key: 'Q' },
  { id: 'HH-OP',  key: 'W' },
  { id: 'CRASH',  key: 'E' },
  { id: 'RIDE',   key: 'R' },
  { id: 'TOM-HI', key: 'A' },
  { id: 'TOM-LO', key: 'S' },
  { id: 'CONGA',  key: 'D' },
  { id: '808',    key: 'F' },
];

export class DrumEngine {
  private kick!: Tone.MembraneSynth;
  private snare!: Tone.NoiseSynth;
  private clap!: Tone.NoiseSynth;
  private rim!: Tone.MetalSynth;
  private hhCl!: Tone.MetalSynth;
  private hhOp!: Tone.MetalSynth;
  private crash!: Tone.MetalSynth;
  private ride!: Tone.MetalSynth;
  private tomHi!: Tone.MembraneSynth;
  private tomMid!: Tone.MembraneSynth;
  private tomLo!: Tone.MembraneSynth;
  private cowbell!: Tone.MetalSynth;
  private shaker!: Tone.NoiseSynth;
  private tamb!: Tone.NoiseSynth;
  private conga!: Tone.MembraneSynth;
  private bass808!: Tone.MembraneSynth;

  init(destination: Tone.ToneAudioNode) {
    const c = (n: Tone.ToneAudioNode) => n.connect(destination);

    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.08, octaves: 6,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.2 },
    });
    c(this.kick);

    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
    });
    c(this.snare);

    this.clap = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 },
    });
    c(this.clap);

    this.rim = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 16, resonance: 1500, octaves: 0.5,
      envelope: { attack: 0.001, decay: 0.06, release: 0.01 },
    });
    this.rim.frequency.value = 800;
    c(this.rim);

    this.hhCl = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 32, resonance: 8000, octaves: 1.5,
      envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    });
    this.hhCl.frequency.value = 400;
    c(this.hhCl);

    this.hhOp = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 32, resonance: 8000, octaves: 1.5,
      envelope: { attack: 0.001, decay: 0.4, release: 0.1 },
    });
    this.hhOp.frequency.value = 400;
    c(this.hhOp);

    this.crash = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 32, resonance: 8000, octaves: 2,
      envelope: { attack: 0.001, decay: 1.0, release: 0.3 },
    });
    this.crash.frequency.value = 300;
    c(this.crash);

    this.ride = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 32, resonance: 5000, octaves: 1,
      envelope: { attack: 0.001, decay: 0.5, release: 0.1 },
    });
    this.ride.frequency.value = 350;
    c(this.ride);

    this.tomHi = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 3,
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    });
    c(this.tomHi);

    this.tomMid = new Tone.MembraneSynth({
      pitchDecay: 0.06, octaves: 4,
      envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 },
    });
    c(this.tomMid);

    this.tomLo = new Tone.MembraneSynth({
      pitchDecay: 0.07, octaves: 5,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    });
    c(this.tomLo);

    this.cowbell = new Tone.MetalSynth({
      harmonicity: 5.1, modulationIndex: 16, resonance: 3500, octaves: 0.5,
      envelope: { attack: 0.001, decay: 0.6, release: 0.1 },
    });
    this.cowbell.frequency.value = 562;
    c(this.cowbell);

    this.shaker = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.02 },
    });
    c(this.shaker);

    this.tamb = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.03 },
    });
    c(this.tamb);

    this.conga = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 2,
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.1 },
    });
    c(this.conga);

    this.bass808 = new Tone.MembraneSynth({
      pitchDecay: 0.5, octaves: 8,
      envelope: { attack: 0.001, decay: 0.8, sustain: 0.1, release: 0.5 },
    });
    c(this.bass808);
  }

  trigger(id: string, time?: number): void {
    const t = time ?? (Tone.now() + 0.05);
    const v = 1.0;
    switch (id) {
      case 'KICK':    this.kick.triggerAttackRelease('C1', '8n', t, v); break;
      case 'SNARE':   this.snare.triggerAttackRelease('8n', t, v); break;
      case 'CLAP':    this.clap.triggerAttackRelease('8n', t, v); break;
      case 'RIM':     this.rim.triggerAttackRelease('32n', t, v); break;
      case 'HH-CL':   this.hhCl.triggerAttackRelease('32n', t, v); break;
      case 'HH-OP':   this.hhOp.triggerAttackRelease('8n', t, v); break;
      case 'CRASH':   this.crash.triggerAttackRelease('4n', t, v); break;
      case 'RIDE':    this.ride.triggerAttackRelease('8n', t, v); break;
      case 'TOM-HI':  this.tomHi.triggerAttackRelease('G2', '8n', t, v); break;
      case 'TOM-MID': this.tomMid.triggerAttackRelease('D2', '8n', t, v); break;
      case 'TOM-LO':  this.tomLo.triggerAttackRelease('A1', '8n', t, v); break;
      case 'COWBELL': this.cowbell.triggerAttackRelease('8n', t, v); break;
      case 'SHAKER':  this.shaker.triggerAttackRelease('32n', t, v); break;
      case 'TAMB':    this.tamb.triggerAttackRelease('16n', t, v); break;
      case 'CONGA':   this.conga.triggerAttackRelease('E2', '8n', t, v); break;
      case '808':     this.bass808.triggerAttackRelease('C1', '4n', t, v); break;
    }
  }

  dispose() {
    this.kick?.dispose();
    this.snare?.dispose();
    this.clap?.dispose();
    this.rim?.dispose();
    this.hhCl?.dispose();
    this.hhOp?.dispose();
    this.crash?.dispose();
    this.ride?.dispose();
    this.tomHi?.dispose();
    this.tomMid?.dispose();
    this.tomLo?.dispose();
    this.cowbell?.dispose();
    this.shaker?.dispose();
    this.tamb?.dispose();
    this.conga?.dispose();
    this.bass808?.dispose();
  }
}
