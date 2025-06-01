const express = require('express');
const router = express.Router();
const throttleController = require('../controllers/throttle.controller');
const recuperationController = require('../controllers/recuperationQuota.controller');

router.get('/quota-publication', throttleController.afficherQuota);



// Route GET pour récupérer l'état du quota récupération
router.get('/quota', recuperationController.getQuota);

router.post('/recuperer', recuperationController.recuperer);


// Routes pour la suppression
router.get('/supp/etat', recuperationController.getEtatQuotaSupp);
router.post('/supp/incrementer', recuperationController.incrementerQuotaSupp);

module.exports = router;
