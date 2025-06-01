import React, { useState,useEffect } from "react";
import { 
  Form, Input, Button, Typography, Card, Divider, Alert, 
  InputNumber, Select, DatePicker, Upload, Row, Col ,message
} from "antd";
import { 
  SaveOutlined, UploadOutlined, UserOutlined, 
  MailOutlined, PhoneOutlined, IdcardOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import assuranceService from "../../services-call/assurance";
import authService from "../../services-call/auth";
import { useUser } from "../../contexts/UserContext";


const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const assuranceTypes = [
  {
    value: "annulation",
    label: "Assurance Annulation de Voyage",
    description: "Couvre les frais si le voyageur doit annuler son voyage (maladie, problème familial, etc.)"
  },
  {
    value: "medicale",
    label: "Assurance Assistance Médicale à l'Étranger",
    description: "Prise en charge des frais médicaux, hospitalisation, rapatriement, etc., pendant le voyage."
  },
  {
    value: "bagages",
    label: "Assurance Bagages",
    description: "Protection contre la perte, le vol ou les dommages des bagages pendant le voyage."
  },
  {
    value: "responsabilite",
    label: "Assurance Responsabilité Civile à l'Étranger",
    description: "Couvre les dommages matériels ou corporels causés à un tiers durant le voyage."
  },
  {
    value: "multirisque",
    label: "Assurance Multirisque Voyage",
    description: "Combine plusieurs garanties (annulation, médicale, bagages, responsabilité civile, etc.) dans une seule formule."
  }
];

const CreateAssuranceForm = ({ token, onCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
 const { user } = useUser();
 const navigate = useNavigate();
 const assurancePrices = {
  annulation: 3000,
  medicale: 4500,
  bagages: 2000,
  responsabilite: 3500,
  multirisque: 6000,
};

// Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = user?.token;
        console.log(" token depuis useUser:", token);
        if (!token) {
          throw new Error("Aucun token d'authentification trouvé");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const userResponse = await authService.getCurrentUser(config);
        setCurrentUser(userResponse.data);

        // Pré-remplissage du formulaire
        form.setFieldsValue({
          prenom: userResponse.data.prenom || "",
          nom_client: userResponse.data.nom || "",
          email: userResponse.data.email || "",
          telephone: userResponse.data.telephone ? userResponse.data.telephone.toString() : "",
        });

      } catch (err) {
        console.error("Erreur complète:", err);
setError(err.message || "Erreur inconnue");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, [ form]);

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      
      // Ajout des champs de base
      formData.append('id_utilisateur_inscrit', currentUser.id);
      formData.append('type', values.type);
      formData.append('description', values.description || assuranceTypes.find(t => t.value === values.type)?.description);
      formData.append('prix', parseFloat(values.prix));
      
      // Ajout des nouveaux champs
      formData.append('prenom', values.prenom);
      formData.append('nom_client', values.nom_client);
      formData.append('email', values.email);
      formData.append('telephone', values.telephone);
      formData.append('dateDebut', values.dates[0].format('YYYY-MM-DD'));
      formData.append('dateFin', values.dates[1].format('YYYY-MM-DD'));
      formData.append('nombreVoyageurs', values.nombreVoyageurs);
      
      // Ajout du fichier passeport
      if (values.passeport) {
        formData.append('passeport', values.passeport.file);
      }

      const response = await assuranceService.create(formData, token);
      
      if (response.data && response.data.id) {
        message.success("Assurance souscrite avec succès !");
        navigate(`/web/Reservations/${response.data.id}/choix-paiement1`, {
          state: {
            assuranceId: response.data.id,
            type: values.type,
            prix: values.prix,
            dates: {
              debut: values.dates[0].format('YYYY-MM-DD'),
              fin: values.dates[1].format('YYYY-MM-DD')
            },
            nombreVoyageurs: values.nombreVoyageurs
          }
        });
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      setError(err.response?.data?.message || "Erreur lors de la création");
      message.error(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (value) => {
  setSelectedType(value);
  const typeInfo = assuranceTypes.find(t => t.value === value);
  const price = assurancePrices[value];

  if (typeInfo) {
    form.setFieldsValue({
      description: typeInfo.description,
      prix: price,
    });
  }
};


  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file) => {
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isPDF && !isImage) {
      setError('Vous ne pouvez uploader que des fichiers PDF ou image!');
      return false;
    }

    if (!isLt5M) {
      setError('Le fichier doit faire moins de 5MB!');
      return false;
    }

    setError(null);
    return true;
  };

  if (pageLoading) {
    return <div style={{ textAlign: 'center', margin: '20px 0' }}>Chargement en cours...</div>;
  }

  if (!currentUser) {
    return (
      <Alert 
        message="Attention"
        description="Veuillez vous connecter pour souscrire à une assurance"
        type="warning"
        showIcon
        style={{ maxWidth: 800, margin: "0 auto" }}
      />
    );
  }

  return (
    <div
    style={{
      backgroundImage: "url('/images/hi.png')", // <-- adapte ici ton chemin
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "50px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Card 
      title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>
  Souscription à une assurance voyage
</Title>
}
      style={{ maxWidth: 800, margin: "0 auto" }}
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ prix: 0, nombreVoyageurs: 1 }}
      >
        {error && (
          <Alert 
            message="Erreur"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        {success && (
          <Alert 
            message="Succès"
            description="L'assurance a été souscrite avec succès"
            type="success"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        <Divider orientation="left">Informations personnelles</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Prénom"
              name="prenom"
              rules={[
                { required: true, message: "Veuillez saisir votre prénom" },
                { max: 50, message: "Maximum 50 caractères" }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Votre prénom" 
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Nom"
              name="nom_client"
              rules={[
                { required: true, message: "Veuillez saisir votre nom" },
                { max: 50, message: "Maximum 50 caractères" }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Votre nom" 
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Veuillez saisir votre email" },
                { type: 'email', message: "Email invalide" }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="exemple@email.com" 
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Téléphone"
              name="telephone"
              rules={[
                { required: true, message: "Veuillez saisir votre téléphone" },
                { pattern: /^[0-9]{10}$/, message: "Numéro invalide (10 chiffres)" }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="0612345678" 
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Détails du voyage</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Période de couverture"
              name="dates"
              rules={[
                { required: true, message: "Veuillez sélectionner les dates" }
              ]}
            >
              <RangePicker 
                style={{ width: '100%' }}
                size="large"
                disabledDate={(current) => current && current < moment().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Nombre de voyageurs"
              name="nombreVoyageurs"
              rules={[
                { required: true, message: "Veuillez indiquer le nombre" },
                { type: 'number', min: 1, max: 20, message: "Entre 1 et 20" }
              ]}
            >
              <InputNumber 
                min={1} 
                max={20} 
                style={{ width: '100%' }} 
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Scan du passeport (PDF ou image)"
          name="passeport"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Veuillez uploader votre passeport" }
          ]}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />} size="large">
              Uploader le passeport
            </Button>
          </Upload>
        </Form.Item>

        <Divider orientation="left">Détails de l'assurance</Divider>


        <Form.Item
          label="Type d'assurance"
          name="type"
          rules={[
            { required: true, message: "Veuillez sélectionner un type d'assurance" }
          ]}
        >
          <Select
            placeholder="Sélectionnez un type d'assurance"
            size="large"
            onChange={handleTypeChange}
            optionLabelProp="label"
          >
            {assuranceTypes.map(type => (
              <Option key={type.value} value={type.value} label={type.label}>
                <div>
                  <strong>{type.label}</strong>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    {type.description}
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Demande particulière"
          name="description"
          rules={[
            { required: true, message: "Veuillez saisir une description" },
            { min: 20, message: "La description doit contenir au moins 20 caractères" }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Décrivez les garanties et couvertures de cette assurance..."
            showCount 
            maxLength={500}
            size="large"
            disabled={!!selectedType}
          />
        </Form.Item>

       <Form.Item name="prix" label="Prix (DZD)">
  <InputNumber style={{ width: "100%" }} disabled />
</Form.Item>
        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Button 
  type="primary" 
  onClick={() => form.submit()} // Ceci déclenchera la soumission du formulaire et appellera handleSubmit
  loading={loading}
  icon={<SaveOutlined />}
  size="large"
  block
>
  Souscrire à l'assurance
</Button>
        </Form.Item>
      </Form>
    </Card>
    </div>
  );
};

export default CreateAssuranceForm;