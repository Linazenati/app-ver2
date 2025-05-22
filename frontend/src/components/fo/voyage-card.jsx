import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaPlaneDeparture, FaMoneyBillWave, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Card = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 320px;
  margin: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.03);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
  flex-grow: 1;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 22px;
  font-weight: bold;
  color: #1e1e2f;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  svg {
    margin-right: 8px;
    color: #1976d2;
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  color: #003366;
  font-weight: bold;
  font-size: 18px;
  margin-top: 10px;
  svg {
    margin-right: 8px;
    color: #e91e63;
  }
`;

// 1. Wrapper qui gère le flex-wrap
const CommentsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
    color: #888;
  }

  .text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Statut = styled.span`
  background: ${({ statut }) => (statut === 'disponible' ? '#4caf50' : '#f44336')};
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  position: absolute;
  top: 15px;
  right: 15px;
  text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

const CardWrapper = styled.div`
  position: relative;
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 10px 14px;
  background-color: #1976d2;
  border: none;
  color: white;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0d47a1;
  }
`;


  

const VoyageCard = ({ voyage, commentairesFacebook = [], commentairesInstagram = [], urlPostFacebook = null, urlPostInstagram = null }) => {
  if (!voyage) return <div>Chargement...</div>


  const imageBaseUrl = 'http://localhost:3000/images';
  const images = JSON.parse(voyage.image || '[]');
  const firstImage = images[0] || 'default.jpg';
  const imageUrl = `${imageBaseUrl}/${firstImage}`;

  return (
    <Link to={`/web/infos_voyage/${voyage.id}`} style={{ textDecoration: 'none' }}>
      <Card
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <CardWrapper>
          <Image src={imageUrl} alt="voyage" loading="lazy" />
          <Statut statut={voyage.statut}>{voyage.statut}</Statut>
        </CardWrapper>
        <CardContent>
          <Title>{voyage.titre}</Title>
          <InfoRow><FaPlaneDeparture /> Départ : {new Date(voyage.date_de_depart).toLocaleDateString()}</InfoRow>
          <InfoRow><FaCalendarAlt /> Retour : {new Date(voyage.date_de_retour).toLocaleDateString()}</InfoRow>
          <Price><FaMoneyBillWave /> {voyage.prix} DZD</Price>
{/* Commentaires Facebook */}
    {commentairesFacebook.length > 0 && (
  <CommentsWrapper>
    {commentairesFacebook.map((c, i) => (
      <CommentBubble key={`fb-${i}`}>
        <a
href={c.url || urlPostFacebook || '#'}
  target="_blank"
  rel="noopener noreferrer"
  style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
  title="Voir sur Facebook"
  onClick={e => e.stopPropagation()}  // <-- empêche le Link parent de s'activer
>
          <div className="icon">
            <FaFacebookF size={14} />
          </div>
          <div className="text" title={c.contenu || c.texte}>
            {c.contenu || c.texte}
          </div>
        </a>
      </CommentBubble>
    ))}
  </CommentsWrapper>
)}

          {/* Commentaires Instagram */}
          {commentairesInstagram.length > 0 && (
  <CommentsWrapper>
    {commentairesInstagram.map((c, i) => (
      <CommentBubble key={`ig-${i}`}>
        <a
href={c.urlPostInstagram || urlPostInstagram || '#'}
  target="_blank"
  rel="noopener noreferrer"
  style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
  title="Voir sur Instagram"
  onClick={e => e.stopPropagation()}  // <-- empêche le Link parent
>
          <div className="icon">
            <FaInstagram size={14} />
          </div>
          <div className="text" title={c.contenu || c.texte}>
            {c.contenu || c.texte}
          </div>
        </a>
      </CommentBubble>
    ))}
  </CommentsWrapper>
)}

          <Button>Voir Détails</Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VoyageCard;
