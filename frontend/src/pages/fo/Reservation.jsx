import React, { useState, useEffect } from "react";
import imagePayment from '../../assets/img/payment/images.jpg';
import imagePayment1 from '../../assets/img/payment/images1.png';
import reservationService from "../../services-call/reservation";
import authService from "../../services-call/auth";
import publicationService from "../../services-call/publication";
import { useUser } from "../../contexts/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BookingPage = () => {
    // État initial avec valeurs par défaut
    const [formData, setFormData] = useState({
        civilite: "Mr.",
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        date_depart: "",
        date_retour: "",
        nombre_adultes: 1,
        nombre_enfants: 0,
        type_chambre: "Double",
        ville_residence: "",
        nationalite: "",
        piece_identite: null,
        passeport: null,
        passagers: [
            { prenom: "", nom: "", numeroPasseport: "", dateExpirationPasseport: "" },
            { prenom: "", nom: "", numeroPasseport: "", dateExpirationPasseport: "" }
        ],
        methodePaiement: "agence",
        message: "",
        conditionsAcceptees: false
    });

    const [previewPieceIdentite, setPreviewPieceIdentite] = useState(null);
    const [previewPasseport, setPreviewPasseport] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [publicationId, setPublicationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPublication, setCurrentPublication] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const { id: paramId } = useParams();
    const { user } = useUser();
    const token = user?.token;

    // Récupération des données initiales
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Détails de l'URL:", {
                    pathname: window.location.pathname,
                    search: window.location.search,
                    hash: window.location.hash,
                    state: location.state
                });

                // 1. Récupération du token
                const session = JSON.parse(localStorage.getItem("session"));
                const token = user?.token || session?.token;

                console.log("Token utilisé:", token);

                if (!token) {
                    throw new Error("Aucun token d'authentification trouvé");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // 2. Récupération de l'utilisateur
                console.log("Récupération des informations utilisateur...");
                const userResponse = await authService.getCurrentUser(config);

                if (!userResponse.data) {
                    throw new Error("Données utilisateur non reçues");
                }

                setCurrentUser(userResponse.data);
                console.log("Utilisateur récupéré:", userResponse.data);

                // 3. Pré-remplissage du formulaire
                setFormData(prev => ({
                    ...prev,
                    civilite: userResponse.data.civilite || "Mr.",
                    prenom: userResponse.data.prenom || "",
                    nom: userResponse.data.nom || "",
                    email: userResponse.data.email || "",
                    telephone: userResponse.data.telephone ? userResponse.data.telephone.toString() : "",
                    nationalite: userResponse.data.nationalite || "",
                    ville_residence: userResponse.data.ville || ""
                }));

                // 4. Récupération de la publication spécifique par ID
                const publicationId = paramId;

                if (!publicationId) {
                    throw new Error("ID de publication non spécifié dans l'URL");
                }

                console.log("Récupération de la publication avec ID:", publicationId);
                const publicationResponse = await publicationService.getById(publicationId);

                if (!publicationResponse.data) {
                    throw new Error("Données de publication non reçues");
                }

                setCurrentPublication(publicationResponse.data);
                console.log("Publication récupérée:", publicationResponse.data);

            } catch (err) {
                console.error("Erreur lors du chargement:", err);

                let errorMessage = "Erreur lors du chargement des données";
                if (err.response) {
                    errorMessage = err.response.data?.message || err.response.statusText;
                } else if (err.message) {
                    errorMessage = err.message;
                }

                setError(errorMessage);

                if (err.response?.status === 401) {
                    navigate(`/web/Reservation/${publicationId}/choix-paiement`, { state: { from: location.pathname } });
                } else if (err.message === "ID de publication non spécifié dans l'URL") {
                    navigate('/web/Reservation');
                }
            } finally {
                setPageLoading(false);
            }
        };

        (async () => {
            try {
                await fetchData();
            } catch (err) {
                console.error("Erreur non gérée:", err);
                setError("Une erreur inattendue est survenue");
                setPageLoading(false);
            }
        })();
    }, [user, location, navigate, paramId]);

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

            // Créer une prévisualisation pour les images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (name === "piece_identite") {
                        setPreviewPieceIdentite(reader.result);
                    } else {
                        setPreviewPasseport(reader.result);
                    }
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                // Pour les PDF, afficher une icône PDF
                if (name === "piece_identite") {
                    setPreviewPieceIdentite('https://cdn-icons-png.flaticon.com/512/337/337946.png');
                } else {
                    setPreviewPasseport('https://cdn-icons-png.flaticon.com/512/337/337946.png');
                }
            }
        }
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

    const handleNumericInputChange = (e, field) => {
        const value = e.target.value;
        const numericValue = value === '' ? (field === 'nombre_adultes' ? 1 : 0) : Math.max(
            field === 'nombre_adultes' ? 1 : 0,
            parseInt(value) || (field === 'nombre_adultes' ? 1 : 0)
        );

        setFormData(prev => ({
            ...prev,
            [field]: numericValue
        }));
    };

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...formData.passagers];
        updatedPassengers[index][field] = value;
        setFormData(prev => ({
            ...prev,
            passagers: updatedPassengers
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.piece_identite) {
            setError("La pièce d'identité est obligatoire");
            return;
        }

        if (!currentUser || !currentPublication) {
            setError("Données manquantes pour la réservation");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = user?.token || JSON.parse(localStorage.getItem("session"))?.token;

            // Création du FormData pour l'envoi des fichiers
            const formDataToSend = new FormData();

            // Conversion explicite en nombres
            const numericData = {
                nombre_adultes: Number(formData.nombre_adultes),
                nombre_enfants: Number(formData.nombre_enfants)
            };

            // Ajout des champs texte avec vérification
            const fieldsToAdd = {
                id_utilisateur: currentUser.id,
                id_publication: currentPublication.id,
                civilite: formData.civilite,
                prenom: formData.prenom,
                nom: formData.nom,
                email: formData.email,
                telephone: formData.telephone,
                date_depart: formData.date_depart,
                date_retour: formData.date_retour,
                type_chambre: formData.type_chambre,
                ville_residence: formData.ville_residence,
                nationalite: formData.nationalite,
                message: formData.message,
                ...numericData
            };

            // Ajout des champs au FormData
            Object.entries(fieldsToAdd).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            formDataToSend.append('piece_identite', formData.piece_identite);
            if (formData.passeport) {
                formDataToSend.append('passeport', formData.passeport);
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await reservationService.createReservation(formDataToSend, config);
            console.log("Réponse complète:", JSON.stringify(response.data, null, 2));
             navigate(`/web/Reservations/${response.data.data.id}/choix-paiement`, {
                state: {

                    reservationId: response.data.data.id, // Assurez-vous que votre API retourne l'ID
                    publicationId: currentPublication.id
                }
            });
            setSuccess("Réservation effectuée avec succès !");

            // Réinitialisation partielle du formulaire
            setFormData(prev => ({
                ...prev,
                message: "",
                conditionsAcceptees: false,
                piece_identite: null,
                passeport: null
            }));

            setPreviewPieceIdentite(null);
            setPreviewPasseport(null);

        } catch (err) {
            console.error("Erreur:", err);
            setError(`Erreur lors de la réservation: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="text-center my-5">Chargement en cours...</div>;
    }

    if (error) {
        return <div className="alert alert-danger my-5">{error}</div>;
    }

    if (!currentUser) {
        return <div className="alert alert-warning my-5">Veuillez vous connecter pour accéder à cette page</div>;
    }

    return (
        <>
            <section className="py-4 hero_in" style={{ backgroundColor: '#1a2d61' }}>
                <div className="container">
                    <div className="d-none d-sm-block">
                        <div className="row">
                            <div className="col-md-12 align-items-center">
                                <div className="row pt-2 d-flex justify-content-center">
                                    <div className="col-md-8">
                                        <div className="row no-gutters">
                                            {['Votre demande', 'Choix du paiement', 'Paiement'].map((step, index) => (
                                                <div className="col-md" key={index}>
                                                    <div className="text-center">
                                                        <button
                                                            type="button"
                                                            className={`btn ${index < 1 ? 'btn-warning' : 'btn-outline-warning'} rounded-25`}
                                                            disabled={index > 1}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                        <div className="mt-2 text-white">{step}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mt-4">
                <div className="card">
                    <div className="card-body">
                        <h1 className="h3 mb-3">Informations sur la réservation</h1>
                        {currentPublication && (
                            <div className="alert alert-info mb-4">
                                Vous réservez : <strong>{currentPublication.titre || currentPublication.nom}</strong>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Section Coordonnées */}
                            <h5 className="mb-4" style={{ color: '#f1c40f' }}>Coordonnées</h5>

                            <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                    <label htmlFor="civilite">Civilité*</label>
                                    <select
                                        id="civilite"
                                        name="civilite"
                                        className="form-select"
                                        value={formData.civilite}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mme">Mme</option>
                                        <option value="Mlle">Mlle</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="prenom">Prénom*</label>
                                        <input
                                            id="prenom"
                                            name="prenom"
                                            className="form-control"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="nom">Nom*</label>
                                        <input
                                            id="nom"
                                            name="nom"
                                            className="form-control"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="email">Email*</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="telephone">Téléphone*</label>
                                        <input
                                            id="telephone"
                                            name="telephone"
                                            type="tel"
                                            className="form-control"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informations sur le voyage */}
                            <h5 className="mb-4 mt-4" style={{ color: '#f1c40f' }}>
                                Informations sur le voyage
                            </h5>
                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="date_depart">Date de départ</label>
                                    <input
                                        type="date"
                                        id="date_depart"
                                        name="date_depart"
                                        className="form-control"
                                        value={formData.date_depart}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="date_retour">Date de retour</label>
                                    <input
                                        type="date"
                                        id="date_retour"
                                        name="date_retour"
                                        className="form-control"
                                        value={formData.date_retour}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                    <label>Nombre d'adultes*</label>
                                    <div className="input-group">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleNumberChange('nombre_adultes', 'decrement')}
                                            disabled={formData.nombre_adultes <= 1}
                                            style={{
                                                backgroundColor: '#f1c40f',
                                                color: '#000',
                                                padding: '0.375rem 0.75rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #d9b10c'
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            value={formData.nombre_adultes}
                                            onChange={(e) => handleNumericInputChange(e, 'nombre_adultes')}
                                            min="1"
                                            style={{
                                                maxWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleNumberChange('nombre_adultes', 'increment')}
                                            style={{
                                                backgroundColor: '#f1c40f',
                                                color: '#000',
                                                padding: '0.375rem 0.75rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #d9b10c'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label>Nombre d'enfants</label>
                                    <div className="input-group">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleNumberChange('nombre_enfants', 'decrement')}
                                            disabled={formData.nombre_enfants <= 0}
                                            style={{
                                                backgroundColor: '#f1c40f',
                                                color: '#000',
                                                padding: '0.375rem 0.75rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #d9b10c'
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="form-control text-center"
                                            value={formData.nombre_enfants}
                                            onChange={(e) => handleNumericInputChange(e, 'nombre_enfants')}
                                            min="0"
                                            style={{
                                                maxWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => handleNumberChange('nombre_enfants', 'increment')}
                                            style={{
                                                backgroundColor: '#f1c40f',
                                                color: '#000',
                                                padding: '0.375rem 0.75rem',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                border: '1px solid #d9b10c'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="type_chambre">Type de chambre</label>
                                    <select
                                        id="type_chambre"
                                        name="type_chambre"
                                        className="form-select"
                                        value={formData.type_chambre}
                                        onChange={handleChange}
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Triple">Triple</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="ville_residence">Ville de résidence</label>
                                    <input
                                        type="text"
                                        id="ville_residence"
                                        name="ville_residence"
                                        className="form-control"
                                        value={formData.ville_residence}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="nationalite">Nationalité</label>
                                    <input
                                        type="text"
                                        id="nationalite"
                                        name="nationalite"
                                        className="form-control"
                                        value={formData.nationalite}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="piece_identite">Pièce d'identité (scan)*</label>
                                    <input
                                        type="file"
                                        id="piece_identite"
                                        name="piece_identite"
                                        className="form-control"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    {previewPieceIdentite && (
                                        <div className="mt-2">
                                            <img
                                                src={previewPieceIdentite}
                                                alt="Preview pièce d'identité"
                                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="passeport">Passeport (scan)</label>
                                    <input
                                        type="file"
                                        id="passeport"
                                        name="passeport"
                                        className="form-control"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                    />
                                    {previewPasseport && (
                                        <div className="mt-2">
                                            <img
                                                src={previewPasseport}
                                                alt="Preview passeport"
                                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section Message et Conditions */}
                            <div className="mb-4">
                                <label htmlFor="message" className="form-label">Demande particulière</label>
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
                                    J'accepte les <a href="/web/conditions" target="_blank" style={{ color: "#ffc107" }}>
                                        conditions générales
                                    </a> *
                                </label>
                            </div>

                            {/* Boutons de soumission */}
                            <div className="row">
                                <div className="col-6">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => window.history.back()}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i> Retour
                                    </button>
                                </div>
                                <div className="col-6 text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-warning px-4"
                                        disabled={loading || !formData.conditionsAcceptees}
                                    >
                                        {loading ? (
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
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingPage;