// src/ChromaDots.tsx
import React, {
  useRef,
  useEffect,
  useState,
  ReactNode,
  MouseEvent,
  TouchEvent,
  ElementType,
} from 'react';
import clsx from 'clsx';
import {
  FixedSizeList as List,
  ListChildComponentProps,
} from 'react-window';

export interface ChromaDotsProps {
  children: ReactNode[];

  // Layout
  direction?: 'horizontal' | 'vertical';
  responsiveDirection?: {
    base?: 'horizontal' | 'vertical';
    md?: 'horizontal' | 'vertical';
  };
  containerWidth?: string;    // CSS width (e.g. '100%' or 'w-[300px]')
  containerHeight?: string;   // CSS height (e.g. '200px' or 'h-40')

  // Default item spacing (gap between flex children)
  itemSpacing?: string;       // Tailwind gap class, e.g. 'gap-2'

  // Scroll + Snap
  scrollSnap?: boolean;
  snapAlign?: 'start' | 'center' | 'end';
  draggable?: boolean;

  // Virtualization
  virtualize?: boolean;
  virtualWidth?: number;      // px, required if virtualize=true
  virtualHeight?: number;     // px, required if virtualize=true
  itemSize?: number;          // px per item in scroll direction
  overscanCount?: number;

  // Wrapper element for each child
  wrapperElement?: ElementType;

  // Dots
  showDots?: boolean;
  dotColor?: string;
  activeColor?: string;
  dotSize?: string;
  dotSpacing?: string;
  animateActive?: boolean;

  // Arrows
  showArrows?: boolean;
  arrowColor?: string;
  arrowSize?: string;

  // Extra classes on root
  className?: string;

  // Callbacks
  onDotClick?: (index: number) => void;
  onArrowClick?: (newIndex: number) => void;
}

const ChromaDots: React.FC<ChromaDotsProps> = ({
  children,
  direction = 'vertical',
  responsiveDirection,
  containerWidth = '100%',
  containerHeight = '200px',      // fallback height

  itemSpacing = 'gap-2',          // default gap

  scrollSnap = false,
  snapAlign = 'start',
  draggable = true,

  virtualize = false,
  virtualWidth,
  virtualHeight,
  itemSize = 100,
  overscanCount = 2,

  wrapperElement = 'div',

  showDots = true,
  dotColor = 'bg-gray-300',
  activeColor = 'bg-blue-500',
  dotSize = 'w-2 h-2',
  dotSpacing = 'gap-2',
  animateActive = true,

  showArrows = false,
  arrowColor = 'text-gray-700',
  arrowSize = 'text-xl',

  className = '',
  onDotClick,
  onArrowClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDir, setCurrentDir] = useState(direction);
  const [visibleSize, setVisibleSize] = useState(0);
  const [dots, setDots] = useState<boolean[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Responsive direction
  useEffect(() => {
    if (!responsiveDirection) return;
    const update = () => {
      const w = window.innerWidth;
      if (w >= 768 && responsiveDirection.md) {
        setCurrentDir(responsiveDirection.md);
      } else {
        setCurrentDir(responsiveDirection.base || direction);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [responsiveDirection, direction]);

  // Measure scroll area & build dot array
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const total =
      currentDir === 'horizontal' ? el.scrollWidth : el.scrollHeight;
    const visible =
      currentDir === 'horizontal' ? el.clientWidth : el.clientHeight;

    setVisibleSize(visible);
    const count = Math.ceil(total / visible);
    setDots(Array(count).fill(false));

    const onScroll = () => {
      const pos =
        currentDir === 'horizontal' ? el.scrollLeft : el.scrollTop;
      const idx = Math.min(Math.floor(pos / visible), count - 1);
      setActiveIdx(idx);
      setDots((prev) => prev.map((_, i) => i === idx));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [currentDir, children]);

  // Scroll-to helpers
  const scrollTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const offset = i * visibleSize;
    const behavior = { behavior: 'smooth' as const };

    if (currentDir === 'horizontal') {
      el.scrollTo({ left: offset, ...behavior });
    } else {
      el.scrollTo({ top: offset, ...behavior });
    }
    onDotClick?.(i);
    onArrowClick?.(i);
  };
  const prev = () => scrollTo(Math.max(activeIdx - 1, 0));
  const next = () => scrollTo(Math.min(activeIdx + 1, dots.length - 1));

  // Drag-to-scroll
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const onMouseDown = (e: MouseEvent) => {
    if (!draggable) return;
    const el = containerRef.current!;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      startY: e.pageY - el.offsetTop,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
    el.classList.add('cursor-grabbing');
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = containerRef.current!;
    const dx = e.pageX - el.offsetLeft - dragState.current.startX;
    const dy = e.pageY - el.offsetTop - dragState.current.startY;
    if (currentDir === 'horizontal') {
      el.scrollLeft = dragState.current.scrollLeft - dx;
    } else {
      el.scrollTop = dragState.current.scrollTop - dy;
    }
  };
  const onMouseUp = () => {
    dragState.current.isDown = false;
    containerRef.current?.classList.remove('cursor-grabbing');
  };
  const onTouchStart = (e: TouchEvent) =>
    onMouseDown((e as unknown) as MouseEvent);
  const onTouchMove = (e: TouchEvent) =>
    onMouseMove((e as unknown) as MouseEvent);
  const onTouchEnd = onMouseUp;

  // Flatten children
  const arr = React.Children.toArray(children);

  // Render one item (used by both paths)
  const renderItem = (index: number, style?: React.CSSProperties) => {
    const Tag = wrapperElement;
    return (
      <Tag
        key={index}
        style={style}
        className={clsx(
          'flex-shrink-0',
          scrollSnap && `snap-${snapAlign}`
        )}
      >
        {arr[index]}
      </Tag>
    );
  };

  console.log('dots count:', dots.length, dots);

  // Guarantee at least one dot
  useEffect(() => {
    if (dots.length === 0 && children.length > 0) {
      setDots(Array(children.length).fill(false));
    }
  }, [dots, children]);


  return (
    <div className={clsx('relative inline-block', className)}>
      {virtualize ? (
        // ————————————————————————————————————————————————— Virtualized —
        <>
          {(!virtualWidth || !virtualHeight) &&
            (() => {
              throw new Error(
                '`virtualWidth` and `virtualHeight` (numbers) are required when virtualize=true'
              );
            })()}
          <List
            outerRef={containerRef}
            layout={currentDir === 'horizontal' ? 'horizontal' : 'vertical'}
            width={virtualWidth!}
            height={virtualHeight!}
            itemCount={arr.length}
            itemSize={itemSize}
            overscanCount={overscanCount}
            className={clsx(
              'hide-scrollbar',
              'flex',
              itemSpacing,
              { 'cursor-grab': draggable }
            )}
            style={{
              scrollSnapType: scrollSnap
                ? `${currentDir === 'horizontal' ? 'x' : 'y'} mandatory`
                : undefined,
              overflowX:
                currentDir === 'horizontal' ? 'auto' : 'hidden',
              overflowY:
                currentDir === 'vertical' ? 'auto' : 'hidden',
            }}
            onScroll={() => {
              // re-fire event so our effect picks it up
              containerRef.current?.dispatchEvent(
                new Event('scroll')
              );
            }}
          >
            {({ index, style }: ListChildComponentProps) =>
              renderItem(index, style)
            }
          </List>
        </>
      ) : (
        // ———————————————————————————————————————— Regular overflow —
        <div
          ref={containerRef}
          className={clsx(
            'hide-scrollbar overflow-auto',
            'flex',
            itemSpacing,
            { 'cursor-grab': draggable }
          )}
          style={{
            flexDirection:
              currentDir === 'horizontal' ? 'row' : 'column',
            width: containerWidth,
            height: containerHeight,
            scrollSnapType: scrollSnap
              ? `${currentDir === 'horizontal' ? 'x' : 'y'} mandatory`
              : undefined,
            overflowX:
              currentDir === 'horizontal' ? 'auto' : 'hidden',
            overflowY:
              currentDir === 'vertical' ? 'auto' : 'hidden',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {arr.map((_, i) => renderItem(i))}
        </div>
      )}

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            onClick={prev}
            className={clsx(
              'absolute left-2 top-1/2 transform -translate-y-1/2',
              arrowColor,
              arrowSize,
              'p-1 rounded-full bg-white/50'
            )}
          >
            ‹
          </button>
          
          <button
            onClick={next}
            className={clsx(
              'absolute right-2 translate-x-40 top-1/2 transform -translate-y-1/2',
              arrowColor,
              arrowSize,
              'p-1 rounded-full bg-white/50'
            )}
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div
          className={clsx(
            'absolute p-1 z-10',
            dotSpacing,
            currentDir === 'horizontal'
              ? 'bottom-2 left-1/2 -translate-x-1/2 flex flex-row'
              : 'right-2 top-1/2 -translate-y-1/2 flex flex-col'
          )}
        >
          {dots.map((isActive, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={clsx(
                'rounded-full transition-transform duration-200 ease-in-out',
                dotSize,
                isActive
                  ? clsx(activeColor, {
                      'scale-125 shadow-md': animateActive,
                    })
                  : dotColor
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChromaDots;
