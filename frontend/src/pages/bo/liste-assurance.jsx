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
    Select
} from "antd";
import {
    SearchOutlined,
    InfoCircleOutlined,
    DeleteOutlined,
    FilterOutlined,
    EditOutlined,
    PlusOutlined
} from "@ant-design/icons";
import assuranceService from "../../services-call/assurance";
import { useUser } from "../../contexts/UserContext";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ListeAssurancesPage() {
    const { user: contextUser } = useUser();
    const [user, setUser] = useState(contextUser || null);
    const [assurances, setAssurances] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentAssurance, setCurrentAssurance] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingAssurance, setEditingAssurance] = useState(null);
    const [dateRangeFilter, setDateRangeFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState(null);

    const [form] = Form.useForm();

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

    const fetchAssurances = async () => {
        if (!token) {
            message.error("Vous devez être connecté pour accéder à cette page");
            return;
        }

        try {
            setLoading(true);
            const res = await assuranceService.getAll(token);
            setAssurances(res?.data || []);
            console.log("Données reçues du backend :", res?.data);
        } catch (err) {
            console.error("Erreur:", err);
            message.error("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAssurances();
    }, [token]);

    const getUserInfo = (assurance) => {
        if (!assurance.utilisateur_inscrit) return null;
        
        if (assurance.utilisateur_inscrit.utilisateur) {
            return assurance.utilisateur_inscrit.utilisateur;
        }
        
        return assurance.utilisateur_inscrit;
    };

    const handleDelete = async (id) => {
        try {
            await assuranceService.remove(id, token);
            message.success("Assurance supprimée");
            fetchAssurances();
        } catch (err) {
            message.error("Erreur lors de la suppression");
        }
    };

    const showDetails = (assurance) => {
        setCurrentAssurance(assurance);
        setIsDetailModalOpen(true);
    };

    const openFormModal = (assurance = null) => {
        setEditingAssurance(assurance);
        setIsFormModalOpen(true);
        if (assurance) {
            form.setFieldsValue({
                ...assurance,
                dateDebut: dayjs(assurance.dateDebut),
                dateFin: dayjs(assurance.dateFin)
            });
        } else {
            form.resetFields();
        }
    };

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const data = {
                ...values,
                dateDebut: values.dateDebut.toISOString(),
                dateFin: values.dateFin.toISOString(),
                utilisateurId: user?.id || contextUser?.id
            };
            if (editingAssurance) {
                await assuranceService.update(editingAssurance.id, data, token);
                message.success("Assurance modifiée");
            } else {
                await assuranceService.create(data, token);
                message.success("Assurance ajoutée");
            }
            setIsFormModalOpen(false);
            fetchAssurances();
        } catch (err) {
            console.error(err);
            message.error("Erreur lors de l'enregistrement");
        }
    };

    // Extraire les types uniques pour le filtre
    const typesUniques = [...new Set(assurances.map(a => a.type))];

    const filteredAssurances = assurances.filter((a) => {
        const matchesSearch = searchText
            ? Object.values(a).some(val =>
                val && val.toString().toLowerCase().includes(searchText.toLowerCase())
            )
            : true;

        let matchesDate = true;
        if (dateRangeFilter && dateRangeFilter[0] && dateRangeFilter[1]) {
            const date = dayjs(a.createdAt);
            matchesDate =
                date.isAfter(dateRangeFilter[0]) &&
                date.isBefore(dateRangeFilter[1]);
        }

        const matchesType = typeFilter
            ? a.type === typeFilter
            : true;

        return matchesSearch && matchesDate && matchesType;
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
            title: "Utilisateur",
            key: "utilisateur",
            render: (_, record) => {
                const userInfo = getUserInfo(record);
                return (
                    <div>
                        <div><strong>Nom :</strong> {userInfo?.nom || 'N/A'}</div>
                        <div><strong>Prénom :</strong> {userInfo?.prenom || 'N/A'}</div>
                        <div><strong>Email :</strong> {userInfo?.email || 'N/A'}</div>
                    </div>
                );
            }
        },
        {
            title: "Date début",
            dataIndex: "dateDebut",
            key: "dateDebut",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
            sorter: (a, b) => new Date(a.dateDebut) - new Date(b.dateDebut)
        },
        {
            title: "Date fin",
            dataIndex: "dateFin",
            key: "dateFin",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
            sorter: (a, b) => new Date(a.dateFin) - new Date(b.dateFin)
        },
        {
            title: "Prix",
            dataIndex: "prix",
            key: "prix",
            render: (prix) => `${prix} DA`,
            sorter: (a, b) => a.prix - b.prix
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => <Tag color="blue">{type}</Tag>
        },
        {
            title: "Voyageurs",
            dataIndex: "nombreVoyageurs",
            key: "nombreVoyageurs"
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
                        onClick={() => openFormModal(record)}
                    />
                    <Popconfirm
                        title="Supprimer cette assurance ?"
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
        setDateRangeFilter(null);
        setSearchText("");
        setTypeFilter(null);
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
                    height: "120px",
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
                    <h2 style={{ margin: 0 }}>Liste des contrats d'assurances</h2>
                    <Space>
                        <Input
                            placeholder="Rechercher..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            style={{ width: 300 }}
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => openFormModal()}>
                            Ajouter
                        </Button>
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
                        placeholder="Filtrer par type"
                        style={{ width: 200 }}
                        onChange={setTypeFilter}
                        value={typeFilter}
                        allowClear
                    >
                        {typesUniques.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                        ))}
                    </Select>
                    <Button icon={<FilterOutlined />} onClick={resetFilters}>
                        Réinitialiser
                    </Button>
                </Space>
            </div>

            <div style={{ height: "120px" }}></div>

            <Table
                columns={columns}
                dataSource={filteredAssurances}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
                locale={{ emptyText: "Aucune assurance disponible" }}
            />

            <Modal
                title="Détails de l'assurance"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={null}
                width={700}
            >
                {currentAssurance && (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="ID">{currentAssurance.id}</Descriptions.Item>
                        <Descriptions.Item label="Date création">
                            {dayjs(currentAssurance.createdAt).format("DD/MM/YYYY HH:mm")}
                        </Descriptions.Item>
                        
                        <Descriptions.Item label="Utilisateur" span={2}>
                            {(() => {
                                const userInfo = getUserInfo(currentAssurance);
                                return (
                                    <>
                                        <div><strong>Nom :</strong> {userInfo?.nom || 'N/A'}</div>
                                        <div><strong>Prénom :</strong> {userInfo?.prenom || 'N/A'}</div>
                                        <div><strong>Email :</strong> {userInfo?.email || 'N/A'}</div>
                                        <div><strong>Téléphone :</strong> {userInfo?.telephone || 'N/A'}</div>
                                    </>
                                );
                            })()}
                        </Descriptions.Item>

                        <Descriptions.Item label="Type">{currentAssurance.type}</Descriptions.Item>
                        <Descriptions.Item label="Prix">{currentAssurance.prix} DA</Descriptions.Item>
                        <Descriptions.Item label="Date début">
                            {dayjs(currentAssurance.dateDebut).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date fin">
                            {dayjs(currentAssurance.dateFin).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Voyageurs">
                            {currentAssurance.nombreVoyageurs}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={2}>
                            {currentAssurance.description || "Aucune description"}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <Modal
                title={editingAssurance ? "Modifier l'assurance" : "Ajouter une assurance"}
                open={isFormModalOpen}
                onCancel={() => setIsFormModalOpen(false)}
                onOk={handleFormSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="type" label="Type" rules={[{ required: true, message: "Champ requis" }]}>
                        <Input placeholder="Type d'assurance" />
                    </Form.Item>
                    <Form.Item name="prix" label="Prix" rules={[{ required: true, message: "Champ requis" }]}>
                        <Input type="number" placeholder="Prix en DA" />
                    </Form.Item>
                    <Form.Item name="nombreVoyageurs" label="Nombre de voyageurs" rules={[{ required: true, message: "Champ requis" }]}>
                        <Input type="number" placeholder="Nombre de voyageurs" />
                    </Form.Item>
                    <Form.Item name="dateDebut" label="Date de début" rules={[{ required: true, message: "Champ requis" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="dateFin" label="Date de fin" rules={[{ required: true, message: "Champ requis" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Utilisateur" name="utilisateur">
                        <Input value={user?.email} disabled />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} placeholder="Description (optionnelle)" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}