const express = require('express');
const cors = require('cors');
const path = require('path');

module.exports = (app) => {
    app.use(express.json());

    // Configuration CORS avec des options spécifiques
    const corsOptions = {
        origin: 'http://localhost:5173', // Remplace par l'origine de ton frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    };

    app.use(cors(corsOptions));

    // Gestion des requêtes OPTIONS pour toutes les routes
    app.options('*', cors(corsOptions));

    app.use((req, res, next) => {
        console.log("REQ : " + req.url);
        next();
    });

    app.use('/public', express.static(path.join(__dirname, 'public')));
};
