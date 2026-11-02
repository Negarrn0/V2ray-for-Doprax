import { forwardRef, useEffect, useRef, useState } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../config/defaultMenu';
import { MenuBoard, type MenuBoardProps } from './board/MenuBoard';

/** Fits the native 4K board into any container while preserving 16:9. */
export const ScaledBoard = forwardRef<HTMLDivElement, MenuBoardProps & { className?: string; shadow?: boolean }>(
  function ScaledBoard({ className = '', shadow = false, ...boardProps }, boardRef) {
    const host = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.25);

    useEffect(() => {
      const el = host.current;
      if (!el) return;
      const ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setScale(Math.max(0.05, Math.min(width / BOARD_WIDTH, height / BOARD_HEIGHT)));
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    return (
      <div ref={host} className={`relative grid h-full w-full place-items-center overflow-hidden ${className}`}>
        <div
          className={shadow ? 'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/5' : ''}
          style={{ width: BOARD_WIDTH * scale, height: BOARD_HEIGHT * scale, position: 'relative' }}
        >
          <MenuBoard
            ref={boardRef}
            {...boardProps}
            style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: '0 0' }}
          />
        </div>
      </div>
    );
  },
);
