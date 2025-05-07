const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publication.controller');


router.post('/:id/publier-multi', publicationController.publierMulti);

router.get('/', publicationController.getAll);
router.get('/:id', publicationController.getById);

module.exports = router;
