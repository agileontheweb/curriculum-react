import logo from '../assets/logo-agileontheweb.svg';

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <img src={logo} alt="Logo AgileOnTheWeb" className="navbar-logo" />
          <span className="navbar-title">
            agile<span className="text-agile-sky">ontheweb</span>
          </span>
        </div>
        <div className="navbar-actions">
          <button className="navbar-cta">
            Contattami
          </button>
        </div>
      </div>
    </nav>
  );
}