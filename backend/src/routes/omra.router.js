const express = require("express");
const router = express.Router();
const omraController = require("../controllers/omra.controller");
const upload = require('../middlewares/upload.middleware'); // 👈 Assure-toi que le middleware fonctionne bien
const multer = require('multer');
const authenticateToken = require('../middlewares/authMiddleware'); // ← import du middleware


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


// ✏️ publier une omra dans le site par ID
router.post("/:id/publish", omraController.publierSurSiteSeule);

// 🔍 Récupérer les omras publier sur site
router.get('/publies/site', omraController.getOmraPubliesSurSite);


// 🔍 Récupérer les omras publier sur site avec commentaire des rsx
router.get('/publies/siteCommentaire/:id', omraController.getDetailsOmra);



module.exports = router;
