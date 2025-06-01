const express = require('express');
const router = express.Router();
const visaController = require('../controllers/visa.controller');
const upload = require('../middlewares/upload.middleware');
const authenticateToken = require('../middlewares/authMiddleware'); // ← import du middleware

// POST /api/visas
router.post('/', upload.array('justificatifs'),authenticateToken,visaController.createVisa);


router.get('/', visaController.getAllVisas);


router.get('/visas/:visaId/participants', visaController.getParticipantsByVisaId);


router.get('/participants/:participantId/justificatifs', visaController.getJustificatifsByParticipantId);
module.exports = router;
