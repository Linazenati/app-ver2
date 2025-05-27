const path = require('path');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
  Assurance
} = require('../models');
const generateInvoice = require('../services/facture.service');
const sendMail = require('../utils/sendMail');

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`⚠️ Erreur de signature Stripe : ${err.message}`);
    return res.status(400).json({ error: 'Signature invalide' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (!session.metadata || !session.metadata.paiementId) {
        console.error('Metadata ou paiementId manquant');
        return res.status(400).json({ error: 'Metadata manquantes' });
      }

      const paiement = await Paiement.findByPk(session.metadata.paiementId);

      if (!paiement) {
        console.error(`Paiement ${session.metadata.paiementId} non trouvé`);
        return res.status(404).json({ error: 'Paiement non trouvé' });
      }

      paiement.statut = 'payé';
      paiement.id_transaction = session.payment_intent;
      await paiement.save();

      const reservation = await Reservation.findByPk(paiement.id_reservation, {
        include: [
          {
            model: Utilisateur_inscrit,
            as: 'utilisateur_inscrit',
            include: [
              {
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
              }
            ]
          },
          {
            model: Publication,
            as: 'publication',
            include: [
              { model: Voyage, as: 'voyage', attributes: ['titre'], required: false },
              { model: Omra, as: 'omra', attributes: ['titre'], required: false }
            ]
          },
          {
            model: Vol,
            as: 'vol',
            attributes: ['aeroport_depart'],
            required: false
          },
          {
            model: Hotel,
            as: 'hotel',
            attributes: ['name'],
            required: false
          }
        ]
      });

      // Récupérer l'assurance liée au paiement (si existante)
      let assurance = null;
      if (paiement.id_assurance) {
        assurance = await Assurance.findByPk(paiement.id_assurance);
      }

      if (reservation) {
        reservation.statut = 'confirmée';
        await reservation.save();

        const utilisateur = reservation.utilisateur_inscrit?.utilisateur;
        const userId = utilisateur?.id || 'unknown';

        // Détermination de la destination
        let destination = 'Destination inconnue';
        if (reservation.publication?.voyage?.titre) {
          destination = reservation.publication.voyage.titre;
        } else if (reservation.publication?.omra?.titre) {
          destination = reservation.publication.omra.titre;
        } else if (reservation.vol?.aeroport_depart) {
          destination = `Vol depuis ${reservation.vol.aeroport_depart}`;
        } else if (reservation.hotel?.name) {
          destination = `Hôtel ${reservation.hotel.name}`;
        }

        const nom = utilisateur?.nom || 'Nom inconnu';
        const prenom = utilisateur?.prenom || '';
        const email = utilisateur?.email || '';
        const telephone = utilisateur?.telephone || '';
        const montant = session.amount_total || 0;

        // Infos assurance à inclure dans la facture
        let assuranceInfo = '';
        if (assurance) {
          destination = `Type d'assurance : ${assurance.type}\nDescription : ${assurance.description || 'N/A'}\nPrix assurance : ${assurance.prix} DZD\n`;
        }

        const dossierFactures = path.join(__dirname, '..', 'factures');
        if (!fs.existsSync(dossierFactures)) {
          fs.mkdirSync(dossierFactures, { recursive: true });
        }

        const facturePath = path.join(dossierFactures, `facture-${userId}-${paiement.id}.pdf`);
        console.log('Reservation ID:', reservation.id);
        console.log('Vol lié à la réservation:', reservation.vol);
        console.log('Aéroport de départ:', reservation.vol?.aeroport_depart);
        await generateInvoice(
          {
            numeroFacture: `INV-${paiement.id}`,
            montant,
            nom,
            prenom,
            email,
            telephone,
            date: new Date(),
            statut: paiement.statut,
            destination,
            assurance: assuranceInfo
          },
          facturePath
        );

        if (email) {
          await sendMail({
            to: email,
            subject: 'Votre facture - ZIGUADE TOUR',
            text: `Bonjour ${prenom},\n\nMerci pour votre paiement. Veuillez trouver ci-joint votre facture.\n\n${assuranceInfo}\nL’équipe ZIGUADE TOUR`,
            attachments: [
              {
                filename: `facture-${userId}-${paiement.id}.pdf`,
                path: facturePath
              }
            ]
          });
        }
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Erreur traitement webhook Stripe:', error);
    return res.status(500).json({ error: error.message });
  }
};
