import React from "react";
import { Link } from "react-router-dom";// 🔥 Ajoute cette ligne
import "../../assets/css/navbar.css"
import Logo from "../../assets/img/LogoZiguade.jpg"

function Navbar() {
  return (
    <div className="container-fluid position-relative nav-bar p-0">
      <div className="container-lg position-relative p-0 px-lg-3" style={{ zIndex: 9 }}>
        <nav className="navbar navbar-expand-lg bg-light navbar-light shadow-lg py-2 py-lg-1 pl-3 pl-lg-5">

         <Link to="/" className="navbar-brand">
<img src={Logo} alt="Logo" style={{ height: '40px', width: 'auto' }} />
            <h1 className="brand-text">
             <span style={{ color: '#003366' }}>Ziguade </span>
              <span style={{ color: '#f1c40f' }}>Tour</span>
                 </h1>
            </Link>

          <button
            type="button"
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between px-3" id="navbarCollapse">
            <div className="navbar-nav ml-auto py-0">
              <Link to="/web/Home" className="nav-item nav-link d-flex align-items-center" style={{ fontWeight: "bold" }}>
                <i className="fas fa-home mr-2"></i> Accueil
              </Link>
              <Link to="/web/Hotels" className="nav-item nav-link d-flex align-items-center" style={{ fontWeight: "bold" }}>
                <i className="fas fa-hotel mr-2"></i> Hotels
              </Link>
              <Link to="/web/Vols" className="nav-item nav-link d-flex align-items-center" style={{ fontWeight: "bold" }}>
                <i className="fas fa-plane mr-2"></i> Vols
              </Link>
              
              {/* Lien vers Visa avec un sous-menu */}
              <div className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  to="#"
                  id="visaDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontWeight: "bold" }}
                >
                  <i className="fas fa-visa mr-2"></i> Visa
                </Link>
                <ul className="dropdown-menu" aria-labelledby="visaDropdown">
                  <li><Link to="/web/Visatouristique" className="dropdown-item">Visa Touristique</Link></li>
                  <li><Link to="/web/Visadetudes" className="dropdown-item">Visa d'Études</Link></li>
                </ul>
              </div>

              {/* Lien vers Offres avec un sous-menu */}
              <div className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  to="#"
                  id="offresDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontWeight: "bold" }}
                >
                  <i className="fas fa-gift mr-2"></i> Offres
                </Link>
                <ul className="dropdown-menu" aria-labelledby="offresDropdown">
                  <li><Link to="/web/Omra" className="dropdown-item">Omra</Link></li>
                  <li><Link to="/web/VoyagesOrganisés" className="dropdown-item">Voyages Organisés</Link></li>
                </ul>
              </div>

              <Link to="/web/Assurance" className="nav-item nav-link d-flex align-items-center" style={{ fontWeight: "bold" }}>
                <i className="fas fa-shield-alt mr-2"></i> Assurance
              </Link>
              <Link to="/web/contact" className="nav-item nav-link d-flex align-items-center" style={{ fontWeight: "bold" }}>
                <i className="fas fa-phone-alt mr-2"></i> Contact
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
