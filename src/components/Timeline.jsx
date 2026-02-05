import { useEffect, useRef } from 'react';
import { useSoundContext } from '../contexts/SoundContext';

export default function Timeline({ experiences, selectedId, onSelect }) {
  const scrollRef = useRef();
  const { playSound } = useSoundContext();

  useEffect(() => {
    const activeItem = scrollRef.current?.querySelector('.dot-active');
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [selectedId]);

  return (
    <div ref={scrollRef} className="timeline-container no-scrollbar">
      <div className="timeline-list">
        {experiences.map((exp) => {
          const isActive = selectedId === exp.id;

          return (
            <div
              key={exp.id}
              onClick={() => {
                playSound('/audio/denielcz-immersivecontrol-button-click-sound-463065.mp3');
                onSelect(exp.id);
              }}
              onMouseEnter={() => playSound('/audio/soundreality-interface-10-204783.mp3')}
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