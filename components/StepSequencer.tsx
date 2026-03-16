'use client';

import { memo } from 'react';
import { GRID_STEPS } from '@/audio/sequencer';

interface StepSequencerProps {
  grid: boolean[][];
  rowLabels: string[];
  currentStep: number;
  onToggleStep: (row: number, step: number) => void;
  onClear: () => void;
}

interface CellProps {
  active: boolean;
  isPlayhead: boolean;
  onToggle: () => void;
}

const Cell = memo(function Cell({ active, isPlayhead, onToggle }: CellProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        ...cellBase,
        background: active ? '#E8593C' : isPlayhead ? '#26262E' : '#1E1E22',
        border: `1px solid ${isPlayhead ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)'}`,
        boxShadow: active ? '0 0 6px rgba(232,89,60,0.35)' : 'none',
      }}
    />
  );
});

export default function StepSequencer({ grid, rowLabels, currentStep, onToggleStep, onClear }: StepSequencerProps) {
  const stepNumbers = [1, 5, 9, 13];

  return (
    <div style={styles.wrap}>
      {/* Step number header */}
      <div style={styles.header}>
        <div style={styles.labelCol} />
        {Array.from({ length: GRID_STEPS }, (_, i) => (
          <div key={i} style={styles.stepNum}>
            {stepNumbers.includes(i + 1) ? i + 1 : ''}
          </div>
        ))}
        <button onClick={onClear} style={styles.clearBtn}>CLEAR</button>
      </div>

      {/* Rows */}
      <div style={styles.tray}>
        {rowLabels.map((label, rowIdx) => (
          <div key={label} style={styles.row}>
            <div style={styles.noteLabel}>{label}</div>
            {Array.from({ length: GRID_STEPS }, (_, stepIdx) => (
              <Cell
                key={stepIdx}
                active={grid[rowIdx]?.[stepIdx] ?? false}
                isPlayhead={currentStep === stepIdx}
                onToggle={() => onToggleStep(rowIdx, stepIdx)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const cellBase: React.CSSProperties = {
  flex: 1,
  height: '100%',
  borderRadius: 3,
  cursor: 'pointer',
  transition: 'background 0.06s',
  minWidth: 0,
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  labelCol: {
    width: 36,
    flexShrink: 0,
  },
  stepNum: {
    flex: 1,
    fontSize: 8,
    fontWeight: 400,
    color: 'var(--t3)',
    textAlign: 'center',
    fontFamily: 'JetBrains Mono, monospace',
    minWidth: 0,
  },
  clearBtn: {
    marginLeft: 8,
    padding: '2px 8px',
    fontSize: 8,
    fontWeight: 600,
    fontFamily: 'JetBrains Mono, monospace',
    color: 'var(--t2)',
    background: '#1E1E22',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'color 0.1s, border-color 0.1s',
  },
  tray: {
    background: '#131316',
    borderRadius: 12,
    padding: '8px 8px',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: 10,
  },
  noteLabel: {
    width: 36,
    flexShrink: 0,
    fontSize: 9,
    fontWeight: 400,
    color: 'var(--t3)',
    fontFamily: 'JetBrains Mono, monospace',
    textAlign: 'right',
    paddingRight: 6,
  },
};
