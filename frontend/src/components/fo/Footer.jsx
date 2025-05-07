import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/footer.css"
function Footer() {
  return (
    <>
      <div className="footer-front container-fluid py-5 px-sm-3 px-lg-5" style={{ marginTop: "90px" }}>
        <div className="row pt-5">
          {/* Section de l'entreprise (à gauche) */}
          <div className="col-lg-3 col-md-6 mb-5">
            <a href="#" className="navbar-brand">
             <h1 style={{ color: 'var(--jaune)' }}>
              <span style={{ color: 'white' }}>Ziguade</span>Tour
              </h1>
            </a>
            <p>
              Voyagez autrement avec Ziguade Tour ! Nous vous offrons les meilleures destinations, des offres exceptionnelles et un accompagnement personnalisé pour rendre vos aventures inoubliables.
            </p>
            <h6 className="text-white text-uppercase mt-4 mb-3" style={{ letterSpacing: "5px" }}>
              Follow Us
            </h6>
            <div className="d-flex justify-content-start">
              <a className="btn btn-outline-primary btn-square mr-2" href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a className="btn btn-outline-primary btn-square mr-2" href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a className="btn btn-outline-primary btn-square mr-2" href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a className="btn btn-outline-primary btn-square" href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Section des services (centrée) */}
          <div className="col-lg-3 col-md-6 mb-5 d-flex justify-content-center">
            <div>
              <h5 className="text-white text-uppercase mb-4" style={{ letterSpacing: "5px" }}>
                Nos Services
              </h5>
              <div className="d-flex flex-column justify-content-start">
                <Link className="text-white-50 mb-2" to="/web/Home">
                  <i className="fa fa-angle-right mr-2"></i>Accueil
                </Link>
                <Link className="text-white-50 mb-2" to="/web/Hotels">
                  <i className="fa fa-angle-right mr-2"></i>Hôtels
                </Link>
                <Link className="text-white-50 mb-2" to="/web/Vols">
                  <i className="fa fa-angle-right mr-2"></i>Vols
                </Link>
                <Link className="text-white-50 mb-2" to="/web/Visatouristique">
                  <i className="fa fa-angle-right mr-2"></i>Visa Touristique
                </Link>
                <Link className="text-white-50 mb-2" to="/web/Visadetudes">
                  <i className="fa fa-angle-right mr-2"></i>Visa d'Études
                </Link>
                <Link className="text-white-50 mb-2" to="/web/Assurance">
                  <i className="fa fa-angle-right mr-2"></i>Assurance
                </Link>
                <Link className="text-white-50" to="/web/contact">
                  <i className="fa fa-angle-right mr-2"></i>Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Section contact (à droite) */}
          <div className="col-lg-3 col-md-6 mb-5">
            <h5 className="text-white text-uppercase mb-4" style={{ letterSpacing: "5px" }}>
              Contactez-nous
            </h5>
            <p>
              <i className="fa fa-map-marker-alt mr-2"></i> Bejaia. CITE 208 LOGTS BT A2 QUARTIER SEGHIR Bejaia
            </p>
            <p>
              <i className="fa fa-phone-alt mr-2"></i>+213 560 63 58 06
            </p>
            <p>
              <i className="fa fa-envelope mr-2"></i>Infos & réservations
            </p>
            <h6 className="text-white text-uppercase mt-4 mb-3" style={{ letterSpacing: "5px" }}>
              Newsletter
            </h6>
            <div className="w-100">
              <div className="input-group">
                <input type="text" className="form-control border-light" style={{ padding: "25px" }} placeholder="Votre Email" />
                <div className="input-group-append">
                  <button className="btn btn-primary px-3">S'inscrire</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom container-fluid py-4 px-sm-3 px-md-5">
        <div className="row">
          <div className="col-lg-6 text-center text-md-left mb-3 mb-md-0">
            <p className="m-0">
              Copyright &copy; <Link to="#">Ziguade Tour</Link>. Tous droits réservés.
            </p>
          </div>
          <div className="col-lg-6 text-center text-md-right">
            <p className="m-0">
              Designé par <a href="https://htmlcodex.com">HTML Codex</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
