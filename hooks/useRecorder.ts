'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { NoteRecorder } from '@/audio/recorder';
import { NoteEvent, RecordingState } from '@/types';

export function useRecorder() {
  const recorderRef = useRef<NoteRecorder>(new NoteRecorder());
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [events, setEvents] = useState<NoteEvent[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(() => {
    recorderRef.current.start();
    setRecordingState('recording');
    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime(recorderRef.current.getElapsed());
    }, 100);
  }, []);

  const stopRecording = useCallback(() => {
    const captured = recorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setEvents(captured);
    setRecordingState(captured.length > 0 ? 'hasRecording' : 'idle');
    return captured;
  }, []);

  const clearRecording = useCallback(() => {
    setEvents([]);
    setRecordingState('idle');
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { recorderRef, recordingState, elapsedTime, events, startRecording, stopRecording, clearRecording };
}
