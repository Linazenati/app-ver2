import { useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Inclut à la fois le JS et Popper.js
import { Routes, Route } from "react-router-dom";

import { UserProvider } from '../../contexts/UserContext';

import GotoTop from "../../components/fo/GotoTop";
import Topbar from "../../components/fo/Topbar"
import Navbar from "../../components/fo/Navbar"
import Footer from"../../components/fo/Footer"

import Home from "./Home";
import Hotels from "./Hotels"
import Vols from "./Vols";
import Visadetudes from "./Visadetudes";
import VisaTouristique from "./VisaTouristique";
import Omra from "./Omra";
import Infos_omra1 from "./Infos_omra1"
import VoyageOrganisés from "./VoyagesOrganisés"
import Assurance from"./Assurance"
import Connexion from "./Connexion"
import Inscription from "./Inscription"
import "../../assets/fo/css/style.min.css"



const Index = () => {
  useEffect(() => {
    const scripts = [
      "https://code.jquery.com/jquery-3.4.1.min.js",
      "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js",
      "/fo/lib/easing/easing.min.js",
      "/fo/lib/owlcarousel/owl.carousel.min.js",
      "/fo/lib/tempusdominus/js/moment.min.js",
      "/fo/lib/tempusdominus/js/moment-timezone.min.js",
      "/fo/lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js",
      "/fo/mail/jqBootstrapValidation.min.js",
      "/fo/mail/contact.js",
      "/fo/js/main.js",
      
    ];

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      

    // Charger les scripts en séquence pour éviter les erreurs
    (async () => {
      try {
        for (const script of scripts) {
          await loadScript(script);
        }
        console.log("Tous les scripts sont chargés !");
      } catch (error) {
        console.error("Erreur lors du chargement des scripts :", error);
      }
    })();

    return () => {
      // Nettoyage des scripts au démontage du composant
      scripts.forEach((src) => {
        const scriptElement = document.querySelector(`script[src="${src}"]`);
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
      });
    };
  }, []);

  

  return (
    <UserProvider>
      <Topbar />
      <Navbar />

      <GotoTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/vols" element={<Vols />} />
       <Route path="/visaDetudes" element={<Visadetudes />} />
        <Route path="/visaTouristique" element={<VisaTouristique />} />
        <Route path="/omra" element={<Omra />} />
        <Route path="/Infos_omra1" element={<Infos_omra1 />} />
        <Route path="/voyagesOrganisés" element={<VoyageOrganisés />} />
        <Route path="/assurance" element={<Assurance />} />
        <Route path="/inscription" element={<Inscription />} />

        <Route path="/connexion" element={<Connexion />} />
      </Routes>

      <Footer />
    </UserProvider>
  )
}

export default Index