# CLAUDE.md — Synthwave Synth Project

## Project Overview

This is an interactive web-based synthesizer with a skeuomorphic hardware UI.
It's a Next.js React app using Tone.js for audio synthesis and Canvas for visualization.
Users can play notes live, record their performance, edit notes on a step sequencer grid,
and export the result as a WAV file. Single track.
The app will be deployed on Vercel and embedded/linked from a Framer portfolio site.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Audio:** Tone.js (PolySynth, Filter, Reverb, Gain, Analyser, Recorder, Transport, Sequence)
- **Visualization:** HTML Canvas (2D context, radial frequency visualizer)
- **Styling:** CSS Modules or inline styles (no Tailwind — the design is too specific)
- **Font:** JetBrains Mono (Google Fonts, loaded via next/font or link tag)
- **Deployment:** Vercel

## Design System

Read `design-system-v2.md` in the project root before writing ANY CSS.
It contains every color hex, gradient, shadow, font size, spacing value, and component spec.
Do not guess colors or sizes — use the exact values from that file.

### Critical Design Rules

- **Font:** JetBrains Mono everywhere. No Inter, no system fonts, no sans-serif fallback visible.
- **Colors:** Dark palette only. Background is #0D0D0F. Device body is #1A1A1E. Never use white backgrounds.
- **Accent:** #E8593C (red-orange) is the ONLY primary accent. Used for active states, LED glow, note display.
- **Terminal green:** #4AE68A for status indicators only.
- **Buttons:** Always use the 3-stop gradient + inset tray pattern. Never flat buttons.
- **Knobs:** 100px, double-layer conic-gradient brushed metal. Red indicator dot. See design system for exact gradient stops.
- **Scanlines:** The CRT screen must have the repeating-linear-gradient scanline overlay.

## Architecture

```
src/
├── app/
│   ├── layout.tsx            # Root layout, font loading, global styles
│   ├── page.tsx              # Main synth page (single page app)
│   └── globals.css           # CSS variables from design system, base resets
├── components/
│   ├── SynthDevice.tsx       # Top-level device shell (the dark rounded container)
│   ├── Screen.tsx            # CRT screen with scanlines, header/footer, houses visualizer
│   ├── RadialVisualizer.tsx  # Canvas component — radial frequency bars + rings + LED
│   ├── Keyboard.tsx          # 2-octave piano keyboard, handles mouse + keyboard input
│   ├── DrumPads.tsx          # 4x4 grid of drum pads (appears in PAD mode, replaces keyboard)
│   ├── Knob.tsx              # Single rotary knob with drag-to-rotate interaction
│   ├── KnobPanel.tsx         # 2x2 grid of knobs (Filter, Reverb, Attack, Volume)
│   ├── ModeSelector.tsx      # SYN / PAD / SEQ horizontal button group
│   ├── WaveSelector.tsx      # Square / Saw / Sine / Triangle waveform picker
│   ├── Transport.tsx         # Rec, Play, Stop, Octave +/-, BPM, Export
│   ├── StepSequencer.tsx     # Grid-based note editor (appears in SEQ mode)
│   ├── RecordingTimeline.tsx # Visual timeline showing recorded note events
│   └── StatusBar.tsx         # Bottom status bar (engine ready, latency, voices)
├── audio/
│   ├── engine.ts             # Tone.js audio engine setup (synth, filter, reverb, gain, analyser)
│   ├── drums.ts              # Drum kit: synthesized drum sounds using Tone.js built-ins
│   ├── recorder.ts           # Live recording logic (capture note events with timestamps)
│   ├── sequencer.ts          # Step sequencer playback engine (Tone.Transport + Tone.Sequence)
│   ├── exporter.ts           # WAV export using Tone.Recorder -> blob -> download
│   ├── keymap.ts             # Computer keyboard -> note mapping
│   └── params.ts             # Parameter ranges (knob rotation -> audio values)
├── hooks/
│   ├── useAudioEngine.ts     # React hook wrapping audio engine init/cleanup
│   ├── useDrumPads.ts        # Hook for drum pad triggers, sample loading, pad keyboard mapping
│   ├── useRecorder.ts        # Hook for start/stop live recording, stores note events
│   ├── useSequencer.ts       # Hook for step sequencer state and Tone.Transport control
│   ├── useKnobDrag.ts        # Pointer event handler for knob rotation
│   └── useKeyboard.ts        # Keyboard event listener for playing notes
└── types/
    └── index.ts              # Shared types: NoteEvent, SequencerStep, RecordingState, etc.
```

## Audio Engine Spec

### Signal chain
```
PolySynth (8 voices)
  -> Filter (lowpass, cutoff controlled by Filter knob)
    -> Reverb (wet controlled by Reverb knob)
      -> Gain (controlled by Volume knob)
        |-> Analyser (FFT data feeds the radial visualizer)
        |-> Recorder (captures audio output for WAV export)
          -> Destination (speakers)

DrumEngine (all 16 synths)
  -> Filter (same Filter node as synth — knobs affect drums too)
    -> (continues through same chain)
```

### Tone.js setup
- Use `Tone.PolySynth` with `Tone.Synth` voice
- Attack knob controls `synth.set({ envelope: { attack } })`
- Filter knob controls `filter.frequency.value` (range: 100Hz-8000Hz)
- Reverb knob controls `reverb.wet.value` (range: 0-1)
- Volume knob controls `gain.gain.value` (range: 0-1)
- Waveform selector changes `synth.set({ oscillator: { type } })`
- Analyser: `Tone.Analyser({ type: "fft", size: 128 })` — feed 72 bars from FFT data

### Important Tone.js rules
- Always call `Tone.start()` on first user interaction (click/keypress). Browser requires user gesture.
- Wrap in `useEffect` with cleanup: `synth.dispose()` on unmount.
- Don't create new Tone nodes on every render — create once, store in ref.

---

## Recording System

There are TWO ways to create music, and they share a single track of note data.

### Data Model

```typescript
// A single note event (what gets recorded or placed on the grid)
interface NoteEvent {
  note: string        // e.g. "C4", "F#5" for synth OR "KICK", "SNARE" for drums
  time: number        // start time in seconds (relative to recording start)
  duration: number    // how long the note was held, in seconds (0.1 fixed for drums)
  velocity: number    // 0-1, default 0.8
}

// The full recording
interface Recording {
  events: NoteEvent[]
  bpm: number
  waveform: string    // "square" | "sawtooth" | "sine" | "triangle"
  duration: number    // total duration in seconds
}

// Sequencer grid representation (derived from Recording for grid editing)
interface SequencerStep {
  note: string        // row label, e.g. "C4" or "KICK"
  step: number        // column index (0-15 for 16 steps)
  active: boolean
  velocity: number    // 0-1
}
```

### Mode 1: Live Recording (SYN mode)

How it works:
1. User is in SYN mode (default). They play notes freely.
2. User clicks REC. The button pulses red. A timer shows elapsed time.
3. Every note played gets captured as a NoteEvent with timestamp, duration, and note name.
4. User clicks STOP. Recording ends. NoteEvent array is stored.
5. User can now PLAY it back, switch to SEQ mode to edit on a grid, or EXPORT as WAV.

Implementation — NoteRecorder class in recorder.ts:
- start(): reset events, store start time, set isRecording true
- noteOn(note): store note start time in an activeNotes Map
- noteOff(note): calculate duration, push NoteEvent to events array
- stop(): close any held notes, return NoteEvent array

### Mode 2: Step Sequencer (SEQ mode)

How it works:
1. User switches to SEQ mode. Keyboard/pads are replaced by a step sequencer grid.
2. Grid: rows = notes (2 octaves) OR drum pad IDs, columns = 16 steps (one bar at current BPM).
3. Click cells to toggle notes on/off. Active cells glow in accent color.
4. A playhead column highlights the current step during playback.
5. PLAY loops through the 16 steps. STOP resets.

If the user recorded in SYN mode first:
- Grid rows = GRID_NOTES (24 chromatic note names)
- Notes are quantized to nearest step and pre-populated on the grid.

If the user recorded in PAD mode first:
- Grid rows = DRUM_ROWS (16 drum pad IDs)
- Drum hits are quantized to nearest step and pre-populated on the grid.

Grid cell styling (must match design system):
- Inactive: background #1E1E22, border 1px solid rgba(255,255,255,0.04), border-radius 3px
- Active: background #E8593C, border-radius 3px, box-shadow 0 0 6px rgba(232,89,60,0.2)
- Hover: background #262629
- Playhead column: cells get brighter border rgba(255,255,255,0.15)
- Row labels: 9px JetBrains Mono, color #4A4944, left side
- Step numbers: 8px JetBrains Mono, color #4A4944, above grid, every 4th step (1, 5, 9, 13)
- Entire grid inside an inset tray (same style as button groups)
- CLEAR button in header row to reset all active steps

### Conversion between modes

SYN to SEQ:
- step = Math.round(event.time / (60 / bpm / 4)) % 16
- rowIdx = GRID_NOTES.indexOf(event.note)

PAD to SEQ:
- step = Math.round(event.time / (60 / bpm / 4)) % 16
- rowIdx = DRUM_ROWS.indexOf(event.note)  // event.note = 'KICK', 'SNARE', etc.

SEQ to playback:
- Tone.Sequence fires triggerRow(rowIdx, time) callback
- SYN grid: engine.synth.triggerAttackRelease(GRID_NOTES[rowIdx], '16n', time)
- Drum grid: drumEngine.trigger(DRUM_ROWS[rowIdx], time)

---

## WAV Export

How it works:
1. User clicks EXPORT (only visible when a recording exists).
2. Tone.Recorder captures audio output.
3. The recorded sequence plays back start to finish through the Recorder.
4. When playback finishes, Recorder outputs a Blob.
5. Blob becomes a download link, auto-triggered.

Important export rules:
- Show progress state during export ("Exporting..." in status bar, disable all controls).
- Export plays through the SAME signal chain (filter, reverb, gain) so output sounds identical.
- Add 1.5s tail time after last note to capture reverb decay.
- Tone.Recorder outputs webm by default. Name file .wav anyway — the audio content is valid.
- After export completes, re-enable all controls and show "Export complete" briefly in status bar.

---

## Updated Transport Bar

Layout:
```
[REC] [PLAY] [STOP] [EXPORT]    Oct [-] 4 [+]    BPM [-] 120 [+]
```

Oct +/- is hidden in PAD mode (drums don't have octaves).

### Transport States

| State         | REC              | PLAY             | STOP     | EXPORT              |
|---------------|------------------|------------------|----------|---------------------|
| Idle          | Default          | Default          | Default  | Hidden              |
| Recording     | Pulsing red      | Disabled         | Stops    | Hidden              |
| Has recording | Default          | Default          | Default  | Visible             |
| Playing       | Disabled         | Active (green)   | Stops    | Disabled            |
| Exporting     | Disabled         | Disabled         | Disabled | Pulsing (progress)  |

### REC button
- Default: hardware button style with red dot icon
- Recording: border pulses red (CSS animation), text shows elapsed time "0:03"

### EXPORT button
- Hardware button style with download arrow SVG icon
- Only visible when recording.events.length > 0
- During export: text changes to "Exporting...", subtle pulse animation

### BPM control
- Has +/- buttons (30x30px, same style as octave buttons)
- Range: 60-200 BPM
- BPM is saved with the recording

---

## Mode Behavior

### SYN mode (default)
- Keyboard visible, play notes freely
- REC available for live recording
- Screen shows radial visualizer
- recordingSource set to 'synth' on REC

### PAD mode
- Keyboard is REPLACED by a 4x4 grid of drum pads
- Each pad triggers a different drum/percussion sound (synthesized via Tone.js)
- Pads are clickable AND mapped to computer keyboard keys
- REC works — drum hits are recorded as NoteEvents (note = pad ID like "KICK", "SNARE")
- recordingSource set to 'drums' on REC
- Filter and Reverb knobs still affect the drum output (drums route through same filter node)
- Attack knob has no effect in PAD mode (drums are one-shot)
- Volume knob controls master output
- Oct +/- hidden in transport bar
- useKeyboard is disabled (to avoid key conflicts with pad shortcuts)

### PAD mode — DrumPads component spec

**Layout:** 4 columns x 4 rows = 16 pads, filling the same area the keyboard occupies.

**Pad grid:**
```
Row 1: KICK    SNARE   CLAP    RIM
Row 2: HH-CL  HH-OP   CRASH   RIDE
Row 3: TOM-HI TOM-MID TOM-LO  COWBELL
Row 4: SHAKER  TAMB    CONGA   808
```

**Computer keyboard mapping (PAD mode only):**
```
Row 1: 1=KICK, 2=SNARE, 3=CLAP, 4=RIM
Row 2: Q=HH-CL, W=HH-OP, E=CRASH, R=RIDE
Row 3: A=TOM-HI, S=TOM-MID, D=TOM-LO, F=COWBELL
Row 4: Z=SHAKER, X=TAMB, C=CONGA, V=808
```

**Pad styling:**
```
Each pad:
  - Size: fills available space in 4x4 grid, roughly 1:1 aspect ratio
  - Default: background linear-gradient same as hardware buttons
            border 1.5px solid rgba(255,255,255,0.04), border-radius 10px
            box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)
  - Pressed/Active: background darkens, border-color rgba(232,89,60,0.5)
            box-shadow: 0 0 14px rgba(232,89,60,0.15), inset 0 2px 6px rgba(0,0,0,0.5)
            brief flash of accent color, fades out over 150ms
  - Label: pad name centered, 9px JetBrains Mono, --t3, uppercase, letter-spacing 2px
  - Key hint: small keyboard shortcut in bottom-right corner, 7px, --t3 at 50% opacity

The entire grid sits inside the same inset tray as the button groups:
  background #131316, border-radius 14px, padding 8px,
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.7)
```

**Audio — Drum sounds (drums.ts):**
Synthesized using Tone.js built-in synths (no external audio files):
- KICK: Tone.MembraneSynth (pitchDecay 0.08, octaves 6)
- SNARE: Tone.NoiseSynth (white noise, short decay)
- CLAP: Tone.NoiseSynth (pink noise)
- RIM: Tone.MetalSynth (frequency 800)
- HH-CL: Tone.MetalSynth (short decay)
- HH-OP: Tone.MetalSynth (longer decay)
- CRASH: Tone.MetalSynth (long decay)
- RIDE: Tone.MetalSynth (medium decay)
- TOM variants: Tone.MembraneSynth at different pitches (G2, D2, A1)
- COWBELL: Tone.MetalSynth (frequency 562)
- SHAKER/TAMB: Tone.NoiseSynth variants
- CONGA: Tone.MembraneSynth (E2)
- 808: Tone.MembraneSynth (long pitchDecay 0.5, octaves 8)

All drum sounds connect to `engineRef.current.filter` (shared signal chain).

**Recording drum hits:**
- note = pad ID string ('KICK', 'SNARE', 'HH-CL', etc.)
- time = timestamp relative to recording start
- duration = fixed 0.1s (one-shot)
- velocity = 0.8

### SEQ mode
- Keyboard/pads REPLACED by step sequencer grid
- If last recording was SYN: rowLabels = GRID_NOTES (24 rows), triggerRow uses engine.synth
- If last recording was PAD: rowLabels = DRUM_ROWS (16 rows), triggerRow uses drumEngine
- PLAY loops sequence, playhead advances visually
- Click cells to add/remove steps
- CLEAR button resets all active cells
- Screen still shows radial visualizer (reacts to playback)

---

## Updated Component Anatomy

```
+------------------------------------------------------------------+
|  HEADER                                                          |
|  +-----------------------------+  +----------------------------+ |
|  |  SCREEN (radial visualizer) |  |  SYN / PAD / SEQ modes     | |
|  |                             |  |  Knobs (Filter, Reverb,    | |
|  |                             |  |         Attack, Volume)     | |
|  |                             |  |  Waveform selector          | |
|  +-----------------------------+  +----------------------------+ |
|                                                                  |
|  +--------------------------------------------------------------+|
|  |  IF SYN: Piano keyboard (2 octaves, 15 white + 10 black)    ||
|  |  IF PAD: 4x4 drum pad grid (16 pads)                        ||
|  |  IF SEQ: Step sequencer grid (16 steps x note/drum rows)    ||
|  +--------------------------------------------------------------+|
|                                                                  |
|  [REC] [PLAY] [STOP] [EXPORT]    [Oct +/- 4 if not PAD]  BPM  |
|  * Audio engine ready    Latency: 5.2ms          8 voices        |
+------------------------------------------------------------------+
```

---

## Keyboard Mapping

### SYN mode — Computer keyboard to notes
```
White keys: A=C, S=D, D=E, F=F, G=G, H=A, J=B, K=C+1, L=D+1
Black keys: W=C#, E=D#, T=F#, Y=G#, U=A#
```
Octave shifts with Oct +/- buttons.
useKeyboard is DISABLED in PAD mode to avoid conflicts.

### PAD mode — Computer keyboard to drum pads
```
Row 1: 1=KICK, 2=SNARE, 3=CLAP, 4=RIM
Row 2: Q=HH-CL, W=HH-OP, E=CRASH, R=RIDE
Row 3: A=TOM-HI, S=TOM-MID, D=TOM-LO, F=COWBELL
Row 4: Z=SHAKER, X=TAMB, C=CONGA, V=808
```

### Mouse
- Click on piano key triggers note
- Click on drum pad triggers drum hit
- Mouse down = attack, mouse up = release (synth keys)
- Support mouseenter while mousedown for glissando (synth keys only)

### During recording
- All note/drum triggers are captured by the recorder
- recorder.noteOn/noteOff called alongside synth.triggerAttack/drumEngine.trigger

## Knob Interaction

- Pointer down on knob starts drag
- Pointer move (vertical): up = clockwise, down = counterclockwise
- Pointer up stops drag
- Map rotation (-150 to +150 degrees) linearly to parameter range
- Use pointermove on window (not just the knob) so drag works if cursor leaves knob
- Set cursor: grabbing on body during drag

## Radial Visualizer

- 72 bars arranged in a circle
- Read FFT data from Tone.Analyser on each animation frame
- Map FFT bin values to bar heights
- Smooth with lerp: barHeight += (target - barHeight) * 0.15
- Draw concentric rings, dashed rings, center LED (see design system for exact specs)
- Use requestAnimationFrame loop, cancel on unmount
- During recording: center LED pulses red more intensely
- During playback: center LED pulses green (#4AE68A) instead of red

## Component Rules

1. No prop drilling for audio state. Use a React context or zustand store for:
   - Current note being played (SYN mode) or current pad being hit (PAD mode)
   - Knob values (filter, reverb, attack, volume)
   - Selected waveform
   - Current octave
   - Current mode (SYN / PAD / SEQ)
   - Recording state (idle / recording / hasRecording)
   - Recording source (synth / drums) — so SEQ mode knows which row labels to show
   - Playback state (stopped / playing)
   - Export state (idle / exporting)
   - The NoteEvent array
   - The sequencer grid data + rowLabels
   - BPM
   - Elapsed recording time

2. Knobs are controlled components. Parent owns angle state, Knob receives angle + onAngleChange.

3. Keyboard component handles both mouse events on keys AND keyboard events (via useKeyboard hook).
   During recording, it calls both synth.triggerAttack AND recorder.noteOn.
   useKeyboard receives `disabled=true` when mode === 'PAD'.

4. Screen component only renders the CRT container + scanlines. RadialVisualizer is a child.

5. StepSequencer appears ONLY in SEQ mode, replacing the Keyboard/DrumPads.
   Receives `rowLabels` prop (GRID_NOTES for synth, DRUM_ROWS for drums).

6. DrumPads appears ONLY in PAD mode, replacing the Keyboard.
   Handles click AND keyboard shortcuts (1-4, Q-R, A-F, Z-V) via useDrumPads hook.
   During recording, calls drumEngine.trigger AND recorder.noteOn.

7. Transport conditionally shows/hides REC, PLAY, STOP, EXPORT based on state.
   Oct +/- hidden when mode === 'PAD' via `showOctave` prop.

8. Every component must match the design system exactly. Reference design-system-v2.md.

## Coding Standards

- TypeScript strict mode
- Functional components only (no classes)
- Use refs for Tone.js nodes (useRef), never state
- Use state for UI values (knob angles, active mode, selected wave, current octave)
- CSS: use CSS Modules or a single globals.css with CSS variables. No Tailwind.
- Keep components under 150 lines. Extract logic into hooks.
- No `any` types. Type all props, audio params, and event handlers.
- Comments only where non-obvious (audio math, knob-to-param mapping, FFT processing)

## Performance Rules

- Canvas draw loop: 60fps via requestAnimationFrame. No React state updates inside the draw loop.
- Throttle knob parameter changes to avoid audio crackle: update Tone params with rampTo() not direct assignment.
- Debounce waveform changes (Tone needs time to swap oscillator type).
- Keyboard events: prevent default on mapped keys to stop page scrolling.
- Step sequencer grid: use React.memo on individual cells to avoid full grid re-renders.
- Export: disable all controls during export to prevent audio interference.

## Testing Checklist

### Core synth
- [ ] Audio starts on first click/keypress (no autoplay errors)
- [ ] All 4 knobs drag smoothly and control their parameter
- [ ] All 4 waveforms sound different
- [ ] Computer keyboard plays notes correctly
- [ ] Mouse click on keys triggers notes
- [ ] Radial visualizer reacts to actual audio (not faked)
- [ ] Octave +/- shifts keyboard range correctly
- [ ] No audio glitches on rapid note changes

### Recording
- [ ] REC button starts recording, shows elapsed time
- [ ] Notes played during recording are captured with correct timing
- [ ] Drum hits during recording are captured with correct pad IDs
- [ ] STOP ends recording and preserves the NoteEvent array
- [ ] PLAY replays the recorded notes/drums with correct timing and sound
- [ ] Recording preserves the waveform and knob settings

### Drum pads
- [ ] PAD mode shows 4x4 grid, hides the keyboard
- [ ] Clicking pads triggers distinct drum sounds
- [ ] Computer keyboard shortcuts (1-4, Q-R, A-F, Z-V) trigger correct pads
- [ ] Pad labels and key hints are visible
- [ ] Pad visual feedback on hit (brief accent flash, darkens)
- [ ] Filter and Reverb knobs affect drum output
- [ ] Radial visualizer reacts to drum hits
- [ ] Oct +/- hidden in transport when in PAD mode
- [ ] SYN keyboard shortcuts don't fire in PAD mode

### Step sequencer
- [ ] SEQ mode shows the grid, hides the keyboard/pads
- [ ] If SYN recording exists, grid shows note names as row labels (24 rows)
- [ ] If PAD recording exists, grid shows drum names as row labels (16 rows)
- [ ] Clicking cells toggles notes/drums on/off
- [ ] PLAY loops through the 16 steps and triggers correct notes/drums
- [ ] Playhead visually advances through columns
- [ ] If recording exists, it is quantized and shown on grid
- [ ] Editing the grid updates playback immediately
- [ ] CLEAR button resets all active steps

### Export
- [ ] EXPORT button appears only when recording exists
- [ ] Clicking EXPORT plays back the recording and captures audio
- [ ] A WAV file downloads when export finishes
- [ ] Exported audio sounds identical to what was heard during playback
- [ ] Controls are disabled during export, re-enabled after

### Visual
- [ ] Looks correct at 880px wide on 1440p/1080p screen
- [ ] Scanlines, LED pulse, and vignette effects all render
- [ ] Center LED color changes during record (red) and playback (green)
- [ ] Cleanup: no audio playing after navigating away

## Deployment

```bash
vercel --prod
```

After deploying, copy the production URL and paste it into the Framer shell component's "App URL" property.

## File References

- `design-system-v2.md` — Complete visual spec (colors, gradients, shadows, sizes)
- `synth-mockup-v3.html` — Working HTML/CSS/JS prototype (reference for appearance)
- `synth-shell-preview.html` — Framer shell component preview (what users see before launching)
