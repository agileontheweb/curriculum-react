import { useState, forwardRef } from 'react';
import { HiOutlineBuildingOffice2, HiOutlineCommandLine, HiArrowsPointingOut } from "react-icons/hi2";
import ExperienceModal from './ExperienceModal';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

const ExperienceContent = forwardRef(({ experience, onOpenVideo, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  if (!experience) return null;
  const expKey = `experiences.${experience.year}`;

  return (
    <>
      <div
        ref={ref}
        {...props}
        className={`content-section mb-24 transition-all duration-700 ease-in-out ${props.className || ''}`}
      >
        <div
          onClick={() => setIsOpen(true)}
          className="experience-card group cursor-pointer relative hover:border-agile-sky/30 transition-colors"
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-agile-sky">
            <HiArrowsPointingOut size={22} />
          </div>

          <span className="experience-year-label">{experience.year}</span>

          <h2 className="experience-title group-hover:text-agile-sky transition-colors duration-300">
            {t(`${expKey}.title`)}
          </h2>

          <div className="flex items-center gap-2 mt-2 opacity-80">
            <HiOutlineBuildingOffice2 className="text-agile-sky w-5 h-5" />
            <p className="experience-company !mt-0 font-medium">
              {experience.company}
            </p>
          </div>

          <div className="experience-divider"></div>

          <p className="experience-description line-clamp-3 text-slate-400 group-hover:text-slate-300 transition-colors">
            {t(`${expKey}.description`)}
          </p>

          <div className="skills-container mt-4">
            {experience.skills.map(skill => (
              <span key={skill} className="skill-badge flex items-center gap-1.5 bg-slate-800/50 group-hover:bg-agile-sky/10 transition-colors">
                <HiOutlineCommandLine className="text-agile-sky/70" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isOpen && createPortal(
        <ExperienceModal
          experience={experience}
          onClose={() => setIsOpen(false)}
          onOpenVideo={onOpenVideo}
        />,
        document.body
      )}
    </>
  );
});

// FONDAMENTALE:
export default ExperienceContent;