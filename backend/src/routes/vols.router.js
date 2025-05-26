const express = require('express');
const router = express.Router();
const volController = require('../controllers/vols.controller');
// Route POST pour rechercher et enregistrer les vols
router.post('/search-and-save', volController.rechercherEtEnregistrerVols);
router.get('/', volController.listerVols);        // Liste tous les vols en base
router.post('/', volController.creerVol);         // Crée un vol en base
router.get('/:id', volController.getById);    // Détail d’un vol
router.put('/:id', volController.modifierVol);    // Modifier un vol
router.delete('/:id', volController.supprimerVol);// Supprimer un vol
router.get('/numero/:numeroVol', volController.getByNumeroVol);

module.exports = router;
