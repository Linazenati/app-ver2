import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaPlaneDeparture, FaMoneyBillWave } from 'react-icons/fa';

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
 color: #003366;; 
  font-weight: bold;
  font-size: 18px;
  margin-top: 10px;

  svg {
    margin-right: 8px;
    color: #e91e63;
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

const VoyageCard = ({ voyage }) => {
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
          <Button>Voir Détails</Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VoyageCard;
