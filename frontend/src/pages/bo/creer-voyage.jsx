import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Modal,
  Checkbox,
} from "antd";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import voyageService from "../../services-call/voyage";
import publicationService from "../../services-call/publication";

export default function CreerVoyage() {
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [createdVoyageId, setCreatedVoyageId] = useState(null);

  const onFinish = async (values) => {
    const data = {
      ...values,
      date_de_depart: values.date_de_depart
        ? values.date_de_depart.format("YYYY-MM-DD")
        : null,
      date_de_retour: values.date_de_retour
        ? values.date_de_retour.format("YYYY-MM-DD")
        : null,
      image: imageUrls || [],
    };

    try {
      const res = await voyageService.createVoyage(data);

      if (!res.data || !res.data.id) {
        toast.error("⚠️ ID du voyage manquant dans la réponse !");
        return;
      }

      setCreatedVoyageId(res.data.id);
      toast.success("✅ Voyage ajouté avec succès !");
      setModalVisible(true);
    } catch (err) {
      console.error("Erreur lors de la création :", err);
      toast.error("❌ Erreur lors de la création !");
    }
  };

  const propsUpload = {
    beforeUpload: (file) => {
      setImageUrls((prev) => [...prev, URL.createObjectURL(file)]);
      return false; // Empêche le téléchargement automatique
    },
    multiple: true,
    showUploadList: false,
  };

  const mapPlatforms = (platforms) => {
    return platforms.map((p) => {
      if (p === "Site web") return "site";
      if (p === "Facebook") return "facebook";
      if (p === "Instagram") return "instagram";
      return p.toLowerCase();
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Créer un Voyage</h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <Form.Item
          name="titre"
          label="Titre du voyage"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

      

        <Form.Item
          name="prix"
          label="Prix (DZD)"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="date_de_depart"
          label="Date de départ"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="date_de_retour" label="Date de retour">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="statut" label="Statut" initialValue="disponible">
          <Select>
            <Select.Option value="disponible">Disponible</Select.Option>
            <Select.Option value="épuisé">Épuisé</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Images (carrousel)">
          <Upload {...propsUpload}>
            <Button icon={<UploadOutlined />}>Télécharger des images</Button>
          </Upload>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`preview-${index}`}
                className="h-32 w-full object-cover rounded-md"
              />
            ))}
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Créer le Voyage
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="🟩 Voyage créé avec succès !"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="later" onClick={() => setModalVisible(false)}>
            Plus tard
          </Button>,
          <Button
            key="publish"
            type="primary"
            onClick={async () => {
              if (!createdVoyageId || platforms.length === 0) {
                toast.error("Veuillez sélectionner une plateforme.");
                return;
              }

                const mapped = mapPlatforms(platforms);
                console.log(mapped)
              try {
                const res = await publicationService.publierMulti(
                  createdVoyageId,
                  mapped
                );
                console.log("Résultat publication :", res.data);
                toast.success("🎉 Publication réussie !");
              } catch (err) {
                console.error(err);
                toast.error("❌ Erreur lors de la publication !");
              } finally {
                setModalVisible(false);
              }
            }}
          >
            Publier
          </Button>,
        ]}
      >
        <p>Souhaitez-vous le publier maintenant ?</p>
        <Checkbox.Group
          options={["Site web", "Facebook", "Instagram"]}
          value={platforms}
          onChange={setPlatforms}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 12,
          }}
        />
      </Modal>
    </>
  );
}
