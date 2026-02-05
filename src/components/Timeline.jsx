import { useEffect, useRef } from 'react';
import { useSoundContext, SOUNDS } from '../contexts/SoundContext';

export default function Timeline({ experiences, selectedId, onSelect, isAnimationRunning }) {
  const scrollRef = useRef();
  const { playSound } = useSoundContext();

  useEffect(() => {
    if (isAnimationRunning) return;
    const activeItem = scrollRef.current?.querySelector('.dot-active');
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [selectedId, isAnimationRunning]);

  return (
    <div ref={scrollRef} className="timeline-container no-scrollbar">
      <div className="timeline-list">
        {experiences.map((exp) => {
          const isActive = selectedId === exp.id;

          return (
            <div
              key={exp.id}
              onClick={() => {
                playSound(SOUNDS.CLICK);
                onSelect(exp.id);
              }}
              onMouseEnter={() => playSound(SOUNDS.HOVER)}
              className="timeline-item group"
              data-year={exp.id}
            >
              <span className={`timeline-year ${isActive ? 'text-agile-sky font-bold' : 'text-slate-600'} transition-all`}>
                {exp.year}
              </span>

              <div
                className={`
                  timeline-dot 
                  ${isActive ? 'dot-active animate-pulse-glow' : 'dot-inactive'}
                  group-hover:scale-150 group-hover:bg-agile-sky/50
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}