export interface NoteEvent {
  note: string;
  time: number;       // seconds from recording start
  duration: number;   // seconds held
  velocity: number;   // 0–1
}

export interface Recording {
  events: NoteEvent[];
  bpm: number;
  waveform: string;
  duration: number;   // total seconds
}

export interface SequencerStep {
  note: string;
  step: number;
  active: boolean;
  velocity: number;
}

export type RecordingState = 'idle' | 'recording' | 'hasRecording';
export type PlaybackState = 'stopped' | 'playing';
export type ExportState = 'idle' | 'exporting' | 'done';
