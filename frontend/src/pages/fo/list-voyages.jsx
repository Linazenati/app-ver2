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
const [commentsByVoyage, setCommentsByVoyage] = useState({});
  // Fonction pour charger les voyages depuis l'API
useEffect(() => {
  async function fetchAll() {
    try {
      const resp = await voyageService.getVoyagesPubliesSurSite();
      const list = resp.data;
        console.log('Voyages récupérés:', list);
      const results = await Promise.allSettled(
       list.map(v => voyageService.getVoyagePublieAvecCommentaires(v.id))
      );

      const map = {};
     results.forEach((res, idx) => {
  const vid = list[idx].id;
  if (res.status === 'fulfilled') {
    const data = res.value.data; // <-- Il faut stocker data ici !
    console.log(`Commentaires pour le voyage ${vid}:`, data);
    map[vid] = {
      commentairesFacebook: data.commentairesFacebook || [],
      commentairesInstagram: data.commentairesInstagram || [],
      urlPostFacebook: data.urlPostFacebook || null,       // <-- ici !
      urlPostInstagram: data.urlPostInstagram || null,     // <-- ici !
    };
  } else {
    console.warn(`Échec pour ${vid}`, res.reason);
    map[vid] = {
      commentairesFacebook: [],
      commentairesInstagram: [],
      urlPostFacebook: null,
      urlPostInstagram: null,
    };
  }
});

      setVoyages(list);
      setCommentsByVoyage(map);
    } catch (err) {
      console.error('Erreur globale fetchAll :', err);
    }
  }
  fetchAll();
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
   <VoyageCard
  key={voyage.id}
  voyage={voyage}
  commentairesFacebook={commentsByVoyage[voyage.id]?.commentairesFacebook || []}
  commentairesInstagram={commentsByVoyage[voyage.id]?.commentairesInstagram || []}
  urlPostFacebook={commentsByVoyage[voyage.id]?.urlPostFacebook || null}
  urlPostInstagram={commentsByVoyage[voyage.id]?.urlPostInstagram || null}
/>
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
