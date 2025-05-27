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
  Assurance
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
              { model: Voyage, as: 'voyage', attributes: ['titre'] },
              { model: Omra, as: 'omra', attributes: ['titre'] }
            ]
          },
          {
            model: Vol,
            as: 'vol',
            attributes: ['aeroport_depart']
          },
          {
            model: Hotel,
            as: 'hotel',
            attributes: ['name']
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
        const userId = utilisateur?.id;
        const nom = utilisateur?.nom || 'Nom inconnu';
        const prenom = utilisateur?.prenom || '';
        const email = utilisateur?.email || '';
        const telephone = utilisateur?.telephone || '';
        const montant = data.amount;

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

        // Préparation des infos assurance à inclure
        let assuranceInfo = '';
        if (assurance) {
          assuranceInfo = `Type d'assurance : ${assurance.type}\nDescription : ${assurance.description || 'N/A'}\nPrix assurance : ${assurance.prix} DZD\n`;
        }

        const dossierFactures = path.join(__dirname, '..', 'factures');
        if (!fs.existsSync(dossierFactures)) {
          fs.mkdirSync(dossierFactures, { recursive: true });
        }

        const facturePath = path.join(dossierFactures, `facture-${userId}-${paiement.id}.pdf`);

        // Générer la facture en passant les infos d'assurance
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
            text: `Bonjour ${prenom},\n\nMerci pour votre paiement. Veuillez trouver ci-joint votre facture.\n\n${assuranceInfo}\nL’équipe ZIGUADE TOUR`,
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
