import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { FaUser, FaSignOutAlt, FaPhoneAlt } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

import "../../assets/css/topbar.css";

function Topbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  return (
    <div className="container-fluid bg-light pt-3 d-none d-lg-block">
      <div className="container">
        <div className="row align-items-center">

          {/* Colonne gauche : Informations de contact */}
          <div className="col-lg-6 text-center text-lg-left mb-2 mb-lg-0">
            <div className="d-inline-flex align-items-center">
              <p className="mb-0">
                <i className="fa fa-envelope mr-2"></i> Infos & réservations
              </p>
              <p className="text-body px-3 mb-0">|</p>
              <p className="mb-0">
                <FaPhoneAlt className="mr-2" /> +213 560 63 58 06
              </p>
            </div>
          </div>

          {/* Colonne droite : Réseaux sociaux + Auth */}
          {/* Colonne droite : Réseaux sociaux + Auth */}
<div className="col-lg-6 d-flex justify-content-end align-items-center">
  <div className="d-flex align-items-center mr-3"> {/* Ajout d'un wrapper avec un margin-right */}
    <a className="social-icon mr-2" href="https://www.facebook.com/Ziguadegroup/?locale=fr_FR" target="_blank" rel="noopener noreferrer">
      <FaFacebookF />
    </a>
    <a className="social-icon mr-2" href="https://dz.linkedin.com/in/ziguade-alger-5717a8309" target="_blank" rel="noopener noreferrer">
      <FaLinkedinIn />
    </a>
    <a className="social-icon mr-2" href="https://www.instagram.com/ziguadetours/" target="_blank" rel="noopener noreferrer">
      <FaInstagram />
    </a>
  </div>

  {user === null ? (
    <>
      <Link
        to="/web/Connexion"
        className={`btn-custom ml-2 ${currentPath === '/web/connexion' ? 'active' : ''}`}
      >
        <i className="fa fa-user"></i> Se Connecter
      </Link>

      <Link
        to="/web/Inscription"
        className={`btn-custom ml-2 ${currentPath === '/web/inscription' ? 'active' : ''}`}
      >
        <i className="fa fa-user-plus"></i> S'inscrire
      </Link>
    </>
  ) : (
    <>
      <Link to="/web/Mon_espace" className="btn-custom ml-2 d-flex align-items-center gap-1">
        <FaUser className="mr-1" />
        Mon espace
      </Link>
      <Link
        to="/web/"
        className="btn-custom ml-2 d-flex align-items-center gap-1"
        onClick={logout}
      >
        <FaSignOutAlt className="mr-1" />
        Se Déconnecter
      </Link>
    </>
  )}
</div>

        </div>
      </div>
    </div>
  );
}

export default Topbar;
