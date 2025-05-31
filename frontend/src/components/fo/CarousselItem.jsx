import React from "react";

const CarousselItem = ({ nom, img, title, content, active, lien }) => {
  return (
    <div className={`carousel-item ${active ? "active" : ""}`}>
      {/* Image avec overlay */}
      <div style={{ position: "relative", height: "120vh" }}>
        <img
          className="w-100"
          src={img}
          alt="Image"
          style={{
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.6)",
            transition: "filter 0.3s ease",  // Transition fluide pour l'image
          }}
        />
        <div
          className="carousel-caption d-flex flex-column align-items-center justify-content-center"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            transition: "background-color 0.3s ease",  // Transition douce sur l'overlay
          }}
        >
          <div className="p-4" style={{ maxWidth: "900px", textAlign: "center" }}>
            <h2
              className="text-warning mb-4"
              style={{
                fontSize: "2.5rem",   // Taille de police plus grande
                fontWeight: "600",    // Poids de police plus lourd pour un effet plus pro
                textTransform: "uppercase",
                letterSpacing: "2px", // Espacement entre les lettres
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Ombre pour le titre
              }}
            >
              {nom}
            </h2>
            <h4
              className="text-white text-uppercase mb-md-3"
              style={{
                fontSize: "1.5rem",
                fontWeight: "500",
                letterSpacing: "1px",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
              }}
            >
              {title}
            </h4>
            <h1
              className="display-3 text-white mb-md-4"
              style={{
                fontSize: "3rem", // Taille de police pour un effet plus grand
                fontWeight: "700",
                letterSpacing: "3px",
                textShadow: "3px 3px 5px rgba(0, 0, 0, 0.7)",
              }}
            >
              {content}
            </h1>
            <a
              href={lien || "#"}
              className="btn btn-warning py-md-3 px-md-5 mt-4"
              style={{
                position: "relative",
                top: "130px",
                left: "17%",
                transform: "translateX(-50%)",
                textTransform: "uppercase",
                fontWeight: "600",
                borderRadius: "25px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              Réserver maintenant
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CarousselItem;
