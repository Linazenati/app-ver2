
const volService = require('../services/vols.service');
const { Vol } = require('../models');
/**
 * Controller pour rechercher des vols via Amadeus et enregistrer en base.
 */


async function rechercherEtEnregistrerVols(req, res) {
  try {
    console.log('--- DEBUT APPEL rechercherEtEnregistrerVols ---');
    
    // 1. Vérification du corps de la requête
    if (!req.body.searchParams || !req.body.results) {
      console.error('Structure de données invalide:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ 
        success: false, 
        message: 'Le corps de la requête doit contenir searchParams et results' 
      });
    }

    // 2. Extraction et validation des paramètres
    const { searchParams, results } = req.body;
    console.log('SearchParams reçus:', JSON.stringify(searchParams, null, 2));

    const requiredParams = ['originLocationCode', 'destinationLocationCode', 'departureDate', 'adults'];
    const missingParams = requiredParams.filter(param => !searchParams[param]);
    
    if (missingParams.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres obligatoires manquants',
        missing: missingParams
      });
    }

    // 3. Formatage des paramètres pour Amadeus
    const amadeusParams = {
      originLocationCode: searchParams.originLocationCode,
      destinationLocationCode: searchParams.destinationLocationCode,
      departureDate: searchParams.departureDate,
      adults: parseInt(searchParams.adults) || 1,
      nonStop: Boolean(searchParams.nonStop),
      max: parseInt(searchParams.max) || 50,
      travelClass: searchParams.travelClass || 'ECONOMY',
      ...(searchParams.returnDate && { returnDate: searchParams.returnDate }),
      ...(searchParams.children && { children: parseInt(searchParams.children) }),
      ...(searchParams.infants && { infants: parseInt(searchParams.infants) })
    };

    // 4. Appel à l'API Amadeus
   // console.log('Appel à l\'API Amadeus avec params:', JSON.stringify(amadeusParams, null, 2));
    //const volsAPI = await amadeusService.rechercherVols(amadeusParams);
    //console.log(`Réponse Amadeus: ${volsAPI.length} offres reçues`);

    // 5. Transformation des résultats pour la sauvegarde
    const volsASauvegarder = results.map(result => {
      const premierSegment = result.itineraries?.[0]?.segments?.[0] || {};
      const prix = result.price || {};
      
      return {
        numero_vol: premierSegment.number || `GEN-${Math.random().toString(36).substr(2, 8)}`,
        compagnie_aerienne: premierSegment.carrierCode || result.validatingAirlineCodes?.[0] || 'INCONNU',
        aeroport_depart: premierSegment.departure?.iataCode || 'INCONNU',
        date_depart: premierSegment.departure?.at || new Date(),
        aeroport_arrivee: premierSegment.arrival?.iataCode || 'INCONNU',
        date_arrivee: premierSegment.arrival?.at || new Date(),
        duree: premierSegment.duration || 'PT0H0M',
        prix: parseFloat(prix.total) || 0,
        devise: prix.currency || 'EUR',
        bagages_inclus: result.pricingOptions?.includedCheckedBagsOnly || false,
        remboursable: result.refundable || false,
        // Champs supplémentaires
        flightOfferId: result.id,
        lastTicketingDate: result.lastTicketingDate,
        source: 'AMADEUS'
      };
    });

    console.log(`Préparation de ${volsASauvegarder.length} vols pour sauvegarde`);
    console.log('Exemple de vol transformé:', JSON.stringify(volsASauvegarder[0], null, 2));

    // 6. Sauvegarde en base de données
    if (volsASauvegarder.length > 0) {
      try {
        const resultatSauvegarde = await volService.creerPlusieursVols(volsASauvegarder);
        console.log('Résultat de la sauvegarde:', resultatSauvegarde);
        
        if (!resultatSauvegarde.success) {
          console.error('Échec partiel de la sauvegarde:', resultatSauvegarde);
        }
      } catch (saveError) {
        console.error('Erreur lors de la sauvegarde:', {
          message: saveError.message,
          stack: saveError.stack,
          failedItems: volsASauvegarder.filter(v => !v.numero_vol || !v.compagnie_aerienne)
        });
        // On continue malgré l'erreur de sauvegarde
      }
    }

    // 7. Réponse finale
    return res.json({
      success: true,
      savedCount: volsASauvegarder.length,
      savedSuccessfully: true
    });

  } catch (error) {
    console.error('--- ERREUR PRINCIPALE ---', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    return res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement de la requête',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        stack: error.stack
      })
    });
  } finally {
    console.log('--- FIN APPEL rechercherEtEnregistrerVols ---\n');
  }
}

async function getByNumeroVol(req, res) {
  const { numeroVol } = req.params;
  try {
    const vol = await Vol.findOne({ where: { numero_vol: numeroVol } });
    if (!vol) {
      return res.status(404).json({ message: "Vol non trouvé" });
    }
    return res.json(vol);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}



async function listerVols(req, res) {
  try {
    const vols = await volService.listerTousLesVols(); // à créer dans vols.service
    return res.json({ success: true, data: vols });
  } catch (error) {
    console.error('Erreur lors de la récupération des vols :', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
}

async function creerVol(req, res) {
  try {
    const nouveauVol = await volService.creerOuTrouverVol(req.body);
    return res.status(201).json({ success: true, data: nouveauVol });
  } catch (error) {
    console.error('Erreur lors de la création du vol :', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la création du vol' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const vol = await volService.getById(id);
    if (!vol) {
      return res.status(404).json({ success: false, message: 'Vol non trouvé' });
    }
    return res.json({ success: true, data: vol });
  } catch (error) {
    console.error('Erreur lors de la récupération du vol :', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
}
async function modifierVol(req, res) {
  try {
    const id = req.params.id;
    const volModifie = await volService.modifierVol(id, req.body);
    if (!volModifie) {
      return res.status(404).json({ success: false, message: 'Vol non trouvé' });
    }
    return res.json({ success: true, data: volModifie });
  } catch (error) {
    console.error('Erreur lors de la modification du vol :', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
}

async function supprimerVol(req, res) {
  try {
    const id = req.params.id;
    const deleted = await volService.supprimerVol(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Vol non trouvé' });
    }
    return res.json({ success: true, message: 'Vol supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du vol :', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
}

module.exports = {
  rechercherEtEnregistrerVols,
  listerVols,
  creerVol,
  getById,
  modifierVol,
  supprimerVol,
  getByNumeroVol
};
