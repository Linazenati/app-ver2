import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

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
  /* PAS de hauteur fixe */
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 22px;
  font-weight: bold;
  color: #1e1e2f;
`;

const InfoText = styled.p`
  margin: 5px 0;
  color: #555;
  font-size: 14px;
`;

const Price = styled.div`
  margin-top: 10px;
  color: #003366;
  font-weight: bold;
  font-size: 18px;
`;

const Button = styled.button`
  margin-top: auto; /* pousse le bouton en bas */
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

const HotelCard = ({ hotel, onClick }) => {
  const {
    id,
    name,
    etoiles,
    adresse,
    region,
    photos,
    Note_moyenne,
    Appréciation,
    Nombre_avis,
    prixDZD,
    prixEUR
  } = hotel;

  return (
    <Card
      onClick={() => onClick(id)}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Image
        src={photos?.[0] || "https://via.placeholder.com/320x220?text=Pas+d'image"}
        alt={name || "Hôtel"}
        loading="lazy"
      />
      <CardContent>
        <Title>{name}</Title>
        {etoiles > 0 && (
          <InfoText>
            {'⭐'.repeat(etoiles)} ({etoiles} étoiles)
          </InfoText>
        )}
<InfoText>
  {adresse}
  {region ? `, ${region}` : ""}
</InfoText>        {Note_moyenne && (
          <InfoText>
            Note : {Note_moyenne}/10 - {Appréciation || "N/A"}
            <br />
            {Nombre_avis || 0} avis
          </InfoText>
        )}
       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
  {prixDZD && (
    <div style={{
      backgroundColor: '#fff9db',
      border: '2px solid #ffcc00',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      fontWeight: 'bold',
      color: '#333',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: 'fit-content'
    }}>
      Prix en Dinar : {prixDZD} DZD
    </div>
  )}
  {prixEUR && (
    <div style={{
      backgroundColor: '#f0f8ff',
      border: '2px solid #007fff',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      fontWeight: 'bold',
      color: '#333',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      width: 'fit-content'
    }}>
      Prix en Euro : {prixEUR} EUR
    </div>
  )}
</div>


      </CardContent>
    </Card>
  );
};

export default HotelCard;
