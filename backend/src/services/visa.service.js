const { Visa, Participant, Justificatif,  Utilisateur_inscrit, sequelize , Utilisateur} = require('../models');
const { Op , Sequelize } = require("sequelize");

async function createVisaWithParticipants(data) {
  const {
    pays,
    typeVisa,
    personnes,
    nationalite,
    dateArrivee,
    accepteConditions,
    total,
    utilisateurInscritId,
    participants
  } = data;

  if (!accepteConditions) {
    throw new Error('Les conditions doivent être acceptées.');
  }

  const t = await sequelize.transaction();

  try {
    const visa = await Visa.create({
      pays,
      typeVisa,
      personnes,
      nationalite,
      dateArrivee,
      accepteConditions,
      total,
      utilisateurInscritId,
    }, { transaction: t });

    if (Array.isArray(participants) && participants.length > 0) {
      for (const p of participants) {
        const participant = await Participant.create({
          prenom: p.prenom,
          nom: p.nom,
          dateNaissance: p.dateNaissance,
          lieuNaissance: p.lieuNaissance,
          numeroPasseport: p.numeroPasseport,
          delivrancePasseport: p.delivrancePasseport,
          expirationPasseport: p.expirationPasseport,
          email: p.email,
          adresse: p.adresse,
          visaId: visa.id
        }, { transaction: t });

        if (Array.isArray(p.justificatifs) && p.justificatifs.length > 0) {
          for (const j of p.justificatifs) {
            await Justificatif.create({
              filename: j.filename,
              originalName: j.originalName,
              mimeType: j.mimeType,
              participantId: participant.id
            }, { transaction: t });
          }
        }
      }
    }

    await t.commit();
    return visa;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

const getAllVisas = async ({
  search = '',
  limit = 50,
  offset = 0,
  orderBy = 'createdAt',
  orderDir = 'ASC',
  pays,
  typeVisa
}) => {
  const whereClause = {};
  const includeOptions = [
    {
      model: Utilisateur_inscrit,
      as: 'utilisateurInscrit',
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['nom', 'prenom', 'email']
        }
      ]
    }
  ];

  // 🔍 Recherche globale
  if (search) {
    whereClause[Op.or] = [
      { pays: { [Op.like]: `%${search}%` } },
      { typeVisa: { [Op.like]: `%${search}%` } }
    ];
  }

  // ✅ Filtre par pays
  if (pays) {
    whereClause.pays = { [Op.like]: `%${pays}%` };
  }

  // ✅ Filtre par type de visa
  if (typeVisa) {
    whereClause.typeVisa = { [Op.like]: `%${typeVisa}%` };
  }

  // 🚀 Exécution de la requête
  const result = await Visa.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
    distinct: true
  });

  return {
    data: result.rows,
    total: result.count
  };
};





const getParticipantsByVisaId = async (visaId) => {
  return await Participant.findAll({
    where: { visaId }
  });
};


const getJustificatifsByParticipantId = async (participantId) => {
  return await Justificatif.findAll({
    where: { participantId }
  });
};


module.exports = {
  createVisaWithParticipants,getJustificatifsByParticipantId,getAllVisas,getParticipantsByVisaId
};
