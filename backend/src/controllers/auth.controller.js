const utilisateurService = require("../services/utilisateur.service")
const { getCurrentUser } = require('../services/utilisateur.service');
module.exports.login = async (req, res) => {
  try {
    const response = await utilisateurService.login(req.body);
    if (!response) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error(error);  // Log l'erreur pour mieux la diagnostiquer
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.logout = async (req, res) => {
  try {
    res.status(201).json("OK - Logout");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.register = async (req, res) => {
  try {
    const response = await utilisateurService.register( req.body );

    res.status(201).json({ success: true, data: response });
    console.log("BODY reçu :", req.body);

  } catch (error) {
    res.status(500).json({ success:false, message: error.message });
  }
};

module.exports.currentUser = async (req, res) => {
  try {
    console.log("📥 Requête reçue pour /me");
    console.log("👤 Données utilisateur extraites du token:", req.user);

    const userId = req.user.id;
    const utilisateur = await getCurrentUser(userId);

    console.log("📤 Utilisateur trouvé:", utilisateur);
    res.status(200).json(utilisateur);
  } catch (error) {
    console.log("❌ Erreur dans currentUser:", error.message);
    res.status(500).json({ message: error.message });
  }
};