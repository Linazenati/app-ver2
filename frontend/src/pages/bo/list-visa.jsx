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
  Space,
  Form,
  Select,
  Card
} from "antd";
import {
  SearchOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  FilterOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined
} from "@ant-design/icons";
import serviceVisa from "../../services-call/visa ";
import { useUser } from "../../contexts/UserContext";
import dayjs from "dayjs";
import ParticipantsModal from "../../components/bo/ParticipantsModal";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ListeVisasPage() {
  const { user: contextUser } = useUser();
  const [user, setUser] = useState(contextUser || null);
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentVisa, setCurrentVisa] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [selectedVisaId, setSelectedVisaId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [paysFilter, setPaysFilter] = useState(null);

  useEffect(() => {
    if (!contextUser) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      setUser(contextUser);
    }
  }, [contextUser]);

  const token = user?.token;

  const fetchVisas = async () => {
    if (!token) {
      message.error("Vous devez être connecté pour accéder à cette page");
      return;
    }

    try {
      setLoading(true);
      const res = await serviceVisa.getAllVisas(token);
      console.log("Visas récupérés :", res?.data);
      setVisas(res?.data?.data || []);

    } catch (err) {
      console.error("Erreur:", err);
      message.error("Erreur lors de la récupération des visas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchVisas();
  }, [token]);

  const getUserInfo = (visa) => {
    if (!visa.utilisateurInscrit) return null;
    
    if (visa.utilisateurInscrit.utilisateur) {
      return visa.utilisateurInscrit.utilisateur;
    }
    
    return visa.utilisateurInscrit;
  };

  const handleDelete = async (id) => {
    try {
      await serviceVisa.remove(id, token);
      message.success("Visa supprimé");
      fetchVisas();
    } catch (err) {
      message.error("Erreur lors de la suppression");
    }
  };

  const showDetails = (visa) => {
    setCurrentVisa(visa);
    setIsDetailModalOpen(true);
  };

  const showParticipants = (visaId) => {
    setSelectedVisaId(visaId);
    setIsParticipantsModalOpen(true);
  };

  const handleRequestPayment = async (visaId) => {
    try {
      // Implémentez la logique de demande de paiement ici
      message.success("Demande de paiement envoyée");
    } catch (err) {
      message.error("Erreur lors de la demande de paiement");
    }
  };

  // Extraire les types et pays uniques pour les filtres
  const typesUniques = [...new Set(visas.map(v => v.typeVisa))];
  const paysUniques = [...new Set(visas.map(v => v.pays))];

  const filteredVisas = visas.filter((v) => {
    const matchesSearch = searchText
      ? Object.values(v).some(val =>
          val && val.toString().toLowerCase().includes(searchText.toLowerCase())
      ): true;

    let matchesDate = true;
    if (dateRangeFilter && dateRangeFilter[0] && dateRangeFilter[1]) {
      const date = dayjs(v.createdAt);
      matchesDate =
        date.isAfter(dateRangeFilter[0]) &&
        date.isBefore(dateRangeFilter[1]);
    }

    const matchesType = typeFilter
      ? v.typeVisa === typeFilter
      : true;

    const matchesPays = paysFilter
      ? v.pays === paysFilter
      : true;

    return matchesSearch && matchesDate && matchesType && matchesPays;
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
    title: "Pays",
    dataIndex: "pays",
    key: "pays",
    render: (pays) => <Tag color="geekblue">{pays}</Tag>,
    sorter: (a, b) => a.pays.localeCompare(b.pays)
  },
  {
    title: "Type Visa",
    dataIndex: "typeVisa",
    key: "typeVisa",
    render: (type) => <Tag color="blue">{type}</Tag>,
    sorter: (a, b) => a.typeVisa.localeCompare(b.typeVisa)
  },
  {
    title: "Personnes",
    dataIndex: "personnes",
    key: "personnes",
    sorter: (a, b) => a.personnes - b.personnes
  },
  {
    title: "Nationalité",
    dataIndex: "nationalite",
    key: "nationalite",
    sorter: (a, b) => a.nationalite?.localeCompare(b.nationalite)
  },
  {
    title: "Date Arrivée",
    dataIndex: "dateArrivee",
    key: "dateArrivee",
    render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "",
    sorter: (a, b) => new Date(a.dateArrivee) - new Date(b.dateArrivee)
  },
  
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (total) => `${total} DA`,
    sorter: (a, b) => a.total - b.total
  },
  {
    title: "Utilisateur",
    dataIndex: "utilisateurInscrit",
    key: "utilisateurInscrit",
    render: (u) => u?.utilisateur?.nom
      ? `${u.utilisateur.nom} ${u.utilisateur.prenom}`
      : u?.email || "N/A"
  },
  {
    title: "Actions",
    key: "actions",
    width: 180,
    render: (_, record) => (
      <Space size="small">
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => showParticipants(record.id)}
        />
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => showDetails(record)}
        />
        <Button
          type="text"
          icon={<DollarOutlined />}
          onClick={() => handleRequestPayment(record.id)}
        />
        <Popconfirm
          title="Supprimer cette demande de visa ?"
          onConfirm={() => handleDelete(record.id)}
          okText="Oui"
          cancelText="Non"
        >
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    )
  }
];


  const resetFilters = () => {
    setDateRangeFilter(null);
    setSearchText("");
    setTypeFilter(null);
    setPaysFilter(null);
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
          height: "150px",
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
          <h2 style={{ margin: 0 }}>Liste des demandes de visa</h2>
          <Space>
            <Input
              placeholder="Rechercher..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: 300 }}
            />
          </Space>
        </div>

        <Space>
          <RangePicker
            placeholder={["Date début", "Date fin"]}
            onChange={(dates) => setDateRangeFilter(dates)}
            value={dateRangeFilter}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Type de visa"
            style={{ width: 200 }}
            onChange={setTypeFilter}
            value={typeFilter}
            allowClear
          >
            {typesUniques.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Select
            placeholder="Pays de destination"
            style={{ width: 200 }}
            onChange={setPaysFilter}
            value={paysFilter}
            allowClear
          >
            {paysUniques.map(pays => (
              <Option key={pays} value={pays}>{pays}</Option>
            ))}
          </Select>
          <Button icon={<FilterOutlined />} onClick={resetFilters}>
            Réinitialiser
          </Button>
        </Space>
      </div>

      <div style={{ height: "150px" }}></div>

      <Card style={{ margin: 20 }}>
        <Table
          columns={columns}
          dataSource={filteredVisas}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: "Aucune demande de visa disponible" }}
        />
      </Card>

      <Modal
        title="Détails du visa"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {currentVisa && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID">{currentVisa.id}</Descriptions.Item>
            <Descriptions.Item label="Date création">
              {dayjs(currentVisa.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            
            <Descriptions.Item label="Utilisateur" span={2}>
              {(() => {
                const userInfo = getUserInfo(currentVisa);
                return (
                  <>
                    <div><strong>Nom :</strong> {userInfo?.nom || 'N/A'}</div>
                    <div><strong>Prénom :</strong> {userInfo?.prenom || 'N/A'}</div>
                    <div><strong>Email :</strong> {userInfo?.email || 'N/A'}</div>
                    
                  </>
                );
              })()}
            </Descriptions.Item>

            <Descriptions.Item label="Pays">{currentVisa.pays}</Descriptions.Item>
            <Descriptions.Item label="Type Visa">{currentVisa.typeVisa}</Descriptions.Item>
            <Descriptions.Item label="Nombre de personnes">{currentVisa.personnes}</Descriptions.Item>
            <Descriptions.Item label="Date d'arrivée">
              {dayjs(currentVisa.dateArrivee).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Nationalité">{currentVisa.nationalite}</Descriptions.Item>
            <Descriptions.Item label="Prix">{currentVisa.total} DA</Descriptions.Item>
            
            
          </Descriptions>
        )}
      </Modal>

      <ParticipantsModal
        show={isParticipantsModalOpen}
        handleClose={() => setIsParticipantsModalOpen(false)}
        visaId={selectedVisaId}
      />
    </div>
  );
}