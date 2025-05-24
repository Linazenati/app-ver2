const express = require("express");
const router = express.Router();
const factureController = require("../controllers/facture.controller");
const authenticateToken = require("../middlewares/authMiddleware");

// Protection de toutes les routes avec le middleware
router.use(authenticateToken);

router.get("/mes-factures", factureController.getUserFactures);
router.get("/download/:filename", factureController.downloadFacture);

module.exports = router;