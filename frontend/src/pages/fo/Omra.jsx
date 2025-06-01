import { useEffect, useState } from "react";
import { Spin, Empty, Pagination } from "antd";
import omraService from "../../services-call/omra";
import OmraCard from "../../components/fo/Omra-card";
import publicationService from "../../services-call/publication";

export default function ListeOmras() {
  const [omras, setOmras] = useState([]);
  const [commentsByOmra, setCommentsByOmra] = useState({});
  const [likesByOmra, setLikesByOmra] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const omrasPerPage = 6;

  useEffect(() => {
    const fetchOmras = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await omraService.getOmraPubliesSurSite(token);
        const list = resp.data;

        const results = await Promise.allSettled(
          list.map((o) => omraService.getDetailsOmra(o.id))
        );

        const map = {};
        results.forEach((res, idx) => {
          const oid = list[idx].id;
          if (res.status === "fulfilled") {
            const data = res.value.data;
            map[oid] = {
              commentairesFacebook: data.commentairesFacebook || [],
              commentairesInstagram: data.commentairesInstagram || [],
              urlPostFacebook: data.urlPostFacebook || null,
              urlPostInstagram: data.urlPostInstagram || null,
            };
          } else {
            map[oid] = {
              commentairesFacebook: [],
              commentairesInstagram: [],
              urlPostFacebook: null,
              urlPostInstagram: null,
            };
          }
        });

        setOmras(list);
        setCommentsByOmra(map);
      } catch (error) {
        console.error("Erreur lors du chargement des Omras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOmras();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      const likesMap = {};

      await Promise.all(
        omras.map(async (omra) => {
          try {
            const resPubs = await publicationService.getPublicationsByOmraId(omra.id);
            const publications = resPubs.data;

            likesMap[omra.id] = { facebook: 0, instagram: 0 };

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
    likesMap[omra.id][plateforme] += likesCount;
  } catch (e) {
    console.error(`❌ Erreur likes ${plateforme} pour post ${id_post}:`, e);
  }
}

  })
);

            // Console log nombre total de likes par Omra après cumul
            const totalLikes = likesMap[omra.id].facebook + likesMap[omra.id].instagram;
            console.log(`Omra ID ${omra.id} - Total likes (Facebook + Instagram):`, totalLikes);

          } catch (e) {
            console.error(`Erreur récupération publications pour Omra ${omra.id}:`, e);
          }
        })
      );

      setLikesByOmra(likesMap);
    };

    if (omras.length > 0) {
      fetchLikes();
    }
  }, [omras]);

  // Pagination
  const indexOfLastOmra = currentPage * omrasPerPage;
  const indexOfFirstOmra = indexOfLastOmra - omrasPerPage;
  const currentOmras = omras.slice(indexOfFirstOmra, indexOfLastOmra);

  const onChangePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  if (omras.length === 0) {
    return (
      <div className="text-center p-4">
        <Empty description="Aucune Omra disponible pour le moment" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {currentOmras.map((omra) => {
          const facebookLikes = likesByOmra[omra.id]?.facebook || 0;
          const instagramLikes = likesByOmra[omra.id]?.instagram || 0;
          const totalLikes = facebookLikes + instagramLikes;

          // Log dans le rendu de la card
          console.log(`Rendu Omra ID ${omra.id} - Likes Facebook: ${facebookLikes}, Likes Instagram: ${instagramLikes}, Total: ${totalLikes}`);

          return (
            <OmraCard
              key={omra.id}
              omra={omra}
              commentairesFacebook={commentsByOmra[omra.id]?.commentairesFacebook || []}
              commentairesInstagram={commentsByOmra[omra.id]?.commentairesInstagram || []}
              urlPostFacebook={commentsByOmra[omra.id]?.urlPostFacebook || null}
              urlPostInstagram={commentsByOmra[omra.id]?.urlPostInstagram || null}
              likesFacebook={facebookLikes}
              likesInstagram={instagramLikes}
            />
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={omras.length}
          pageSize={omrasPerPage}
          onChange={onChangePage}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
