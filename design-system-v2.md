# SYNTHWAVE — Design System v2.2

## Visual Identity

**Aesthetic:** Dark hardware console + sci-fi terminal with tactile, physical 3D presence
**Inspired by:** Dieter Rams hardware, retro CRT monitors, spacecraft control panels, Akai MPC pads
**Mood:** Precise, mechanical, futuristic but analog-feeling
**Key qualities:** Engraved text, concentric-groove knobs, subtle grain texture, deep 3D shadows, CRT noise grain

---

## Color Palette

### Surfaces
| Token       | Hex       | Usage                                    |
|-------------|-----------|------------------------------------------|
| --base      | #0D0D0F   | Page / deepest background                |
| --device    | #1A1A1E   | Device body / main panel                 |
| --inset     | #111114   | Recessed screen / display area           |
| --raised    | #242428   | General raised surface                   |
| --btn-bg    | #1E1E22   | Button resting surface                   |
| --btn-hover | #262629   | Button hover                             |
| --tray      | #131316   | Inset tray behind button groups          |

### Accents
| Token       | Hex       | Usage                                    |
|-------------|-----------|------------------------------------------|
| --accent    | #E8593C   | Active state, LED glow, note display     |
| --warm      | #F2A623   | Secondary indicator (export state)       |
| --cool      | #3B8BD4   | Info state (unused currently)            |
| --terminal  | #4AE68A   | Status online dot, play button triangle  |

### Text
| Token | Hex       | Usage                          |
|-------|-----------|--------------------------------|
| --t1  | #E8E6E1   | Primary readable text, values  |
| --t2  | #8A8883   | Labels, knob names, hover text |
| --t3  | #4A4944   | Muted, disabled, screen meta   |

### Metallic (knob ramp, lightest → darkest)
| Stop | Hex       | Usage               |
|------|-----------|---------------------|
| 1    | #E8E6E1   | Brightest highlight  |
| 2    | #D4D2CD   | Light reflection     |
| 3    | #C0BEB8   | Mid-light            |
| 4    | #B0AEA8   | Mid                  |
| 5    | #A0A098   | Mid-shadow           |
| 6    | #8A8883   | Shadow               |
| 7    | #7A7A74   | Deep shadow          |
| 8    | #6E6C68   | Darkest groove       |
| 9    | #606058   | Inner disc darkest   |

---

## Typography

| Role              | Font                    | Size    | Weight | Case       | Letter-spacing |
|-------------------|-------------------------|---------|--------|------------|----------------|
| Note display      | JetBrains Mono          | 22px    | 700    | Normal     | —              |
| BPM / Octave val  | JetBrains Mono          | 15px    | 700    | Normal     | —              |
| Button text       | JetBrains Mono          | 11px    | 600    | UPPERCASE  | 2.5–3px        |
| Screen header     | JetBrains Mono          | 9px     | 400    | UPPERCASE  | 1–1.5px        |
| Knob label        | JetBrains Mono          | 9px     | 400    | UPPERCASE  | 2.5px          |
| Wave label        | JetBrains Mono          | 8px     | 400    | UPPERCASE  | 2px            |
| Key label         | JetBrains Mono          | 7px     | 400    | Normal     | —              |
| Status bar        | JetBrains Mono          | 9px     | 400    | UPPERCASE  | 1.5px          |
| Device title      | JetBrains Mono          | 10px    | 500    | UPPERCASE  | 3px            |
| Pad label         | JetBrains Mono          | 9px     | 500    | UPPERCASE  | 2px            |
| Pad key hint      | JetBrains Mono          | 7px     | 400    | UPPERCASE  | 1px            |
| Sequencer row     | JetBrains Mono          | 9px     | 400    | UPPERCASE  | 1px            |
| Sequencer step    | JetBrains Mono          | 8px     | 400    | Normal     | 1px            |

**Rule:** ALL text on the device surface is UPPERCASE. No mixed-case labels anywhere.

---

## Component Anatomy — Final Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: [SYNTHWAVE V1.0]                      [MODEL SV-1] (●) │
│                                                                  │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐ │
│  │  SCREEN (CRT + scanlines)  │  │  RIGHT PANEL               │ │
│  │                             │  │                            │ │
│  │  M — 01         AUDIO_OUT  │  │  ┌──────┬──────┬──────┐   │ │
│  │                             │  │  │ SYN  │ PAD  │ SEQ  │   │ │
│  │     ╭─── radial ───╮       │  │  └──────┴──────┴──────┘   │ │
│  │     │  ○ dashed     │       │  │                            │ │
│  │     │   ○ dashed    │       │  │  ┌─────────┐ ┌─────────┐  │ │
│  │     │    ○ solid    │       │  │  │  KNOB   │ │  KNOB   │  │ │
│  │     │    [■] LED    │       │  │  │ 100px   │ │ 100px   │  │ │
│  │     │    ○ glow     │       │  │  │ FILTER  │ │ REVERB  │  │ │
│  │     │   ░░ bars ░░  │       │  │  └─────────┘ └─────────┘  │ │
│  │     ╰───────────────╯       │  │  ┌─────────┐ ┌─────────┐  │ │
│  │                             │  │  │  KNOB   │ │  KNOB   │  │ │
│  │  C4              44.1 KHZ  │  │  │ 100px   │ │ 100px   │  │ │
│  └─────────────────────────────┘  │  │ ATTACK  │ │ VOLUME  │  │ │
│                                    │  └─────────┘ └─────────┘  │ │
│                                    │                            │ │
│                                    │       WAVEFORM             │ │
│                                    │  ┌────┬────┬────┬────┐    │ │
│                                    │  │ ⊓⊔ │ /\ │ ~  │ △  │    │ │
│                                    │  └────┴────┴────┴────┘    │ │
│                                    └────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  IF SYN: KEYBOARD — 15 white + 10 black (absolute pos)     │ │
│  │  IF PAD: DRUM PADS — 4×3 grid, 12 pads (MPC-style cushion) │ │
│  │  IF SEQ: STEP SEQUENCER — 16 steps × note/drum rows        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [REC] [PLAY] [STOP] [EXPORT]   Oct [−] 4 [+]    BPM [−]120[+] │
│                                                                  │
│  ● AUDIO ENGINE READY         LATENCY: 5.2MS       8 VOICES     │
└──────────────────────────────────────────────────────────────────┘
         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← bottom wall (~9px)
```

**Device dimensions:** 880px wide, padding 28px 32px
**Main split:** Screen (flex:1) + Right panel (300px), gap 24px

---

## Component Specifications

### Hardware Button (mode, transport)

Buttons sit inside an **inset tray** container:

**Tray:**
- Background: #111114
- Border-radius: 14px
- Padding: 7px
- Box-shadow: inset 0 2px 8px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.02), 0 1px 0 rgba(255,255,255,0.03)

**Button:**
- Height: 44px (mode) / 40px (transport)
- Background: linear-gradient(180deg, #242428 0%, #1E1E22 50%, #1A1A1E 100%)
- Border: 1px solid rgba(255,255,255,0.04)
- Border-radius: 10px
- Box-shadow: 0 2px 4px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)
- **Engraved text:** text-shadow: 0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)

**States:**
| State   | Background gradient              | Border                          | Color       | Shadow                                           |
|---------|----------------------------------|---------------------------------|-------------|--------------------------------------------------|
| Default | #242428 → #1E1E22 → #1A1A1E     | rgba(255,255,255,0.04)          | --t3        | 0 2px 4px rgba(0,0,0,0.35)                       |
| Hover   | #2C2C32 → #242428 → #1F1F24     | (same)                          | --t2        | (same)                                           |
| Active  | #1A1A1E → #161618 → #131316     | rgba(232,89,60,0.4)            | --accent    | 0 0 12px rgba(232,89,60,0.08), inset 0 2px 6px rgba(0,0,0,0.5) |
| Pressed | (same as active)                 | (same)                          | (same)      | transform: scale(0.97)                           |

**Active text glow:** text-shadow: 0 0 8px rgba(232,89,60,0.3), 0 -1px 0 rgba(0,0,0,0.5)

### Rotary Knob

**Size:** 100px × 100px

**Style:** Concentric groove rings (like precision machined metal or vinyl record texture).

**Outer bevel ring (3px):**
```css
background: linear-gradient(160deg, #D4D2CD 0%, #B0AEA8 40%, #8A8883 100%);
box-shadow: 0 8px 24px rgba(0,0,0,0.55),
            0 3px 8px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.25),
            inset 0 -1px 0 rgba(0,0,0,0.15);
```

**Inner disc (canvas-rendered grooves):**
- Base fill: radial gradient #E8E6E1 → #D8D6D1 → #C4C2BC → #B0AEA8
- Concentric grooves: dark ring strokes rgba(0,0,0,0.08–0.14), spacing 3.2px
- Highlight rings: rgba(255,255,255,0.15–0.25), offset by half spacing
- Top crescent shine: radial gradient white at 18% → transparent
- Bottom shadow: radial gradient black at 12% → transparent

**Indicator dot:** 5px circle at top center
- Background: --accent
- Box-shadow: 0 0 5px --accent, 0 0 10px rgba(232,89,60,0.35)

**Interaction:** Radial drag (tracks angular position of pointer relative to knob center). Range: −150° to +150°. Cursor: grab → grabbing.

**Labels:** 9px JetBrains Mono, --t2, letter-spacing 2.5px, UPPERCASE, 8px below knob.

**Knob parameters:**
| Knob   | Controls               | Default rotation |
|--------|------------------------|------------------|
| Filter | Low-pass cutoff freq   | −40°             |
| Reverb | Wet/dry mix            | +50°             |
| Attack | Envelope attack time   | −70°             |
| Volume | Master output gain     | +15°             |

### Radial Visualizer

Lives inside the CRT screen. Canvas: 300×300px, centered.

**FFT mapping:** Logarithmic bin mapping, symmetric mirroring. 72 bars split into two halves (0–35, 36–71). Both halves independently map low→high frequency so the full circle reacts uniformly to all audio. Lerp factor: 0.22. Sensitivity: floor −70dB, range ÷55.

**Layers (inside out):**
1. **Center LED** — 5px square (#E8593C during idle/recording, #4AE68A during playback), expands to ~7px on energy. Radial glow gradient around it, glow radius 10–16px.
2. **Glow ring** — radius 38px, 1.5px stroke, rgba(color, 0.04–0.22) based on energy.
3. **Inner solid ring** — radius 48px, 1px stroke, rgba(255,255,255, 0.08–0.14).
4. **Frequency bars** — 72 bars radiating outward from radius 56px. Length: 56–126px total. Width: 2px, round caps. Color: rgba(228,226,221, 0.25–1.0) based on bar height.
5. **Mid dashed ring** — radius 90px, 0.5px, dash [2,5], rgba(255,255,255,0.05).
6. **Outer dashed ring** — radius 130px, 0.7px, dash [3,6], rgba(255,255,255,0.06).
7. **Outer dots** — 40 dots at radius 136px, 0.7px radius, rgba(255,255,255,0.07).

**Behavior:**
- Idle: bars drift randomly within 0.01–0.08 height, updated every 900ms (gentle breathing)
- Note/pad trigger: all bars jump to 0.5–1.0, energy → 1, decays over ~500ms
- Recording: LED color stays red (#E8593C), intensity amplified
- Playback: LED color switches to green (#4AE68A)
- No auto-demo timer (removed — visualizer reacts to real audio only)

### Display Screen (CRT)

- Background: #111114
- Border: 2px solid #0A0A0C
- Border-radius: 12px
- Box-shadow: inset 0 3px 12px rgba(0,0,0,0.8)
- **CRT noise grain:** canvas-animated 180×120 noise stretched to fill, imageRendering: pixelated, ~14fps for analog static feel, warm-tinted (green ×0.38, blue ×0.22), alpha 3–21 per pixel, opacity 0.28, mix-blend-mode: screen
- **Scanline overlay:** repeating-linear-gradient(0deg, transparent 2px, rgba(0,0,0,0.09) 2px, 4px total period)
- **Header:** top-left "M — 01", top-right "AUDIO_OUT" (9px, --t3, UPPERCASE)
- **Footer:** bottom-left = note display (22px bold, --accent, minHeight 28px), bottom-right = "44.1 KHZ" (9px, --t3, UPPERCASE)

### Waveform Selector

Same tray + button pattern as mode buttons but smaller:

**Tray:** same as mode tray but border-radius 12px, padding 6px
**Buttons:** 56×40px, border-radius 9px
**Icons:** 22×16px SVG, stroke-width 1.8, round caps
**Waveforms:**
| Icon    | Shape        | Tone character     |
|---------|--------------|--------------------|
| Square  | ⊓⊔ steps     | Hollow, retro      |
| Sawtooth| /\/\ zigzag  | Bright, buzzy      |
| Sine    | ∿ curve      | Pure, clean        |
| Triangle| △ peaks      | Soft, mellow       |

### Piano Keyboard

- 2 octaves + 1 key (C4–C6 default, shifts with octave control)
- 15 white keys, 10 black keys
- **Layout:** white keys use `flex:1` in a row; black keys use `position: absolute` calculated as `(whiteIndex+1) * (100/15)%` centered
- Height: 90px
- White keys: flex:1, gradient #E8E6E1 → #D4D2CD
- Black keys: 62% of one white key width, 56% height, gradient #2A2A2E → #1A1A1E, `position: absolute`
- Black key positions (per octave): C# D# — gap — F# G# A#
- Key labels: 7px JetBrains Mono at bottom of white keys
- Pressed state: darker gradient + inset shadow

### Drum Pads (PAD mode)

Replaces the keyboard in PAD mode. 4 columns × 3 rows = **12 pads**.

**Grid:**
```
Row 1: KICK    SNARE   CLAP    RIM
Row 2: HH-CL   HH-OP   CRASH   RIDE
Row 3: TOM-HI  TOM-LO  CONGA   808
```

**Computer keyboard shortcuts:**
```
Row 1: 1=KICK, 2=SNARE, 3=CLAP, 4=RIM
Row 2: Q=HH-CL, W=HH-OP, E=CRASH, R=RIDE
Row 3: A=TOM-HI, S=TOM-LO, D=CONGA, F=808
```

**Pad styling — convex cushion (MPC-style):**
- Size: fills 4-column grid, ~1:1 aspect ratio
- Default: `radial-gradient(ellipse at 38% 32%, #38383F 0%, #28282E 35%, #1E1E24 70%, #191920 100%)`
- Active/pressed: `radial-gradient(ellipse at 38% 32%, rgba(232,89,60,0.75) 0%, rgba(180,60,30,0.6) 40%, rgba(120,35,20,0.4) 70%, rgba(60,15,10,0.3) 100%)`
- Border: 1.5px solid (use `borderWidth`/`borderStyle`/`borderColor` separately — not shorthand `border`)
  - Default border-color: rgba(255,255,255,0.06)
  - Active border-color: rgba(232,89,60,0.5)
- Border-radius: 10px
- Default box-shadow: `0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.4)`
- Active box-shadow: `0 0 18px rgba(232,89,60,0.2), inset 0 2px 8px rgba(0,0,0,0.7), inset 0 0 12px rgba(232,89,60,0.15)`
- **Top-left glint:** absolutely positioned div, 40% wide × 45% tall, `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.12), transparent 70%)`, pointer-events none
- Label: 9px JetBrains Mono, --t3, UPPERCASE, letter-spacing 2px, centered
- Key hint: 7px JetBrains Mono, --t3 at 50% opacity, bottom-right corner

**Container tray:** background #131316, border-radius 14px, padding 8px, `box-shadow: inset 0 2px 8px rgba(0,0,0,0.7)`

**Audio (drums.ts) — synthesized, no external files:**
| Pad     | Synth type       | Notes                                     |
|---------|------------------|-------------------------------------------|
| KICK    | MembraneSynth    | pitchDecay 0.08, octaves 6, note C1      |
| SNARE   | NoiseSynth       | white noise, decay 0.15                   |
| CLAP    | NoiseSynth       | pink noise, decay 0.1                     |
| RIM     | MetalSynth       | freq 800Hz, decay 0.06                    |
| HH-CL   | MetalSynth       | freq 400Hz, decay 0.05 (closed hat)       |
| HH-OP   | MetalSynth       | freq 400Hz, decay 0.4 (open hat)          |
| CRASH   | MetalSynth       | freq 300Hz, decay 1.0                     |
| RIDE    | MetalSynth       | freq 350Hz, decay 0.5                     |
| TOM-HI  | MembraneSynth    | note G2, pitchDecay 0.05                  |
| TOM-LO  | MembraneSynth    | note A1, pitchDecay 0.07                  |
| CONGA   | MembraneSynth    | note E2, pitchDecay 0.04                  |
| 808     | MembraneSynth    | pitchDecay 0.5, octaves 8, note C1        |

**Signal chain:** DrumEngine → `engineRef.current.analyser` (same analyser as synth, so visualizer reacts to drums)

**Important:** `MetalSynth.frequency` must be set AFTER construction, not in the options object (TypeScript limitation). Always use `Tone.now() + 0.05` lookahead when scheduling drum hits. Call `void Tone.start()` synchronously at the top of the trigger handler (before any await) to unlock AudioContext within the user gesture frame.

### Step Sequencer (SEQ mode)

Replaces keyboard/pads in SEQ mode. 16 steps × N rows.

**Grid rows:**
- If last recording was SYN: 24 rows = GRID_NOTES (chromatic C3–B4)
- If last recording was PAD: 12 rows = DRUM_ROWS (KICK through 808)
- Row labels on left side, 9px UPPERCASE, --t3

**Cell styling:**
- Inactive: background #1E1E22, border 1px solid rgba(255,255,255,0.04), border-radius 3px
- Active: background #E8593C, border-radius 3px, box-shadow 0 0 6px rgba(232,89,60,0.2)
- Hover: background #262629
- Playhead column: cells get brighter border rgba(255,255,255,0.15)

**Header:** Step numbers (1, 5, 9, 13) above grid, 8px, --t3. **CLEAR button** on right side — resets all active steps.

**Container:** inset tray style, background #131316, border-radius 14px, padding 8px.

**Performance:** Use `React.memo` on individual cells to avoid full grid re-renders on step toggle.

### Transport Bar

**Layout:**
```
[REC] [PLAY] [STOP] [EXPORT]    OCT [−] 4 [+]    BPM [−] 120 [+]
```
`showOctave` prop — Oct +/- hidden in PAD mode.

**Transport states:**
| State         | REC              | PLAY             | STOP     | EXPORT              |
|---------------|------------------|------------------|----------|---------------------|
| Idle          | Default          | Default          | Default  | Hidden              |
| Recording     | Pulsing red      | Disabled         | Stops    | Hidden              |
| Has recording | Default          | Default          | Default  | Visible             |
| Playing       | Disabled         | Active (green)   | Stops    | Disabled            |
| Exporting     | Disabled         | Disabled         | Disabled | Pulsing (progress)  |

**REC button:** Red dot icon. During recording: border pulses red, shows elapsed time "0:03".
**EXPORT button:** Download arrow icon. Only visible when `events.length > 0`. During export: "EXPORTING..." pulse.
**BPM control:** +/- buttons (30×30px), range 60–200.
**Oct control:** +/- buttons (30×30px), range 1–7.

---

## Device Body

**Structure:** Two-layer system for 3D bottom wall effect.

**Outer wrapper (`deviceOuter`):**
```css
position: relative;
width: 880px;
```

**Wall layer (`deviceWall`)** — sits behind face, creates visible bottom depth:
```css
position: absolute;
top: 8px; left: 3px; right: 3px; bottom: -9px;
background: linear-gradient(180deg, #19191D 0%, #121215 50%, #0C0C0F 100%);
border-radius: 22px;
box-shadow: 0 60px 160px rgba(0,0,0,0.95), 0 24px 60px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.04);
z-index: 0;
```
Visible bottom wall height ≈ 9px. Same width as face (left/right inset 3px each side).

**Face layer (`device`):**
```css
background: linear-gradient(175deg, #1E1E22 0%, #1A1A1E 30%, #171719 100%);
border-radius: 22px;
position: relative;
z-index: 1;
box-shadow: 0 4px 14px rgba(0,0,0,0.65),
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.5);
```

**Grain texture overlay:**
- 64×64px canvas-generated noise tile
- Composited with `mix-blend-mode: overlay`, opacity 0.6
- Gives the device surface a tactile, slightly rough feel like real painted metal

---

## Page Background

```css
body {
  background:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
    radial-gradient(ellipse at center, #141418 0%, var(--base) 70%);
  background-size: 60px 60px, 60px 60px, 100% 100%;
}
```
Subtle grid lines at 4% white opacity, 60px spacing, on a radial dark gradient.

---

## Engraved Text Effect

All labels on the device body (header, knob labels, status bar, transport labels) use an engraved text-shadow to look stamped/cut into the surface:
```css
text-shadow: 0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04);
```
Active accent text uses a glow variant:
```css
text-shadow: 0 0 8px rgba(232,89,60,0.3), 0 -1px 0 rgba(0,0,0,0.5);
```

---

## Sci-Fi Terminal Effects

1. **Scanlines:** repeating-linear-gradient on screen, 4px period, 9% opacity dark bands
2. **CRT noise grain:** canvas-animated warm static overlay, ~14fps, mix-blend-mode: screen
3. **Note flicker:** opacity animation 0.94–1.0 over 4s on note display
4. **LED pulse:** opacity 0.55–1.0 over 2s on power LED and recording dot
5. **Vignette:** radial-gradient on body, transparent center → 50% black edge
6. **Grain texture:** canvas-generated noise tile overlay on device body (mix-blend-mode: overlay)

---

## Spacing & Layout Rules

| Measurement              | Value    |
|--------------------------|----------|
| Device padding           | 28px 32px|
| Device border-radius     | 22px     |
| Device width             | 880px    |
| Bottom wall depth        | ~9px     |
| Main gap (screen↔panel)  | 24px     |
| Right panel width        | 300px    |
| Section gap (vertical)   | 16–22px  |
| Button tray padding      | 6–7px    |
| Button tray gap          | 6px      |
| Knob grid gap            | 18px     |
| Keyboard height          | 90px     |
| Drum pad grid height     | ~300px   |
| Transport button height  | 40px     |

---

## Audio Signal Chain

```
PolySynth (8 voices)
  └→ Filter (lowpass, Filter knob controls cutoff 100Hz–8000Hz)
       └→ Reverb (Reverb knob controls wet 0–1)
            └→ Gain (Volume knob controls gain 0–1)
                 ├→ Analyser (FFT 128-bin → feeds RadialVisualizer)
                 ├→ Recorder (Tone.Recorder → WAV export blob)
                 └→ Destination (speakers)

DrumEngine (12 synths: MembraneSynth × 5, NoiseSynth × 3, MetalSynth × 4)
  └→ engineRef.current.analyser (directly into analyser, bypasses filter/reverb)
       └→ (continues through same chain to destination)
```

**Note:** Drums connect directly to the analyser node so the visualizer reacts, but drums bypass Filter and Reverb knobs. Volume knob still affects drums.

---

## Architecture (for reference)

```
Framer site
  └── Synth shell component
        └── onClick / iframe → yourapp.vercel.app
              ├── React + Tone.js (Next.js App Router)
              ├── Web Audio API (oscillators, filters, reverb)
              ├── Canvas (radial visualizer, CRT noise grain, knob texture)
              └── This design system (inline styles + globals.css CSS variables)
```
