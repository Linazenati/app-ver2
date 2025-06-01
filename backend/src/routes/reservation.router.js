const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const upload = require("../middlewares/upload.middleware");

// Middleware amélioré avec logs
const uploadMiddleware = (req, res, next) => {
  console.log('Middleware upload appelé');
  upload.fields([
    { name: 'piece_identite', maxCount: 1 },
    { name: 'passeport', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ])(req, res, (err) => {
    if (err) {
      console.error('Erreur dans le middleware upload:', err);
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }
    console.log('Fichiers reçus:', req.files);
    next();
  });
};

router.post("/", uploadMiddleware, reservationController.createReservation);
console.log("➡️ Requête reçue sur /api/v1/reservation");

 
// 📌 Obtenir toutes les réservations
router.get("/", reservationController.getAllReservations);

// 📌 Obtenir une réservation par ID
router.get("/:id", reservationController.getReservationById);

// 📌 Supprimer une réservation
router.delete("/:id", reservationController.supprimerReservation);
router.put("/:id", reservationController.updateReservation);


module.exports = router;
