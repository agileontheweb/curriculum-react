import { forwardRef } from 'react';
import { HiXMark } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { useSoundContext, SOUNDS } from '../contexts/SoundContext';

const Sidebar = forwardRef(({ onClose, links }, ref) => {
  const { t } = useTranslation();
  const { playSound } = useSoundContext();

  return (
    <>
      <div
        id="sidemenu-overlay"
        className="sidemenu-overlay"
        onClick={onClose}
      />

      <div ref={ref} className="sidemenu-drawer">
        <button
          className="cursor-pointer absolute top-8 right-8 text-white hover:text-agile-sky transition-transform hover:rotate-90 p-2"
          onMouseEnter={() => playSound(SOUNDS.HOVER)}
          onClick={() => {
            playSound(SOUNDS.CLICK);
            onClose();
          }}
          aria-label={t('common.close')}
        >
          <HiXMark className="w-10 h-10 md:w-12 md:h-12" />
        </button>

        <nav className="nav-link-list">
          {links.map((link, index) => {
            const displayNumber = (index + 1).toString().padStart(2, '0');
            const isExternal = link.href?.startsWith('http');

            return (
              <a
                key={index}
                href={link.href || '#'}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="nav-link-item group"
                onMouseEnter={() => playSound(SOUNDS.HOVER)}
                onClick={(e) => {
                  playSound(SOUNDS.CLICK);

                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                    onClose();
                  } else if (!isExternal) {
                    e.preventDefault();
                    onClose();
                  }
                }}
              >
                <span className="nav-link-number">
                  {displayNumber}.
                </span>
                <span className="nav-link-text">
                  {t(link.labelKey)}
                </span>
                <div className="h-0.5 w-0 bg-agile-sky transition-all duration-300 group-hover:w-full mt-2" />
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;