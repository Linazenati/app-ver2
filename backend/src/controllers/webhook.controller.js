const path = require('path');
const fs = require('fs');
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
  Visa,
  Client,
  Agent
} = require('../models');
const generateInvoice = require('../services/facture.service');
const sendMail = require('../utils/sendMail');

exports.handleChargilyWebhook = async (req, res) => {
  try {
    const event = req.body;
    const { data } = event;
    const isSuccess = data?.status === 'paid';

    const paiement = await Paiement.findOne({
      where: {
        lien_paiement: data.checkout_url
      }
    });

    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé.' });
    }

    paiement.statut = isSuccess ? 'payé' : 'échec';
    await paiement.save();

    if (isSuccess) {
      let utilisateur = null;
      let montant = data.amount;
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
                adresse: utilisateur.adresse || 'Adresse non renseignée',
              });
            }
          }

          destination = `Type d'assurance : ${assurance.type}\n`
            + `Date début : ${new Date(assurance.dateDebut).toLocaleDateString()}\n`
            + `Date fin : ${new Date(assurance.dateFin).toLocaleDateString()}\n`
            + `Nombre de voyageurs : ${assurance.nombreVoyageurs}\n`
            + `Description : ${assurance.description || 'N/A'}`;

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

      // Cas 3: Paiement pour une réservation
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
                  include: [{
                    model: Agent,
                    as: 'agent',
                    include: [{
                      model: Utilisateur,
                      as: 'utilisateur',
                      attributes: ['nom', 'prenom', 'email']
                    }]
                  }]
                },
                {
                  model: Omra,
                  as: 'omra',
                  include: {
                    model: Agent,
                    as: 'agent',
                    include: {
                      model: Utilisateur,
                      as: 'utilisateur',
                      attributes: ['nom', 'prenom', 'email']
                    }
                  }
                }]
            },
            { model: Vol, as: 'vol' },
            { model: Hotel, as: 'hotel' }
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
                adresse: utilisateur.adresse || 'Adresse non renseignée',
              });
            }
          }

          if (reservation.publication?.voyage) {
            const voyage = reservation.publication.voyage;
            destination = `Voyage : ${voyage.titre}\nPrix : ${voyage.prix} DZD\nDépart : ${new Date(voyage.date_de_depart).toLocaleDateString()}\nRetour : ${new Date(voyage.date_de_retour).toLocaleDateString()}\nDescription : ${voyage.description || 'N/A'}\nAgent : ${voyage.agent?.utilisateur?.prenom} ${voyage.agent?.utilisateur?.nom} (${voyage.agent?.utilisateur?.email})`;
          } else if (reservation.publication?.omra) {
            const omra = reservation.publication.omra;
            destination = `Omra : ${omra.titre}\nPrix : ${omra.prix} DZD\nDurée : ${omra.duree} jours\nDépart : ${new Date(omra.date_de_depart).toLocaleDateString()}\nRetour : ${new Date(omra.date_de_retour).toLocaleDateString()}\nDescription : ${omra.description || 'N/A'}\nAgent : ${omra.agent?.utilisateur?.prenom} ${omra.agent?.utilisateur?.nom} (${omra.agent?.utilisateur?.email})`;
          } else if (reservation.vol) {
            const vol = reservation.vol;
            destination = `Vol ${vol.numero_vol} (${vol.compagnie_aerienne})\nDe ${vol.aeroport_depart} à ${vol.aeroport_arrivee}\nDépart: ${new Date(vol.date_depart).toLocaleDateString()}\nArrivée: ${new Date(vol.date_arrivee).toLocaleDateString()}`;
          } else if (reservation.hotel) {
            const hotel = reservation.hotel;
            destination = `Hôtel ${hotel.name}\nVille : ${hotel.ville}\nAdresse : ${hotel.adresse}\nClassement : ${'★'.repeat(hotel.etoiles || 0)}`;
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

        const facturePath = path.join(dossierFactures, `facture-${utilisateur?.id || 'inconnu'}-${paiement.id}.pdf`);

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
              filename: `facture-${paiement.id}.pdf`,
              path: facturePath
            }]
          });
        }
      }
    }

    return res.status(200).json({ message: 'Statut de paiement mis à jour avec succès.' });
  } catch (error) {
    console.error("Erreur dans le webhook Chargily :", error);
    return res.status(500).json({ message: 'Erreur lors du traitement du webhook.' });
  }
};

