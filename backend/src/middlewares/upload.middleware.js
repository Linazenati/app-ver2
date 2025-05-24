const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(__dirname, '../uploads/reservations');
    console.log(`Destination des fichiers: ${destPath}`);
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    console.log(`Nom du fichier généré: ${uniqueName}`);
    cb(null, uniqueName);
  }
});

// Filtrage des fichiers (images et PDF uniquement)
const fileFilter = (req, file, cb) => {
  console.log(`Type MIME reçu: ${file.mimetype}`);
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    console.warn(`Type de fichier rejeté: ${file.mimetype}`);
    cb(new Error('Seuls les images et les PDF sont autorisés'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5 Mo
    files: 2 // Maximum de 2 fichiers par requête
  }
});

module.exports = upload;
