import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Card, Typography, Row, Col, Divider, Tag, Alert } from "antd";
import {
  HomeOutlined, EnvironmentOutlined, StarOutlined, CommentOutlined,
  PictureOutlined, PhoneOutlined, UserOutlined, MailOutlined,
  TeamOutlined, CalendarOutlined, SmileOutlined, WifiOutlined,
  DesktopOutlined, CarOutlined, CoffeeOutlined, FileOutlined
} from "@ant-design/icons";
import hotelService from "../../services-call/hotel";

const { Title, Paragraph } = Typography;

const blueDark = "#001f3f";
const yellow = "#fadb14";

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombreEnfants, setNombreEnfants] = useState(0);
  const [agesEnfants, setAgesEnfants] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await hotelService.getHotelById(id);
        const h = res.data;
        const photos = typeof h.photos === "string" ? JSON.parse(h.photos) : h.photos || [];
        setHotel({ ...h, photos });
      } catch (error) {
        console.error("Erreur lors de la récupération de l'hôtel :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <Spin tip="Chargement..." style={{ display: "block", marginTop: 100 }} />;
  if (!hotel) return <p>Hôtel introuvable.</p>;

  const imageBaseUrl = "http://localhost:3000/images";

  const renderStarsDynamic = (count) => (
    <span style={{ color: yellow, fontSize: 28, letterSpacing: 6, display: "inline-flex" }}>
      {[...Array(count)].map((_, i) => <span key={i} style={{ marginRight: 4 }}>★</span>)}
    </span>
  );

  const renderStarsSmall = (etoiles) => (
    <span style={{ color: yellow, fontSize: 18, display: "inline-flex", alignItems: "center" }}>
      {[...Array(etoiles || 0)].map((_, i) => <StarOutlined key={i} style={{ marginRight: 4 }} />)}
    </span>
  );

  const handleAgeChange = (index, age) => {
    const newAges = [...agesEnfants];
    newAges[index] = age;
    setAgesEnfants(newAges);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
    console.log("Documents sélectionnés :", files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis !");
    console.log("Documents :", documents);
    alert("Demande envoyée !");
    // Ajoute ici la logique pour envoyer les données et les fichiers (via FormData)
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "0 20px" }}>
      {hotel.photos?.length > 0 && (
        <>
          <Divider orientation="left"><PictureOutlined /> Photos</Divider>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem", marginBottom: "20px"
          }}>
            {hotel.photos.map((photo, index) => (
              <div key={index} style={{ borderRadius: "10px", overflow: "hidden" }}>
                <img
                  src={photo.startsWith("http") ? photo : `${imageBaseUrl}/${photo}`}
                  alt={`hotel-${index}`} style={{ width: "100%", height: "250px", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: 30, borderBottom: `2px solid ${blueDark}`, paddingBottom: 10,
          }}>
            <Title level={2} style={{ margin: 0, color: blueDark, flex: 1 }}>
              {hotel.name}
            </Title>
            {renderStarsDynamic(hotel.etoiles || 0)}
          </div>
        </>
      )}

      <Row gutter={[32, 32]} style={{ alignItems: "stretch" }}>
        <Col xs={24} md={12}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
            <Card style={{ backgroundColor: "#f0f5ff", borderRadius: 12, flex: 1 }}>
              <Title level={4} style={{ color: blueDark }}>
                <HomeOutlined style={{ color: blueDark }} /> {hotel.name}
              </Title>
              <Paragraph><EnvironmentOutlined style={{ color: blueDark }} /> {hotel.adresse}</Paragraph>
              <Paragraph><EnvironmentOutlined style={{ color: blueDark }} /> {hotel.ville} ({hotel.region})</Paragraph>
              <Paragraph>{renderStarsSmall(hotel.etoiles)}{" "}
                <Tag color={yellow} style={{ fontWeight: "bold" }}>{hotel.etoiles} ★</Tag></Paragraph>
              <Paragraph><CommentOutlined style={{ color: blueDark }} /> Note :{" "}
                <Tag color="blue">{hotel.Note_moyenne}/10</Tag> ({hotel.Nombre_avis} avis)</Paragraph>
            </Card>

            <Card style={{ borderRadius: 12, flex: 1 }}>
              <Title level={5} style={{ color: blueDark }}>Caractéristiques & Services</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}><SmileOutlined style={{ color: yellow, marginRight: 6 }} /> Service de qualité</Col>
                <Col span={12}><WifiOutlined style={{ color: yellow, marginRight: 6 }} /> Wi-Fi rapide</Col>
                <Col span={12}><CoffeeOutlined style={{ color: yellow, marginRight: 6 }} /> Petit-déjeuner inclus</Col>
                <Col span={12}><CarOutlined style={{ color: yellow, marginRight: 6 }} /> Parking sécurisé</Col>
                <Col span={12}><DesktopOutlined style={{ color: yellow, marginRight: 6 }} /> Équipements modernes</Col>
                <Col span={12}><CalendarOutlined style={{ color: yellow, marginRight: 6 }} /> Réservation flexible</Col>
              </Row>
            </Card>

            <Card style={{ borderRadius: 12 }}>
              <Title level={5} style={{ color: blueDark, marginBottom: 20 }}> Meilleures raisons de réserver</Title>
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ fontSize: 28, lineHeight: 1, marginRight: 12 }}>🏅</div>
                <div><div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Les invités l'adorent</div>
                  <div style={{ fontSize: 14, color: "#555", lineHeight: 1.4 }}>Qualité supérieure et service exceptionnel</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ fontSize: 28, lineHeight: 1, marginRight: 12 }}>📍</div>
                <div><div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Emplacement le mieux coté</div>
                  <div style={{ fontSize: 14, color: "#555", lineHeight: 1.4 }}>Emplacement stratégique pour toutes vos attentes</div>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
            <Card style={{ borderRadius: 12, flex: 1 }}>
              <Title level={4}>Demande de réservation</Title>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label><UserOutlined style={{ color: blueDark }} /> Nom Complet</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label><MailOutlined style={{ color: blueDark }} /> Email</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label><PhoneOutlined style={{ color: blueDark }} /> Téléphone</label>
                  <input type="tel" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label><TeamOutlined style={{ color: blueDark }} /> Nombre de personnes</label>
                  <input type="number" className="form-control" required />
                </div>

                <div className="mb-3">
                  <label><TeamOutlined style={{ color: blueDark }} /> Nombre d'enfants</label>
                  <input type="number" className="form-control" min="0" value={nombreEnfants}
                    onChange={(e) => {
                      const count = parseInt(e.target.value);
                      setNombreEnfants(count);
                      setAgesEnfants(new Array(count).fill(""));
                    }} />
                </div>
                {nombreEnfants > 0 && (
                  <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, marginBottom: 20 }}>
                    <Row gutter={16}>
                      <Col span={12}><b>Numéro d'enfant</b></Col>
                      <Col span={12}><b>Âge</b></Col>
                    </Row>
                    {Array.from({ length: nombreEnfants }).map((_, index) => (
                      <Row gutter={16} key={index} style={{ marginBottom: 10 }}>
                        <Col span={12}>Enfant {index + 1}</Col>
                        <Col span={12}>
                          <input type="number" className="form-control" min="0"
                            value={agesEnfants[index] || ""}
                            onChange={(e) => handleAgeChange(index, e.target.value)} required />
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}

                <Row gutter={10}>
                  <Col span={12}>
                    <div className="mb-3">
                      <label><CalendarOutlined style={{ color: blueDark }} /> Arrivée</label>
                      <input type="date" className="form-control" required />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="mb-3">
                      <label><CalendarOutlined style={{ color: blueDark }} /> Départ</label>
                      <input type="date" className="form-control" required />
                    </div>
                  </Col>
                </Row>

                {/* Champ pour envoyer des documents */}
                <div className="mb-3">
                  <label><FileOutlined style={{ color: blueDark }} /> Documents (pièce d'identité, etc.)</label>
                  <input type="file" className="form-control" multiple required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange} />
                </div>

                <button type="submit" className="btn w-100" style={{ backgroundColor: blueDark, color: "#fff" }}>
                  Réserver
                </button>
              </form>
            </Card>

            <Alert message="Documents obligatoires à fournir" description={<ul style={{ marginLeft: 20 }}>
              <li>Copie de la pièce d'identité pour chaque voyageur</li>
            </ul>} type="info" showIcon />
          </div>
        </Col>
      </Row>

      <Card style={{ marginTop: 30, borderRadius: 12 }}>
        <Title level={4} style={{ color: blueDark }}><EnvironmentOutlined /> Localisation</Title>
        <div style={{ height: "400px", borderRadius: "10px", overflow: "hidden" }}>
          <iframe
            title={`Localisation ${hotel.name}`}
            src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&hl=fr&z=15&output=embed`}
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
        </div>
      </Card>
    </div>
  );
};

export default HotelDetails;
