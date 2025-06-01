const visaService = require('../services/visa.service');

async function createVisa(req, res) {
  try {
    // Parsing de participants (envoyé sous forme de chaîne JSON)
    const parsedBody = { ...req.body };
    const userId = req.user?.id;

if (!userId) {
  return res.status(401).json({ error: 'Utilisateur non authentifié' });
}

    parsedBody.utilisateurInscritId = userId;
    

    parsedBody.participants = JSON.parse(req.body.participants);

    // Associer les fichiers aux participants (même ordre)
    if (req.files && req.files.length > 0) {
      let fileIndex = 0;

      for (const participant of parsedBody.participants) {
        const justificatifsCount = parseInt(participant.nbJustificatifs || 1); // tu peux adapter
        participant.justificatifs = [];

        for (let i = 0; i < justificatifsCount && fileIndex < req.files.length; i++) {
          const file = req.files[fileIndex];
          participant.justificatifs.push({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
          });
          fileIndex++;
        }
      }
    }

    // Appel du service avec les participants enrichis
    const visa = await visaService.createVisaWithParticipants(parsedBody);

    res.status(201).json({ message: 'Visa créé avec succès', visa });
  } catch (error) {
    console.error('Erreur dans createVisa:', error);
    res.status(400).json({ error: error.message || 'Erreur lors de la création du visa' });
  }
}
const getAllVisas = async (req, res) => {
  try {
    const {
      search,
      limit = 5,
      offset = 0,
      orderBy = 'createdAt',
      orderDir = 'ASC',
      pays,
      typeVisa
    } = req.query;

    const result = await visaService.getAllVisas({
      search,
      limit: parseInt(limit),
      offset: parseInt(offset),
      orderBy,
      orderDir,
      pays,
      typeVisa
    });

    res.json({
      success: true,
      total: result.total,
      data: result.data
    });

  } catch (error) {
    console.error('Erreur contrôleur:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};


const getParticipantsByVisaId = async (req, res) => {
  try {
    const { visaId } = req.params;
    const participants = await visaService.getParticipantsByVisaId(visaId);
    res.status(200).json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des participants" });
  }
};

const getJustificatifsByParticipantId = async (req, res) => {
  try {
    const { participantId } = req.params;
    const justificatifs = await visaService.getJustificatifsByParticipantId(participantId);
    res.status(200).json(justificatifs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des justificatifs" });
  }
};
module.exports = {
  createVisa,getJustificatifsByParticipantId,getParticipantsByVisaId,getAllVisas
};
