import { UploadOutlined , PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Modal,
  Checkbox,Divider,
  Space,
} from "antd";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import voyageService from "../../services-call/voyage";
import publicationService from "../../services-call/publication";
import dayjs from 'dayjs';  // si tu utilises dayjs (Ant Design 5+)
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.locale('fr');
dayjs.extend(localizedFormat);

export default function CreerVoyage() {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [createdVoyageId, setCreatedVoyageId] = useState(null);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("titre", values.titre);
    formData.append("description", values.description);
    formData.append("prix", values.prix);
    formData.append("date_de_depart", values.date_de_depart.format("YYYY-MM-DD"));
    formData.append("date_de_retour", values.date_de_retour.format("YYYY-MM-DD"));
    formData.append("statut", values.statut || "disponible");
    formData.append("programme", JSON.stringify(values.programme));
    formData.append("excursions", JSON.stringify(values.excursions));

    console.log("Avant l'envoi, voici les images : ", imageFiles);
    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await voyageService.createVoyage(formData);
      toast.success("🚀 Voyage créé avec succès !");
      setCreatedVoyageId(res.data.id);
      setModalVisible(true);
      form.resetFields();
      setImageFiles([]);
      setImageUrls([]);
      setFileList([]);
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de la création !");
    }
  };

  const propsUpload = {
    onRemove: (file) => {
      setFileList((prevFileList) =>
        prevFileList.filter((item) => item.uid !== file.uid)
      );
      setImageFiles((prevImageFiles) =>
        prevImageFiles.filter((item) => item.uid !== file.uid)
      );
      setImageUrls((prevImageUrls) =>
        prevImageUrls.filter((url) => url !== file.url)
      );
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        alert("Seules les images sont autorisées");
        return false;
      }
      return false; // ⛔️ Empêche Ant Design d'uploader automatiquement
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      setImageFiles(newFileList.map(file => file.originFileObj));
      setImageUrls(newFileList.map(file =>
        file.url || URL.createObjectURL(file.originFileObj)
      ));
    },
    fileList,
    multiple: true,
  };

  const mapPlatforms = (platforms) => {
    return platforms.map((p) => {
      if (p === "Site web") return "site";
      if (p === "Facebook") return "facebook";
      if (p === "Instagram") return "instagram";
      return p.toLowerCase();
    });
  };
const handlePublish = async (createdVoyageId, platforms) => {
  const mapped = mapPlatforms(platforms);

  try {
    const res = await publicationService.publierMulti(createdVoyageId, mapped);
    console.log("Résultat publication :", res.data);

    const resultats = res.data.resultats;

    // 🔁 Affichage toast pour chaque plateforme
    Object.entries(resultats).forEach(([platform, result]) => {
      if (result?.error) {
        toast.error(`Échec de publication sur ${platform} : ${result.error}`);
      } else {
        toast.success(`Publication réussie sur ${platform}`);
      }
    });

  } catch (err) {
    console.error("Erreur publication multiple :", err.message);
    toast.error("Erreur globale lors de la publication");
  }
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
        <Form.Item name="titre" label="Titre du voyage" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="prix" label="Prix (DZD)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        
        <Form.Item name="date_de_depart"  label="Date de départ" rules={[{ required: true }]}>
                 <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

       <Form.Item name="date_de_retour"  label="Date de retour" rules={[{ required: true }]}>
             <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

        <Form.Item name="statut" label="Statut" initialValue="disponible">
          <Select>
            <Select.Option value="disponible">Disponible</Select.Option>
            <Select.Option value="épuisé">Épuisé</Select.Option>
          </Select>
        </Form.Item>

        
           {/* -- PROGRAMME -- */}
  <Divider orientation="left">
    <strong>Programme jour par jour</strong>
  </Divider>
  <Form.List name="programme">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Space key={key} align="start" style={{ display: "flex", marginBottom: 8 }}>
            <Form.Item
              {...restField}
              name={[name, "jour"]}
              rules={[{ required: true, message: "Numéro de jour requis" }]}
            >
              <InputNumber placeholder="Jour n°" min={1} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "activites"]}
              rules={[{ required: true, message: "Activités requises" }]}
            >
              <Input.TextArea placeholder="Activités (séparées par virgule)" rows={1} />
            </Form.Item>
            <MinusCircleOutlined onClick={() => remove(name)} />
          </Space>
        ))}
        <Form.Item>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Ajouter un jour
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>

 
     
  {/* -- EXCURSIONS -- */}
<Divider orientation="left">
  <strong>Excursions prévues</strong>
</Divider>
<Form.List name="excursions">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Space
          key={key}
          style={{ display: "flex", marginBottom: 8 }}
          align="start"
        >
          {/* Champ Nom */}
          <Form.Item
            {...restField}
            name={[name, "nom"]}
            rules={[{ required: true, message: "Nom requis" }]}
          >
            <Input placeholder="Nom de l’excursion" />
          </Form.Item>
          {/* Champ Description */}
          <Form.Item
            {...restField}
            name={[name, "description"]}
            rules={[{ required: true, message: "Description requise" }]}
          >
            <Input.TextArea
              placeholder="Description détaillée"
              rows={2}
            />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
        </Space>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          block
          icon={<PlusOutlined />}
        >
          Ajouter une excursion
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>



        <Form.Item name="image" label="Images (carrousel)">
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
    await handlePublish(createdVoyageId, platforms);
    setModalVisible(false);
  }}
>
  Publier maintenant
</Button>
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
