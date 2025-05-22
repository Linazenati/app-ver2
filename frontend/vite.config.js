import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permet l'accès depuis l'extérieur
    port: 5173, // Ton port Vite
    allowedHosts: ['.ngrok-free.app', 'localhost'], // Autorise les sous-domaines ngrok
  },
    base: './', // <- Ajoute cette ligne pour les chemins relatifs
})
