import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

type ImagePositionPickerProps = {
  imageUrl: string;
  position: { x: number; y: number };
  onChange: (position: { x: number; y: number }) => void;
  objectFit?: 'cover' | 'contain' | 'fill';
};

export default function ImagePositionPicker({
  imageUrl,
  position,
  onChange,
  objectFit = 'cover',
}: ImagePositionPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

      onChange({ x, y });
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updatePosition(e.clientX, e.clientY);
    },
    [updatePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    },
    [isDragging, updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    },
    [isDragging, updatePosition]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Presets for quick positioning
  const presets = [
    { label: 'Topo', x: 50, y: 0 },
    { label: 'Centro', x: 50, y: 50 },
    { label: 'Base', x: 50, y: 100 },
    { label: 'Esq', x: 0, y: 50 },
    { label: 'Dir', x: 100, y: 50 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Ponto Focal</span>
        <span className="text-xs text-muted-foreground">
          {Math.round(position.x)}% × {Math.round(position.y)}%
        </span>
      </div>

      {/* Image preview with draggable point */}
      <div
        ref={containerRef}
        className={cn(
          'relative aspect-video rounded-lg overflow-hidden border-2 cursor-crosshair select-none',
          isDragging ? 'border-primary' : 'border-border'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full pointer-events-none"
          style={{
            objectFit,
            objectPosition: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Focal point indicator */}
        <div
          className={cn(
            'absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform',
            isDragging ? 'scale-125' : ''
          )}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-primary border-2 border-white shadow-lg" />
          <div className="absolute inset-1/3 rounded-full bg-white" />
        </div>

        {/* Crosshair lines */}
        <div
          className="absolute top-0 bottom-0 w-px bg-primary/50 pointer-events-none"
          style={{ left: `${position.x}%` }}
        />
        <div
          className="absolute left-0 right-0 h-px bg-primary/50 pointer-events-none"
          style={{ top: `${position.y}%` }}
        />
      </div>

      {/* Preset buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={cn(
              'px-3 py-1 text-xs rounded-full border transition-colors',
              position.x === preset.x && position.y === preset.y
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'
            )}
            onClick={() => onChange({ x: preset.x, y: preset.y })}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Arraste o ponto ou use os presets para ajustar o foco da imagem
      </p>
    </div>
  );
}
