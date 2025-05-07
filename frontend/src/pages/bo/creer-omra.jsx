import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Upload } from "antd";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // ✅ import du toast
import omraService from "../../services-call/omra";

export default function CreerOmra() {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
const [imageFile, setImageFile] = useState(null);
 
  const onFinish = (values) => {
  const formData = new FormData();
  formData.append("titre", values.titre);
  formData.append("description", values.description);
  formData.append("prix", values.prix);
  formData.append("date_de_depart", values.date_de_depart.format("YYYY-MM-DD"));
  formData.append("duree", values.duree);
  formData.append("image", imageFile); // ici on met le fichier original

  omraService.createItem(formData)
    .then(() => {
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
    setImageFile(file); // conserve le fichier original
    return false;
  },
  showUploadList: false,
};
  return (

    <>

      <Toaster position="top-right" reverseOrder={false} /> {/* ⚡️ Ajout du Toaster global */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2 style={{ margin: 0 }} >Créer une Omra</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          
        </div>
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
        <Form.Item name="date_de_depart" label="Date de départ" rules={[{ required: true }]}>
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
            <img src={imageUrl} alt="preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Créer Omra
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
