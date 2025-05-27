// routes/assuranceRoutes.js
const express = require('express');
const router = express.Router();
const assuranceController = require('../controllers/assurance.controller');
const multer = require('multer');
const upload = multer();

router.get('/', assuranceController.getAll);
router.get('/:id', assuranceController.getById);
router.post('/', upload.single('passeport'), assuranceController.create);
router.put('/:id', assuranceController.update);
router.delete('/:id', assuranceController.remove);

module.exports = router;
