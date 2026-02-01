import { HiChevronUp, HiChevronDown } from "react-icons/hi2";

export default function Timeline({ experiences, selectedId, onSelect }) {
  return (
    <div className="timeline-container">


      <div className="timeline-list">
        {experiences.map((exp) => {
          const isActive = selectedId === exp.id;

          return (
            <div
              key={exp.id}
              onClick={() => onSelect(exp.id)}
              className="timeline-item group"
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