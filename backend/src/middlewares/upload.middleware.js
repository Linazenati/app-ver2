const multer = require('multer');
const path = require('path');

// Définir le stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images')); // dossier de destination
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // nom du fichier enregistré
  },
});

// Middleware d’upload
const upload = multer({ storage });

module.exports = upload;
