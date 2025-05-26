const chargilyService = require('../services/chargily.service');
const { Paiement, Reservation, Utilisateur_inscrit, Utilisateur, Publication, Voyage, Omra, Vol, Hotel } = require('../models');

exports.initiatePayment = async (req, res) => {
  try {
    const { reservationId } = req.body;
    console.log('Données reçues pour initier paiement :', req.body);

    if (!reservationId) {
      return res.status(400).json({ message: "L'ID de la réservation est requis." });
    }

    // Récupération de la réservation avec toutes les associations nécessaires
    const reservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: Utilisateur_inscrit,
          as: 'utilisateur_inscrit',
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur'
            }
          ]
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

    const utilisateurInscrit = reservation.utilisateur_inscrit;
    const utilisateur = utilisateurInscrit?.utilisateur;
    const publicationData = reservation.publication;

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur inscrit introuvable.' });
    }

    // Récupérer le prix et le titre depuis publication, vol ou hotel
    let prix = null;
    let titre = 'Réservation Ziguade Tour';

    if (publicationData?.omra) {
      prix = publicationData.omra.prix;
      titre = publicationData.omra.titre;
    } else if (publicationData?.voyage) {
      prix = publicationData.voyage.prix;
      titre = publicationData.voyage.titre;
    } else if (reservation.vol) {
      console.log("Vol récupéré :", reservation.vol);

      prix = parseFloat(reservation.vol.prix);
      titre = `Vol ${reservation.vol.aeroport_depart}`;
    } else if (reservation.hotel) {
      prix = parseFloat(reservation.hotel.prix_par_nuit);
      titre = `Hôtel ${reservation.hotel.name}`;
    }

    if (!prix) {
      return res.status(400).json({ message: "Aucun prix trouvé pour la réservation." });
    }
    // Fonction utilitaire pour convertir les devises (exemple statique)
    function convertirEnDZD(prix, devise) {
      const tauxChange = {
        EUR: 245, // Exemple de taux, à ajuster
        USD: 140,
        DZD: 1
      };
      return Math.round(parseFloat(prix) * (tauxChange[devise] || 1));
    }

    const montantCentimes = convertirEnDZD(prix, reservation.vol?.devise || 'DZD');// Chargily accepte le montant en DZD entier

    // Construction des données de paiement
    const paymentData = {
      amount: montantCentimes,
      currency: "dzd",
      payment_method: "edahabia",
      success_url: "http://localhost:5173/web",
      failure_url: "http://localhost:5173/web",
      webhook_endpoint: 'https://dc51-105-103-5-31.ngrok-free.app/api/v1/webhook/chargily',
      description: `Paiement pour ${titre}`,
      locale: "fr",
      shipping_address: {
        country: "DZ",
        city: "Algiers",
        address: "123 Rue Didouche Mourad"
      },
      collect_shipping_address: true,
      amount_discount: 0,
      metadata: [{}]
    };

    // Appel à l’API Chargily
    const response = await chargilyService.createPaymentLink(paymentData);

    if (!response?.data?.checkout_url) {
      return res.status(500).json({ message: "Erreur lors de la création du lien de paiement." });
    }

    // Enregistrement du paiement
    const paiement = await Paiement.create({
      devise: 'DZD',
      methode_paiement: 'Chargily',
      statut: 'en_attente',
      lien_paiement: response.data.checkout_url,
      id_reservation: reservationId,
    });

    return res.status(200).json({
      lien_paiement: response.data.checkout_url,
      paiement
    });

  } catch (error) {
    console.error("Erreur dans initiatePayment :", error);
    return res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
};
