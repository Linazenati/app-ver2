const path = require('path');
const fs = require('fs');
const { Paiement, Reservation, Utilisateur_inscrit, Utilisateur, Publication, Voyage, Omra } = require('../models');
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
          }
        ]
      });

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

        let destination = 'Destination inconnue';
        if (reservation.publication?.voyage?.titre) {
          destination = reservation.publication.voyage.titre;
        } else if (reservation.publication?.omra?.titre) {
          destination = reservation.publication.omra.titre;
        }

        const dossierFactures = path.join(__dirname, '..', 'factures');
        if (!fs.existsSync(dossierFactures)) {
          fs.mkdirSync(dossierFactures, { recursive: true });
        }

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
          destination
        }, facturePath);

        if (email) {
          await sendMail({
            to: email,
            subject: 'Votre facture - ZIGUADE TOUR',
            text: `Bonjour ${prenom},\n\nMerci pour votre paiement. Veuillez trouver ci-joint votre facture.\n\nL’équipe ZIGUADE TOUR`,
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
