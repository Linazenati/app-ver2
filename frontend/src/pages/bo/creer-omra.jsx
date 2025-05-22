import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Upload,
  Modal,
  Checkbox,
} from "antd";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import omraService from "../../services-call/omra";
import publicationService from "../../services-call/publication";

export default function CreerOmra() {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [createdVoyageId, setCreatedVoyageId] = useState(null); // ✅ Ajout de l'ID de l'Omra créée

  const mapPlatforms = (selected) => {
    const mapping = {
      "Site web": "site",
      Facebook: "facebook",
      Instagram: "instagram",
    };
    return selected.map((p) => mapping[p]);
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("titre", values.titre);
    formData.append("description", values.description);
    formData.append("prix", values.prix);
    formData.append("date_de_depart", values.date_de_depart.format("YYYY-MM-DD"));
    formData.append("duree", values.duree);
    formData.append("image", imageFile);

    omraService
      .createItem(formData)
      .then((res) => {
        const id = res.data?.id || res.data?.insertId; // selon ton backend
        if (id) {
          setCreatedVoyageId(id);
          setModalVisible(true); // ✅ afficher le modal de publication
        }
        form.resetFields();
        setImageFile(null);
        setImageUrl(null);
        toast.success("🚀 Omra créée avec succès !");
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Erreur lors de la création !");
      });
  };

  const propsUpload = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      return false;
    },
    showUploadList: false,
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Créer une Omra</h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <Form.Item name="titre" label="Nom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="prix" label="Prix (DZD)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="date_de_depart"
          label="Date de départ"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="duree" label="Durée (jours)" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="image" label="Image">
          <Upload {...propsUpload}>
            <Button icon={<UploadOutlined />}>Télécharger une image</Button>
          </Upload>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-2 w-full h-40 object-cover rounded-lg"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Créer Omra
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ MODAL DE PUBLICATION */}
      <Modal
        title="🟩 Omra créée avec succès !"
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
                toast.error("Veuillez sélectionner au moins une plateforme.");
                return;
              }

              // Mappe les plateformes sélectionnées en leur format attendu par l'API
              const mappedPlatforms = mapPlatforms(platforms);

              try {
                // Publier sur toutes les plateformes sélectionnées (site, Facebook, Instagram)
                const res = await publicationService.publierMulti(
                  createdVoyageId,
                  mappedPlatforms,
                  "omra"
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
        <p>Souhaitez-vous la publier maintenant ?</p>
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
