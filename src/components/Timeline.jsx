import { useEffect, useRef } from 'react';

export default function Timeline({ experiences, selectedId, onSelect }) {
  const scrollRef = useRef();

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
              onClick={() => onSelect(exp.id)}
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