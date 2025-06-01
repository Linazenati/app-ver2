const facebookService = require('../services/facebook.service');
const instagramService = require('../services/instagram.service');
const publicationService = require('../services/publication.service');

const INTERVAL_MS = 15 * 60 * 1000; // 3 minutes

const updateNbrLikes = async () => {
  try {
    const publications = await publicationService.getAll(); // récupère toutes les publications

    for (const pub of publications) {
      let likes = 0;

      if (pub.plateforme === 'facebook') {
        likes = await facebookService.recupererLikesFacebook(pub.id_post_facebook);
      } else if (pub.plateforme === 'instagram') {
        likes = await instagramService.recupererLikesInstagram(pub.id_post_instagram);
      }
    if (likes !== null) {
  await publicationService.updateNbrLikes(pub.id, likes);
  console.log(`👍 Likes mis à jour pour ${pub.plateforme} : ${likes}`);
   }

    }
  } catch (err) {
    console.error('[ERREUR] Mise à jour des likes :', err.message);
  }
};

// Lancer au démarrage et toutes les 3 minutes
updateNbrLikes();
setInterval(updateNbrLikes, INTERVAL_MS);
