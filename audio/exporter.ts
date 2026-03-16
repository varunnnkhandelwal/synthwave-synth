import * as Tone from 'tone';
import { NoteEvent } from '@/types';
import { AudioEngine } from './engine';

export async function exportRecordingToWAV(
  engine: AudioEngine,
  events: NoteEvent[],
  onStart?: () => void,
  onDone?: () => void
): Promise<void> {
  if (events.length === 0) return;

  const recorder = new Tone.Recorder();
  engine.gain.connect(recorder);

  const totalDuration = events.reduce((max, e) => Math.max(max, e.time + e.duration), 0) + 1.5;

  onStart?.();
  await recorder.start();

  const now = Tone.now();
  events.forEach((e) => {
    engine.synth.triggerAttackRelease(e.note, e.duration, now + e.time, e.velocity);
  });

  await new Promise<void>((resolve) => setTimeout(resolve, totalDuration * 1000));

  const blob = await recorder.stop();
  recorder.dispose();

  try {
    engine.gain.disconnect(recorder);
  } catch {
    // already disconnected
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'synthwave-recording.wav';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  onDone?.();
}
