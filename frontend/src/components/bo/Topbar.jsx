import React from "react";
import "../../assets/css/bo/topbar.css"

function Topbar() {
  return (
    <div className="topbar">
      <div className="left-side">
        <span className="slogan">Explorez le monde avec <strong>  Ziguade Tour</strong> 🌍</span>
      </div>
      <div className="right-side">
        <i className="fas fa-phone-alt contact-icon"></i>
        <span className="contact-text">+221 33 123 45 67</span>
        <i className="fas fa-envelope email-icon"></i>
        <span className="contact-text">contact@ziguadetour.com</span>
      </div>
    </div>
  );
}

export default Topbar;
