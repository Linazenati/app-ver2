const fs = require('fs');
const path = require('path');
const apiConfigService = require('../services/apiconfig.service');


exports.getAllConfigs = async (req, res) => {
  try {
    const configs = await apiConfigService.getAll();
  console.log("Réponse getAllConfigs : ", JSON.stringify(configs, null, 2));

    res.json(configs);
  } catch (error) {
    console.error('Erreur dans getAllConfigs :', error); // <== Log d'erreur aussi utile
    res.status(500).json({ error: error.message });
  }
};



exports.getConfigById = async (req, res) => {
  try {
    const config = await apiConfigService.getById(req.params.id);
    if (!config) {
      return res.status(404).json({ error: 'Configuration non trouvée' });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createConfig = async (req, res) => {
  try {
    // Pour la création, on va simplement créer un nouveau fichier de config
    const newConfig = await apiConfigService.update(req.params.id, req.body);
    res.status(201).json(newConfig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const updatedConfig = await apiConfigService.update(req.params.id, req.body);
    if (!updatedConfig) {
      return res.status(404).json({ error: 'Configuration non trouvée' });
    }
    res.json(updatedConfig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updatedConfig = await apiConfigService.updateStatus(
      req.params.id,
      req.body.active
    );
    if (!updatedConfig) {
      return res.status(404).json({ error: 'Configuration non trouvée' });
    }
    res.json(updatedConfig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteConfig = async (req, res) => {
  try {
    const configPath = path.join(__dirname, '../config', `${req.params.id}.config.js`);
    
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
      res.json({ message: 'Configuration supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Configuration non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testConnection = async (req, res) => {
  try {
    const result = await apiConfigService.testConnection(req.params.id);
    if (result.success) {
      res.json({ success: true, message: 'Connexion réussie' });
    } else {
      res.status(400).json({ 
        success: false, 
        message: result.message || 'Échec de la connexion' 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};