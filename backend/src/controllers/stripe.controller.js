
const stripeService = require('../services/stripe.service');

const { Paiement, Reservation, Utilisateur_inscrit, Utilisateur, Publication, Voyage, Omra } = require('../models');

exports.initiatePayment = async (req, res) => {
    try {
        const { reservationId } = req.body;
        console.log('Données reçues pour initier paiement Stripe :', req.body);

        if (!reservationId) {
            return res.status(400).json({ message: "L'ID de la réservation est requis." });
        }

        // Récupération de la réservation avec les relations
        const reservation = await Reservation.findByPk(reservationId, {
            include: [
                {
                    model: Utilisateur_inscrit,
                    as: 'utilisateur_inscrit',
                    include: [
                        { model: Utilisateur, as: 'utilisateur' }
                    ]
                },
                {
                    model: Publication,
                    as: 'publication',
                    include: [
                        { model: Voyage, as: 'voyage' },
                        { model: Omra, as: 'omra' }
                    ]
                }
            ]
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation introuvable.' });
        }

        const utilisateur = reservation.utilisateur_inscrit?.utilisateur;
        const publicationData = reservation.publication;

        if (!utilisateur || !publicationData) {
            return res.status(404).json({ message: 'Utilisateur ou publication associé introuvable.' });
        }

        // Détermination du prix et du titre
        let prix = null;
        let titre = 'Réservation Ziguade Tour';

        if (publicationData.omra) {
            prix = publicationData.omra.prix;
            titre = publicationData.omra.titre;
        } else if (publicationData.voyage) {
            prix = publicationData.voyage.prix;
            titre = publicationData.voyage.titre;
        }

        if (!prix) {
            return res.status(400).json({ message: "Aucun prix trouvé pour la publication liée." });
        }

        const montantCentimes = Math.round(prix * 1);

        // Création du paiement en BASE D'ABORD
        const paiement = await Paiement.create({
            devise: 'USD',
            methode_paiement: 'Stripe',
            statut: 'en_attente',
            id_reservation: reservationId,
            // lien_paiement sera mis à jour après
        });

        // Préparation des données Stripe avec l'ID du paiement
        const stripeData = {
            amount: montantCentimes,
            currency: 'usd',
            title: titre,
            customer_email: utilisateur.email,
            success_url: 'http://localhost:5173/web/?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/web',
            paiementId: paiement.id,  // Maintenant disponible
            reservationId: reservationId
        };

        // Création de la session Stripe
        const session = await stripeService.createCheckoutSession(stripeData);

        if (!session?.url) {
            // Si échec, supprimer le paiement créé
            await paiement.destroy();
            return res.status(500).json({ message: "Erreur création session Stripe" });
        }

        // Mise à jour du paiement avec le lien Stripe
        await paiement.update({ lien_paiement: session.url });

        return res.status(200).json({
            lien_paiement: session.url,
            paiementId: paiement.id
        });

    } catch (error) {
        console.error("Erreur initiatePayment:", error);
        return res.status(500).json({ 
            message: "Erreur serveur",
            error: error.message 
        });
    }
};