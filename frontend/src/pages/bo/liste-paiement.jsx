import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Tag,
  Descriptions,
  message,
  Popconfirm,
  DatePicker,
  Select,
  Space
} from "antd";
import {
  SearchOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  FilterOutlined
} from "@ant-design/icons";
import paiementService from "../../services-call/paiement";
import { useUser } from "../../contexts/UserContext";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function ListePaiementsPage() {
  const { user } = useUser();
  const [paiements, setPaiements] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPaiement, setCurrentPaiement] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);

  const token = user?.token || localStorage.getItem("token");

  const fetchPaiements = async () => {
    if (!token) {
      message.error("Vous devez être connecté pour accéder à cette page");
      return;
    }

    try {
      setLoading(true);
      const res = await paiementService.getAll(token);
      
      if (res?.data) {
        setPaiements(res.data);
      } else {
        message.warning("Aucun paiement trouvé");
        setPaiements([]);
      }
    } catch (err) {
      console.error("Erreur:", err);
      message.error(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await paiementService.delete(id, token);
      message.success("Paiement supprimé");
      fetchPaiements();
    } catch (err) {
      message.error("Erreur lors de la suppression");
    }
  };

  const showDetails = (paiement) => {
    setCurrentPaiement(paiement);
    setIsDetailModalOpen(true);
  };

  const getUserInfo = (paiement) => {
    // Si le paiement est lié à une réservation
    if (paiement?.reservation) {
      return paiement.reservation.utilisateur_inscrit?.utilisateur || 
             paiement.reservation.utilisateur_inscrit ||
             null;
    }
    // Si le paiement est lié à une assurance
    else if (paiement?.assurance) {
      return paiement.assurance.utilisateur_inscrit?.utilisateur ||
             paiement.assurance.utilisateur_inscrit ||
             null;
    }
    return null;
  };

  const normalizeStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase().replace(/é/g, 'e').replace(/è/g, 'e');
  };

  const statusColors = {
    paye: "green",
    en_attente: "orange",
    echoue: "red",
    echec: "red"
  };

  const statusDisplay = {
    paye: "PAYÉ",
    en_attente: "EN ATTENTE",
    echoue: "ANNULER",
    echec: "ÉCHEC"
  };

  const statusOptions = [
    { value: 'paye', label: 'Payé' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'echoue', label: 'Annuler' },
    { value: 'echec', label: 'Échec' }
  ];

  const filteredPaiements = paiements.filter(p => {
    // Filtre par texte de recherche
    const matchesSearch = searchText 
      ? Object.values(p).some(val =>
          val && val.toString().toLowerCase().includes(searchText.toLowerCase()))
      : true;
      
    // Filtre par statut (normalisé)
    const matchesStatus = statusFilter 
      ? normalizeStatus(p.statut) === statusFilter 
      : true;
    
    // Filtre par date
    let matchesDate = true;
    if (dateRangeFilter && dateRangeFilter[0] && dateRangeFilter[1]) {
      const paymentDate = dayjs(p.createdAt);
      matchesDate = paymentDate.isAfter(dateRangeFilter[0]) && 
                   paymentDate.isBefore(dateRangeFilter[1]);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: "Montant",
      dataIndex: "montant",
      key: "montant",
      render: (montant, record) => {
        // Si c'est un paiement d'assurance et que montant est vide, utiliser le prix de l'assurance
        if (record.assurance && (!montant || montant === 0)) {
          return `${record.assurance.prix} DA`;
        }
        return `${montant} DA`;
      },
      sorter: (a, b) => {
        const montantA = a.assurance && (!a.montant || a.montant === 0) ? a.assurance.prix : a.montant;
        const montantB = b.assurance && (!b.montant || b.montant === 0) ? b.assurance.prix : b.montant;
        return montantA - montantB;
      }
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut) => (
        <Tag color={statusColors[normalizeStatus(statut)] || "default"}>
          {statusDisplay[normalizeStatus(statut)] || statut?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Méthode",
      dataIndex: "methode_paiement",
      key: "methode_paiement"
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => {
        if (record.reservation) return "Réservation";
        if (record.assurance) return "Assurance";
        return "N/A";
      }
    },
    {
      title: "Utilisateur",
      key: "utilisateur",
      render: (_, record) => {
        const userInfo = getUserInfo(record);
        return userInfo ? `${userInfo.prenom || ''} ${userInfo.nom || ''}`.trim() || 'Utilisateur' : 'N/A';
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => showDetails(record)}
          />
          <Popconfirm
            title="Supprimer ce paiement ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      )
    }
  ];

  const resetFilters = () => {
    setStatusFilter(null);
    setDateRangeFilter(null);
    setSearchText("");
  };

  return (
    <div className="content">
      <div
        style={{
          position: "fixed",
          left: 250,
          right: 0,
          background: "white",
          zIndex: 1000,
          padding: "10px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10
          }}
        >
          <h2 style={{ margin: 0 }}>Liste des Paiements</h2>
          <Input
            placeholder="Rechercher..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 300 }}
          />
        </div>
        
        <Space>
          <Select
            placeholder="Filtrer par statut"
            options={statusOptions}
            onChange={setStatusFilter}
            value={statusFilter}
            style={{ width: 200 }}
            allowClear
          />
          
          <RangePicker
            placeholder={["Date début", "Date fin"]}
            onChange={(dates) => setDateRangeFilter(dates)}
            value={dateRangeFilter}
            style={{ width: 250 }}
          />
          
          <Button 
            icon={<FilterOutlined />} 
            onClick={resetFilters}
          >
            Réinitialiser
          </Button>
        </Space>
      </div>

      <div style={{ height: "120px" }}></div>

      <Table
        columns={columns}
        dataSource={filteredPaiements}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
        locale={{ emptyText: "Aucune donnée disponible" }}
      />

      <Modal
        title="Détails du Paiement"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {currentPaiement && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">{currentPaiement.id}</Descriptions.Item>
            <Descriptions.Item label="Date">
              {dayjs(currentPaiement.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Montant">
              {currentPaiement.assurance && (!currentPaiement.montant || currentPaiement.montant === 0) 
                ? `${currentPaiement.assurance.prix} DA` 
                : `${currentPaiement.montant} DA`}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={statusColors[normalizeStatus(currentPaiement.statut)] || "default"}>
                {statusDisplay[normalizeStatus(currentPaiement.statut)] || currentPaiement.statut?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Méthode">{currentPaiement.methode_paiement}</Descriptions.Item>
            <Descriptions.Item label="Devise">{currentPaiement.devise || "DZD"}</Descriptions.Item>
            
            {currentPaiement.assurance && (
              <Descriptions.Item label="Type d'assurance">
                {currentPaiement.assurance.type}
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label="Utilisateur" span={2}>
              {getUserInfo(currentPaiement) ? (
                <>
                  <strong>ID:</strong> {currentPaiement.reservation?.id_utilisateur_inscrit || 
                                        currentPaiement.assurance?.id_utilisateur_inscrit || 
                                        'N/A'}<br />
                  <strong>Nom:</strong> {getUserInfo(currentPaiement).nom || 'N/A'}<br />
                  <strong>Prénom:</strong> {getUserInfo(currentPaiement).prenom || 'N/A'}<br />
                  <strong>Email:</strong> {getUserInfo(currentPaiement).email || 'N/A'}<br />
                  <strong>Téléphone:</strong> {getUserInfo(currentPaiement).telephone || 'N/A'}
                </>
              ) : (
                "Non renseigné"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Lien de paiement" span={2}>
              {currentPaiement.lien_paiement ? (
                <a href={currentPaiement.lien_paiement} target="_blank" rel="noopener noreferrer">
                  Voir le lien
                </a>
              ) : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}