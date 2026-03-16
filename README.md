# SYNTHWAVE — Browser-Based Synthesizer

A skeuomorphic web synthesizer built with Next.js and Tone.js. Play melodies on a piano keyboard, create beats on drum pads, arrange music on a step sequencer, and export your creations as audio files — all from your browser.

## What It Does

**Three modes, one instrument:**

- **SYN** — Play a 2-octave piano keyboard using your mouse or computer keys. Shape your sound with filter, reverb, attack, and volume knobs. Choose between square, sawtooth, sine, and triangle waveforms.

- **PAD** — Tap out beats on a 4×4 grid of drum pads. Kick, snare, hi-hat, clap, toms, 808 — 16 synthesized percussion sounds mapped to your keyboard.

- **SEQ** — Arrange notes and beats on a 16-step sequencer grid. Record a live performance in SYN or PAD mode, then switch to SEQ to see it quantized on the grid. Click cells to edit, loop playback, and fine-tune your track.

**Record and export:**
Hit REC, play your music, then export as a WAV file. The export captures everything — your waveform choice, filter settings, reverb, volume — exactly as you heard it.

## Design

The interface is inspired by hardware synthesizers and sci-fi control panels. Dark surfaces, brushed metal rotary knobs, CRT-style display with scanlines, and a radial audio visualizer that reacts to everything you play.

Built to match a custom design system with hand-specified colors, gradients, typography, and interaction states.

## Tech Stack

- **Next.js** (App Router) — React framework
- **Tone.js** — Audio synthesis, effects, transport, and recording
- **HTML Canvas** — Radial frequency visualizer
- **TypeScript** — Strict mode throughout
- **JetBrains Mono** — Monospace typography

## Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Keyboard Shortcuts

**SYN mode (piano):**
| Key | Note |
|-----|------|
| A S D F G H J K L | C D E F G A B C D |
| W E T Y U | C# D# F# G# A# |

**PAD mode (drums):**
| Key | Sound |
|-----|-------|
| 1 2 3 4 | Kick, Snare, Clap, Rim |
| Q W E R | HH-Closed, HH-Open, Crash, Ride |
| A S D F | Tom-Hi, Tom-Mid, Tom-Lo, Cowbell |
| Z X C V | Shaker, Tamb, Conga, 808 |

## Deploy

This app is designed to deploy on Vercel with zero configuration:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys on every push.

## Project Structure

```
synth-app/
├── app/           # Next.js pages and global styles
├── components/    # UI components (keyboard, knobs, pads, sequencer, etc.)
├── audio/         # Tone.js engine, drum synthesis, recorder, exporter
├── hooks/         # React hooks for audio, knob drag, keyboard input
├── types/         # Shared TypeScript types
└── public/        # Static assets
```

## License

MIT
