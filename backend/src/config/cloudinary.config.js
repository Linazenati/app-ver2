// cloudinary.config.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'daz2lntzd',   // mets directement ton cloud name ici
  api_key: '763736456298992',           // mets directement ton API key ici
  api_secret: 'w7JFsp4sRIwdb06KYYSXtm95O7s',    // mets directement ton API secret ici
});

module.exports = cloudinary;
