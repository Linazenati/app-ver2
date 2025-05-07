import React from "react";
import "../../assets/css/bo/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Ziguade Tour. Tous droits réservés.</p>
        <p>
          Créé avec ❤️ pour les passionnés de voyage.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
