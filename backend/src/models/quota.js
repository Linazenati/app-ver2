module.exports = (sequelize, DataTypes) => {
  const Quota = sequelize.define('Quota', {
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      primaryKey: true,
    },
    minute_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
   },
    heure_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
       allowNull: true,
    },
    jour_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
         allowNull: true,
    },
    last_minute_reset: {
  type: DataTypes.DATE,
  allowNull: true,
},
last_heure_reset: {
  type: DataTypes.DATE,
  allowNull: true,
},

      // Suppression 
    supp_minute_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    supp_heure_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    supp_jour_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    supp_last_minute_reset: {
  type: DataTypes.DATE,
  allowNull: true,
},
supp_last_heure_reset: {
  type: DataTypes.DATE,
  allowNull: true,
},

    //likes
   
    like_minute_utilisee: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},
like_heure_utilisee: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},
like_jour_utilisee: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
    },

    // Pour les dates de reset (si différentes des autres)
last_like_minute_reset: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW,
},
last_like_heure_reset: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW,
},

// ========================
    // Champs pour la publication
    // ========================
    publication_minute_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    publication_heure_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    publication_jour_utilisee: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },

    last_publication_minute_reset: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_publication_heure_reset: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    derniere_minute: {
  type: DataTypes.DATE,
  allowNull: true,
},

  });

  return Quota;
};
