const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
    }

    next(); // l'utilisateur a le bon rôle, on continue
  };
};

module.exports = authorizeRoles;

