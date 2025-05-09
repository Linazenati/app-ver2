// src/app.js

const express = require('express');
const app = express();

const cors = require('cors');

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


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`===========================================`);
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
      console.log(`===========================================`);
});

