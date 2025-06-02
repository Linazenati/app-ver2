const stripeService = require('../services/stripe.service');
const {
  Paiement,
  Reservation,
  Utilisateur_inscrit,
  Utilisateur,
  Publication,
  Voyage,
  Omra,
  Vol,
  Hotel,
  Assurance,
  Visa // 🔹 Ajouté
} = require('../models');

exports.initiatePayment = async (req, res) => {
  try {
    const { reservationId, assuranceId, visaId } = req.body;
    console.log('Données reçues pour initier paiement Stripe :', req.body);

    if (!reservationId && !assuranceId && !visaId) {
      return res.status(400).json({ message: "Un ID (réservation, assurance ou visa) est requis." });
    }

    let reservation = null;
    let prix = null;
    let titre = 'Paiement Ziguade Tour';
    let utilisateur = null;

    if (reservationId) {
      reservation = await Reservation.findByPk(reservationId, {
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
          { model: Vol, as: 'vol' },
          { model: Hotel, as: 'hotel' }
        ]
      });

      if (!reservation) {
        return res.status(404).json({ message: 'Réservation introuvable.' });
      }

      utilisateur = reservation.utilisateur_inscrit?.utilisateur;
      if (!utilisateur) {
        return res.status(404).json({ message: 'Utilisateur inscrit introuvable.' });
      }

      const publicationData = reservation.publication;

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
    } else if (assuranceId) {
      const assurance = await Assurance.findByPk(assuranceId);
      if (!assurance) {
        return res.status(404).json({ message: "Assurance introuvable." });
      }
      prix = assurance.prix;
      titre = `Assurance ${assurance.type}`;
      utilisateur = null;
    } else if (visaId) {
      const visa = await Visa.findByPk(visaId, {
        include: [
          {
            model: Utilisateur_inscrit,
            as: 'utilisateurInscrit',
            include: [{ model: Utilisateur, as: 'utilisateur' }]
          }
        ]
      });

      if (!visa) {
        return res.status(404).json({ message: "Visa introuvable." });
      }

      prix = visa.total;
      titre = `Visa pour ${visa.pays} (${visa.typeVisa})`;
      utilisateur = visa.utilisateur_inscrit?.utilisateur || null;
    }

    if (!prix) {
      return res.status(400).json({ message: "Aucun prix trouvé pour la réservation, l'assurance ou le visa." });
    }

    const montantCentimes = Math.round(prix * 100);

    const paiement = await Paiement.create({
      devise: 'USD',
      methode_paiement: 'Stripe',
      statut: 'en_attente',
      id_reservation: reservationId || null,
      id_assurance: assuranceId || null,
      id_visa: visaId || null // 🔹 Ajout ici
    });

    console.log('Paiement ID:', paiement.id);
    console.log('Réservation ID:', reservationId);
    console.log('Assurance ID:', assuranceId);
    console.log('Visa ID:', visaId);

    const stripeData = {
      amount: montantCentimes,
      currency: 'usd',
      title: titre,
      customer_email: utilisateur?.email || undefined,
      success_url: 'http://localhost:5173/web/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/web',
      paiementId: paiement.id,
      reservationId: reservationId || null,
      assuranceId: assuranceId || null,
      visaId: visaId || null
    };

    const session = await stripeService.createCheckoutSession(stripeData);

    if (!session?.url) {
      await paiement.destroy();
      return res.status(500).json({ message: "Erreur lors de la création de la session Stripe." });
    }

    await paiement.update({ lien_paiement: session.url });

    return res.status(200).json({
      lien_paiement: session.url,
      paiementId: paiement.id
    });

  } catch (error) {
    console.error("Erreur initiatePayment Stripe :", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};
