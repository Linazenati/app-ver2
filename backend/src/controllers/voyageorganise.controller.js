const voyageService = require("../services/voyageorganise.service");
const { Voyage } = require('../models');
const publicationService = require('../services/publication.service');






// ✅ Créer un voyage
const create = async (req, res) => {

  try {
    
    const { titre, prix, date_de_depart,date_de_retour ,description , statut  } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];
console.log("BODY:", req.body);
console.log("FILES:", req.files);
    const voyage = await Voyage.create({
      titre,
      prix,
      date_de_depart,
      date_de_retour,
      description,
      image: JSON.stringify(images), // tu peux aussi stocker dans un autre champ comme `images`
      id_agent :20,
      statut,
       
    });

    res.status(201).json(voyage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ Récupérer tous les voyages (avec recherche, pagination, tri)
const getAll = async (req, res) => {
  try {
    // Récupère les paramètres de query dans l'URL (facultatifs)
    const { search, limit, offset, orderBy, orderDir } = req.query;

    const voyages = await voyageService.getAllVoyages({
      search,
      limit,
      offset,
      orderBy,
      orderDir
    });

    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Récupérer un seul voyage par ID
const getById = async (req, res) => {
  try {
      const voyage = await voyageService.getVoyageById(req.params.id);
      
    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }
    res.status(200).json(voyage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// ✅ Mettre à jour un voyage
const update = async (req, res) => {
  try {
    const updatedVoyage = await voyageService.updateVoyage(req.params.id, req.body);
    res.status(200).json(updatedVoyage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// ✅ Supprimer un voyage
const deletee= async (req, res) => {
  try {
    await voyageService.deleteVoyage(req.params.id);
    res.status(200).json({ message: "Voyage supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// ✅ publier  un voyage sur fb
const publishToSite = async (req, res,silent = false) => {
  try {
    const voyageId = req.params.id;
    const voyage = await voyageService.getVoyageById(voyageId);

    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }

  //insérer dans la table publication
    await publicationService.publier({
      plateforme: 'site',
      id_voyage: voyageId,
    });
    
    // Modifier voyage vers `est_Publie: true`)
    const updatedVoyage = await voyageService.updateVoyage(voyageId, { est_publier: true });
    await voyageService.updateVoyage(voyageId,  "site");

    console.log("Voyage mis à jour : ", updatedVoyage);
    
  if (!silent) {
      return res.status(200).json({ message: 'Voyage publié sur le site', voyage: updatedVoyage });
    }

    // Si silent == true, ne réponds pas au client ici.
    return { message: 'Publié sur site',  voyage: updatedVoyage   };

  } catch (error) {
    if (!silent) {
      return res.status(500).json({ message: 'Erreur lors de la publication du voyage sur le site', error: error.message });
    }
    // En mode silencieux, on laisse le parent gérer l'erreur
    throw error;
  }
};

// 🔄 Export
module.exports = {
  create,
  getAll,
  getById,
  update,
    deletee,
  publishToSite,
};
