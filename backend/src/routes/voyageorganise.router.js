const express = require("express");
const router = express.Router();
const voyageController = require("../controllers/voyageorganise.controller");
const upload = require('../middlewares/upload.middleware');  // Vérifie cette ligne
const multer = require('multer');
// 📥 Créer un nouveau voyage organisé
router.post("/",upload.array('image', 5), voyageController.create);

// 📄 Récupérer tous les voyages organisés (optionnel: ?search=...&limit=...&offset=...)
router.get("/", voyageController.getAll);

// 🔍 Récupérer un voyage par son ID
router.get("/:id", voyageController.getById);

// ✏️ Mettre à jour un voyage par ID
router.put("/:id", voyageController.update);

// 🗑️ Supprimer un voyage par ID (appelée "deletee")
router.delete("/:id", voyageController.remove);

// ✏️ publier un voyage dans le site par ID
router.post("/:id/publish", voyageController.publierSurSiteSeule);

// 🔍 Récupérer les voyages publier sur site
router.get('/publies/site', voyageController.getVoyagesPubliesSurSite);


// 🔍 Récupérer les voyages publier sur site avec commentaire des rsx
router.get('/publies/siteCommentaire/:id', voyageController.getDetailsVoyages);


module.exports = router;