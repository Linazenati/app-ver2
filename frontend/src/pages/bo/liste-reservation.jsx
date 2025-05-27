import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Form,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tag,
  Badge,
  Select,
  Descriptions,
  Space
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  FilterOutlined
} from "@ant-design/icons";
import reservationService from "../../services-call/reservation";
import { useUser } from "../../contexts/UserContext";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function ListeReservationsPage() {
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);

  const token = user?.token || localStorage.getItem("token");

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getAll(token);
      if (res?.data) {
        setReservations(res.data);
      } else {
        message.warning("Aucune donnée reçue");
      }
    } catch (err) {
      console.error("Erreur de récupération des réservations :", err);
      message.error(err.response?.data?.message || "Erreur lors de la récupération");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const openModal = (reservation = null) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
    if (reservation) {
      form.setFieldsValue({
        ...reservation,
        date_depart: reservation.date_depart ? dayjs(reservation.date_depart) : null,
        date_retour: reservation.date_retour ? dayjs(reservation.date_retour) : null
      });
    } else {
      form.resetFields();
    }
  };

  const showDetails = (reservation) => {
    setCurrentReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await reservationService.deleteReservation(id, token);
      message.success("Réservation supprimée avec succès !");
      fetchReservations();
    } catch (err) {
      message.error("Erreur lors de la suppression : " + (err.response?.data?.message || "Erreur inconnue"));
    }
  };

  const handleFinish = async (values) => {
    try {
      const data = {
        ...values,
        nombre_adultes: Number(values.nombre_adultes) || 1,
        nombre_enfants: Number(values.nombre_enfants) || 0,
        date_depart: values.date_depart?.format("YYYY-MM-DD HH:mm:ss"),
        date_retour: values.date_retour?.format("YYYY-MM-DD HH:mm:ss"),
      };

      if (editingReservation) {
        await reservationService.updateReservation(editingReservation.id, data, token);
        message.success("Réservation modifiée avec succès !");
      } else {
        await reservationService.createReservation(data, token);
        message.success("Réservation créée avec succès !");
      }

      setIsModalOpen(false);
      fetchReservations();
    } catch (err) {
      console.error("Erreur complète:", err);
      message.error(err.response?.data?.message || "Erreur lors de l'opération");
    }
  };

  const filteredReservations = reservations?.rows?.filter(res => {
    // Filtre par texte de recherche
    const matchesSearch = searchText
      ? Object.values(res).some(
        val => val && val.toString().toLowerCase().includes(searchText.toLowerCase())
      )
      : true;

    // Filtre par date de réservation
    let matchesDate = true;
    if (dateRangeFilter && dateRangeFilter[0] && dateRangeFilter[1]) {
      const reservationDate = dayjs(res.createdAt);
      matchesDate = reservationDate.isAfter(dateRangeFilter[0]) &&
        reservationDate.isBefore(dateRangeFilter[1]);
    }

    return matchesSearch && matchesDate;
  }) || [];

  const statusColors = {
    "confirmée": "green",
    "en_attente": "orange",
    "annulée": "red",
    "terminée": "blue"
  };

  const getUserInfo = (reservation) => {
    if (!reservation.utilisateur_inscrit) return null;

    if (reservation.utilisateur_inscrit.utilisateur) {
      return reservation.utilisateur_inscrit.utilisateur;
    }

    return reservation.utilisateur_inscrit;
  };

  const resetFilters = () => {
    setDateRangeFilter(null);
    setSearchText("");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: "Date de réservation",
      key: "date",
      render: (_, record) => (
        <div>
          <div>{dayjs(record.createdAt).format("DD/MM/YYYY")}</div>
          <div>{dayjs(record.createdAt).format("HH:mm")}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: "Utilisateur",
      key: "utilisateur",
      render: (_, record) => {
        const user = getUserInfo(record);
        return (
          <div>
            <div><strong>Nom :</strong> {user?.nom || 'N/A'}</div>
            <div><strong>Prénom :</strong> {user?.prenom || 'N/A'}</div>
            <div><strong>Email :</strong> {user?.email || 'N/A'}</div>
            <div><strong>Téléphone :</strong> {user?.telephone || 'N/A'}</div>
          </div>
        );
      }
    },
    {
  title: "Publication / Réservation",
  key: "publication",
  render: (_, record) => {
    const publication = record.publication;
    const hotel = record.hotel;
    const vol = record.vol;

    if (publication?.voyage) {
      return (
        <div>
          <div><strong>Titre :</strong> {publication.voyage.titre}</div>
          <div><strong>Description :</strong> {publication.voyage.description}</div>
          <div><strong>Prix :</strong> {publication.voyage.prix} DA</div>
        </div>
      );
    }

    if (publication?.omra) {
      return (
        <div>
          <div><strong>Titre :</strong> {publication.omra.titre}</div>
          <div><strong>Description :</strong> {publication.omra.description}</div>
          <div><strong>Prix :</strong> {publication.omra.prix} DA</div>
        </div>
      );
    }

    if (hotel) {
      return (
        <div>
          <div><strong>Nom Hôtel :</strong> {hotel.name}</div>
          <div><strong>Adresse :</strong> {hotel.adresse}, {hotel.ville}, {hotel.region}</div>
          <div><strong>Note Moyenne :</strong> {hotel.Note_moyenne ? hotel.Note_moyenne + ' ★' : 'N/A'}</div>
        </div>
      );
    }

    if (vol) {
      return (
        <div>
          <div><strong>Vol :</strong> {vol.numero_vol} - {vol.compagnie_aerienne}</div>
          <div><strong>Trajet :</strong> {vol.aeroport_depart} → {vol.aeroport_arrivee} ({vol.duree})</div>
          <div><strong>Prix :</strong> {vol.prix} {vol.devise}</div>
        </div>
      );
    }

    return <div>Aucune information disponible</div>;
  }
},


    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>Départ: {dayjs(record.date_depart).format("DD/MM/YYYY")}</div>
          {record.date_retour && (
            <div>Retour: {dayjs(record.date_retour).format("DD/MM/YYYY")}</div>
          )}
        </div>
      )
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: statut => (
        <Tag color={statusColors[statut] || "default"}>
          {statut?.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Confirmée', value: 'confirmée' },
        { text: 'En attente', value: 'en_attente' },
        { text: 'Annulée', value: 'annulée' },
        { text: 'Terminée', value: 'terminée' }
      ],
      onFilter: (value, record) => record.statut === value
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => showDetails(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Supprimer cette réservation ?"
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
          height: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Liste des Réservations</h2>
          <Input
            placeholder="Rechercher..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 300 }}
          />
        </div>

        <Space>
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

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Ajouter
          </Button>
        </Space>
      </div>

      <div style={{ height: "120px" }}></div>

      <Table
        columns={columns}
        dataSource={filteredReservations}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
      />

      {/* Modal de détail */}
      <Modal
        title="Détails de la réservation"
        visible={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={800}
      >
        {currentReservation && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">{currentReservation.id}</Descriptions.Item>
            <Descriptions.Item label="Date de réservation">
              {dayjs(currentReservation.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={statusColors[currentReservation.statut]}>
                {currentReservation.statut?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Utilisateur" span={2}>
              Nom: {getUserInfo(currentReservation)?.nom}
              <br />
              Prénom: {getUserInfo(currentReservation)?.prenom}
              <br />
              Email: {getUserInfo(currentReservation)?.email}
              <br />
              Numéro de téléphone: {getUserInfo(currentReservation)?.telephone}
            </Descriptions.Item>
            <Descriptions.Item label="Publication" span={2}>
              Titre: {currentReservation.publication?.voyage?.titre || currentReservation.publication?.omra?.titre || 'N/A'}
              <br />
              Prix: {currentReservation.publication?.voyage?.prix || currentReservation.publication?.omra?.prix || 'N/A'} DA
              <br />
              Desciption: {currentReservation.publication?.voyage?.description || currentReservation.publication?.omra?.description || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Date de départ">
              {dayjs(currentReservation.date_depart).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Date de retour">
              {currentReservation.date_retour ? dayjs(currentReservation.date_retour).format("DD/MM/YYYY HH:mm") : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Participants">
              Adultes: {currentReservation.nombre_adultes}, Enfants: {currentReservation.nombre_enfants || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Type de chambre">
              {currentReservation.type_chambre || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ville de résidence">
              {currentReservation.ville_residence || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Nationalité">
              {currentReservation.nationalite || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Pièce d'identité">
              {currentReservation.piece_identite ? (
                <a href={currentReservation.piece_identite} target="_blank" rel="noopener noreferrer">
                  Voir document
                </a>
              ) : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Passeport">
              {currentReservation.passeport ? (
                <a href={currentReservation.passeport} target="_blank" rel="noopener noreferrer">
                  Voir document
                </a>
              ) : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal de création/édition */}
      <Modal
        title={editingReservation ? "Modifier la réservation" : "Ajouter une réservation"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{
            nombre_adultes: 1,
            nombre_enfants: 0,
            statut: "en_attente",
            type_chambre: "Double"
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Nombre d'adultes"
              name="nombre_adultes"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Nombre d'enfants"
              name="nombre_enfants"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Date de départ"
              name="date_depart"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm:ss"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Date de retour"
              name="date_retour"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm:ss"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Type de chambre"
              name="type_chambre"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select style={{ width: "100%" }}>
                <Select.Option value="Single">Single</Select.Option>
                <Select.Option value="Double">Double</Select.Option>
                <Select.Option value="Triple">Triple</Select.Option>
                <Select.Option value="Suite">Suite</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Statut"
              name="statut"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select style={{ width: "100%" }}>
                <Select.Option value="en_attente">En attente</Select.Option>
                <Select.Option value="confirmée">Confirmée</Select.Option>
                <Select.Option value="annulée">Annulée</Select.Option>
                <Select.Option value="terminée">Terminée</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ville de résidence"
              name="ville_residence"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Nationalité"
              name="nationalite"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingReservation ? "Modifier" : "Créer"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}