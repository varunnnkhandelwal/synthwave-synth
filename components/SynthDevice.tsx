'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import Screen from './Screen';
import KnobPanel from './KnobPanel';
import ModeSelector from './ModeSelector';
import WaveSelector from './WaveSelector';
import Keyboard from './Keyboard';
import DrumPads from './DrumPads';
import StepSequencer from './StepSequencer';
import Transport from './Transport';
import StatusBar from './StatusBar';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useRecorder } from '@/hooks/useRecorder';
import { useSequencer } from '@/hooks/useSequencer';
import { useDrumPads } from '@/hooks/useDrumPads';
import { DEFAULT_ANGLES } from '@/audio/params';
import { WaveType } from '@/audio/engine';
import { GRID_NOTES, DRUM_ROWS } from '@/audio/sequencer';
import { exportRecordingToWAV } from '@/audio/exporter';
import { ExportState } from '@/types';

type Mode = 'SYN' | 'PAD' | 'SEQ';
type RecordingSource = 'synth' | 'drums';

function useGrainTexture(): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const generated = useRef(false);

  useEffect(() => {
    if (generated.current) return;
    generated.current = true;
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 14;
    }
    ctx.putImageData(img, 0, 0);
    setUrl(c.toDataURL('image/png'));
  }, []);

  return url;
}

export default function SynthDevice() {
  const { engineRef, ready, latency, init } = useAudioEngine();
  const grainUrl = useGrainTexture();

  const [mode, setMode] = useState<Mode>('SYN');
  const [wave, setWave] = useState<WaveType>('square');
  const [octave, setOctave] = useState(4);
  const [bpm, setBpm] = useState(120);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [recordingSource, setRecordingSource] = useState<RecordingSource>('synth');

  const [filterAngle, setFilterAngle] = useState<number>(DEFAULT_ANGLES.filter);
  const [reverbAngle, setReverbAngle] = useState<number>(DEFAULT_ANGLES.reverb);
  const [attackAngle, setAttackAngle] = useState<number>(DEFAULT_ANGLES.attack);
  const [volumeAngle, setVolumeAngle] = useState<number>(DEFAULT_ANGLES.volume);

  const { recorderRef, recordingState, elapsedTime, events, startRecording, stopRecording } = useRecorder();

  const {
    grid, rowLabels, toggleStep, clearGrid, playbackState, currentStep,
    startLinearPlayback, startLoopPlayback, stopPlayback,
    populateFromRecording, populateFromDrums,
  } = useSequencer();

  const handleInit = useCallback(async () => { await init(); }, [init]);
  const handleNoteChange = useCallback((note: string | null) => { setActiveNote(note); }, []);

  const { drumRef, activePad, triggerPad, initDrums } = useDrumPads(
    engineRef, recorderRef, handleInit, mode !== 'PAD'
  );

  const handleFilterChange = useCallback((v: number) => {
    setFilterAngle(v); engineRef.current?.setFilterAngle(v);
  }, [engineRef]);

  const handleReverbChange = useCallback((v: number) => {
    setReverbAngle(v); engineRef.current?.setReverbAngle(v);
  }, [engineRef]);

  const handleAttackChange = useCallback((v: number) => {
    setAttackAngle(v); engineRef.current?.setAttackAngle(v);
  }, [engineRef]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolumeAngle(v); engineRef.current?.setVolumeAngle(v);
  }, [engineRef]);

  const handleWaveChange = useCallback((w: WaveType) => {
    setWave(w); engineRef.current?.setWaveform(w);
  }, [engineRef]);

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    if (m === 'PAD') {
      // Pre-init drum engine on mode entry so first pad hit has no latency
      initDrums();
    }
    if (m === 'SEQ') {
      if (recordingSource === 'drums' && events.length > 0) {
        populateFromDrums(events, bpm);
      } else if (recordingSource === 'synth' && events.length > 0) {
        populateFromRecording(events, bpm);
      }
    }
    stopPlayback();
  }, [events, bpm, recordingSource, populateFromRecording, populateFromDrums, stopPlayback]);

  const handleRec = useCallback(() => {
    if (recordingState === 'recording') return;
    if (mode === 'PAD') {
      initDrums();
      setRecordingSource('drums');
    } else {
      handleInit();
      setRecordingSource('synth');
    }
    startRecording();
  }, [recordingState, mode, handleInit, initDrums, startRecording]);

  // Trigger callbacks for linear playback
  const synthTrigger = useCallback((note: string, time: number, duration: number) => {
    engineRef.current?.synth.triggerAttackRelease(note, duration, time, 0.8);
  }, [engineRef]);

  const drumTrigger = useCallback((note: string, time: number) => {
    drumRef.current?.trigger(note, time);
  }, [drumRef]);

  // Trigger callbacks for loop playback
  const synthRowTrigger = useCallback((rowIdx: number, time: Tone.Unit.Time) => {
    engineRef.current?.synth.triggerAttackRelease(GRID_NOTES[rowIdx], '16n', time, 0.8);
  }, [engineRef]);

  const drumRowTrigger = useCallback((rowIdx: number, time: Tone.Unit.Time) => {
    drumRef.current?.trigger(DRUM_ROWS[rowIdx], time as number);
  }, [drumRef]);

  const handlePlay = useCallback(() => {
    handleInit();
    if (mode === 'SEQ') {
      const triggerRow = rowLabels === DRUM_ROWS || (rowLabels.length === DRUM_ROWS.length && rowLabels[0] === DRUM_ROWS[0])
        ? drumRowTrigger : synthRowTrigger;
      startLoopPlayback(triggerRow, bpm);
    } else if (events.length > 0) {
      if (recordingSource === 'drums') {
        startLinearPlayback(events, (note, time) => drumTrigger(note, time));
      } else {
        startLinearPlayback(events, synthTrigger);
      }
    }
  }, [
    mode, events, bpm, recordingSource, rowLabels,
    handleInit, startLoopPlayback, startLinearPlayback,
    synthTrigger, drumTrigger, synthRowTrigger, drumRowTrigger,
  ]);

  const handleStop = useCallback(() => {
    if (recordingState === 'recording') { stopRecording(); return; }
    stopPlayback();
  }, [recordingState, stopRecording, stopPlayback]);

  const handleExport = useCallback(async () => {
    if (!engineRef.current || events.length === 0) return;
    setExportState('exporting');
    await exportRecordingToWAV(engineRef.current, events, undefined, () => {
      setExportState('done');
      setTimeout(() => setExportState('idle'), 3000);
    });
  }, [engineRef, events]);

  const handleOctaveUp = () => setOctave((o) => Math.min(7, o + 1));
  const handleOctaveDown = () => setOctave((o) => Math.max(1, o - 1));
  const handleBpmUp = () => setBpm((b) => Math.min(200, b + 5));
  const handleBpmDown = () => setBpm((b) => Math.max(60, b - 5));


  const statusText = exportState === 'done' ? 'Export complete' : undefined;

  return (
    <div style={styles.deviceOuter}>
    <div style={styles.deviceWall} />
    <div style={styles.device} onClick={handleInit}>
      {grainUrl && (
        <div style={{ ...styles.grain, backgroundImage: `url(${grainUrl})` }} />
      )}

      <div style={styles.header}>
        <span style={styles.title}>SYNTHWAVE V1.0</span>
        <div style={styles.headerRight}>
          <span style={styles.model}>MODEL SV-1</span>
          <span style={styles.powerLed} />
        </div>
      </div>

      <div style={styles.main}>
        <Screen
          activeNote={activeNote}
          engineRef={engineRef}
          recordingState={recordingState}
          playbackState={playbackState}
        />
        <div style={styles.rightPanel}>
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
          <KnobPanel
            filterAngle={filterAngle} reverbAngle={reverbAngle}
            attackAngle={attackAngle} volumeAngle={volumeAngle}
            onFilterChange={handleFilterChange} onReverbChange={handleReverbChange}
            onAttackChange={handleAttackChange} onVolumeChange={handleVolumeChange}
          />
          <WaveSelector wave={wave} onWaveChange={handleWaveChange} />
        </div>
      </div>

      {mode === 'SEQ' ? (
        <StepSequencer
          grid={grid}
          rowLabels={rowLabels}
          currentStep={currentStep}
          onToggleStep={toggleStep}
          onClear={clearGrid}
        />
      ) : mode === 'PAD' ? (
        <DrumPads activePad={activePad} onTrigger={triggerPad} />
      ) : (
        <Keyboard
          octave={octave}
          engineRef={engineRef}
          recorderRef={recorderRef}
          onNoteChange={handleNoteChange}
          onInit={handleInit}
          disabled={false}
        />
      )}

      <Transport
        playing={playbackState === 'playing'}
        octave={octave}
        bpm={bpm}
        showOctave={mode !== 'PAD'}
        recordingState={recordingState}
        playbackState={playbackState}
        exportState={exportState}
        elapsedTime={elapsedTime}
        onRec={handleRec}
        onPlay={handlePlay}
        onStop={handleStop}
        onExport={handleExport}
        onOctaveUp={handleOctaveUp}
        onOctaveDown={handleOctaveDown}
        onBpmUp={handleBpmUp}
        onBpmDown={handleBpmDown}
      />

      <StatusBar ready={ready} latency={latency} voices={8} statusOverride={statusText} />
    </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  deviceOuter: {
    position: 'relative',
    width: 880,
  },
  // The physical bottom wall — same width as face, extends below it
  deviceWall: {
    position: 'absolute',
    top: 8,
    left: 3,
    right: 3,
    bottom: -9,
    background: 'linear-gradient(180deg, #19191D 0%, #121215 50%, #0C0C0F 100%)',
    borderRadius: 22,
    boxShadow:
      '0 60px 160px rgba(0,0,0,0.95), ' +
      '0 24px 60px rgba(0,0,0,0.8), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
    zIndex: 0,
  },
  device: {
    width: 880,
    background: 'linear-gradient(175deg, #1E1E22 0%, #1A1A1E 30%, #171719 100%)',
    borderRadius: 22,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    boxShadow:
      '0 4px 14px rgba(0,0,0,0.65), ' +
      'inset 0 1px 0 rgba(255,255,255,0.06), ' +
      'inset 0 -1px 0 rgba(0,0,0,0.5)',
  },
  grain: {
    position: 'absolute', inset: 0,
    backgroundRepeat: 'repeat', backgroundSize: '64px 64px',
    opacity: 0.6, pointerEvents: 'none', zIndex: 0, borderRadius: 22,
    mixBlendMode: 'overlay' as React.CSSProperties['mixBlendMode'],
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'relative', zIndex: 1,
  },
  title: {
    fontSize: 10, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase',
    color: 'var(--t3)',
    textShadow: '0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)',
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  model: {
    fontSize: 10, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase',
    color: 'var(--t3)',
    textShadow: '0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)',
  },
  powerLed: {
    display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
    background: 'var(--terminal)', boxShadow: '0 0 8px var(--terminal)',
    animation: 'ledPulse 2s ease-in-out infinite',
  },
  main: {
    display: 'flex', gap: 24, alignItems: 'stretch', minHeight: 340,
    position: 'relative', zIndex: 1,
  },
  rightPanel: { width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 18 },
};
