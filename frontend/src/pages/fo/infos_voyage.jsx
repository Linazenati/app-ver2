import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import voyageService from "../../services-call/voyage";
import { Spin, Card, Tabs, Divider, Typography, Row, Col, Tag } from "antd";
import {
  InfoCircleOutlined,
  CalendarOutlined,
  GlobalOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  SolutionOutlined , EnvironmentOutlined,
  MedicineBoxOutlined,
  PhoneOutlined
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Infos_Voyage = () => {
  const { id } = useParams();
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoyage = async () => {
      try {
        const response = await voyageService.getById(id);
        const data = response.data;

        let programme = [];
        let excursions = [];
        let conditions = [];

        try {
          programme = data.programme ? JSON.parse(data.programme) : [];
        } catch (err) {
          console.error("Erreur parsing programme :", err);
        }

        try {
          excursions = data.excursions ? JSON.parse(data.excursions) : [];
        } catch (err) {
          console.error("Erreur parsing excursions :", err);
        }

        try {
          conditions = data.conditions ? JSON.parse(data.conditions) : [];
        } catch (err) {
          console.error("Erreur parsing conditions :", err);
        }

        setVoyage({ ...data, programme, excursions, conditions });
      } catch (error) {
        console.error("Erreur lors de la récupération du voyage :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoyage();
  }, [id]);

  if (loading) return <Spin tip="Chargement..." />;
  if (!voyage) return <p>Voyage introuvable.</p>;

  const imageBaseUrl = "http://localhost:3000/images";
  const images = voyage.image ? JSON.parse(voyage.image) : [];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", marginTop: 30 }}>
      {images.length > 0 && (
        <>
          <Divider orientation="left">
            <CameraOutlined /> Photos du voyage
          </Divider>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {images.map((img, index) => (
              <div key={index} className="rounded shadow-sm overflow-hidden border">
                <img
                  src={`${imageBaseUrl}/${img}`}
                  alt={`voyage-${index}`}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <Card
        title={<Title level={3} style={{ marginBottom: 0 }}>{voyage.titre}</Title>}
        style={{ marginTop: 30 }}
      >
        <Tabs
          defaultActiveKey="1"
          centered
          type="line"
          tabBarGutter={30}
          tabBarStyle={{ fontSize: "16px", fontWeight: "bold" }}
        >
         <TabPane
  tab={
    <span>
      <InfoCircleOutlined /> Aperçu
    </span>
  }
  key="1"
>
  <Row gutter={[16, 16]}>
    {/* Colonne gauche */}
    <Col span={12}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f0f5ff",
          borderLeft: "5px solid #1890ff", // Bord bleu pour uniformité
          borderRadius: "8px",
        }}
      >
        <Title level={4}>Description</Title>
        <Paragraph style={{ color: "#595959", fontSize: "16px" }}>
          {voyage.description}
        </Paragraph>

        <Title level={4}>Prix</Title>
        <Paragraph>
<Tag color="#006400" style={{ fontWeight: "bold", color: "white" }}>
              {voyage.prix} DZD
          </Tag>
        </Paragraph>

        <Title level={4}>Statut</Title>
<Paragraph>
  <Tag color={voyage.statut?.trim().toLowerCase() === "disponible" ? "green" : "red"} style={{ fontWeight: "bold" }}>
    {voyage.statut}
  </Tag>
</Paragraph>
      </div>
    </Col>

    {/* Colonne droite */}
    <Col span={12}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#e6f7ff",
          borderLeft: "5px solid #1890ff",
          borderRadius: "8px",
        }}
      >
        <Title level={4}>Dates</Title>
        <Paragraph style={{ color: "#595959", fontSize: "16px" }}>
          <CalendarOutlined /> <strong>Départ :</strong> {new Date(voyage.date_de_depart).toLocaleDateString()}
        </Paragraph>
        <Paragraph style={{ color: "#595959", fontSize: "16px" }}>
          <CalendarOutlined /> <strong>Retour :</strong> {new Date(voyage.date_de_retour).toLocaleDateString()}
        </Paragraph>

        <Title level={4}>Durée</Title>
        <Paragraph style={{ color: "#595959", fontSize: "16px" }}>
          <strong>{voyage.duree} jours</strong>
        </Paragraph>
      </div>
    </Col>
  </Row>
</TabPane>


        <TabPane
  tab={
    <span>
      <SolutionOutlined /> Programme
    </span>
  }
  key="2"
>
  {voyage.programme?.length > 0 ? (
    voyage.programme.map((item, index) => (
      <div
        key={index}
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          borderLeft: "5px solid #1890ff",
          backgroundColor: "#f0f5ff",
          borderRadius: "8px",
        }}
      >
        <Row gutter={16} align="middle">
          <Col>
            <CalendarOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
          </Col>
          <Col>
            <Title level={4} style={{ marginBottom: 0 }}>
              Jour {item.jour}
            </Title>
          </Col>
        </Row>
        <Paragraph
          style={{
            marginTop: "10px",
            fontSize: "16px",
            lineHeight: "1.5",
            fontWeight: "400",
          }}
        >
          <strong>Activités :</strong> {item.activites}
        </Paragraph>
        <Divider style={{ margin: "10px 0", borderColor: "#1890ff" }} /> {/* Divider bleu */}
      </div>
    ))
  ) : (
    <p>Aucun programme disponible pour ce voyage.</p>
  )}
</TabPane>

          <TabPane
  tab={
    <span>
      <GlobalOutlined /> Excursions
    </span>
  }
  key="3"
>
  {voyage.excursions?.length > 0 ? (
    voyage.excursions.map((excursion, index) => (
      <div
        key={index}
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          borderLeft: "5px solid #1890ff", // Bleu pour les excursions
          backgroundColor: "#e6f7ff", // Fond bleu clair pour correspondre au style
          borderRadius: "8px", // Coins arrondis
        }}
      >
        <Row gutter={16} align="middle">
          <Col>
            <GlobalOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
          </Col>
          <Col>
            <Title level={4} style={{ marginBottom: 0 }}>
              {excursion.nom}
            </Title>
          </Col>
        </Row>
        <Paragraph
          style={{
            marginTop: "10px",
            fontSize: "16px",
            lineHeight: "1.5",
            fontWeight: "400",
            color: "#595959", // Couleur du texte pour plus de lisibilité
          }}
        >
          <strong>Description :</strong> {excursion.description}
        </Paragraph>
        <Divider style={{ margin: "10px 0", borderColor: "#1890ff" }} /> {/* Divider bleu */}
      </div>
    ))
  ) : (
    <p>Aucune excursion disponible pour ce voyage.</p>
  )}
</TabPane>

<TabPane tab="Informations pratiques" key="informations-pratiques">
  <div style={{
    backgroundColor: '#f0f5ff',
    borderLeft: '4px solid #1890ff',
    padding: '16px',
    borderRadius: '4px'
  }}>
    <Title level={4} style={{ color: '#1890ff' }}>
      <CheckCircleOutlined style={{ marginRight: '8px' }} />
      Documents nécessaires
    </Title>
    <Paragraph>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Passeport en cours de validité (vérifier la date d'expiration).<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Visa requis selon la destination (se renseigner auprès du consulat).<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Photocopies de vos documents importants (passeport, billets, assurances).
    </Paragraph>

    <Title level={4} style={{ color: '#1890ff', marginTop: '16px' }}>
      <MedicineBoxOutlined style={{ marginRight: '8px' }} />
      Conseils de santé
    </Title>
    <Paragraph>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Vérifiez les vaccins recommandés pour la destination (consultez un centre de santé voyage).<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Emportez une trousse de premiers secours (antidouleurs, pansements, antiseptique, médicaments personnels).<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Souscrivez à une assurance santé voyage ou vérifiez votre couverture (carte européenne d’assurance maladie en Europe).
    </Paragraph>

    <Title level={4} style={{ color: '#1890ff', marginTop: '16px' }}>
      <CalendarOutlined style={{ marginRight: '8px' }} />
      Climat et météo
    </Title>
    <Paragraph>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Consultez les prévisions météo avant de partir et adaptez vos vêtements (vêtements légers, imperméable, etc.).<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Prenez en compte les saisons (saison des pluies, chaleur, etc.) selon la période de votre voyage.
    </Paragraph>

    <Title level={4} style={{ color: '#1890ff', marginTop: '16px' }}>
      <EnvironmentOutlined style={{ marginRight: '8px' }} />
      Transport local
    </Title>
    <Paragraph>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Privilégiez les transports en commun (bus, métro) pour un tarif économique.<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Informez-vous sur les passes de transport ou applications locales (transports en commun, VTC).<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Négociez les tarifs des taxis à l'avance ou utilisez des services officiels.
    </Paragraph>

    <Title level={4} style={{ color: '#1890ff', marginTop: '16px' }}>
      <PhoneOutlined style={{ marginRight: '8px' }} />
      Numéros utiles / urgences
    </Title>
    <Paragraph>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Notez les numéros d'urgence locaux (ex. 112 en Europe, 911 aux États-Unis) et le numéro du consulat.<br/>
      <CheckCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
      Gardez une liste de contacts : police, pompiers, ambulance, assistance routière.
    </Paragraph>
  </div>
</TabPane>

          
        </Tabs>
      </Card>



      {/* Section bouton Réserver à l'extérieur de la carte */}
<div style={{ textAlign: "center", marginTop: "20px" }}>
  <Title level={4} style={{ color: "#1890ff" }}>
    Prêt pour cette expérience inoubliable ?
  </Title>
  <Paragraph>
    Réservez votre voyage et bénéficiez de notre accompagnement complet.
  </Paragraph>
  <button
    style={{
      backgroundColor: "#1890ff",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    }}
    onClick={() => {
      // Logique pour la réservation, redirection ou ouverture d'un formulaire
      alert("Réservation en cours...");
    }}
  >
    Réserver maintenant
  </button>
</div>
    </div>
  );
};

export default Infos_Voyage;
