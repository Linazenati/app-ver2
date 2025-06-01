import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import hotelService from "../../services-call/hotel";
import HotelCard from "../../components/fo/hotel-card";
import HotelSearch from "../../components/fo/HotelSearch";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  justify-items: center;
  padding: 30px;
`;

const HotelsByVille = () => {
  const { villeId } = useParams();
  const [villeDetails, setVilleDetails] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const formatHotel = (hotel) => {
    const data = hotel.dataValues || hotel;
  console.log("Data hotel brut:", data); // 👈 ICI
    return {
      id: data.id,
      name: data.name || data.nom || "Nom indisponible",
      etoiles: data.etoiles || data.etoile || 0,
      adresse: data.adresse || data.address || "Adresse non disponible",
      region: data.region ?? null,
      photos: Array.isArray(data.photos)
        ? data.photos
        : typeof data.photos === "string"
        ? (() => {
            try {
              return JSON.parse(data.photos);
            } catch {
              return [];
            }
          })()
        : [],
      Note_moyenne: data.Note_moyenne ?? data.rating ?? null,
      Appréciation: data.Appréciation ?? data.review ?? null,
      Nombre_avis: data.Nombre_avis ?? data.reviews_count ?? 0,
      prixDZD: data.prix_dinare ?? data.price ?? null,
      prixEUR: data.prix_euro ?? null,
    };
  };


  useEffect(() => {
  if (!villeId) return; // sécurité

  const fetchVille = async () => {
    try {
      const villeResponse = await hotelService.getVilleById(villeId);
setVilleDetails(villeResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la ville :", error);
    }
  };

  fetchVille();
}, [villeId]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await hotelService.getHotelsByVilleId(villeId);
        const hotelsFormatted = response.data.map(formatHotel);
        setHotels(hotelsFormatted);
      } catch (err) {
        setError("Erreur lors du chargement des hôtels.");
        console.error("Erreur API :", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [villeId]);

  const handleCardClick = (id) => {
    navigate(`/web/infos_hotel/${id}`);
  };

  const handleSearch = async (criteres) => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.searchAndSaveHotelsForVille(criteres);
      const hotelsFormatted = response.data.map(formatHotel);
      setHotels(hotelsFormatted);
    } catch (err) {
      setError("Erreur lors de la recherche.");
      console.error("Erreur recherche :", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement des hôtels...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 style={{ color: "#0D3B66", marginTop: "40px" }}>
        Hôtels à {villeDetails?.nom || "Chargement..."}
      </h2>

      <HotelSearch
        villeNom={villeDetails?.nom}
        destId={villeDetails?.dest_id}
        region={villeDetails?.region}
        onSearch={handleSearch}
      />

      {!Array.isArray(hotels) ? (
        <p>Chargement des hôtels...</p>
      ) : hotels.length === 0 ? (
        <p>Aucun hôtel trouvé.</p>
      ) : (
        <GridContainer>
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} onClick={() => handleCardClick(hotel.id)} />
          ))}
        </GridContainer>
      )}
    </div>
  );
};

export default HotelsByVille;
