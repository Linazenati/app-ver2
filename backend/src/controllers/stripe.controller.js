const stripeService = require('../services/stripe.service');
const { Paiement, Reservation, Utilisateur_inscrit, Utilisateur, Publication, Voyage, Omra, Vol, Hotel } = require('../models');

exports.initiatePayment = async (req, res) => {
  try {
    const { reservationId } = req.body;
    console.log('Données reçues pour initier paiement Stripe :', req.body);

    if (!reservationId) {
      return res.status(400).json({ message: "L'ID de la réservation est requis." });
    }

    // Récupération complète de la réservation
    const reservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: Utilisateur_inscrit,
          as: 'utilisateur_inscrit',
          include: [{ model: Utilisateur, as: 'utilisateur' }]
        },
        {
          model: Publication,
          as: 'publication',
          include: [
            { model: Voyage, as: 'voyage' },
            { model: Omra, as: 'omra' }
          ]
        },
        {
          model: Vol,
          as: 'vol'
        },
        {
          model: Hotel,
          as: 'hotel'
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable.' });
    }

    const utilisateur = reservation.utilisateur_inscrit?.utilisateur;
    const publicationData = reservation.publication;

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur inscrit introuvable.' });
    }

    // Détermination du prix et du titre
    let prix = null;
    let titre = 'Réservation Ziguade Tour';

    if (publicationData?.omra) {
      prix = publicationData.omra.prix;
      titre = publicationData.omra.titre;
    } else if (publicationData?.voyage) {
      prix = publicationData.voyage.prix;
      titre = publicationData.voyage.titre;
    } else if (reservation.vol) {
      prix = reservation.vol.prix;
      titre = `Vol de ${reservation.vol.aeroport_depart} à ${reservation.vol.aeroport_arrivee}`;
    } else if (reservation.hotel) {
      prix = reservation.hotel.prix_par_nuit;
      titre = `Hôtel ${reservation.hotel.name}`;
    }

    if (!prix) {
      return res.status(400).json({ message: "Aucun prix trouvé pour cette réservation." });
    }

    const montantCentimes = Math.round(prix * 100); // Stripe attend un montant en centimes

    const paiement = await Paiement.create({
      devise: 'USD',
      methode_paiement: 'Stripe',
      statut: 'en_attente',
      id_reservation: reservationId
    });

    const stripeData = {
      amount: montantCentimes,
      currency: 'usd',
      title: titre,
      customer_email: utilisateur.email,
      success_url: 'http://localhost:5173/web/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/web',
      paiementId: paiement.id,
      reservationId: reservationId
    };

    const session = await stripeService.createCheckoutSession(stripeData);

    if (!session?.url) {
      await paiement.destroy(); // rollback en cas d’échec
      return res.status(500).json({ message: "Erreur lors de la création de la session Stripe." });
    }

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
