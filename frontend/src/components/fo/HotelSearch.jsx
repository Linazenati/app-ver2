import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBed,
  FaUser,
  FaChild,
  FaSearch,
} from "react-icons/fa";

export default function HotelSearch({ villeNom, destId, region, onSearch }) {
  const getLocalDate = (key, fallback) =>
    localStorage.getItem(key) || fallback;

  const [arrivalDate, setArrivalDate] = useState(() =>
    getLocalDate("arrivalDate", "2025-05-23")
  );
  const [departureDate, setDepartureDate] = useState(() =>
    getLocalDate("departureDate", "2025-05-24")
  );
  const [nbrChambre, setNbrChambre] = useState(1);
  const [nbrAdulte, setNbrAdulte] = useState(2);
  const [ageEnfants, setAgeEnfants] = useState("");

  useEffect(() => {
    localStorage.setItem("arrivalDate", arrivalDate);
  }, [arrivalDate]);

  useEffect(() => {
    localStorage.setItem("departureDate", departureDate);
  }, [departureDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      villeNom,
      region,
      dest_id: destId,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      nbr_chambre: nbrChambre,
      nbr_adulte: nbrAdulte,
      age_enfants: ageEnfants,
    });
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
    color: "#333",
  };

  const iconStyle = {
    color: "#F9A425",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "flex-end",
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
      }}
    >
      {/* Ville */}
      <div style={{ flex: "1 1 200px" }}>
        <label htmlFor="ville" style={labelStyle}>
          <FaMapMarkerAlt style={iconStyle} /> Ville
        </label>
        <input
          id="ville"
          name="ville"
          type="text"
          value={villeNom}
          readOnly
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#eee",
            cursor: "not-allowed",
          }}
        />
      </div>

      {/* Arrivée */}
      <div style={{ flex: "1 1 150px" }}>
        <label htmlFor="arrivalDate" style={labelStyle}>
          <FaCalendarAlt style={iconStyle} /> Arrivée
        </label>
        <input
          id="arrivalDate"
          type="date"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Départ */}
      <div style={{ flex: "1 1 150px" }}>
        <label htmlFor="departureDate" style={labelStyle}>
          <FaCalendarAlt style={iconStyle} /> Départ
        </label>
        <input
          id="departureDate"
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Chambres */}
      <div style={{ flex: "1 1 100px" }}>
        <label htmlFor="nbrChambre" style={labelStyle}>
          <FaBed style={iconStyle} /> Chambres
        </label>
        <input
          id="nbrChambre"
          type="number"
          min="1"
          value={nbrChambre}
          onChange={(e) => setNbrChambre(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Adultes */}
      <div style={{ flex: "1 1 100px" }}>
        <label htmlFor="nbrAdulte" style={labelStyle}>
          <FaUser style={iconStyle} /> Adultes
        </label>
        <input
          id="nbrAdulte"
          type="number"
          min="1"
          value={nbrAdulte}
          onChange={(e) => setNbrAdulte(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Enfants */}
      <div style={{ flex: "1 1 150px" }}>
        <label htmlFor="ageEnfants" style={labelStyle}>
          <FaChild style={iconStyle} /> Âges enfants
        </label>
        <input
          id="ageEnfants"
          type="text"
          value={ageEnfants}
          onChange={(e) => setAgeEnfants(e.target.value)}
          placeholder="4,6 ou vide"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Bouton */}
      <div>
        <button
          type="submit"
          style={{
            backgroundColor: "#F9A425",
            border: "none",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaSearch /> Rechercher
        </button>
      </div>
    </form>
  );
}
