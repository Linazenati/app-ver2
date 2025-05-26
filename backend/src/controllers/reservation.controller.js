const { Reservation, Utilisateur, Publication, Vol,Hotel } = require('../models');
const reservationService = require('../services/reservation.service');
//const Upload = require('../middlewares/upload.middleware');
const fs = require('fs'); // Ajout pour la gestion des fichiers temporaires
const path = require('path');


// Créer une réservation
exports.createReservation = async (req, res) => {
  console.log("🔍 Headers reçus:", req.headers);
  console.log("📥 Données textuelles reçues:", req.body);
  console.log("📂 Fichiers reçus:", req.files);

  try {
    // Extraction des données
    const bodyData = req.body;
    console.log(req.body)
    const files = req.files;



    // Vérification des fichiers
    const piece_identite = files?.['piece_identite']?.[0]?.filename || null;
    const passeport = files?.['passeport']?.[0]?.filename || null;

    console.log("📄 Fichiers après traitement:", { piece_identite, passeport });

    // Vérification des champs obligatoires
   if (!bodyData.id_utilisateur || bodyData.nombre_adultes == null || 
    (!bodyData.id_publication && !bodyData.id_vol && !bodyData.id_hotel)) {
  return res.status(400).json({
    success: false,
    message: "Champs manquants : id_utilisateur, nombre_adultes, et au moins une cible de réservation (publication, vol ou hôtel)."
  });
}



    // Vérification de l'existence de l'utilisateur et de la publication
    // Vérification de l'existence de l'utilisateur, publication, vol et hôtel
const [
  utilisateur,
  publication,
  vol,
  hotel
] = await Promise.all([
  Utilisateur.findByPk(bodyData.id_utilisateur),
  bodyData.id_publication ? Publication.findByPk(bodyData.id_publication) : Promise.resolve(null),
  bodyData.id_vol ? Vol.findByPk(bodyData.id_vol) : Promise.resolve(null),
  bodyData.id_hotel ? Hotel.findByPk(bodyData.id_hotel) : Promise.resolve(null),
]);

if (!utilisateur) {
  return res.status(404).json({ 
    success: false,
    message: "Utilisateur introuvable." 
  });
}

if (bodyData.id_publication && !publication) {
  return res.status(404).json({ 
    success: false,
    message: "Publication introuvable." 
  });
}

if (bodyData.id_vol && !vol) {
  return res.status(404).json({ 
    success: false,
    message: "Vol introuvable." 
  });
}

if (bodyData.id_hotel && !hotel) {
  return res.status(404).json({ 
    success: false,
    message: "Hôtel introuvable." 
  });
}


    // Création de la réservation
    const reservation = await Reservation.create({
      id_utilisateur_inscrit: bodyData.id_utilisateur,
      id_publication: bodyData.id_publication,
      id_vol: bodyData.id_vol || null,
      id_hotel: bodyData.id_hotel || null,
      date_depart: bodyData.date_depart,
      date_retour: bodyData.date_retour,
      nombre_adultes: bodyData.nombre_adultes,
      nombre_enfants: bodyData.nombre_enfants || 0,
      type_chambre: bodyData.type_chambre || null,
      ville_residence: bodyData.ville_residence,
      nationalite: bodyData.nationalite,
      piece_identite,
      passeport
    });

    console.log("✅ Réservation créée avec succès:", reservation.toJSON());

    return res.status(201).json({
      success: true,
      message: "Réservation créée avec succès",
      data: {
        id: reservation.id,
        documents: {
          piece_identite: !!piece_identite,
          passeport: !!passeport
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur complète:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la réservation",
      error: error.message
    });
  }
};
// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

  // Obtenir une réservation par ID
  exports.getReservationById = async (req, res) => {
    try {
      const { id } = req.params;
      const reservation = await reservationService.getReservationById(id);
      return res.status(200).json(reservation);
    } catch (error) {
      console.error("Erreur :", error);
      return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur." });
    }
  };
  
  // Supprimer une réservation
  exports.supprimerReservation = async (req, res) => {
    try {
      const { id } = req.params;
      await reservationService.supprimerReservation(id);
      return res.status(200).json({ message: "Réservation supprimée avec succès." });
    } catch (error) {
      console.error("Erreur :", error);
      return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur." });
    }
  };
  // ✅ Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    console.log("🛠️ Mise à jour de la réservation ID:", id, "avec les données:", data);

    const reservation = await reservationService.updateReservation(id, data);

    return res.status(200).json({
      message: "Réservation mise à jour avec succès.",
      reservation
    });
  } catch (error) {
    console.error("❌ Erreur de mise à jour :", error);
    return res.status(500).json({
      message: error.message || "Erreur lors de la mise à jour de la réservation."
    });
  }
};
