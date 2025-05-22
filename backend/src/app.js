require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Autoriser CORS
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
