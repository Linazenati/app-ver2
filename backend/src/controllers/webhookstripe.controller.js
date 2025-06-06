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
  Assurance,
  Client,
  Agent,
  Visa
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

      let utilisateur = null;
      let montant = session.amount_total ? session.amount_total / 100 : 0;
      let destination = 'Service ZIGUADE TOUR';
      let assuranceInfo = '';
      let nom = 'Nom inconnu';
      let prenom = '';
      let email = '';
      let telephone = '';
      let shouldGenerateInvoice = false;

      // Cas 1: Paiement pour une assurance
      if (paiement.id_assurance) {
        const assurance = await Assurance.findByPk(paiement.id_assurance, {
          include: [{
            model: Utilisateur_inscrit,
            as: 'utilisateur_inscrit',
            include: [{
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
            }]
          }]
        });

        if (assurance) {
          utilisateur = assurance.utilisateur_inscrit?.utilisateur;
          nom = utilisateur?.nom || 'Nom inconnu';
          prenom = utilisateur?.prenom || '';
          email = utilisateur?.email || '';
          telephone = utilisateur?.telephone || '';
          if (utilisateur?.id) {
            const existingClient = await Client.findByPk(utilisateur.id);

            if (!existingClient) {
              await Client.create({
                id: utilisateur.id,
                adresse: utilisateur.adresse || 'Adresse non renseignée', // Tu peux éventuellement enrichir cela plus tard
              });
              console.log(`Utilisateur avec ID ${utilisateur.id} ajouté en tant que client.`);
            }
          }

          destination = `Type d'assurance : ${assurance.type}\n` +
            `Date début : ${new Date(assurance.dateDebut).toLocaleDateString()}\n` +
            `Date fin : ${new Date(assurance.dateFin).toLocaleDateString()}\n` +
            `Nombre de voyageurs : ${assurance.nombreVoyageurs}\n` +
            `Description : ${assurance.description || 'N/A'}`;

          shouldGenerateInvoice = true;
        }
      }

      // Cas 2: Paiement pour un visa
      else if (paiement.id_visa) {
        const visa = await Visa.findByPk(paiement.id_visa, {
          include: [{
            model: Utilisateur_inscrit,
            as: 'utilisateurInscrit',
            include: [{
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
            }]
          }]
        });

        if (visa) {
          utilisateur = visa.utilisateurInscrit?.utilisateur;
          nom = utilisateur?.nom || 'Nom inconnu';
          prenom = utilisateur?.prenom || '';
          email = utilisateur?.email || '';
          telephone = utilisateur?.telephone || '';

          if (utilisateur?.id) {
            const existingClient = await Client.findByPk(utilisateur.id);

            if (!existingClient) {
              await Client.create({
                id: utilisateur.id,
                adresse: utilisateur.adresse || 'Adresse non renseignée',
              });
              console.log(`Utilisateur avec ID ${utilisateur.id} ajouté en tant que client.`);
            }
          }

          destination = `Demande de Visa\n` +
            `Pays de destination : ${visa.pays || 'Non spécifié'}\n` +
            `Type de visa : ${visa.typeVisa || 'Non précisé'}\n` +
            `Nombre de personnes : ${visa.personnes || 'Non précisé'}\n` +
            `Nationalité : ${visa.nationalite || 'Non précisée'}\n` +
            `Date d’arrivée prévue : ${visa.dateArrivee || 'Non précisée'}`;

          shouldGenerateInvoice = true;
        }
      }



      // Cas 2: Paiement pour une réservation
      else if (paiement.id_reservation) {
        const reservation = await Reservation.findByPk(paiement.id_reservation, {
          include: [
            {
              model: Utilisateur_inscrit,
              as: 'utilisateur_inscrit',
              include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
              }]
            },
            {
              model: Publication,
              as: 'publication',
              include: [
                {
                  model: Voyage,
                  as: 'voyage',
                  attributes: ['titre', 'description', 'prix', 'date_de_depart', 'date_de_retour', 'programme', 'id_agent'],
                  include: [
                    {
                      model: Agent,
                      as: 'agent',
                      include: [
                        {
                          model: Utilisateur,
                          as: 'utilisateur',
                          attributes: ['nom', 'prenom', 'email']
                        }
                      ]
                    }
                  ]
                },
                {
                  model: Omra,
                  as: 'omra',
                  attributes: ['titre', 'description', 'prix', 'date_de_depart', 'date_de_retour', 'duree', 'status'],
                  include: {
                    model: Agent,
                    as: 'agent',
                    include: {
                      model: Utilisateur,
                      as: 'utilisateur',
                      attributes: ['nom', 'prenom', 'email']
                    }
                  }
                }
              ]
            },
            {
              model: Vol,
              as: 'vol',
              attributes: ['numero_vol', 'compagnie_aerienne', 'aeroport_depart', 'aeroport_arrivee', 'date_depart', 'date_arrivee']
            },
            {
              model: Hotel,
              as: 'hotel',
              attributes: ['name', 'ville', 'adresse', 'etoiles', 'region']
            }
          ]
        });

        if (reservation) {
          reservation.statut = 'confirmée';
          await reservation.save();

          utilisateur = reservation.utilisateur_inscrit?.utilisateur;
          nom = utilisateur?.nom || 'Nom inconnu';
          prenom = utilisateur?.prenom || '';
          email = utilisateur?.email || '';
          telephone = utilisateur?.telephone || '';
          if (utilisateur?.id) {
            const existingClient = await Client.findByPk(utilisateur.id);

            if (!existingClient) {
              await Client.create({
                id: utilisateur.id,
                adresse: utilisateur.adresse || 'Adresse non renseignée', // Tu peux éventuellement enrichir cela plus tard
              });
              console.log(`Utilisateur avec ID ${utilisateur.id} ajouté en tant que client.`);
            }
          }

          // Détermination de la destination
          if (reservation.publication?.voyage) {
            const voyage = reservation.publication.voyage;
            const dateDepart = voyage.date_de_depart ? new Date(voyage.date_de_depart).toLocaleDateString() : 'Date inconnue';
            const dateRetour = voyage.date_de_retour ? new Date(voyage.date_de_retour).toLocaleDateString() : 'Date inconnue';

            destination = `Voyage : ${voyage.titre}\n` +
              `Prix : ${voyage.prix} DZD\n` +
              `Départ : ${dateDepart}\n` +
              `Retour : ${dateRetour}\n` +
              `Description : ${voyage.description || 'Non disponible'}\n` +
              `Agent : ${voyage.agent?.utilisateur?.prenom} ${voyage.agent?.utilisateur?.nom} (${voyage.agent?.utilisateur?.email})`
              ;

          } else if (reservation.publication?.omra) {
            const omra = reservation.publication.omra;
            const dateDepart = omra.date_de_depart ? new Date(omra.date_de_depart).toLocaleDateString() : 'Date inconnue';
            const dateRetour = omra.date_de_retour ? new Date(omra.date_de_retour).toLocaleDateString() : 'Date inconnue';

            destination = `Omra : ${omra.titre}\n` +
              `Prix : ${omra.prix} DZD\n` +
              `Durée : ${omra.duree} jours\n` +
              `Départ : ${dateDepart}\n` +
              `Retour : ${dateRetour}\n` +
              `Description : ${omra.description || 'Non disponible'}\n` +
              `Agent : ${omra.agent?.utilisateur?.prenom} ${omra.agent?.utilisateur?.nom} (${omra.agent?.utilisateur?.email})`
              ;
          } else if (reservation.vol) {
            const vol = reservation.vol;
            const dateDepart = vol.date_depart ? new Date(vol.date_depart).toLocaleDateString() : 'Date inconnue';
            const dateArrivee = vol.date_arrivee ? new Date(vol.date_arrivee).toLocaleDateString() : 'Date inconnue';

            destination = `Vol ${vol.numero_vol} (${vol.compagnie_aerienne})\n` +
              `De ${vol.aeroport_depart} à ${vol.aeroport_arrivee}\n` +
              `Départ: ${dateDepart}\n` +
              `Arrivée: ${dateArrivee}`;
          } else if (reservation.hotel) {
            const hotel = reservation.hotel;
            destination = `Hôtel ${hotel.name}\n` +
              `Ville : ${hotel.ville || 'Non spécifiée'}\n` +
              `Adresse : ${hotel.adresse || 'Non spécifiée'}\n` +
              `Classement : ${'★'.repeat(hotel.etoiles || 0)}`;
          }

          shouldGenerateInvoice = true;
        }
      }

      // Génération de la facture
      if (shouldGenerateInvoice) {
        const dossierFactures = path.join(__dirname, '..', 'factures');
        if (!fs.existsSync(dossierFactures)) {
          fs.mkdirSync(dossierFactures, { recursive: true });
        }

        const userId = utilisateur?.id || 'inconnu';
        const facturePath = path.join(dossierFactures, `facture-${userId}-${paiement.id}.pdf`);

        await generateInvoice({
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
        }, facturePath);

        if (email) {
          await sendMail({
            to: email,
            subject: 'Votre facture - ZIGUADE TOUR',
            text: `Bonjour ${prenom},\n\nMerci pour votre paiement. Veuillez trouver ci-joint votre facture.\n\n${destination}\n${assuranceInfo}\n\nL'équipe ZIGUADE TOUR`,
            attachments: [{
              filename: `facture-${userId}-${paiement.id}.pdf`,
              path: facturePath
            }]
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