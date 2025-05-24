import React, { useState, useEffect } from 'react';

const ReservationConditions = () => {
  const [acceptedConditions, setAcceptedConditions] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAcceptConditions = () => {
    setAcceptedConditions(!acceptedConditions);
  };

  const toggleConditions = () => {
    setShowConditions(!showConditions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (acceptedConditions) {
      window.location.href = '/web/Reservation'; // 🔁 redirection
    }
  };

  // Styles JSX
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      transform: isScrolled ? 'scale(0.98)' : 'scale(1)'
    },
    title: {
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '1.8rem',
      fontWeight: '600'
    },
    toggleButton: {
      backgroundColor: '#003366',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      marginBottom: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%'
    },
    toggleButtonHover: {
      backgroundColor: '#003366',
      transform: 'translateY(-2px)'
    },
    conditionsContent: {
      backgroundColor: '#f9f9f9',
      padding: '25px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #003366',
      animation: showConditions ? 'fadeIn 0.5s ease' : 'none'
    },
    sectionTitle: {
      color: '#2c3e50',
      marginTop: '15px',
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '15px'
    },
    list: {
      paddingLeft: '25px',
      marginBottom: '20px'
    },
    listItem: {
      marginBottom: '12px',
      lineHeight: '1.6',
      position: 'relative'
    },
    reservationButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      padding: '14px 25px',
      borderRadius: '6px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    },
    reservationButtonHover: {
      backgroundColor: '#219653',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
    },
    reservationButtonDisabled: {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    icon: {
      fontSize: '1.2rem'
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      {/* 🔙 Bouton retour */}
      
      <h2 style={styles.title}>
        <span style={{ color: '#F1C40F' }}>Conditions</span> de Réservation
      </h2>

      <button 
        type="button"
        style={styles.toggleButton}
        onClick={toggleConditions}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.toggleButtonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.toggleButton.backgroundColor}
      >
        {showConditions ? (
          <>
            <span style={styles.icon}>▼</span> Masquer les conditions
          </>
        ) : (
          <>
            <span style={styles.icon}>▶</span> Afficher les conditions
          </>
        )}
      </button>

      {showConditions && (
        <div style={styles.conditionsContent}>
          <h3 style={styles.sectionTitle}>Politique de réservation</h3>
          <ol style={styles.list}>
            {[ 
              "Les réservations doivent être effectuées au moins 48 heures à l'avance.",
              "Un acompte de 30% est requis pour confirmer la réservation.",
              "Les annulations moins de 7 jours avant le départ entraînent des frais de 50%.",
              "Les modifications sont possibles jusqu'à 72 heures avant le départ, sous réserve de disponibilité.",
              "Les prix sont garantis uniquement après paiement complet.",
              "Les visas et documents de voyage sont de la responsabilité du client.",
              "L'agence décline toute responsabilité en cas de force majeure."
            ].map((item, index) => (
              <li key={index} style={styles.listItem}>{item}</li>
            ))}
          </ol>

          <h3 style={styles.sectionTitle}>Assurances</h3>
          <p style={{ lineHeight: '1.6' }}>
            Nous recommandons fortement de souscrire une assurance annulation et une assurance voyage.
            Des options d'assurance vous seront proposées lors de la confirmation de réservation.
          </p>
        </div>
      )}
    </form>
  );
};

export default ReservationConditions;
