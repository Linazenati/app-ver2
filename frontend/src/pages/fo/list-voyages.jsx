import React, { useEffect, useState } from 'react';
import VoyageCard from '../../components/fo/voyage-card';
import voyageService from '../../services-call/voyage'; // Assure-toi que le chemin est correct
import styled from 'styled-components';
import { Pagination } from 'react-bootstrap';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  justify-items: center;
  padding: 30px;
`;

const VoyageList = () => {
  const [voyages, setVoyages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const [voyagesPerPage] = useState(6); // Nombre de voyages par page

  // Fonction pour charger les voyages depuis l'API
  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const response = await voyageService.getVoyagesPubliesSurSite();
          console.log('Voyages récupérés:', response.data); // Affiche les données dans la console
        setVoyages(response.data); // Axios retourne les données dans `.data`
      } catch (error) {
        console.error('Erreur lors de la récupération des voyages publiés:', error);
      }
    };

    fetchVoyages();
  }, []);

  // Calculer les voyages à afficher sur la page actuelle
  const indexOfLastVoyage = currentPage * voyagesPerPage;
  const indexOfFirstVoyage = indexOfLastVoyage - voyagesPerPage;
  const currentVoyages = voyages.slice(indexOfFirstVoyage, indexOfLastVoyage);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(voyages.length / voyagesPerPage);

  // Fonction pour changer la page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <GridContainer>
        {currentVoyages.map(voyage => (
          <VoyageCard key={voyage.id} voyage={voyage} />
        ))}
      </GridContainer>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        {[...Array(totalPages).keys()].map(num => (
          <Pagination.Item
            key={num + 1}
            active={num + 1 === currentPage}
            onClick={() => paginate(num + 1)}
          >
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default VoyageList;
