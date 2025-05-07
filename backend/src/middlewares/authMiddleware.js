// src/middlewares/authMiddleware.js
 
// a chaque  fois le client se connecte , le backend il envoie ce token Jwt (ces info encodée)=> ce token est  signé par la clé secret JWT que le serveur qui l connait
//Le token est stocké	localStorage / cookie
// ce token c une preuve d'identité , t l'envoye dans chaque requete fetch => headers: {Authorization: `Bearer ${token}`}

const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../config/jwt.config");

const authenticateToken = (req, res, next) => {
  // il verifie test  ce que il existe le champ autorization dans la requete /token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  //y'a  pas de token
  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  // y'a le token , il va le décoder ( token , la  clé  )  ==> extraire les vrais informations de la requete  user{}
  jwt.verify(token, SECRET_KEY, (err, user) => {
   
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }

    // le bon token fourni
    req.user = user; // on stock les informations extraire  a l'interieure de req.user pour  qu’elles soient accessibles dans les prochaines étapes du traitement de la requête (middlewares ou contrôleurs)."
    next(); // On passe au middleware suivant ou au contrôleur
  });
};

module.exports = authenticateToken;
