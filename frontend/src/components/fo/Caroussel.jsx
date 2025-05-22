import { useEffect, useState } from "react";
import voyageService from "../../services-call/voyage";
import CarousselItem from "./CarousselItem";
import imgCarousel2 from "../../assets/fo/img/carousel-2.jpg";

const Caroussel = () => {
  const [dernierVoyage, setDernierVoyage] = useState(null);

  useEffect(() => {
    const fetchDernierVoyage = async () => {
      try {
        const res = await voyageService.getVoyagesPubliesSurSite();
        const voyages = res.data;

        if (voyages && voyages.length > 0) {
          // Récupère le dernier voyage publié
          const dernier = voyages[voyages.length - 1];
          setDernierVoyage(dernier);
        }
      } catch (error) {
        console.error("Erreur chargement voyage publié :", error);
      }
    };

    fetchDernierVoyage();
  }, []);

  const imageBaseUrl = "http://localhost:3000/images";
  const imageVoyage =
    dernierVoyage?.image && JSON.parse(dernierVoyage.image)[0]
      ? `${imageBaseUrl}/${JSON.parse(dernierVoyage.image)[0]}`
      : imgCarousel2; // Image par défaut si aucun voyage n'est publié

  return (
    <div className="container-fluid p-0">
      <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {/* 🥇 Premier carrousel - Dernier voyage */}
          <CarousselItem
            nom="Notre Prochain Voyage"
            img={imageVoyage}
            title={dernierVoyage?.titre || "Voyage Inconnu"}
            content={dernierVoyage?.description || "Découvrez votre prochaine aventure"}
            active={true}
          />

          {/* 🥈 Deuxième carrousel - Fixe */}
         <CarousselItem
  nom="Notre Prochain Omra"
  img={imgCarousel2}  // Remplace imgCarousel2 par une image en rapport avec l'Omra
  title="Voyages & Pèlerinages"
  content="Partez en Omra avec nous pour une expérience spirituelle unique"
  active={false}  // Mettre à true si c'est l'élément actif, sinon false
/>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
};

export default Caroussel;
