import React from "react";
import { Link } from "react-router-dom";

export default function OmraCard({ omra }) {
  // Vérification obligatoire des données (débogage)
  if (!omra) {
    console.error("Erreur : `omra` est undefined ou null");
    return null; // Ou un message d'erreur
  }

  console.log("ID de l'Omra:", omra.id); // Doit s'afficher dans la console
  console.log("Données complètes de l'Omra:", omra); // Pour inspecter toutes les props

  const isSoldOut = !omra.disponible;
  const imageSrc = omra.image && omra.image.startsWith("http")
    ? omra.image
    : omra.image
      ? `http://localhost:3000/images/${omra.image}`
      : '/images/omra1.jpg'; // Image par défaut

  return (
    <div className="card shadow item-card-htl mb-4" style={{ maxWidth: '1100px', margin: 'auto', height: '220px' }}>
      <div className="row g-md-3 g-2">
        {/* Section Image */}
        <div className="col-4">
          <figure className="desti-image position-relative mb-0" style={{ height: '360px' }}>
            <img
              src={imageSrc}
              className="img-fluid h-img-single"
              alt={omra.titre || "Omra sans titre"}
              style={{ objectFit: 'cover', height: '218px', width: '100%' }}
            />
            {isSoldOut && (
              <div className="cardImage__leftBadge position-absolute" style={{
                top: '10px',
                left: '10px',
                zIndex: 10,
                backgroundColor: omra.status === 'disponible' ? 'green' : 'red',
                padding: '5px 10px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '5px'
              }}>
                {omra.status === 'disponible' ? 'Disponible' : 'Épuisé'}
              </div>
            )}
          </figure>
        </div>

        {/* Section Contenu */}
        <div className="col-8">
          <div className="d-flex flex-column h-100 py-3 px-3">
            <div className="w-100">
              <h2 className="fs-5 fw-bold text-blue mb-2 text-start">
                {omra.titre || "Titre non spécifié"}
              </h2>
              <p className="mb-1 text-muted small fw-semibold">- {omra.description || "Description manquante"}</p>

              {/* Hôtel et étoiles */}
              <p className="text-muted mb-1 small fw-semibold d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" fill="currentColor" className="me-1">
                  <path d="M0 32C0 14.3 14.3 0 32 0L480 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-176 0 0-48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 48L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64C14.3 64 0 49.7 0 32zm96 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                </svg>
                {omra.hotel || "Hôtel non spécifié"}
                <span className="ms-2">
                  {[...Array(3)].map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      fill="#FDA100"
                      width="14"
                      height="14"
                      className="ms-1"
                    >
                      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                    </svg>
                  ))}
                </span>
              </p>

              {/* Durée */}
              <p className="mb-2 text-muted small fw-semibold d-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="14"
                  height="14"
                  className="me-1"
                  fill="currentColor"
                >
                  <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                {omra.duree ? `${omra.duree} jours, ${omra.duree - 1} nuits` : "Durée non spécifiée"}
              </p>

              <Link
                to={`/web/Infos_omra1/${omra.id}`}
                className="d-block mb-2 text-decoration-none small fw-semibold"
                style={{ color: '#003366' }}
              >
                اللهم تقبل عمرتنا واغفر ذنوبنا واجعلها عمرةً مبرورةً مقبولة
              </Link>

              {/* Tags */}
              <div className="mb-2">
                {omra.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="badge rounded-pill bg-warning bg-opacity-10 text-secondary me-2 p-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prix + Bouton */}
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted small">À partir de</span>
              <div
                style={{
                  color: '#003366',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {omra.prix ? `${omra.prix} DZD` : "Prix non disponible"}
              </div>

              <Link
                to={`/web/Infos_omra1/${omra.id}`}
                className="btn btn-warning fw-bold text-white px-3 py-2 rounded-pill"
              >
                Voir plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}