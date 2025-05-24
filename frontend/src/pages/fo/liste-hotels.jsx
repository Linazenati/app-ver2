import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import hotelService from "../../services-call/hotel";
import HotelCard from "../../components/fo/hotel-card";
import HotelSearch from "../../components/fo/HotelSearch";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const HotelsByVille = () => {
  const { ville } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleCardClick = (id) => {
      console.log("ID de l'hôtel sélectionné :", id);
    navigate(`/web/infos_hotel/${id}`);
  };

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  justify-items: center;
  padding: 30px;
`;
useEffect(() => {
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelService.recupererHotelByVille(ville);
      const hotelsFormatted = response.data.data.map(formatHotel);
      setHotels(hotelsFormatted);
    } catch (err) {
      setError("Erreur lors du chargement des hôtels.");
      console.error("Erreur API :", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchHotels();
}, [ville]);
 
// Dans handleSearch
const handleSearch = async (criteres) => {
  try {
    setLoading(true);
    setError(null);
    const response = await hotelService.searchRealTime(criteres);
    console.log("Réponse API (handleSearch):", response.data);
      const hotelsFormatted = response.data.map(formatHotel); // ⬅️ ici
    console.log("Données formatées : ", hotelsFormatted);

    setHotels(hotelsFormatted);
    console.log("Hotels reçus (handleSearch):", response.data); // <-- ici
  } catch (err) {
    setError("Erreur lors de la recherche.");
    console.error("Erreur recherche :", err?.response?.data || err.message);
  } finally {
    setLoading(false);
  }
  };
  
  const formatHotel = (hotel) => {
  const data = hotel.dataValues || hotel; // <-- extraction sécurisée

  return {
    id: data.id,
    name: data.name || data.nom || "Nom indisponible",
    etoiles: data.etoiles || data.etoile || 0,
    adresse: data.adresse || data.address || "Adresse non disponible",
    photos: Array.isArray(data.photos)
      ? data.photos
      : (typeof data.photos === "string"
          ? (() => {
              try {
                return JSON.parse(data.photos);
              } catch {
                return [];
              }
            })()
          : []),
    Note_moyenne: data.Note_moyenne || data.rating || null,
    Appréciation: data.Appréciation || data.review || null,
    Nombre_avis: data.Nombre_avis || data.reviews_count || 0,
    prixDZD: data.prixDZD || data.price || null,
  };
};

  
  
  if (loading) return <p>Chargement des hôtels...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div>
     <h2 style={{ color: "#0D3B66" , marginTop: "40px" }}>Hôtels à {ville}</h2>
      <HotelSearch ville={ville} onSearch={handleSearch} />
      
   {!Array.isArray(hotels) ? (
    <p>Chargement des hôtels...</p> // Optionnel : tu peux afficher un message temporaire
  ) : hotels.length === 0 ? (
    <p>Aucun hôtel trouvé.</p>
  ) : (
    <GridContainer>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel}              onClick={() => handleCardClick(hotel.id)}/>
      ))}
    </GridContainer>
  )}
</div>
);
};

export default HotelsByVille;
