import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Card, Typography, Row, Col, Divider, Tag, Alert, message } from "antd";
import {
  HomeOutlined, EnvironmentOutlined, StarOutlined, CommentOutlined,
  PictureOutlined, PhoneOutlined, UserOutlined, MailOutlined,
  TeamOutlined, CalendarOutlined, SmileOutlined, WifiOutlined,
  DesktopOutlined, CarOutlined, CoffeeOutlined, FileOutlined
} from "@ant-design/icons";
import hotelService from "../../services-call/hotel";
import { useUser } from "../../contexts/UserContext";
import authService from "../../services-call/auth";
import reservationService from "../../services-call/reservation";

const { Title, Paragraph } = Typography;

const blueDark = "#001f3f";
const yellow = "#fadb14";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombreEnfants, setNombreEnfants] = useState(0);
  const [agesEnfants, setAgesEnfants] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    civilite: "Mr.",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    date_arrivee: "",
    date_depart: "",
    nombre_adultes: 1,
    nombre_enfants: 0,
    message: "",
    conditionsAcceptees: false,
    piece_identite: null,
    passeport: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données de l'hôtel
        const res = await hotelService.getHotelById(id);
        const h = res.data;
        const photos = typeof h.photos === "string" ? JSON.parse(h.photos) : h.photos || [];
        setHotel({ ...h, photos });

        // Récupérer les données de l'utilisateur si connecté
        const token = user?.token || JSON.parse(localStorage.getItem("session"))?.token;
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          const userResponse = await authService.getCurrentUser(config);
          setCurrentUser(userResponse.data);
          
          // Pré-remplir le formulaire avec les données utilisateur
          setFormData(prev => ({
            ...prev,
            civilite: userResponse.data.civilite || "Mr.",
            prenom: userResponse.data.prenom || "",
            nom: userResponse.data.nom || "",
            email: userResponse.data.email || "",
            telephone: userResponse.data.telephone ? userResponse.data.telephone.toString() : "",
          }));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const handleAgeChange = (index, age) => {
    const newAges = [...agesEnfants];
    newAges[index] = age;
    setAgesEnfants(newAges);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const handleNumberChange = (field, operation) => {
    setFormData(prev => {
      const currentValue = Number(prev[field]);
      let newValue;

      if (operation === 'increment') {
        newValue = currentValue + 1;
      } else {
        newValue = Math.max(field === 'nombre_adultes' ? 1 : 0, currentValue - 1);
      }

      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.conditionsAcceptees) {
      message.error("Veuillez accepter les conditions générales");
      return;
    }

    if (!formData.piece_identite) {
      message.error("La pièce d'identité est obligatoire");
      return;
    }

    setReservationLoading(true);

    try {
      const token = user?.token || JSON.parse(localStorage.getItem("session"))?.token;
      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const formDataToSend = new FormData();
      
      // Ajout des champs obligatoires
      formDataToSend.append('id_hotel', id);
      formDataToSend.append('id_utilisateur', currentUser.id);
      formDataToSend.append('civilite', formData.civilite);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('date_arrivee', formData.date_arrivee);
      formDataToSend.append('date_depart', formData.date_depart);
      formDataToSend.append('nombre_adultes', formData.nombre_adultes);
      formDataToSend.append('nombre_enfants', formData.nombre_enfants);
      formDataToSend.append('piece_identite', formData.piece_identite);

      // Ajout des champs optionnels
      if (formData.message) {
        formDataToSend.append('message', formData.message);
      }
      if (formData.passeport) {
        formDataToSend.append('passeport', formData.passeport);
      }

      // Ajout des âges des enfants
      agesEnfants.forEach((age, index) => {
        formDataToSend.append(`agesEnfants[${index}]`, age);
      });

      // Ajout des documents supplémentaires
      documents.forEach((doc) => {
        formDataToSend.append('documents', doc);
      });

      // Configuration pour l'API
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          
        }
      };

      // Envoi de la réservation
      const response = await reservationService.createReservation(formDataToSend, config);
      
      if (response.data && response.data.success) {
        message.success("Réservation effectuée avec succès !");
        navigate(`/web/Reservations/${response.data.data.id}/choix-paiement`, {
          state: {
            reservationId: response.data.data.id,
            hotelId: id,
            hotelName: hotel.name,
            dates: {
              arrivee: formData.date_arrivee,
              depart: formData.date_depart
            }
          }
        });
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      message.error(error.response?.data?.message || "Une erreur est survenue lors de la réservation");
    } finally {
      setReservationLoading(false);
    }
  };

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
                  <label><UserOutlined style={{ color: blueDark }} /> Civilité*</label>
                  <select
                    name="civilite"
                    className="form-control"
                    value={formData.civilite}
                    onChange={handleChange}
                    required
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mme">Mme</option>
                    <option value="Mlle">Mlle</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label><UserOutlined style={{ color: blueDark }} /> Nom Complet*</label>
                  <input 
                    type="text" 
                    name="prenom"
                    className="form-control" 
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required 
                  />
                  <input 
                    type="text" 
                    name="nom"
                    className="form-control mt-2" 
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label><MailOutlined style={{ color: blueDark }} /> Email*</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label><PhoneOutlined style={{ color: blueDark }} /> Téléphone*</label>
                  <input 
                    type="tel" 
                    name="telephone"
                    className="form-control" 
                    value={formData.telephone}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label><TeamOutlined style={{ color: blueDark }} /> Nombre d'adultes*</label>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleNumberChange('nombre_adultes', 'decrement')}
                        disabled={formData.nombre_adultes <= 1}
                        style={{
                          backgroundColor: yellow,
                          color: blueDark,
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        name="nombre_adultes"
                        value={formData.nombre_adultes}
                        onChange={(e) => setFormData({...formData, nombre_adultes: parseInt(e.target.value) || 1})}
                        min="1"
                        style={{ maxWidth: '50px' }}
                      />
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleNumberChange('nombre_adultes', 'increment')}
                        style={{
                          backgroundColor: yellow,
                          color: blueDark,
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label><TeamOutlined style={{ color: blueDark }} /> Nombre d'enfants</label>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleNumberChange('nombre_enfants', 'decrement')}
                        disabled={formData.nombre_enfants <= 0}
                        style={{
                          backgroundColor: yellow,
                          color: blueDark,
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        name="nombre_enfants"
                        value={formData.nombre_enfants}
                        onChange={(e) => setFormData({...formData, nombre_enfants: parseInt(e.target.value) || 0})}
                        min="0"
                        style={{ maxWidth: '50px' }}
                      />
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleNumberChange('nombre_enfants', 'increment')}
                        style={{
                          backgroundColor: yellow,
                          color: blueDark,
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {formData.nombre_enfants > 0 && (
                  <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10, marginBottom: 20 }}>
                    <Row gutter={16}>
                      <Col span={12}><b>Numéro d'enfant</b></Col>
                      <Col span={12}><b>Âge</b></Col>
                    </Row>
                    {Array.from({ length: formData.nombre_enfants }).map((_, index) => (
                      <Row gutter={16} key={index} style={{ marginBottom: 10 }}>
                        <Col span={12}>Enfant {index + 1}</Col>
                        <Col span={12}>
                          <input 
                            type="number" 
                            className="form-control" 
                            min="0"
                            value={agesEnfants[index] || ""}
                            onChange={(e) => handleAgeChange(index, e.target.value)} 
                            required 
                          />
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}

                <Row gutter={10}>
                  <Col span={12}>
                    <div className="mb-3">
                      <label><CalendarOutlined style={{ color: blueDark }} /> Date d'arrivée*</label>
                      <input 
                        type="date" 
                        name="date_arrivee"
                        className="form-control" 
                        value={formData.date_arrivee}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="mb-3">
                      <label><CalendarOutlined style={{ color: blueDark }} /> Date de départ*</label>
                      <input 
                        type="date" 
                        name="date_depart"
                        className="form-control" 
                        value={formData.date_depart}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <label><FileOutlined style={{ color: blueDark }} /> Pièce d'identité*</label>
                  <input 
                    type="file" 
                    name="piece_identite"
                    className="form-control" 
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange} 
                  />
                </div>

                <div className="mb-3">
                  <label><FileOutlined style={{ color: blueDark }} /> Passeport (facultatif)</label>
                  <input 
                    type="file" 
                    name="passeport"
                    className="form-control" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange} 
                  />
                </div>

                <div className="mb-3">
                  <label><FileOutlined style={{ color: blueDark }} /> Autres documents (facultatifs)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    multiple 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange} 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message supplémentaire</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Facultatif"
                  ></textarea>
                </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    id="conditionsAcceptees"
                    name="conditionsAcceptees"
                    className="form-check-input"
                    checked={formData.conditionsAcceptees}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="conditionsAcceptees" className="form-check-label">
                    J'accepte les <a href="/conditions-generales" target="_blank" style={{ color: yellow }}>
                      conditions générales
                    </a> *
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn w-100" 
                  style={{ 
                    backgroundColor: blueDark, 
                    color: "#fff",
                    height: "45px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  disabled={reservationLoading || !formData.conditionsAcceptees}
                >
                  {reservationLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Traitement...
                    </>
                  ) : (
                    <>
                      Confirmer la réservation <i className="fas fa-arrow-right ms-2"></i>
                    </>
                  )}
                </button>
              </form>
            </Card>

            <Alert 
              message="Documents obligatoires à fournir" 
              description={
                <ul style={{ marginLeft: 20 }}>
                  <li>Copie de la pièce d'identité pour chaque voyageur</li>
                  <li>Justificatif de domicile si nécessaire</li>
                </ul>
              } 
              type="info" 
              showIcon 
            />
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