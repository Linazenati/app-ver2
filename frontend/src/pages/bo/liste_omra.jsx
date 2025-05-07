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
  Upload,
  Select
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import omraService from "../../services-call/omra";
import { useUser } from "../../contexts/UserContext";
import dayjs from "dayjs";

export default function ListeOmraPage() {
  const { user } = useUser();
  console.log("User Context:", user); // Vérifie la valeur du contexte utilisateur

  const token =
    user?.token ||
    (() => {
      const token = localStorage.getItem("token");
      console.log("Token depuis localStorage:", token); // Vérifie le token récupéré
      return token ? token : null;
    })();

  console.log("Token utilisé:", token); // Vérifie le token final utilisé pour la requête

  const [omras, setOmras] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOmra, setEditingOmra] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const fetchOmras = () => {
    console.log("Appel à l'API pour récupérer les Omras...");
    omraService
      .getAll(token)
      .then((res) => {
        console.log("Réponse API:", res);
        if (res?.data?.rows) {
          setOmras(res.data.rows);
        } else {
          console.error("Pas de données dans la réponse.");
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération des Omras :", err);
        message.error("Erreur d'autorisation (403), veuillez vous reconnecter.");
      });
  };

  useEffect(() => {
    console.log("useEffect exécuté");
    if (token) {
      console.log("Token disponible, récupération des Omras...");
      fetchOmras();
    } else {
      console.log("Pas de token disponible.");
    }
  }, [token]);

  const openModal = (omra = null) => {
    console.log("Ouverture du modal pour :", omra); // Vérifie les valeurs de l'Omra
    setEditingOmra(omra);
    setIsModalOpen(true);
    if (omra) {
      form.setFieldsValue({
        ...omra,
        dateDepart: omra.date_de_depar ? dayjs(omra.date_de_depart) : null,
      });
      setImageUrl(omra.image);
    } else {
      form.resetFields();
      setImageUrl(null);
    }
  };

  const handleDelete = async (id) => {
    console.log("Suppression de l'Omra avec id :", id);
    try {
      await omraService.deleteItem(id, token);
      message.success("Omra supprimée avec succès !");
      fetchOmras();
    } catch (err) {
      message.error("Erreur lors de la suppression.");
    }
  };

  const handleFinish = async (values) => {
    console.log("Formulaire soumis avec les valeurs :", values); // Vérifie les valeurs du formulaire
    try {
      const data = {
        ...values,
        date_de_depart: values.date_de_depart.format("YYYY-MM-DD"),
        image: imageUrl,
      };
      if (editingOmra) {
        console.log("Mise à jour de l'Omra avec id :", editingOmra.id);
        await omraService.updateItem(editingOmra.id, data, token);
        message.success("Omra modifiée avec succès !");
      } else {
        console.log("Création d'une nouvelle Omra");
        await omraService.createItem(data, token);
        message.success("Omra ajoutée avec succès !");
      }
      setIsModalOpen(false);
      fetchOmras();
    } catch (err) {
      console.error("Erreur lors de l'ajout ou modification de l'Omra:", err);
      message.error("Erreur : " + (err.response?.data?.message || "Erreur inconnue"));
    }
  };

  const propsUpload = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
        console.log("Image téléchargée:", reader.result); // Vérifie l'URL de l'image téléchargée
      };
      reader.readAsDataURL(file);
      return false;
    },
    showUploadList: false,
  };

  const filteredOmras = omras.filter((o) =>
    o.titre.toLowerCase().includes(searchText.toLowerCase())
  );
  console.log("Omras filtrées :", filteredOmras); // Vérifie les Omras filtrées

  const columns = [
    { title: "Nom", dataIndex: "titre", key: "nom" },
    { title: "Prix (DZD)", dataIndex: "prix", key: "prix" },
    { title: "Date de départ", dataIndex: "date_de_depart", key: "dateDepart" },
    { title: "Durée (jours)", dataIndex: "duree", key: "duree" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Supprimer cette Omra ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="content">
      {/* Barre fixe */}
      <div
        style={{
          position: "fixed",
          left: 250,
          right: 0,
          background: "white",
          zIndex: 1000,
          padding: "10px 20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          height: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Liste des Omras</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <Input.Search
              placeholder="Rechercher..."
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            
          </div>
        </div>
      </div>

      {/* Espace barre */}
      <div style={{ height: "80px" }} />

      {/* Tableau */}
      <div style={{ padding: "20px" }}>
        <Table
          columns={columns}
          dataSource={filteredOmras}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal ajouter / modifier */}
      <Modal
        title={editingOmra ? "Modifier l'Omra" : "Ajouter une Omra"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="Nom"
            name="titre"
            rules={[{ required: true, message: "Veuillez entrer un nom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Veuillez entrer une description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Prix (DZD)"
            name="prix"
            rules={[{ required: true, message: "Veuillez entrer un prix" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Date de départ"
            name="date_de_depart"
            rules={[{ required: true, message: "Veuillez entrer une date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Durée (jours)"
            name="duree"
            rules={[{ required: true, message: "Veuillez entrer la durée" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Statut"
            name="status"
            rules={[{ required: true, message: "Veuillez sélectionner un statut" }]}
          >
            <Select placeholder="Sélectionner un statut">
              <Select.Option value="disponible">Disponible</Select.Option>
              <Select.Option value="épuisé">Épuisé</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Image">
            <Upload {...propsUpload}>
              <Button icon={<UploadOutlined />}>Télécharger une image</Button>
            </Upload>
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingOmra ? "Modifier" : "Ajouter"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
