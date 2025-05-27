import React, { useState, useEffect } from "react";
import imagePayment from '../../assets/img/payment/images.jpg';
import imagePayment1 from '../../assets/img/payment/images1.png';
import chargilyService from '../../services-call/chargily';
import stripeService from '../../services-call/stripe';
import authService from "../../services-call/auth";
import { useUser } from "../../contexts/UserContext";

import { useParams } from 'react-router-dom';

const ChoixPaiement = () => {
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        telephone: ""
    });

    const [currentUser, setCurrentUser] = useState(null);

    const { user } = useUser();
    const token = user?.token;

    useEffect(() => {
        const fetchUser = async () => {
            try {
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

                const response = await authService.getCurrentUser(config);

                if (response.data) {
                    setCurrentUser(response.data);

                    setFormData(prev => ({
                        ...prev,
                        prenom: response.data.prenom || "",
                        nom: response.data.nom || "",
                        telephone: response.data.telephone ? response.data.telephone.toString() : "",
                    }));
                } else {
                    console.error("Utilisateur non récupéré");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération utilisateur :", error);
            }
        };

        fetchUser();
    }, []);

    // 🔥 Modification ici : on récupère l'ID d'assurance depuis l'URL
    const { idAssurance } = useParams(); 
    console.log("ID d'assurance depuis l'URL :", idAssurance);

    const handleConfirm = async () => {
        if (formData.methodePaiement === "dahabia") {
            const clientName = currentUser ? `${currentUser.nom} ${currentUser.prenom}` : "Client inconnu";

            const paymentData = {
                client: clientName,
                invoice_number: "FACT-123456",
                back_url: "http://localhost:5173/web",
                success_url: "http://localhost:5173/web",
                webhook_url: "https://a3ae-105-103-5-31.ngrok-free.app/api/v1/webhook/chargily",
                mode: "EDAHABIA",
                assuranceId: idAssurance // 🔥 Utilisation de idAssurance ici
            };

            try {
                const response = await chargilyService.initiatePayment(paymentData, token);
                console.log("Réponse complète de l’API :", response.data);

                const paymentLink = response.data.lien_paiement;
                window.location.href = paymentLink;

            } catch (error) {
                console.error("Erreur lors de la création du lien de paiement :", error);
                console.error('Erreur Axios :', error.response?.data || error.message);
                alert("Une erreur est survenue lors de la création du lien de paiement.");
            }
        } else if (formData.methodePaiement === "international") {
            try {
                const response = await stripeService.initiatePayment(idAssurance, token); // 🔥 Utilisation de idAssurance ici aussi
                const paymentLink = response.data.lien_paiement;

                if (paymentLink) {
                    window.location.href = paymentLink;
                } else {
                    throw new Error("Lien de paiement Stripe non reçu");
                }

            } catch (error) {
                console.error("Erreur lors de l'initialisation du paiement Stripe :", error);
                console.error('Erreur Axios :', error.response?.data || error.message);
                alert("Une erreur est survenue lors du paiement international.");
            }

        } else {
            alert(`Méthode de paiement choisie : ${formData.methodePaiement}`);
        }
    };

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
                                                            className={`btn ${index === 1
                                                                ? 'btn-warning'
                                                                : index < 1
                                                                    ? 'btn-warning'
                                                                    : 'btn-outline-warning'
                                                                } rounded-25`}
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

            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-md-12">
                        <h5 className="mb-4" style={{ color: '#003366' }}>Mode de paiement</h5>

                        <div id="tab-resa">
                            <nav>
                                <div className="nav nav-tabs bg-info" id="nav-tab" role="tablist">
                                    {['agence', 'dahabia', 'international'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            className={`nav-item nav-link px-3 text-dark ${formData.methodePaiement === method ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, methodePaiement: method })}
                                        >
                                            <i className={`fas ${method === 'agence' ? 'fa-store' :
                                                method === 'dahabia' ? 'fa-credit-card' : 'fa-globe'
                                                } pr-2`}></i>
                                            {method === 'agence' ? 'Paiement à l\'agence' :
                                                method === 'dahabia' ? 'Carte Dahabia/CIB' : 'Paiement international'}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            <div className="tab-content bg-light p-3">
                                <div className={`tab-pane fade ${formData.methodePaiement === 'agence' ? 'show active' : ''}`}>
                                    <p><strong>Paiement à l'agence Béjaïa - Quartier Sghir</strong></p>
                                    <p className="text-muted">Vous pourrez régler votre réservation en espèces ou par chèque.</p>
                                </div>
                                <div className={`tab-pane fade ${formData.methodePaiement === 'dahabia' ? 'show active' : ''}`}>
                                    <p><strong>Paiement sécurisé par carte Dahabia/CIB</strong></p>
                                    <img
                                        src={imagePayment}
                                        alt="Paiement CIB/Dahabia"
                                        className="img-fluid"
                                        style={{ maxHeight: '50px' }}
                                    />
                                </div>
                                <div className={`tab-pane fade ${formData.methodePaiement === 'international' ? 'show active' : ''}`}>
                                    <p><strong>Paiement sécurisé par carte Visa/Mastercard</strong></p>
                                    <img
                                        src={imagePayment1}
                                        alt="Paiement international"
                                        className="img-fluid"
                                        style={{ maxHeight: '50px' }}
                                    />
                                </div>

                                <div className="text-end mt-4">
                                    <button
                                        className="btn"
                                        style={{ backgroundColor: '#003366', color: 'white' }}
                                        onClick={handleConfirm}
                                    >
                                        Confirmer la méthode de paiement
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChoixPaiement;
