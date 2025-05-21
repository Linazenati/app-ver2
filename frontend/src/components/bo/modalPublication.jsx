import React, { useEffect, useState } from "react";
import { Modal, Button, Checkbox, Alert, message, Drawer } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons"; // Import de l'icône
import publicationService from "../../services-call/publication";
import ModalCommentaire from "./modalCommentaire";
import moment from "moment";
import facebookService from"../../services-call/facebook";
import instagramService from "../../services-call/instagram"
const plateformesDisponibles = ["site", "facebook", "instagram"];

const ModalPublicationVoyage = ({ voyage, onClose, visible }) => {
  const [publications, setPublications] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessages, setSuccessMessages] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [availablePlatforms, setAvailablePlatforms] = useState(plateformesDisponibles);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
 const [commentModalVisible, setCommentModalVisible] = useState(false);
 const [likes, setLikes] = useState({});

  // Chargement des publications existantes
useEffect(() => {
  const fetchVoyagePublications = async () => {
    try {
      if (voyage && voyage.est_publier) {
        const response = await publicationService.getPublicationsByVoyageId(voyage.id);
        const publicationsByPlatform = {};
        const likesByPublication = {};

       await Promise.allSettled(response.data.map(async (pub) => {
  if (!publicationsByPlatform[pub.plateforme]) {
    publicationsByPlatform[pub.plateforme] = [];
  }
  publicationsByPlatform[pub.plateforme].push(pub);

  if (pub.plateforme === "facebook") {
    try {
      const likesResponse = await facebookService.getLikesByPublication(pub.id_post_facebook);
      const nbLikes = likesResponse.data.likes ?? likesResponse.data ?? 0;
      likesByPublication[pub.id_post_facebook] = nbLikes;
    } catch (error) {
      likesByPublication[pub.id_post_facebook] = 0;
    }
  } else if (pub.plateforme === "instagram") {
    try {
      const likesResponse = await instagramService.recupererLikesPublication(pub.id_post_instagram);
      const nbLikes = likesResponse.data.likes ?? likesResponse.data ?? 0;
      likesByPublication[pub.id_post_instagram] = nbLikes;
    } catch (error) {
      likesByPublication[pub.id_post_instagram] = 0;
    }
  }
}));

        console.log("Publications:", publicationsByPlatform);
        console.log("Likes:", likesByPublication);

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

  if (visible) fetchVoyagePublications();
}, [voyage, visible]);



  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      message.warning("Veuillez sélectionner au moins une plateforme.");
      return;
    }

    setLoading(true);
    const newSuccessMessages = {};
    const newErrorMessages = {};

    try {
      const response = await publicationService.publierMulti(voyage.id, selectedPlatforms);
      const resultats = response.data.resultats;

      selectedPlatforms.forEach((platform) => {
        if (resultats[platform]?.error) {
          newErrorMessages[platform] = resultats[platform].error;
        } else {
          newSuccessMessages[platform] = "Publication réussie";
        }
      });

      setSuccessMessages(newSuccessMessages);
      setErrorMessages(newErrorMessages);

      if (Object.keys(newSuccessMessages).length > 0) {
        const platformsSuccess = Object.keys(newSuccessMessages).join(", ");
        message.success(`Publication réussie sur : ${platformsSuccess}`);
      }

      if (Object.keys(newErrorMessages).length > 0) {
        const platformsError = Object.keys(newErrorMessages).join(", ");
        message.error(`Erreur sur les plateformes : ${platformsError}`);
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
  <Modal
    open={visible}
    onCancel={onClose}
    footer={null}
  >
    {errorMessages.global && (
      <Alert type="error" message={errorMessages.global} showIcon className="mb-3" />
    )}

    {Object.entries(successMessages).map(([platform, msg]) => (
      <Alert key={platform} type="success" message={`${platform.toUpperCase()}: ${msg}`} showIcon className="mb-2" />
    ))}

    {Object.entries(errorMessages).filter(([key]) => key !== "global").map(([platform, msg]) => (
      <Alert key={platform} type="error" message={`${platform.toUpperCase()}: ${msg}`} showIcon className="mb-2" />
    ))}

    {voyage?.est_publier && Object.keys(publications).length > 0 ? (
      <div>
        {/* Titre du voyage - taille agrandie */}
        <h3 className="text-3xl font-semibold mb-5">{voyage?.titre || "Voyage"}</h3>
        
        {/* Publications existantes Section */}
        <h4 className="text-xl font-medium mb-3">Publications existantes :</h4>
        
        {Object.keys(publications).map((platform) => (
          <div key={platform} className="publication-section mb-4">
            {/* Platform Heading */}
            <div className="flex items-center mb-2">
              <h5 className="text-lg font-semibold mr-3">{platform.toUpperCase()}</h5>
              <span className="badge bg-secondary text-white px-2 py-1 rounded-full">
                {publications[platform].length} Publication(s)
              </span>
            </div>

            {/* Publication List */}
            <ul className="publication-list space-y-3">
              {publications[platform].map((pub) => (
                <li key={pub.id} className="publication-item flex justify-between items-center border-b pb-2">
                  {/* Publication Info */}
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-500">
                      {moment(pub.date_publication).format("DD/MM/YYYY HH:mm:ss")}
                    </span>
                    <span className={`status-badge ${pub.statut === "disponible" ? "bg-green-500" : "bg-yellow-500"}`}>
                      {pub.statut === "disponible" ? "Disponible" : pub.statut}
                    </span>
                  </div>
                  
                  {/* Likes & Details Button */}
                <div className="flex items-center">
            {(pub.plateforme === "facebook" || pub.plateforme === "instagram") && (
  <span>
    ❤️ {
      pub.plateforme === "facebook" 
        ? (likes[pub.id_post_facebook] ?? 0) 
        : (likes[pub.id_post_instagram] ?? 0)
    } réactions
  </span>
)}
                    
      <Button
    size="small"
       onClick={() => onCommentClick(pub)} type="link"
      style={{
      backgroundColor: "#007bff",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderRadius: "8px",
      paddingLeft: "12px",
      paddingRight: "12px",
      transition: "background-color 0.3s ease",
      boxShadow: "0 4px 15px rgba(0, 123, 255, 0.2)",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
  >
    💬 Commentaires
  </Button>

                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <p>Aucune publication existante pour ce voyage.</p>
    )}


      <Checkbox.Group
        value={selectedPlatforms}
        onChange={handleCheckboxChange}
        style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}
      >
        {availablePlatforms.map((platform) => (
          <Checkbox key={platform} value={platform} className="mb-2">
            {platform.toUpperCase()}
          </Checkbox>
        ))}
      </Checkbox.Group>
      <Button onClick={handlePublish} loading={loading} type="primary" style={{ marginTop: 20 }}>
        Publier
      </Button>
    <ModalCommentaire
  publication={selectedPublication}
  visible={commentModalVisible}
  onClose={() => setCommentModalVisible(false)}
/>
  
    </Modal>
  );
};

export default ModalPublicationVoyage;
