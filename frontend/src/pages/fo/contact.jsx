
// ContactPage.js
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaFacebook, FaClock } from 'react-icons/fa';
import "../../assets/css/style.css";
import bejaiaImage from '../../assets/fo/img/Bejaia.jpeg';
import logoImage from '../../assets/fo/img/LogoZiguade.jpg';
const ContactPage = () => {
  return (
    <div className="contact-page">
      {/* Section Hero avec image de fond algérienne */}
      <div className="contact-hero" style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bejaiaImage})`,
        minHeight: '50vh',
       position: 'relative'
      }}>
      <div className="hero-content text-center" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%'
    }}>
      <h1 className="hero-title" style={{
        color: '#ffffff',
        fontSize: '3rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
        marginBottom: '1rem'
      }}>
        Contactez ZIGUADE TOUR
      </h1>
      <p className="hero-subtitle" style={{
        color: '#f8f9fa',
        fontSize: '1.5rem',
        fontWeight: '300',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: '1.6'
      }}>
        Votre expert en voyages à Béjaïa
      </p>
    </div>
  </div>

      {/* Grille de contact */}
      <div className="container py-5">
        <div className="row">
          {/* Colonne de contact */}
          <div className="col-md-6 mb-4">
            <div className="contact-info-card p-4 shadow">
              <h3 className="mb-4" style={{ color: '#2A5C82' }}> 
                <img 
                  src={logoImage}
                  alt="Logo Ziguade Tour" 
                  style={{ width: '40px', marginRight: '10px' }}
                />
                ZIGUADE TOUR
              </h3>
              
              <div className="contact-item mb-3">
                <FaMapMarkerAlt className="me-3" style={{ color: '#E67E22' }} />
                <span>Cité 208 Logts BT A2<br/>Quartier Seghir, Béjaïa 06000</span>
              </div>

              <div className="contact-item mb-3">
                <FaPhone className="me-3" style={{ color: '#E67E22' }} />
                <span>+213 550 12 34 56</span>
              </div>

              <div className="contact-item mb-4">
                <FaClock className="me-3" style={{ color: '#E67E22' }} />
                <span>Ouvert 7j/7 - 8h à 19h</span>
              </div>

              <div className="social-links">
                <a 
                  href="https://www.facebook.com/p/ZiguadeTour-100044654241090/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="me-3" style={{ fontSize: '1.8rem', color: '#2A5C82' }} />
                </a>
              </div>

              <div className="mt-4">
                <iframe
                  title="Localisation Ziguade Tour"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10229.72650095869!2d5.058183215719306!3d36.75323977936149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f2cba3ec1e28d1%3A0x3bcd0d2a6c0393e3!2sB%C3%A9ja%C3%AFa!5e0!3m2!1sfr!2sdz!4v1623334573824"
                  width="100%" 
                  height="250" 
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy">
                </iframe>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="col-md-6">
            <form className="contact-form p-4 shadow">
              <h3 className="mb-4" style={{ color: '#2A5C82' }}>Demande de devis</h3>
              
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nom complet"
                  style={{ borderColor: '#2A5C82' }}
                />
              </div>

              <div className="mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email"
                  style={{ borderColor: '#2A5C82' }}
                />
              </div>

              <div className="mb-3">
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Téléphone"
                  style={{ borderColor: '#2A5C82' }}
                />
              </div>

              <div className="mb-3">
                <select 
                  className="form-select"
                  style={{ borderColor: '#2A5C82' }}
                >
                  <option>Type de demande</option>
                  <option>Voyage en Algérie</option>
                  <option>Omra</option>
                  <option>Réservation hôtelière</option>
                  <option>Transport touristique</option>
                </select>
              </div>

              <div className="mb-3">
                <textarea 
                  className="form-control" 
                  rows="5" 
                  placeholder="Détails de votre demande..."
                  style={{ borderColor: '#2A5C82' }}
                ></textarea>
              </div>

              <button 
                className="btn w-100 py-2"
                style={{ 
                  backgroundColor: '#E67E22', 
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;