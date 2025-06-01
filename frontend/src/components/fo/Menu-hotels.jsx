import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hotelService from "../../services-call/hotel"; // adapte le chemin

const MenuHotel = () => {
  const [villesParRegion, setVillesParRegion] = useState({
    Algérie: [],
    Tunisie: [],
    Monde: [],
  });

  useEffect(() => {
    const regions = ["Algérie", "Tunisie", "Monde"];

    const fetchVilles = async () => {
      const result = {};
      for (const region of regions) {
        try {
          const response = await hotelService.getAllVilles(region);
          result[region] = response.data;
          console.log(`Données pour ${region} :`, response.data);

        } catch (err) {
          console.error(`Erreur de chargement des villes pour la région ${region}`, err);
          result[region] = [];
        }
      }
      console.log("Résultat final à setVillesParRegion :", result);

      setVillesParRegion(result);
    };

    fetchVilles();
  }, []);

  return (
  <div className="nav-item dropdown">
    <Link
      to="#"
      className="nav-link dropdown-toggle d-flex align-items-center"
      data-bs-toggle="dropdown"
      role="button"
      aria-expanded="false"
      id="hotelsDropdown"
      style={{ fontWeight: "bold" }}
    >
      <i className="fas fa-hotel mr-2"></i> Hôtels
    </Link>
    <div className="dropdown-menu p-3" aria-labelledby="hotelsDropdown" style={{ minWidth: "600px" }}>
       <div className="d-flex justify-content-between">
          {Object.entries(villesParRegion).map(([region, villes]) => (
            <div key={region} style={{ minWidth: "180px" }}>
              <strong className="dropdown-header" style={{ color: "black" }}>{region}</strong>
              {villes.map((ville) => (
                <Link
                  key={ville.id}
                  to={`/web/hotel/${ville.id}`}
                  className="dropdown-item"
                >
                  {ville.nom}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuHotel;