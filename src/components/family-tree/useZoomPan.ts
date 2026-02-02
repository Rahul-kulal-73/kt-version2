import { useRef, useCallback, useState, useEffect } from 'react';

export interface ZoomPanState {
  scale: number;
  translateX: number;
  translateY: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;
const ZOOM_STEP = 0.1;

export const useZoomPan = (containerRef: React.RefObject<SVGSVGElement>) => {
  const [state, setState] = useState<ZoomPanState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastTranslateRef = useRef({ x: 0, y: 0 });

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current) return;

      e.preventDefault();
      const svg = containerRef.current;
      const rect = svg.getBoundingClientRect();

      // Get mouse position relative to SVG
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Determine zoom direction
      const direction = e.deltaY > 0 ? -1 : 1;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, state.scale + direction * ZOOM_STEP)
      );

      // Calculate new translate to zoom towards mouse position
      const scaleDiff = newScale - state.scale;
      const newTranslateX =
        state.translateX - (mouseX * scaleDiff) / newScale;
      const newTranslateY =
        state.translateY - (mouseY * scaleDiff) / newScale;

      setState({
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    },
    [state.scale, state.translateX, state.translateY]
  );

  // Handle mouse down for pan
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 1 && e.button !== 2) return; // Middle or right click

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastTranslateRef.current = {
      x: state.translateX,
      y: state.translateY,
    };
  }, [state.translateX, state.translateY]);

  // Handle mouse move for pan
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setState((prev) => ({
      ...prev,
      translateX: lastTranslateRef.current.x + deltaX,
      translateY: lastTranslateRef.current.y + deltaY,
    }));
  }, []);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Reset zoom and pan
  const reset = useCallback(() => {
    setState({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  }, []);

  // Fit to bounds
  const fitToBounds = useCallback(
    (boundingBox: { x: number; y: number; width: number; height: number }) => {
      if (!containerRef.current) return;

      const svg = containerRef.current;
      const rect = svg.getBoundingClientRect();
      const padding = 50;

      const availableWidth = rect.width - padding * 2;
      const availableHeight = rect.height - padding * 2;

      const scaleX = availableWidth / boundingBox.width;
      const scaleY = availableHeight / boundingBox.height;
      const newScale = Math.min(scaleX, scaleY, MAX_SCALE);

      const newTranslateX =
        padding - boundingBox.x * newScale + (availableWidth - boundingBox.width * newScale) / 2;
      const newTranslateY =
        padding - boundingBox.y * newScale + (availableHeight - boundingBox.height * newScale) / 2;

      setState({
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    },
    []
  );

  // Setup event listeners
  useEffect(() => {
    if (!containerRef.current) return;

    const svg = containerRef.current;
    svg.addEventListener('wheel', handleWheel, { passive: false });
    svg.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      svg.removeEventListener('wheel', handleWheel);
      svg.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    state,
    reset,
    fitToBounds,
  };
};
