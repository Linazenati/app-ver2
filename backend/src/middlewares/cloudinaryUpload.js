const cloudinary = require('../config/cloudinary.config');
const path = require('path');


async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'mes_images',
      width: 1080,  // Largeur pour un format portrait
      height: 1080, // Hauteur pour un format portrait
      crop: 'limit',     // ajuste l’image dans le cadre sans la couper
    }) // optionnel, ajoute un fond blanc si ratio différent     });
    return result.secure_url;  // L'URL publique de la photo
  } catch (error) {
    console.error('Erreur upload Cloudinary :', error);
    throw error;
  }
}

module.exports = uploadImage;
