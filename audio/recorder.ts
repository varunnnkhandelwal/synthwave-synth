import * as Tone from 'tone';
import { NoteEvent } from '@/types';

export class NoteRecorder {
  private events: NoteEvent[] = [];
  private activeNotes: Map<string, number> = new Map();
  private startTime = 0;
  isRecording = false;

  start() {
    this.events = [];
    this.activeNotes = new Map();
    this.startTime = Tone.now();
    this.isRecording = true;
  }

  noteOn(note: string) {
    if (!this.isRecording) return;
    this.activeNotes.set(note, Tone.now());
  }

  noteOff(note: string) {
    if (!this.isRecording) return;
    const start = this.activeNotes.get(note);
    if (start === undefined) return;
    const now = Tone.now();
    this.events.push({ note, time: start - this.startTime, duration: now - start, velocity: 0.8 });
    this.activeNotes.delete(note);
  }

  stop(): NoteEvent[] {
    const now = Tone.now();
    this.activeNotes.forEach((start, note) => {
      this.events.push({ note, time: start - this.startTime, duration: now - start, velocity: 0.8 });
    });
    this.activeNotes.clear();
    this.isRecording = false;
    return [...this.events];
  }

  getElapsed(): number {
    if (!this.isRecording) return 0;
    return Tone.now() - this.startTime;
  }

  getEvents(): NoteEvent[] {
    return [...this.events];
  }
}
