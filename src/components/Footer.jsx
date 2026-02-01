import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">

          {/* Gruppo Testi */}
          <div className="footer-text-group">
            <span>Alessandro Cuoghi</span>
            <span className="footer-separator">|</span>
            <span>Agileontheweb</span>
            <span className="footer-separator">|</span>
            <span className="font-mono opacity-80">P.IVA: IT01234567890</span>
            <span className="footer-separator">|</span>
            <span>© {currentYear} — {t('footer.all_rights')}</span>
          </div>

          {/* Icona Social */}
          <a
            href="https://github.com/tuo-username"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <FaGithub size={16} />
          </a>

        </div>
      </div>
    </footer>
  );
}