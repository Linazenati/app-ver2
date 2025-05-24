const fs = require("fs");
const path = require("path");
const FACTURES_DIR = path.join(__dirname, "../factures");

exports.getUserFactures = async (req, res) => {
  try {
    const idUser = req.user?.id;
    if (!idUser) {
      return res.status(401).json({ success: false, message: "Utilisateur non authentifié." });
    }

    if (!fs.existsSync(FACTURES_DIR)) {
      fs.mkdirSync(FACTURES_DIR, { recursive: true });
      return res.json([]);
    }

    const files = fs.readdirSync(FACTURES_DIR);
    const pdfFiles = files.filter(file => file.endsWith(".pdf"));

    const factures = pdfFiles
      .filter(file => {
        const match = file.match(/^facture-(\d+)-(\d+)\.pdf$/);
        return match && parseInt(match[1]) === idUser;
      })
      .map(file => {
        const match = file.match(/^facture-(\d+)-(\d+)\.pdf$/);
        const numero = match ? match[2] : '0001';
        const filePath = path.join(FACTURES_DIR, file);
        let date = new Date().toISOString().split('T')[0];

        try {
          const stats = fs.statSync(filePath);
          date = stats.birthtime.toISOString().split('T')[0];
        } catch (_) {}

        return {
          id: file.replace('.pdf', ''),
          idUser,
          filename: file,
          numero,
          date,
          url: `/api/factures/download/${file}`
        };
      });

    return res.json(factures);
  } catch (error) {
    console.error('[FactureController] Erreur:', error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

exports.downloadFacture = async (req, res) => {
  try {
    const filename = req.params.filename;
    const idUser = req.user?.id;

    if (!filename.endsWith(".pdf")) {
      return res.status(403).json({ success: false, message: "Type de fichier non autorisé" });
    }

    const filePath = path.join(FACTURES_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Facture introuvable" });
    }

    // Vérifie que l'utilisateur est autorisé à télécharger cette facture
    const match = filename.match(/^facture-(\d+)-(\d+)\.pdf$/);
    if (!match || parseInt(match[1]) !== idUser) {
      return res.status(403).json({ success: false, message: "Accès non autorisé à cette facture" });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('[FactureController] Erreur:', error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
