import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#003366',
      color: 'white',
      marginTop: '90px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 204, 0, 0.1)'
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '-50px',
        left: '-50px',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        transform: 'rotate(45deg)'
      }}></div>

      <div className="container py-5">
        <div className="row">
          {/* Brand and description */}
          <div className="col-lg-4 col-md-6 mb-5">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{
                color: 'var(--jaune)',
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '20px'
              }}>
                <span style={{ color: 'white' }}>Ziguade</span>Tour
              </h1>
            </Link>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              Voyagez autrement avec Ziguade Tour ! Nous vous offrons les meilleures destinations, des offres exceptionnelles et un accompagnement personnalisé pour rendre vos aventures inoubliables.
            </p>

            <h6 style={{
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '20px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Follow Us
              <span style={{
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                width: '50%',
                height: '2px',
                background: 'var(--jaune)'
              }}></span>
            </h6>

            <div style={{ display: 'flex', gap: '15px' }}>
              <a
                href="https://www.facebook.com/Ziguadegroup/?locale=fr_FR"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#3b5998';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaFacebookF />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ziguadetours/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e1306c';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaInstagram />
              </a>

              {/* LinkedIn */}
              <a
                href="https://dz.linkedin.com/in/ziguade-alger-5717a8309"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#0077b5';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="col-lg-4 col-md-6 mb-5">
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '25px',
              position: 'relative',
              paddingBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '3px'
            }}>
              Nos Services
              <span style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '50px',
                height: '2px',
                background: 'var(--jaune)'
              }}></span>
            </h3>

            <ul style={{ listStyle: 'none', padding: '0' }}>
              {[
                { path: "/web/Home", name: "Accueil" },
                { path: "/web/Hotels", name: "Hôtels" },
                { path: "/web/Vols", name: "Vols" },
                { path: "/web/Voyage", name: "Voyage" },
                { path: "/web/Omra", name: "Omra" },
                { path: "/web/Visatouristique", name: "Visa Touristique" },
                { path: "/web/Visadetudes", name: "Visa d'Études" },
                { path: "/web/Assurance", name: "Assurance" },
                { path: "/web/contact", name: "Contact" }

              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    to={item.path}
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--jaune)';
                      e.currentTarget.style.paddingLeft = '10px';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--jaune)',
                      marginRight: '10px',
                      transition: 'all 0.3s'
                    }}></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-lg-4 col-md-6 mb-5">
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '25px',
              position: 'relative',
              paddingBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '3px'
            }}>
              Contactez-nous
              <span style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '50px',
                height: '2px',
                background: 'var(--jaune)'
              }}></span>
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 204, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaMapMarkerAlt style={{ color: 'var(--jaune)', fontSize: '1.2rem' }} />
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  Bejaia. CITE 208 LOGTS BT A2 QUARTIER SEGHIR Bejaia
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 204, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaPhoneAlt style={{ color: 'var(--jaune)', fontSize: '1.2rem' }} />
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  +213 560 63 58 06
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255, 204, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: '0'
                }}>
                  <FaEnvelope style={{ color: 'var(--jaune)', fontSize: '1.2rem' }} />
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  Infos & réservations
                </p>
              </div>
            </div>

            <h6 style={{
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '20px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Newsletter
              <span style={{
                position: 'absolute',
                bottom: '-5px',
                left: '0',
                width: '50%',
                height: '2px',
                background: 'var(--jaune)'
              }}></span>
            </h6>

            <div style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="Votre Email"
                style={{
                  flex: '1',
                  padding: '12px 15px',
                  border: 'none',
                  borderRadius: '5px 0 0 5px',
                  fontSize: '1rem'
                }}
              />
              <button style={{
                background: 'var(--jaune)',
                color: '#003366',
                border: 'none',
                padding: '0 20px',
                fontWeight: '600',
                borderRadius: '0 5px 5px 0',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#003366';
                  e.currentTarget.style.color = 'var(--jaune)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--jaune)';
                  e.currentTarget.style.color = '#003366';
                }}>
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-left mb-3 mb-md-0">
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0'
              }}>
                &copy; {new Date().getFullYear()} <Link to="/" style={{
                  color: 'var(--jaune)',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>Ziguade Tour</Link>. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-right">
              <div style={{ display: 'flex', justifyContent: 'center', justifyContent: 'md-flex-end', gap: '20px' }}>
                <Link to="/web/mentions-legales" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}>
                  Mentions légales
                </Link>
                <Link to="/web/politique-confidentialite" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}>
                  Politique de confidentialité
                </Link>
                <Link to="/web/cgu" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}>
                  CGU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;