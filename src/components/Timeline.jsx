export default function Timeline({ experiences, selectedId, onSelect }) {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      <div className="timeline-list">
        {experiences.map((exp) => (
          <div key={exp.id} className="timeline-item group">
            <span className={`timeline-year ${selectedId === exp.id ? 'text-sky-400' : 'text-slate-600'}`}>
              {exp.year}
            </span>
            <button
              onClick={() => onSelect(exp.id)}
              className={`timeline-dot ${selectedId === exp.id ? 'dot-active' : 'dot-inactive'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}