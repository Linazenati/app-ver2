const voyageService = require("../services/voyageorganise.service");
const { Voyage } = require('../models');
const publicationService = require('../services/publication.service');






// ✅ Créer un voyage
const create = async (req, res) => {

  try {
    
    let { titre, prix, date_de_depart,date_de_retour ,description , statut , programme, excursions} = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];
       // 1) JSON.parse() pour transformer chaque chaîne en objet JS
    programme  = programme  ? JSON.parse(programme)  : [];
    excursions = excursions ? JSON.parse(excursions) : [];

    console.log("Fichiers reçus :", images);
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
      programme ,
      excursions ,
    
       
    });      console.log(voyage.image)


    res.status(201).json(voyage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ Récupérer tous les voyages (avec recherche, pagination, tri)
const getAll = async (req, res) => {
  try {
    const {
      search,
      limit = 50,
      offset = 0,
      orderBy = 'createdAt',
      orderDir = 'ASC',
      plateforme,
      est_publier,
      annee_de_depart,
      mois_de_depart
    } = req.query;

    // 🛡️ Validation plateforme/est_publier
    if (plateforme && est_publier !== 'true') {
      return res.status(400).json({
        success: false,
        message: "Le filtre plateforme nécessite est_publier=true"
      });
    }

    const result = await voyageService.getAllVoyages({
      search,
      limit,
      offset,
      orderBy,
      orderDir,
      plateforme,
      est_publier,
      annee_de_depart,
      mois_de_depart
    });

    // 🧹 Nettoyage des données si est_publier=false
    const cleanedData = est_publier === 'true' 
      ? result.data 
      : result.data.map(v => {
          const { publications, ...rest } = v.get({ plain: true });
          return rest;
        });

    res.json({
      success: true,
      total: result.total,
      data: cleanedData
    });

  } catch (error) {
    console.error('Erreur contrôleur:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
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
        console.log("ID reçu pour update :", req.params.id); // AJOUTE CECI
  try {
    const updatedVoyage = await voyageService.updateVoyage(req.params.id, req.body);
    res.status(200).json(updatedVoyage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// ✅ Supprimer un voyage
const remove = async (req, res) => {
    console.log("ID reçu pour delete :", req.params.id); // AJOUTE CECI
  try {
    await voyageService.deleteVoyage(req.params.id);
    res.status(200).json({ message: "Voyage supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// ✅ publier  un voyage sur fb
const publishToSite = async (voyageId) => {
  try {
    const voyage = await voyageService.getVoyageById(voyageId);

    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }

    // 2. Vérifier si publication Facebook existe déjà
    const publicationExistante = await publicationService.getByPlatformAndVoyage('site', voyageId);
    if (publicationExistante) {
      return res.status(400).json({ message: 'Ce voyage a déjà été publié sur site.' });
    }  

  //insérer dans la table publication
    await publicationService.publier({
      plateforme: 'site',
      id_voyage: voyageId,
    }); 
    


    // Modifier voyage vers `est_Publie: true`)
    const updatedVoyage = await voyageService.updateVoyage(voyageId, { est_publier: true });
    console.log("Voyage mis à jour : ", updatedVoyage);
        console.log("✅ Voyage marqué comme publié sur site:", updatedVoyage);

    return ({ message: 'Voyage publié sur le site', voyage: updatedVoyage });

  } catch (error) {
    console.error("Erreur publication site :", error.message);
    return ({ message: 'Erreur lors de la publication du voyage sur le site', error: error.message });
  }

};




//publier Sur site seulement sans multiple
const publierSurSiteSeule = async (req, res) => {
  const voyageId = req.params.id;
  try {
    const result = await publishToSite(voyageId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//recupérer les voyages publier sur sites
const getVoyagesPubliesSurSite = async (req, res) => {
  try {
    const publications = await publicationService.getAll({
      plateforme: "site",
    });

    const idsVoyages = publications.map(pub => pub.id_voyage);

    const voyages = await Voyage.findAll({
      where: {
        id: idsVoyages,
        est_publier: true,
        
      }
      
    });
    // Ajout du chemin complet pour chaque image
const voyagesAvecImages = voyages.map(voyage => {
  const images = JSON.parse(voyage.image || '[]');
  return {
    ...voyage.get({ plain: true }),
    images: images.map(img => `http://localhost:3000/images/${img}`)
  };
});

    res.status(200).json(voyagesAvecImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getDetailsVoyages = async (req, res) => {
  try {
    const voyageId = req.params.id;
    const result = await voyageService.getVoyageAvecCommentairesSelectionnes(voyageId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Export
module.exports = {
  create,
  getAll,
  getById,
  update,
    remove,
  publishToSite,
  publierSurSiteSeule,
  getVoyagesPubliesSurSite,
  getDetailsVoyages
};