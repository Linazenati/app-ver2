import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // JS + Popper.js de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/fo/css/style.min.css";
import "../../assets/css/bo/footer.css";

import Sidebar from "../../components/bo/Sidebar";
import Footer from "../../components/bo/Footer";
import Topbar from "../../components/bo/Topbar";

import { Routes, Route } from "react-router-dom";

// Pages backoffice
import Agent from "./FormAgent";
import Utilisateurs from "./ListeUtilisateurs";
import Creer_omra from "./creer-omra";
import Liste_omra from "./liste_omra";
import Creer_voyage from "./creer-voyage";
import Liste_publication from "./list_publication";
import Liste_reservation from "./liste-reservation";
import Liste_paiement from "./liste-paiement";
import List_voyages from "./list-voyages";
import Liste_assurance from "./liste-assurance";

const Index = () => {
  return (
    <>
      <Topbar />
      <Sidebar />

      <div className="bo-main-content">
        <Routes>
          <Route path="/agent" element={<Agent />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/creer-omra" element={<Creer_omra />} />
          <Route path="/liste_omra" element={<Liste_omra />} />
          <Route path="/creer-voyage" element={<Creer_voyage />} />
          <Route path="/liste-publication" element={<Liste_publication />} />
          <Route path="/liste-reservation" element={<Liste_reservation />} />
          <Route path="/liste-paiement" element={<Liste_paiement />} />
          <Route path="/liste-voyages" element={<List_voyages />} />
                    <Route path="/liste-assurance" element={<Liste_assurance />} />


        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default Index;
