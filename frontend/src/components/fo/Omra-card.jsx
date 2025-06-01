import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaFacebookF, FaInstagram,FaPlaneDeparture , FaHeart} from 'react-icons/fa';

const CommentsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
`;

const CommentBubble = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: #f7f9fc;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background-color 0.15s;
  overflow: hidden;

  &:hover {
    background: #eef4fa;
  }

  .icon {
    flex-shrink: 0;
    font-size: 14px;
  }

  .icon.facebook {
    color: #1877F2; /* Bleu Facebook */
  }

  .icon.instagram {
    color: #E1306C; /* Rose Instagram */
  }

  .text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default function OmraCard({
  omra,
  commentairesFacebook = [],
  commentairesInstagram = [],
  urlPostFacebook = null,
  urlPostInstagram = null,
   likesFacebook = 0,  // nouveau prop
  likesInstagram = 0, // nouveau prop
}) {
  if (!omra) {
    console.error("Erreur : `omra` est undefined ou null");
    return null;
  }

  const isSoldOut = !omra.disponible;
  const imageSrc = omra.image?.startsWith("http")
    ? omra.image
    : omra.image
    ? `http://localhost:3000/images/${omra.image}`
    : '/images/omra1.jpg';

  return (
    <div className="card shadow item-card-htl mb-4" style={{ maxWidth: '1100px', margin: 'auto', height: '290px' }}>
      <div className="row g-md-3 g-2">
        {/* Image */}
        <div className="col-4">
          <figure className="desti-image position-relative mb-0" style={{ height: '360px' }}>
            <img
              src={imageSrc}
              className="img-fluid h-img-single"
              alt={omra.titre || "Omra sans titre"}
              style={{ objectFit: 'cover', height: '268px', width: '100%' }}
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

        {/* Contenu */}
        <div className="col-8">
          <div className="d-flex flex-column h-100 py-3 px-3">
            <div className="w-100">
              <h2 className="fs-5 fw-bold text-blue mb-2 text-start">
                {omra.titre || "Titre non spécifié"}
              </h2>
              <p className="mb-1 text-muted small fw-semibold">- {omra.description || "Description manquante"}</p>
<p><FaPlaneDeparture /> {omra.date_de_depart ? new Date(omra.date_de_depart).toLocaleDateString() : "Date inconnue"}</p>

            

              {/* Durée */}
              <p className="mb-2 text-muted small fw-semibold d-flex align-items-center">
                🕒 15 jours, 14 nuits
              </p>

              {/* Lien religieux */}
              <Link
                to={`/web/Infos_omra1/${omra.id}`}
                className="d-block mb-2 text-decoration-none small fw-semibold"
                style={{ color: '#003366' }}
              >
                اللهم تقبل عمرتنا واغفر ذنوبنا واجعلها عمرةً مبرورةً مقبولة
              </Link>

               {/* Section Likes */}
      <div className="d-flex gap-3 mt-2 align-items-center" style={{ fontSize: '14px', color: '#555' }}>
        {likesFacebook != null && (
          <div className="d-flex align-items-center gap-1" title={`${likesFacebook} J'aime Facebook`}>
            <FaFacebookF color="#1877F2" />
            <FaHeart color="#e0245e" />
            <span>{likesFacebook}</span>
          </div>
        )}
        {likesInstagram !== null && (
          <div className="d-flex align-items-center gap-1" title={`${likesInstagram} J'aime Instagram`}>
            <FaInstagram color="#E1306C" />
            <FaHeart color="#e0245e" />
            <span>{likesInstagram}</span>
          </div>
        )}
      </div>

              {/* Commentaires */}
              {(commentairesFacebook.length > 0 || commentairesInstagram.length > 0) && (
                <CommentsWrapper>
                  {commentairesFacebook.map((c, i) => (
                    <CommentBubble key={`fb-${i}`}>
                      <a
                        href={c.url || urlPostFacebook || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Voir sur Facebook"
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="icon facebook"><FaFacebookF /></div>
                        <div className="text" title={c.contenu || c.texte}>
                          {c.contenu || c.texte}
                        </div>
                      </a>
                    </CommentBubble>
                  ))}

                  {commentairesInstagram.map((c, i) => (
                    <CommentBubble key={`ig-${i}`}>
                      <a
                        href={c.url || urlPostInstagram || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Voir sur Instagram"
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="icon instagram"><FaInstagram /></div>
                        <div className="text" title={c.contenu || c.texte}>
                          {c.contenu || c.texte}
                        </div>
                      </a>
                    </CommentBubble>
                  ))}
                </CommentsWrapper>
              )}

              {/* Tags */}
              <div className="mb-2 mt-2">
                {omra.tags?.map((tag, idx) => (
                  <span key={idx} className="badge bg-secondary me-1">
                    #{tag}
                  </span>
                ))}
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
    </div>
  );
}
