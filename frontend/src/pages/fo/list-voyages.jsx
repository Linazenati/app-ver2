import React, { useEffect, useState } from 'react';
import VoyageCard from '../../components/fo/voyage-card';
import voyageService from '../../services-call/voyage';
import styled from 'styled-components';
import { Pagination } from 'react-bootstrap';
import publicationService from "../../services-call/publication";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  justify-items: center;
  padding: 30px;
`;

const VoyageList = () => {
  const [voyages, setVoyages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [voyagesPerPage] = useState(6);
  const [likesByVoyage, setLikesByVoyage] = useState({});
  const [commentsByVoyage, setCommentsByVoyage] = useState({});

  // Récupérer les voyages publiés + leurs détails
  useEffect(() => {
    async function fetchAll() {
      try {
        console.log("Début de la récupération des voyages publiés...");
        const resp = await voyageService.getVoyagesPubliesSurSite();
        const list = resp.data;
        console.log('Voyages publiés récupérés:', list);

        const results = await Promise.allSettled(
          list.map(v => voyageService.getDetailsVoyages(v.id))
        );

        const map = {};
        results.forEach((res, idx) => {
          const vid = list[idx].id;
          if (res.status === 'fulfilled') {
            const data = res.value.data;
            console.log(`Détails du voyage ${vid} :`, data);
            map[vid] = {
              commentairesFacebook: data.commentairesFacebook || [],
              commentairesInstagram: data.commentairesInstagram || [],
              urlPostFacebook: data.urlPostFacebook || null,
              urlPostInstagram: data.urlPostInstagram || null,
            };
          } else {
            console.warn(`Échec de récupération des détails pour le voyage ${vid}`, res.reason);
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
        console.error('Erreur globale lors de fetchAll :', err);
      }
    }

    fetchAll();
  }, []);

  // Récupérer les likes par voyage
  useEffect(() => {
    const fetchLikes = async () => {
      console.log("Début récupération des likes...");
      const likesMap = {};

      await Promise.all(
        voyages.map(async (voyage) => {
          try {
            const resPubs = await publicationService.getPublicationsByVoyageId(voyage.id);
            const publications = resPubs.data;
            console.log(`Publications du voyage ${voyage.id} :`, publications);

            likesMap[voyage.id] = { facebook: 0, instagram: 0 };

           await Promise.all(
  publications.map(async (pub) => {
    const plateforme = pub.plateforme;
    let id_post = null;

    if (plateforme === "facebook") {
      id_post = pub.id_post_facebook;
    } else if (plateforme === "instagram") {
      id_post = pub.id_post_instagram;
    }

   if (plateforme && id_post) {
  try {
    const resLikes = await publicationService.getLikesByPostId(plateforme, id_post);
    console.log(`🟢 Réponse complète pour ${plateforme} post ${id_post}:`, resLikes);

    const likesCount = resLikes.data?.likes ?? 0;
    likesMap[voyage.id][plateforme] += likesCount;
  } catch (e) {
    console.error(`❌ Erreur likes ${plateforme} pour post ${id_post}:`, e);
  }
}

  })
);

          } catch (e) {
            console.error(`Erreur récupération publications pour le voyage ${voyage.id}:`, e);
          }
        })
      );

      console.log("Likes par voyage :", likesMap);
      setLikesByVoyage(likesMap);
    };

    if (voyages.length > 0) {
      fetchLikes();
    }
  }, [voyages]);

  // Pagination
  const indexOfLastVoyage = currentPage * voyagesPerPage;
  const indexOfFirstVoyage = indexOfLastVoyage - voyagesPerPage;
  const currentVoyages = voyages.slice(indexOfFirstVoyage, indexOfLastVoyage);
  const totalPages = Math.ceil(voyages.length / voyagesPerPage);

  const paginate = (pageNumber) => {
    console.log(`Changement de page : ${pageNumber}`);
    setCurrentPage(pageNumber);
  };

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
            likesFacebook={likesByVoyage[voyage.id]?.facebook || 0}
            likesInstagram={likesByVoyage[voyage.id]?.instagram || 0}
          />
        ))}
      </GridContainer>

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
