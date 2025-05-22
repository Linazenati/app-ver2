const { Paiement, Reservation, Utilisateur_inscrit, Utilisateur, Publication, Omra, Voyage } = require('../models');

const getAllPaiements = async () => {
  const paiements = await Paiement.findAll({
    include: [
      {
        model: Reservation,
        as: 'reservation',
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
              { model: Omra, as: 'omra' },
              { model: Voyage, as: 'voyage' }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  // Formattage des données
  const paiementsAvecMontant = paiements.map(p => {
    const pub = p.reservation?.publication;
    const montant = pub?.omra?.prix || pub?.voyage?.prix || null;

    return {
      ...p.toJSON(),
      montant,
      reservation: {
        ...p.reservation?.toJSON(),
        utilisateur_inscrit: {
          ...p.reservation?.utilisateur_inscrit?.toJSON(),
          utilisateur: p.reservation?.utilisateur_inscrit?.utilisateur?.toJSON()
        }
      }
    };
  });

  return paiementsAvecMontant;
};

module.exports = {
  getAllPaiements
};