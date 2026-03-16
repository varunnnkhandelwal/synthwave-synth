'use client';

import Knob from './Knob';

interface KnobPanelProps {
  filterAngle: number;
  reverbAngle: number;
  attackAngle: number;
  volumeAngle: number;
  onFilterChange: (v: number) => void;
  onReverbChange: (v: number) => void;
  onAttackChange: (v: number) => void;
  onVolumeChange: (v: number) => void;
}

export default function KnobPanel({
  filterAngle, reverbAngle, attackAngle, volumeAngle,
  onFilterChange, onReverbChange, onAttackChange, onVolumeChange,
}: KnobPanelProps) {
  return (
    <div style={styles.grid}>
      <Knob label="FILTER" angle={filterAngle} onAngleChange={onFilterChange} />
      <Knob label="REVERB" angle={reverbAngle} onAngleChange={onReverbChange} />
      <Knob label="ATTACK" angle={attackAngle} onAngleChange={onAttackChange} />
      <Knob label="VOLUME" angle={volumeAngle} onAngleChange={onVolumeChange} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 18,
  },
};
