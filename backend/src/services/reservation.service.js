// services/reservation.service.js
const { Reservation, Utilisateur_inscrit,Utilisateur, Publication,Voyage,Omra,Hotel,Vol  } = require('../models');
const { Op } = require("sequelize");

const createReservation = async (data) => {
  console.log("👉 Données reçues pour la réservation :", data); // debug ici
  return await Reservation.create({
    ...data,
    date_reservation: new Date()
  });
};


const getAllReservations = async ({
  limit = 50,
  offset = 0,
  type = "",
  orderBy = "createdAt",
  orderDir = "DESC"
} = {}) => {
  const whereClause = {};

  if (type) {
    whereClause.type = type;
  }

 const reservations = await Reservation.findAndCountAll({
  where: whereClause,
  include: [
    { 
      model: Utilisateur_inscrit,
      as: 'utilisateur_inscrit',
      required: false,
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          required: false,
          attributes: ['id', 'nom', 'prenom', 'email', 'telephone']
        }
      ]
    },
    { 
      model: Publication, 
      as: 'publication',
      required: false,
      include: [
        {
          model: Voyage,
          as: 'voyage',
          required: false,
          attributes: ['id', 'titre', 'description', 'date_de_depart', 'date_de_retour', 'prix']
        },
        {
          model: Omra,
          as: 'omra',
          required: false,
          attributes: ['id', 'titre', 'description', 'date_de_depart', 'date_de_retour', 'prix']
        }
      ]
    },
    {
      model: Hotel,
      as: 'hotel',
      required: false,
      attributes: ['id', 'name', 'adresse', 'ville', 'region', 'Note_moyenne']
    },
    {
      model: Vol,
      as: 'vol',
      required: false,
      attributes: ['numero_vol', 'compagnie_aerienne', 'aeroport_depart', 'aeroport_arrivee', 'duree', 'prix', 'devise']
    }
  ],
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [[orderBy, orderDir]]
});


return reservations;

};

// ✅ Obtenir une réservation par ID
const getReservationById = async (id) => {
  return await Reservation.findByPk(id, {
    include: [
      { model: Utilisateur, as: 'Utilisateur' },
      { model: Publication, as: 'publication' }
    ]
  });
};

// ✅ Supprimer une réservation
const supprimerReservation = async (id) => {
  const reservation = await Reservation.findByPk(id);
  if (!reservation) throw new Error('Réservation non trouvée');
  return await reservation.destroy();
};

const updateReservation = async (id, data) => {
  const reservation = await Reservation.findByPk(id);
  if (!reservation) throw new Error('Réservation non trouvée');
  await reservation.update(data);
  return reservation;
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  supprimerReservation,
  updateReservation
};
