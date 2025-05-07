import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

import "../../assets/css/topbar.css";

function Topbar() {
const { user, logout } = useUser();

  const location = useLocation();
  // Comparaison en minuscules pour éviter les problèmes de casse
  const currentPath = location.pathname.toLowerCase();

  return (
    <div className="container-fluid bg-light pt-3 d-none d-lg-block">
      <div className="container">
        <div className="row align-items-center">
          {/* Colonne gauche : Infos contact */}
          <div className="col-lg-6 text-center text-lg-left mb-2 mb-lg-0">
            <div className="d-inline-flex align-items-center">
              <p><i className="fa fa-envelope mr-2"></i>Infos & réservations</p>
              <p className="text-body px-3">|</p>
              <p><i className="fa fa-phone-alt mr-2"></i>+213 560 63 58 06</p>
            </div>
          </div>

          {/* Colonne droite : Réseaux sociaux + Boutons */}
          <div className="col-lg-6 d-flex justify-content-end align-items-center">
            <a className="social-icon" href="#"><i className="fab fa-facebook-f"></i></a>
            <a className="social-icon" href="#"><i className="fab fa-twitter"></i></a>
            <a className="social-icon" href="#"><i className="fab fa-linkedin-in"></i></a>
            <a className="social-icon" href="#"><i className="fab fa-instagram"></i></a>
            <a className="social-icon" href="#"><i className="fab fa-youtube"></i></a>

            {user === null ? (
              <>
                <Link 
                  to="/web/Connexion" 
                  className={`btn-custom ${currentPath === '/web/connexion' ? 'active' : ''}`}
                >
                  <i className="fa fa-user"></i> Se Connecter
                </Link>

                <Link 
                  to="/web/Inscription" 
                  className={`btn-custom ${currentPath === '/web/inscription' ? 'active' : ''}`}
                >
                  <i className="fa fa-user-plus"></i> S'inscrire
                </Link>
              </>
            ) : (
              <>
                <span>Bonjour {user.utilisateur.nom+" "+user.utilisateur.prenom} ({user.utilisateur.role})</span>
                <Link 
                     to="/web/"  className="btn-custom"  onClick={logout}  >
                      <i className="fa fa-sign-out-alt"></i> Se Déconnecter
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
