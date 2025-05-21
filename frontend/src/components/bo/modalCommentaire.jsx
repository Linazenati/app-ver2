import React, { useEffect, useState } from "react";
import { Modal, Button, Table, message, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import facebookService from "../../services-call/facebook";
import instagramService from "../../services-call/instagram";
import commentaireService from "../../services-call/commentaire";
import moment from "moment";

const ModalCommentaire = ({ publication, visible, onClose }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentairesSelectionnes, setCommentairesSelectionnes] = useState([]);

  useEffect(() => {
    if (publication && visible) {
      fetchCommentaires();
    }
  }, [publication, visible]);

  const fetchCommentaires = async () => {
    setLoading(true);
    try {
      let response;
      if (publication.plateforme === "facebook") {
        const fbId = publication.id_post_facebook;
        response = await facebookService.getAllByPublication(fbId);
      } else if (publication.plateforme === "instagram") {
        const instaId = publication.id_post_instagram;
        response = await instagramService.recupererCommentairesPublication(instaId);
      }
     if (response?.data?.commentaires) {
      const commentairesAvecIdUnique = response.data.commentaires.map((c) => ({
        ...c,
        id_unique: c.id_commentaire_plateforme || c.id,
      }));

      // Récupère les IDs sélectionnés dans localStorage
      const selectedIds = JSON.parse(localStorage.getItem("commentairesSelectionnes") || "[]");

      // Applique la sélection locale (prioritaire sur l'API)
      const commentairesAvecSelection = commentairesAvecIdUnique.map(c => ({
        ...c,
        is_selected: selectedIds.includes(c.id_unique),
      }));

      const selectionnes = commentairesAvecSelection.filter(c => c.is_selected);

      setCommentaires(commentairesAvecSelection);
      setCommentairesSelectionnes(selectionnes);
    } else {
      setCommentaires([]);
      setCommentairesSelectionnes([]);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des commentaires :", error);
    setCommentaires([]);
    setCommentairesSelectionnes([]);
  } finally {
    setLoading(false);
  }
};
      
 

  const handleDelete = async (commentId) => {
    try {
      if (publication.plateforme === "facebook") {
        await facebookService.supprimerCommentaire(commentId);
      } else {
        await instagramService.supprimerCommentaire(commentId);
      }
      message.success("Commentaire supprimé avec succès");
      fetchCommentaires();
    } catch (error) {
      message.error("Erreur lors de la suppression du commentaire");
    }
  };

  const handleHide = async (commentId) => {
    try {
      if (publication.plateforme === "facebook") {
        await facebookService.masquerCommentaire(commentId);
      } else {
        await instagramService.masquerCommentaire(commentId);
      }
      message.success("Commentaire masqué avec succès");
      fetchCommentaires();
    } catch (error) {
      message.error("Erreur lors du masquage du commentaire");
    }
  };
const handleSelectCommentaire = async (commentaire) => {
  const nouvelleValeurSelection = !commentaire.is_selected;

  // Mise à jour locale optimiste
  setCommentaires((prevCommentaires) =>
    prevCommentaires.map((c) =>
      c.id_unique === commentaire.id_unique ? { ...c, is_selected: nouvelleValeurSelection } : c
    )
  );

  // Mets à jour localStorage
  let selectedIds = JSON.parse(localStorage.getItem("commentairesSelectionnes") || "[]");
  if (nouvelleValeurSelection) {
    selectedIds.push(commentaire.id_unique);
  } else {
    selectedIds = selectedIds.filter(id => id !== commentaire.id_unique);
  }
  localStorage.setItem("commentairesSelectionnes", JSON.stringify(selectedIds));

  try {
    await commentaireService.updateSelectionCommentaire(
      commentaire.id_commentaire_plateforme || commentaire.id,
      publication.plateforme,
      nouvelleValeurSelection
    );
    await fetchCommentaires(); // recharge données backend

    message.success(
      `Commentaire ${nouvelleValeurSelection ? "sélectionné" : "désélectionné"} !`
    );
  } catch (error) {
    // rollback si erreur
    setCommentaires((prevCommentaires) =>
      prevCommentaires.map((c) =>
        c.id_unique === commentaire.id_unique ? { ...c, is_selected: commentaire.is_selected } : c
      )
    );
    message.error("Erreur lors de la mise à jour de la sélection");
    console.error(error);
  }


};


  const handleFinishSelection = () => {
    const selectionActuelle = [...commentairesSelectionnes];

    Modal.confirm({
      title: "Confirmer la sélection",
      content: `Vous avez sélectionné ${selectionActuelle.length} commentaire(s). Confirmer ?`,
      okText: "Oui",
      cancelText: "Non",
      onOk() {
        message.success("Commentaires sélectionnés affichés dans la console.");
        console.log("Commentaires sélectionnés :", selectionActuelle);
      },
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created_time",
      key: "created_time",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Contenu",
      dataIndex: "message",
      key: "contenu",
      render: (_, record) => record.message || record.text || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        publication?.plateforme === "facebook" ||
        publication?.plateforme === "instagram" ? (
          <>
            <Popconfirm
              title="Voulez-vous vraiment supprimer ce commentaire ?"
              onConfirm={() => handleDelete(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Supprimer
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Voulez-vous vraiment masquer ce commentaire ?"
              onConfirm={() => handleHide(record.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="link" icon={<EyeInvisibleOutlined />}>
                Masquer
              </Button>
            </Popconfirm>

          <Button
  type="link"
  icon={<CheckCircleOutlined />}
  onClick={() => handleSelectCommentaire(record)}
  style={{
    color: record.is_selected ? "#004085" : "#1890ff",
    fontWeight: record.is_selected ? "bold" : "normal",
  }}
>
  {record.is_selected ? "Désélectionner" : "Sélectionner"}
</Button>



          </>
        ) : null,
    },
  ];

  return (
    <Modal
      title={`Commentaires - ${publication?.plateforme?.toUpperCase() || ""}`}
      open={visible}
      onCancel={onClose}
      onOk={handleFinishSelection}
      okText="Valider la sélection"
      cancelText="Fermer"
      width={600}
    >
      <Table
        dataSource={commentaires}
        columns={columns}
        loading={loading}
        rowKey="id_unique"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default ModalCommentaire;
