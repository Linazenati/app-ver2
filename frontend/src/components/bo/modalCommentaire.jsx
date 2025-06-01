import React, { useEffect, useState } from "react";
import { Modal, Button, Table, message, Popconfirm } from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import facebookService from "../../services-call/facebook";
import instagramService from "../../services-call/instagram";
import commentaireService from "../../services-call/commentaire";
import moment from "moment";
import throttleService from "../../services-call/throttle";

// Cercle avec SVG pour afficher la progression du quota
const CircleQuota = ({ value, max, label ,  size = 100  }) => {
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


const ModalCommentaire = ({ publication, visible, onClose }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNouveaux, setLoadingNouveaux] = useState(false);
  const [quotaMinute, setQuotaMinute] = useState(null);
   const [quotaHeure, setQuotaHeure] = useState(null);
  const [quotaJour, setQuotaJour] = useState(null);
   const [quotaMinuteSupp, setQuotaMinuteSupp] = useState(null);
   const [quotaHeureSupp, setQuotaHeureSupp] = useState(null);
  const [quotaJourSupp, setQuotaJourSupp] = useState(null);
  // Clé spécifique à chaque publication
  const storageKey = `commentairesSelectionnes_${publication?.plateforme || "default"}_${publication?.id || "0"}`;

useEffect(() => {
  if (!visible) return;

  const fetchQuotas = async () => {
    try {
      const [recupRes, suppRes] = await Promise.all([
        throttleService.getQuota(),
        throttleService.getEtatQuotaSupp(),
      ]);

      setQuotaMinute(recupRes.data.recupMinuteRestante);
      setQuotaHeure(recupRes.data.recupHeureRestante);
      setQuotaJour(recupRes.data.recupJourRestante);

      setQuotaMinuteSupp(suppRes.data.suppMinuteRestante);
      setQuotaHeureSupp(suppRes.data.suppHeureRestante);
      setQuotaJourSupp(suppRes.data.suppJourRestante);

      console.log("✅ Quotas récupérés");
    } catch (error) {
      console.error("❌ Erreur lors du fetch des quotas", error);
    }
  };

  fetchQuotas();
}, [visible]);

const LIMITES = {
  RECUP: { MINUTE: 4, HEURE: 10, JOUR: 40 },
  SUPP: { MINUTE: 2, HEURE: 10, JOUR: 40 },
};
  
  // 👉 Ici tu peux définir `data` proprement après le useEffect
  const data = {
    recupMinuteRestante: quotaMinute,
    LIMITE_RECUP_PAR_MINUTE: 4,
    recupHeureRestante: quotaHeure,
    LIMITE_RECUP_PAR_HEURE: 10,
    recupJourRestante: quotaJour,
    LIMITE_RECUP_PAR_JOUR: 40,

    suppMinuteRestante: quotaMinuteSupp,
    LIMITE_SUPP_PAR_MINUTE: 2,
    suppHeureRestante: quotaHeureSupp,
    LIMITE_SUPP_PAR_HEURE: 10,
    suppJourRestante: quotaJourSupp,
    LIMITE_SUPP_PAR_JOUR: 40,
   
  };





  useEffect(() => {
    if (publication && visible) {
            console.log("🔔 useEffect: fetchCommentaires déclenché");
      fetchCommentaires();
    } else {
      setCommentaires([]);
    }
  }, [publication, visible]);

  const fetchCommentaires = async () => {
    setLoading(true);
    try {
      let response;
      if (publication.plateforme === "facebook") {
        response = await commentaireService.getCommentairesFacebook(publication.id);
      } else if (publication.plateforme === "instagram") {
        response = await commentaireService.getCommentairesInstagram(publication.id);
      } else {
        setCommentaires([]);
        setLoading(false);
        return;
      }
      console.log("✅ Commentaires reçus:", response.data);
      const selectedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

      const commentairesAvecEtat = (response?.data || []).map((c) => {
        const id_unique = `${publication.plateforme}_${c.id_commentaire_plateforme || c.id}`;
        const contenu = c.message || c.text || c.body || c.contenu || "-";
        return {
          ...c,
          id_unique,
          contenu,
          is_selected: selectedIds.includes(id_unique),
          isNew: false, // Ces commentaires viennent de la base, pas nouveaux
        };
      });

      setCommentaires(commentairesAvecEtat);
    } catch (error) {
      console.error("Erreur chargement commentaires :", error);
      message.error("Erreur lors du chargement des commentaires");
      setCommentaires([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNouveauxCommentaires = async () => {
  if (!publication) return;
  setLoadingNouveaux(true);
    try {
          console.log("📥 Récupération nouveaux commentaires depuis API externe");
    // 1️⃣ Appel pour récupérer et sauvegarder les nouveaux commentaires (API FB/IG)
    if (publication.plateforme === "facebook") {
      const fbId = publication.id_post_facebook;
      await facebookService.getAllByPublication(fbId); // cette API appelle FB et sauvegarde dans ta base
    } else if (publication.plateforme === "instagram") {
      const instaId = publication.id_post_instagram;
      await instagramService.recupererCommentairesPublication(instaId);
    } else {
      message.warning("Plateforme inconnue");
      setLoadingNouveaux(false);
      return;
    }

    // 2️⃣ Appel backend pour récupérer les commentaires marqués comme "nouveaux" dans la base
    const res = await commentaireService.getNouveauxCommentaires(publication.id);
    const nouveaux = res?.data || [];

    if (nouveaux.length === 0) {
      message.info("Aucun nouveau commentaire trouvé.");
      return;
    }

    const selectedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const nouveauxCommentaires = nouveaux.map((c) => {
      const id_unique = `${publication.plateforme}_${c.id_commentaire_plateforme || c.id}`;
      const contenu = c.message || c.text || c.body || c.contenu || "-";
      return {
        ...c,
        id_unique,
        contenu,
        is_selected: selectedIds.includes(id_unique),
        isNew: true,
      };
    });

    // Fusionner sans doublon
    setCommentaires((prev) => {
      const idsExistants = new Set(prev.map((c) => c.id_unique));
      const merged = [
        ...prev,
        ...nouveauxCommentaires.filter((c) => !idsExistants.has(c.id_unique)),
      ];
      return merged;
    });

    message.success("Nouveaux commentaires chargés !");
  } catch (error) {
    console.error("Erreur récupération des nouveaux commentaires :", error);
    message.error("Une erreur est survenue pendant le chargement des nouveaux commentaires.");
  } finally {
    setLoadingNouveaux(false);
  }
};
  const handleDelete = async (commentId) => {
  console.log("Supprimer commentaire id:", commentId);
  try {
    if (publication.plateforme === "facebook") {
      await facebookService.supprimerCommentaire(commentId);
    } else {
      await instagramService.supprimerCommentaire(commentId);
    }
    message.success("Commentaire supprimé.");
    fetchCommentaires();
  } catch (e) {
    console.error(e);
    message.error("Erreur lors de la suppression.");
  }
};

  const handleSelectCommentaire = async (commentaire) => {
  const nouvelleValeur = !commentaire.is_selected;

  setCommentaires((prev) =>
    prev.map((c) =>
      c.id_unique === commentaire.id_unique ? { ...c, is_selected: nouvelleValeur } : c
    )
  );

  let selectedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

  if (nouvelleValeur) {
    if (!selectedIds.includes(commentaire.id_unique)) {
      selectedIds.push(commentaire.id_unique);
    }
  } else {
    selectedIds = selectedIds.filter((id) => id !== commentaire.id_unique);
  }

  localStorage.setItem(storageKey, JSON.stringify(selectedIds));

  // Ici, changer la clé id_plateforme selon la plateforme
  let id_commentaire_plateforme = null;
  if (publication.plateforme === "facebook") {
    id_commentaire_plateforme = commentaire.id_commentaire_facebook || commentaire.id;
  } else if (publication.plateforme === "instagram") {
    id_commentaire_plateforme = commentaire.id_commentaire_instagram || commentaire.id;
  }

  if (!id_commentaire_plateforme) {
    message.error("Impossible de trouver l'ID du commentaire pour la mise à jour");
    return;
  }

  try {
    await commentaireService.updateSelectionCommentaire(
      id_commentaire_plateforme,
      publication.plateforme,
      nouvelleValeur
    );
    message.success(`Commentaire ${nouvelleValeur ? "sélectionné" : "désélectionné"}.`);
  } catch (error) {
    console.error("Erreur mise à jour sélection :", error);
    message.error("Erreur lors de la mise à jour de la sélection.");

    // rollback
    setCommentaires((prev) =>
      prev.map((c) =>
        c.id_unique === commentaire.id_unique ? { ...c, is_selected: !nouvelleValeur } : c
      )
    );

    localStorage.setItem(
      storageKey,
      JSON.stringify(
        nouvelleValeur
          ? selectedIds.filter((id) => id !== commentaire.id_unique)
          : [...selectedIds, commentaire.id_unique]
      )
    );
  }
};

  const handleFinishSelection = () => {
    const selection = commentaires.filter((c) => c.is_selected);
    Modal.confirm({
      title: "Confirmer la sélection",
      content: `Vous avez sélectionné ${selection.length} commentaire(s).`,
      okText: "Oui",
      cancelText: "Non",
      onOk() {
        console.log("Commentaires sélectionnés :", selection);
        message.success("Sélection confirmée.");
      },
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date_commentaire",
      key: "date_commentaire",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Contenu",
      dataIndex: "contenu",
      key: "contenu",
      render: (contenu, record) => (
        <div>
          {contenu}{" "}
          {record.isNew && (
            <span
              style={{
                color: "#52c41a",
                fontWeight: "bold",
                marginLeft: 8,
                fontSize: 12,
                backgroundColor: "#dff0d8",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              Nouveau
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Popconfirm title="Supprimer ?" onConfirm={() => handleDelete(record.id_commentaire_plateforme || record.id)}
>
            <Button type="link" danger icon={<DeleteOutlined />}>
              Supprimer
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
      ),
    },
  ];

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{`Commentaires - ${publication?.plateforme?.toUpperCase() || ""}`}</span>
         
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={handleFinishSelection}
      okText="Valider la sélection"
      cancelText="Fermer"
      width={700}
      destroyOnClose
    >

       {/* Affiche les quotas avec CircleQuota */}
   
    <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20}}>
  <CircleQuota value={quotaMinute} max={LIMITES.RECUP.MINUTE} label="Récup. / min" />
  <CircleQuota value={quotaHeure} max={LIMITES.RECUP.HEURE} label="Récup. / h" />
  <CircleQuota value={quotaJour} max={LIMITES.RECUP.JOUR} label="Récup. / jour" />
  <CircleQuota value={quotaMinuteSupp} max={LIMITES.SUPP.MINUTE} label="Supp. / min" />
  <CircleQuota value={quotaHeureSupp} max={LIMITES.SUPP.HEURE} label="Supp. / h" />
  <CircleQuota value={quotaJourSupp} max={LIMITES.SUPP.JOUR} label="Supp. / jour" />
</div>
      <Table
        dataSource={commentaires}
        columns={columns}
        loading={loading}
        rowKey="id_unique"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Aucun commentaire trouvé." }}
      />

     

       <Button
  icon={<ReloadOutlined style={{ fontSize: '18px' }} />} // Icône plus grande
  onClick={fetchNouveauxCommentaires}
  loading={loadingNouveaux}
  size="middle" // Tu peux aussi essayer "large"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 'bold',
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#1890ff', // Couleur Ant Design par défaut
    color: '#fff',
    borderRadius: '6px',
  }}
>
  Récupérer Nouveaux
</Button>
    </Modal>
  );
};

export default ModalCommentaire;
