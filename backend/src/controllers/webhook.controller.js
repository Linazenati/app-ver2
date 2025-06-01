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
  Client
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
                adresse: utilisateur.adresse|| 'Adresse non renseignée', // Tu peux éventuellement enrichir cela plus tard
              });
              console.log(`Utilisateur avec ID ${utilisateur.id} ajouté en tant que client.`);
            }
          }
          //destination = `Assurance Voyage - ${assurance.type}`;
          destination = `Type d'assurance : ${assurance.type}\n`
            + `Date début : ${new Date(assurance.dateDebut).toLocaleDateString()}\n`
            + `Date fin : ${new Date(assurance.dateFin).toLocaleDateString()}\n`
            + `Nombre de voyageurs : ${assurance.nombreVoyageurs}\n`
            + `Description : ${assurance.description || 'N/A'}`;

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
                { model: Voyage, as: 'voyage', attributes: ['titre', 'description', 'prix', 'date_de_depart', 'date_de_retour', 'programme'] },
                { model: Omra, as: 'omra', attributes: ['titre', 'description', 'prix', 'date_de_depart', 'date_de_retour', 'duree', 'status'] }
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
          // ... (le reste du code reste inchangé jusqu'à la partie réservation)

          // Dans la partie où vous traitez la réservation, modifiez la destination pour les vols
          if (reservation.publication?.voyage) {
            const voyage = reservation.publication.voyage;
            const dateDepart = voyage.date_de_depart ? new Date(voyage.date_de_depart).toLocaleDateString() : 'Date inconnue';
            const dateRetour = voyage.date_de_retour ? new Date(voyage.date_de_retour).toLocaleDateString() : 'Date inconnue';

            destination = `Voyage : ${voyage.titre}\n` +
              `Prix : ${voyage.prix} DZD\n` +
              `Départ : ${dateDepart}\n` +
              `Retour : ${dateRetour}\n` +
              `Description : ${voyage.description || 'Non disponible'}`;


          } else if (reservation.publication?.omra) {
            const omra = reservation.publication.omra;
            const dateDepart = omra.date_de_depart ? new Date(omra.date_de_depart).toLocaleDateString() : 'Date inconnue';
            const dateRetour = omra.date_de_retour ? new Date(omra.date_de_retour).toLocaleDateString() : 'Date inconnue';

            destination = `Omra : ${omra.titre}\n` +
              `Prix : ${omra.prix} DZD\n` +
              `Durée : ${omra.duree} jours\n` +
              `Départ : ${dateDepart}\n` +
              `Retour : ${dateRetour}\n` +
              `Description : ${omra.description || 'Non disponible'}`;
          } else if (reservation.vol) {
            // Nouveau format pour les vols
            const vol = reservation.vol;
            const dateDepart = vol.date_depart ? new Date(vol.date_depart).toLocaleDateString() : 'Date inconnue';
            const dateArrivee = vol.date_arrivee ? new Date(vol.date_arrivee).toLocaleDateString() : 'Date inconnue';

            destination = `Vol ${vol.numero_vol} (${vol.compagnie_aerienne})\n`
              + `De ${vol.aeroport_depart} à ${vol.aeroport_arrivee}\n`
              + `Départ: ${dateDepart}\n`
              + `Arrivée: ${dateArrivee}`;
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

        // Modification du chemin du fichier comme demandé
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
              filename: `facture-${paiement.id}.pdf`, // Vous pouvez aussi modifier ce nom si besoin
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