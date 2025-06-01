const facebookService = require('../services/facebook.service');
const instagramService = require('../services/instagram.service');
const publicationService = require('../services/publication.service');


const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_API_CALLS_PER_INTERVAL = 30;
const DELAY_BETWEEN_CALLS_MS = 1000; // 1 seconde entre chaque appel (pour éviter le burst)

let apiCallCount = 0;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const updateNbrLikes = async () => {
  try {
    const facebookPublications = await publicationService.getPagePublications('facebook');
    const instagramPublications = await publicationService.getPagePublications('instagram');
    const publications = [...facebookPublications, ...instagramPublications];

    apiCallCount = 0;

    for (const pub of publications) {
      if (apiCallCount >= MAX_API_CALLS_PER_INTERVAL) {
        console.log(`🚧 Limite de ${MAX_API_CALLS_PER_INTERVAL} appels atteinte. Pause jusqu'au prochain intervalle.`);
        break; // sortir de la boucle pour ce cycle
      }

      let likes = null;

      try {
        if (pub.plateforme === 'facebook' && pub.id_post_facebook) {
          likes = await facebookService.recupererLikesFacebook(pub.id_post_facebook);
        } else if (pub.plateforme === 'instagram' && pub.id_post_instagram) {
          likes = await instagramService.recupererLikesInstagram(pub.id_post_instagram);
        } else {
          continue;
        }

        if (likes !== null) {
         await publicationService.updateNbrLikes(pub.id, likes);
          console.log(`👍 Likes mis à jour pour ${pub.plateforme} (${pub.id}) : ${likes}`);
        }

        apiCallCount++;
        await wait(DELAY_BETWEEN_CALLS_MS);

      } catch (error) {
        console.error(`❌ Erreur pour ${pub.plateforme} (${pub.id}) : ${error.message || error}`);
      }
    }
  } catch (err) {
    console.error('[ERREUR] Mise à jour des likes :', err.message || err);
  }
};

// Lancer au démarrage et toutes les 3 minutes
updateNbrLikes();
setInterval(updateNbrLikes, INTERVAL_MS);
