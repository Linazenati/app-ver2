require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

<<<<<<< HEAD
// Autoriser CORS
=======
require("./middlewares")(app);
require("./routes")(app);
require('dotenv').config();


const VERIFY_TOKEN = "1234"; 
// choisis un token personnalisé

// Vérification du webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook vérifié !");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Échec de vérification du webhook");
    res.sendStatus(403);
  }
});


>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
app.use(cors());

// ⬇️ ⚠️ Insérer la route webhook Stripe AVANT tout body-parser
const stripeRawBody = require('./middlewares/stripeRawBody');
const webhookController1 = require('./controllers/webhookstripe.controller');

app.post('/api/v1/webhook1/stripe', stripeRawBody, webhookController1.handleStripeWebhook);

// ⬇️ Ensuite seulement : body parser pour les autres routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ⬇️ Middleware perso
require("./middlewares")(app);

// ⬇️ Routeurs normaux (hors webhook Stripe)
require("./routes")(app);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`===========================================`);
});
