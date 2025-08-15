import React, { useRef, useEffect, useState } from 'react';

export interface ChromaDotsProps {
  children: React.ReactNode;
  dotColor?: string;
  activeColor?: string;
  direction?: 'vertical' | 'horizontal';
  responsiveDirection?: {
    base?: 'vertical' | 'horizontal';
    md?: 'vertical' | 'horizontal';
  };
  scrollSnap?: boolean;
  className?: string;
  dotSize?: string;
  dotSpacing?: string;
  animateActive?: boolean;
  onDotClick?: (index: number) => void;
}

const ChromaDots: React.FC<ChromaDotsProps> = ({
  children,
  dotColor = 'bg-gray-300',
  activeColor = 'bg-blue-500',
  direction = 'vertical',
  responsiveDirection,
  scrollSnap = false,
  className = '',
  dotSize = 'w-2 h-2',
  dotSpacing = 'gap-2',
  animateActive = true,
  onDotClick,                     // now optional
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<boolean[]>([]);           // renamed state
  const [visibleSize, setVisibleSize] = useState<number>(0);
  const [currentDirection, setCurrentDirection] = useState(direction);

  // Handle responsive direction
  useEffect(() => {
    if (!responsiveDirection) return;
    const update = () => {
      const w = window.innerWidth;
      if (w >= 768 && responsiveDirection.md) {
        setCurrentDirection(responsiveDirection.md);
      } else {
        setCurrentDirection(responsiveDirection.base || direction);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [responsiveDirection, direction]);

  // Build dots and track scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const total = currentDirection === 'vertical'
      ? el.scrollHeight
      : el.scrollWidth;
    const visible = currentDirection === 'vertical'
      ? el.clientHeight
      : el.clientWidth;

    setVisibleSize(visible);
    const count = Math.ceil(total / visible);
    setDots(Array(count).fill(false));

    const onScroll = () => {
      const pos = currentDirection === 'vertical' ? el.scrollTop : el.scrollLeft;
      const idx = Math.floor(pos / visible);
      setDots((prev) => prev.map((_, i) => i === idx));
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [currentDirection]);

  const scrollTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const offset = i * visibleSize;
    if (currentDirection === 'vertical') {
      el.scrollTo({ top: offset, behavior: 'smooth' });
    } else {
      el.scrollTo({ left: offset, behavior: 'smooth' });
    }
    onDotClick?.(i);
  };

  return (
    <div className="relative flex">
      <div
        ref={containerRef}
        className={`overflow-auto ${scrollSnap ? 'snap-mandatory' : ''} ${className}`}
        style={{
          display: 'flex',
          flexDirection: currentDirection === 'horizontal' ? 'row' : 'column',
          scrollSnapType: scrollSnap
            ? `${currentDirection === 'vertical' ? 'y' : 'x'} mandatory`
            : undefined,
          height: currentDirection === 'vertical' ? '16rem' : 'auto',
          width: currentDirection === 'horizontal' ? '16rem' : 'auto',
        }}
      >
        {children}
      </div>

      <div
        className={`absolute ${
          currentDirection === 'vertical'
            ? 'right-0 top-0 h-full flex-col'
            : 'bottom-0 left-0 w-full flex-row'
        } flex justify-center ${dotSpacing} p-2 hidden md:flex`}
      >
        {dots.map((active, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ease-in-out ${dotSize} ${
              active
                ? `${activeColor} ${animateActive ? 'scale-125 shadow-md shadow-blue-300' : ''}`
                : dotColor
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ChromaDots;
