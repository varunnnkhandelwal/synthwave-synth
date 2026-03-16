'use client';

import { useCallback, useRef } from 'react';

interface UseKnobDragOptions {
  angle: number;
  onAngleChange: (angle: number) => void;
  min?: number;
  max?: number;
}

/**
 * Radial knob drag — tracks the angular position of the pointer
 * relative to the knob center so the knob follows the direction
 * you actually rotate your mouse, just like a real hardware dial.
 */
export function useKnobDrag({ angle, onAngleChange, min = -150, max = 150 }: UseKnobDragOptions) {
  const dragging = useRef(false);
  const startPointerAngle = useRef(0);
  const startKnobAngle = useRef(0);
  const knobCenter = useRef({ x: 0, y: 0 });

  /** Angle (degrees) from knob center to pointer, 0 = up, CW positive */
  const pointerAngle = (clientX: number, clientY: number): number => {
    const dx = clientX - knobCenter.current.x;
    const dy = clientY - knobCenter.current.y;
    // atan2 gives angle from positive-X axis; we want 0 = up (negative-Y)
    // so rotate by -90°. Result: up=0, right=90, down=180, left=-90
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Calculate knob center from the element's bounding rect
    const rect = e.currentTarget.getBoundingClientRect();
    knobCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    dragging.current = true;
    startPointerAngle.current = pointerAngle(e.clientX, e.clientY);
    startKnobAngle.current = angle;
    document.body.style.cursor = 'grabbing';
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [angle]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;

    const currentPointerAngle = pointerAngle(e.clientX, e.clientY);
    let delta = currentPointerAngle - startPointerAngle.current;

    // Normalise delta to [-180, 180] so crossing the ±180 boundary
    // doesn't cause a sudden 360° jump
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const newAngle = Math.max(min, Math.min(max, startKnobAngle.current + delta));
    onAngleChange(newAngle);
  }, [onAngleChange, min, max]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = '';
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
