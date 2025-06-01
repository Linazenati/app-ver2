import React, { useEffect, useState } from "react";
import { Modal, Button, Checkbox, Alert, message } from "antd";
import publicationService from "../../services-call/publication";
import throttleService from "../../services-call/throttle";
import ModalCommentaire from "./modalCommentaire";
import moment from "moment";


const plateformesDisponibles = ["site", "facebook", "instagram"];

// Cercle avec SVG pour afficher la progression du quota
const CircleQuota = ({ value, max, label }) => {
  if (!max || max === 0) max = 1;

  const ratio = value / max; // value ici = restant

let color = "red";

if (ratio >= 0.5) {
  color = "green";
} else if (ratio >= 0.2) {
  color = "orange";
} else {
  color = "red";
}
  console.log('value:', value, 'max:', max, 'ratio:', ratio);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="100" height="100">
        <circle cx="50" cy="50" r="45" stroke="#ddd" strokeWidth="10" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={2 * Math.PI * 45}
          strokeDashoffset={2 * Math.PI * 45 * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="18"
          fill={color}
          fontWeight="bold"
        >
          {value}
        </text>
      </svg>
      <div style={{ fontSize: 16, fontWeight: "600", userSelect: "none" }}>{label}</div>
    </div>
  );
};



const ModalPublicationVoyage = ({ voyage = null, omra = null, onClose, visible }) => {
  const [publications, setPublications] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessages, setSuccessMessages] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [availablePlatforms, setAvailablePlatforms] = useState(plateformesDisponibles);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [likes, setLikes] = useState({});
  const [quotaMinute, setQuotaMinute] = useState(null);
  const [quotaJour, setQuotaJour] = useState(null);

 useEffect(() => {
  if (!visible) return;

  async function fetchQuota() {
    try {
      const response = await throttleService.afficherQuota();
      
      console.log("📥 Données récupérées du quota :", response.data);

      setQuotaMinute(response.data.publicationMinuteRestante);
      setQuotaJour(response.data.publicationJourRestante);

      console.log("✅ quotaMinute mis à jour :", response.data.publicationMinuteRestante);
      console.log("✅ quotaJour mis à jour :", response.data.publicationJourRestante);
    } catch (error) {
      console.error("❌ Erreur fetch quota", error);
    }
  }

  fetchQuota();
}, [visible]);

  // 👉 Ici tu peux définir `data` proprement après le useEffect
  const data = {
    publicationMinuteRestante: quotaMinute,
    LIMITE_PAR_MINUTE: 2,
    publicationJourRestante: quotaJour,
    LIMITE_PAR_JOUR: 10,
  };
useEffect(() => {
  if (quotaMinute !== null || quotaJour !== null) {
    console.log("✅ Nouveau quota minute :", quotaMinute);
    console.log("✅ Nouveau quota jour :", quotaJour);
  }
}, [quotaMinute, quotaJour]);
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        let response;

        if (voyage && voyage.est_publier) {
          response = await publicationService.getPublicationsByVoyageId(voyage.id);
        } else if (omra && omra.est_publier) {
          response = await publicationService.getPublicationsByOmraId(omra.id);
        } else {
          setPublications({});
          setAvailablePlatforms(plateformesDisponibles);
          setSelectedPlatforms([]);
          setSuccessMessages({});
          setErrorMessages({});
          return;
        }

        if (response && response.data && response.data.length > 0) {
          const publicationsByPlatform = {};
          const likesByPublication = {};

          await Promise.allSettled(
            response.data.map(async (pub) => {
              if (!publicationsByPlatform[pub.plateforme]) {
                publicationsByPlatform[pub.plateforme] = [];
              }
              publicationsByPlatform[pub.plateforme].push(pub);

             if (["facebook", "instagram"].includes(pub.plateforme)) {
  try {
    const id_post = pub.plateforme === "facebook" ? pub.id_post_facebook : pub.id_post_instagram;
    const response = await publicationService.getLikesByPostId(pub.plateforme, id_post);
    const nbLikes = response.data.likes ?? 0;
    likesByPublication[id_post] = nbLikes;
  } catch (error) {
    const id_post = pub.plateforme === "facebook" ? pub.id_post_facebook : pub.id_post_instagram;
    likesByPublication[id_post] = 0;
  }
}
            })
          );

          setPublications(publicationsByPlatform);
          setLikes({ ...likesByPublication });

          setAvailablePlatforms(
            plateformesDisponibles.filter(
              (platform) => !publicationsByPlatform[platform] || publicationsByPlatform[platform].length === 0
            )
          );
        } else {
          setPublications({});
          setAvailablePlatforms(plateformesDisponibles);
        }

        setSelectedPlatforms([]);
        setSuccessMessages({});
        setErrorMessages({});
      } catch (error) {
        setErrorMessages({ global: "Erreur lors du chargement des publications." });
      }
    };

    if (visible) {
      fetchPublications();
    }
  }, [voyage, omra, visible]);

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      message.warning("Veuillez sélectionner au moins une plateforme.");
      return;
    }

    setLoading(true);
    const newSuccessMessages = {};
    const newErrorMessages = {};

    try {
      let response;
      const type = voyage ? "voyage" : omra ? "omra" : null;
      const id = voyage ? voyage.id : omra ? omra.id : null;

      if (!type || !id) {
        setErrorMessages({ global: "Voyage ou Omra non défini pour la publication." });
        setLoading(false);
        return;
      }

      if (type === "voyage") {
        response = await publicationService.publierMulti(id, selectedPlatforms, type);
      } else if (type === "omra") {
        response = await publicationService.publiermultiOmra(id, selectedPlatforms, type);
      }

      const resultats = response.data.resultats;

      selectedPlatforms.forEach((platform) => {
        const resultat = resultats[platform];

        if (resultat?.error) {
          newErrorMessages[platform] = resultat.error;
        } else if (resultat?.message && resultat.message.toLowerCase().includes("impossible")) {
          newErrorMessages[platform] = resultat.message;
        } else {
          newSuccessMessages[platform] = "Publication réussie";
        }
      });

      setSuccessMessages(newSuccessMessages);
      setErrorMessages(newErrorMessages);

      if (Object.keys(newSuccessMessages).length === 0 && Object.keys(newErrorMessages).length > 0) {
        message.error("Échec de la publication sur toutes les plateformes.");
      } else {
        if (Object.keys(newSuccessMessages).length > 0) {
          const platformsSuccess = Object.keys(newSuccessMessages).join(", ");
          message.success(`Publication réussie sur : ${platformsSuccess}`);
        }

        if (Object.keys(newErrorMessages).length > 0) {
          const platformsError = Object.keys(newErrorMessages).join(", ");
          message.error(`Échec sur les plateformes : ${platformsError}`);
        }
      }

      setSelectedPlatforms([]);
    } catch (error) {
      setErrorMessages({ global: "Erreur lors de la publication. Veuillez réessayer." });
      message.error("Erreur de publication !");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (checkedValues) => {
    setSelectedPlatforms(checkedValues);
  };

  const onCommentClick = (publication) => {
    setSelectedPublication(publication);
    setCommentModalVisible(true);
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={700}>
      {errorMessages.global && (
        <Alert type="error" message={errorMessages.global} showIcon className="mb-3" />
      )}

      {Object.entries(successMessages).map(([platform, msg]) => (
        <Alert key={platform} type="success" message={`${platform.toUpperCase()}: ${msg}`} showIcon className="mb-2" />
      ))}

      {Object.entries(errorMessages).map(([platform, msg]) =>
        platform !== "global" ? (
          <Alert key={platform} type="error" message={`${platform.toUpperCase()}: ${msg}`} showIcon className="mb-2" />
        ) : null
      )}

     {(data.publicationMinuteRestante !== null || data.publicationJourRestante !== null) && (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 400, margin: "0 auto" }}>
    {console.log("🔍 Quota minute affiché :", data.publicationMinuteRestante)}
    {console.log("🔍 Quota jour affiché :", data.publicationJourRestante)}

  <CircleQuota
    value={data.publicationMinuteRestante ?? 0}
    max={data.LIMITE_PAR_MINUTE}
    label="Publications possibles cette minute sur les réseaux sociaux"
  />
  <CircleQuota
    value={data.publicationJourRestante ?? 0}
    max={data.LIMITE_PAR_JOUR}
    label="Publications possibles cette journée sur les réseaux sociaux"
  />
</div>
)}

      <Checkbox.Group
        options={availablePlatforms.map((p) => ({
          label: p.charAt(0).toUpperCase() + p.slice(1),
          value: p,
          disabled: !(availablePlatforms.includes(p)),
        }))}
        value={selectedPlatforms}
        onChange={handleCheckboxChange}
      />

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Button onClick={onClose}>Fermer</Button>
        <Button
          type="primary"
          onClick={handlePublish}
          loading={loading}
          disabled={selectedPlatforms.length === 0}
        >
          Publier
        </Button>
      </div>

      {/* Liste des publications déjà existantes avec boutons commentaire */}
    <div style={{ marginTop: 20 }}>
  {Object.entries(publications).map(([platform, pubs]) => (
    <div key={platform} style={{ marginBottom: 12 }}>
      <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
      {pubs.map((pub) => (
        <div key={pub.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: 8,
                  marginBottom: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
          <div>
            <div>ID Publication : {pub.id}</div>
            <div>Date : {moment(pub.date_publication).format("DD/MM/YYYY HH:mm")}</div>
            {platform === "facebook" && (
              <div>Likes : {likes[pub.id_post_facebook] ?? 0}</div>
            )}
            {platform === "instagram" && (
              <div>Likes : {likes[pub.id_post_instagram] ?? 0}</div>
            )}
          </div>
          {(platform === "facebook" || platform === "instagram") && (
            <Button size="small" onClick={() => onCommentClick(pub)}>
              Commentaires
            </Button>
          )}
        </div>
      ))}
    </div>
  ))}
</div>

{selectedPublication && (
  <ModalCommentaire
    publication={selectedPublication}
    visible={commentModalVisible}
    onClose={() => setCommentModalVisible(false)}
  />
)}
</Modal>
  );
};

export default ModalPublicationVoyage;
