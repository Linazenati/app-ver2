const express = require('express');
const router = express.Router();
const apiConfigController = require('../controllers/apiconfig.controller');

router.get('/', apiConfigController.getAllConfigs);
router.get('/:id', apiConfigController.getConfigById);
router.post('/', apiConfigController.createConfig);
router.put('/:id', apiConfigController.updateConfig);
router.delete('/:id', apiConfigController.deleteConfig);
router.put('/:id/status', apiConfigController.updateStatus);
router.post('/:id/test', apiConfigController.testConnection);

module.exports = router;
