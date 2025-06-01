import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/LogoZiguade.jpg"; // 🔥 Import du logo
import "../../assets/css/bo/sidebar.css";

function Sidebar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
    setActiveSubDropdown(null); // Reset sub-dropdown when clicking on a different item
  };

  const toggleSubDropdown = (index) => {
    setActiveSubDropdown(activeSubDropdown === index ? null : index);
  };

  const dropdowns = [
    {
      title: "Voyages Organisés",
      icon: "fas fa-plane",
      links: [
        { to: "/admin/creer-voyage", label: "Créer un voyage", icon: "fas fa-plus-circle" },
        { to: "/admin/liste-voyages", label: "Liste des voyages organisés", icon: "fas fa-list" },
      ],
    },
    {
      title: "Omra",
      icon: "fas fa-kaaba",
      links: [
        { to: "/admin/creer-omra", label: "Créer Omra", icon: "fas fa-plus-square" },
        { to: "/admin/Liste_omra", label: "Liste des Omra", icon: "fas fa-list-alt" },
      ],
    },
    
  

    {
      title: "Réservations",
      icon: "fas fa-ticket-alt",
      links: [
        
        { to: "/admin/Liste-reservation", label: "Liste des réservations ", icon: "fas fa-calendar-alt" },
      ],
    },
    {
      title: "Visa",
      icon: "fas fa-passport",
      links: [
        { to: "/admin/liste-visa", label: "Liste des visas", icon: "fas fa-id-card" },
      ],
    },
   {
  title: "Hotel",
  icon: "fas fa-hotel",  // Icône hôtel classique pour la section principale
  links: [
    {
      to: "/admin/liste-ville",
      label: "Liste des villes",
      icon: "fas fa-city"  // Icône ville / urbain pour liste des villes
    },
    {
      to: "/admin/ajouter-ville",
      label: "Ajouter une ville pour les hotels",
      icon: "fas fa-plus-circle"  // Icône plus pour ajouter une ville
    },
  ],
},
    {
      title: "Utilisateurs",
      icon: "fas fa-users",
      links: [
        { to: "/admin/agent", label: "Ajouter un utilisateur", icon: "fas fa-user-plus" },
        { to: "/admin/utilisateurs", label: "Liste des utilisateurs", icon: "fas fa-users" },
      ],
    },
     {
      title: "Paiements",
      icon: "fas fa-ticket-alt",
      links: [
        
        { to: "/admin/Liste-paiement", label: "Liste des paiements ", icon: "fas fa-calendar-alt" },
      ],
    },
    {
      title: "Paramètres",
      icon: "fas fa-cogs",
      links: [
        { to: "/admin/securite", label: "Sécurité & Accès", icon: "fas fa-shield-alt" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={Logo} alt="Ziguade Tour Logo" />
      </div>
      <h2 className="sidebar-title">
        <i className="fas fa-globe-africa"></i> Ziguade <span>Tour</span>
      </h2>
      <ul className="sidebar-nav">
        {dropdowns.map((item, index) => (
          <li key={index}>
            <div
              className="sidebar-item"
              onClick={() => toggleDropdown(index)}
            >
              <i className={item.icon}></i>
              {item.title}
              <i
                className={`fas fa-chevron-${activeDropdown === index ? "up" : "down"} chevron`}
              ></i>
            </div>
            {activeDropdown === index && (
              <ul className="sidebar-dropdown">
                {item.links.map((link, i) => (
                  link.links ? (
                    <li key={i}>
                      <div
                        className={`sidebar-item ${link.className}`} // Ajout de la classe spécifique pour chaque réseau social
                        onClick={() => toggleSubDropdown(i)}
                      >
                        <i className={link.icon}></i> {link.title}
                        <i
                          className={`fas fa-chevron-${activeSubDropdown === i ? "up" : "down"} chevron`}
                        ></i>
                      </div>
                      {activeSubDropdown === i && (
                        <ul className="sidebar-sub-dropdown">
                          {link.links.map((sublink, j) => (
                            <li key={j}>
                              <Link to={sublink.to} className={`dropdown-link ${link.className}`}>
                                <i className={sublink.icon}></i> {sublink.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={i}>
                      <Link to={link.to} className={`dropdown-link ${link.className}`}>
                        <i className={link.icon}></i> {link.label}
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
