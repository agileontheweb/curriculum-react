import { useState, forwardRef } from 'react';
import { HiOutlineBuildingOffice2, HiOutlineCommandLine, HiArrowsPointingOut } from "react-icons/hi2";
import ExperienceModal from './ExperienceModal';
import { useTranslation } from 'react-i18next';

const ExperienceContent = forwardRef(({ experience }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  if (!experience) return null;
  const expKey = `experiences.${experience.year}`;

  return (
    <>
      <div className="content-section">
        <div
          ref={ref}
          onClick={() => setIsOpen(true)}
          className="experience-card group cursor-pointer relative"
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-agile-sky">
            <HiArrowsPointingOut size={20} />
          </div>

          <span className="experience-year-label">{experience.year}</span>
          <h2 className="experience-title group-hover:text-agile-sky transition-colors">
            {t(`${expKey}.title`)}
          </h2>

          <div className="flex items-center gap-2 mt-2 opacity-80">
            <HiOutlineBuildingOffice2 className="text-agile-sky w-5 h-5" />
            <p className="experience-company !mt-0">
              {experience.company}
            </p>
          </div>

          <div className="experience-divider"></div>
          <p className="experience-description line-clamp-3">
            {t(`${expKey}.description`)}
          </p>

          <div className="skills-container">
            {experience.skills.slice(0, 4).map(skill => (
              <span key={skill} className="skill-badge flex items-center gap-1.5">
                <HiOutlineCommandLine className="text-agile-sky/70" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Il modale viene montato solo quando serve */}
      {isOpen && (
        <ExperienceModal
          experience={experience}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
});

export default ExperienceContent;