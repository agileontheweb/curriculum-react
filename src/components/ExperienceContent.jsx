import { forwardRef } from 'react';

const ExperienceContent = forwardRef(({ experience }, ref) => {
  return (
    <div className="content-section">
      <div ref={ref} className="experience-card">
        <span className="experience-year-label">{experience.year}</span>
        <h2 className="experience-title">{experience.title}</h2>
        <p className="experience-company">{experience.company}</p>
        <div className="experience-divider"></div>
        <p className="experience-description">{experience.description}</p>
        <div className="skills-container">
          {experience.skills.map(skill => (
            <span key={skill} className="skill-badge">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ExperienceContent;