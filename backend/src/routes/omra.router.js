const express = require("express");
const router = express.Router();
const omraController = require("../controllers/omra.controller");
const upload = require('../middlewares/upload.middleware'); // 👈 Assure-toi que le middleware fonctionne bien
const multer = require('multer');
// 📥 Créer une nouvelle Omra
router.post("/", upload.single('image'), omraController.create);

// 📄 Récupérer toutes les Omras (optionnel: ?search=...&limit=...&offset=...)
router.get("/", omraController.getAll);

// 🔍 Récupérer une Omra par son ID
router.get("/:id", omraController.getById);

// ✏️ Mettre à jour une Omra par ID
router.put("/:id", omraController.update);

// 🗑️ Supprimer une Omra par ID
router.delete("/:id", omraController.deletee);

// ✅ Publier une Omra sur le site
router.post("/:id/publish", omraController.publishToSite);

module.exports = router;
