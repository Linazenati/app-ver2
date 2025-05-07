// src/app.js

const express = require('express');
const app = express();

const cors = require('cors');

require("./middlewares")(app);
require("./routes")(app);
require('dotenv').config();





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

