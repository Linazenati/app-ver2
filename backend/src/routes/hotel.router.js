// src/routes/utilisateur.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/hotel.controller');

router.get('/', controller.find);



module.exports = router;
