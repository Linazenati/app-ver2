import React, { useState } from 'react';
import Step1 from '../../components/fo/Step1';
import Step2Wrapper from '../../components/fo/Step2Wrapper';
import Step3 from '../../components/fo/Step3';
import Step4 from '../../components/fo/Step4';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast, { Toaster } from "react-hot-toast";
import '../../assets/fo/css/visa.css';
import backgroundImage from '../../assets/img/visa1.jpg';
import visaService from '../../services-call/visa ';

const visaPrices = {
  Tourisme: 6000,
  Affaires: 8000,
  Etudes: 10000
};

const VisaTouristique = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    pays: '',
    typeVisa: '',
    personnes: '1',
    nationalite: '',
    dateArrivee: '',
    accepteConditions: false
  });

  const [participants, setParticipants] = useState([
    {
      prenom: '',
      nom: '',
      dateNaissance: '',
      lieuNaissance: '',
      numeroPasseport: '',
      delivrancePasseport: '',
      expirationPasseport: '',
      email: '',
      adresse: '',
      justificatifs: []
    }
  ]);

  const [error, setError] = useState('');

  // Gestion des champs du formulaire principal
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion des participants
  const handleParticipantChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...participants];
    if (name === 'justificatifs') {
      const newFiles = Array.from(files);
      updated[index][name] = [...updated[index][name], ...newFiles];
    } else {
      updated[index][name] = value;
    }
    setParticipants(updated);
  };

  // Mise à jour du nombre de participants
  const updateParticipantsCount = (count) => {
    const n = parseInt(count, 10);
    const newParticipants = Array.from({ length: n }, (_, i) =>
      participants[i] || {
        prenom: '',
        nom: '',
        dateNaissance: '',
        lieuNaissance: '',
        numeroPasseport: '',
        delivrancePasseport: '',
        expirationPasseport: '',
        email: '',
        adresse: '',
        justificatifs: []
      }
    );
    setParticipants(newParticipants);
  };

  // Validation de chaque étape
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.pays || !formData.typeVisa || !formData.personnes || !formData.nationalite || !formData.dateArrivee) {
          setError("Veuillez remplir tous les champs requis de l’étape 1.");
          return false;
        }
        break;
      case 2:
        for (const p of participants) {
          if (
            !p.prenom || !p.nom || !p.dateNaissance || !p.lieuNaissance ||
            !p.numeroPasseport || !p.delivrancePasseport || !p.expirationPasseport ||
            !p.email || !p.adresse || p.justificatifs.length === 0
          ) {
            setError("Veuillez remplir tous les champs requis de l’étape 2 pour chaque participant.");
            return false;
          }
        }
        break;
      case 3:
        if (!formData.accepteConditions) {
          setError("Veuillez accepter les conditions pour continuer.");
          return false;
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const next = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prev = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const prixUnitaire = visaPrices[formData.typeVisa] || 0;
  const nombre = parseInt(formData.personnes, 10) || 1;
  const total = prixUnitaire * nombre;

 const handleSubmit = async () => {
  if (!validateStep()) return;

  try {
    const fd = new FormData();

    // Ajout des champs simples de formData
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    // Ajout du total calculé
    fd.append('total', total.toString());

    // Ajout des participants sans les justificatifs (on garde le reste en JSON)
    const participantsSansFichiers = participants.map(({ justificatifs, ...rest }) => rest);
    fd.append('participants', JSON.stringify(participantsSansFichiers));

    // Ajout des fichiers justificatifs
    participants.forEach(p => {
      p.justificatifs.forEach(file => {
        fd.append('justificatifs', file);
      });
    });

    // Envoi via visaService
    const token = localStorage.getItem('token');
    await visaService.createVisa(fd, token);

   alert('Demande envoyée avec succès !');
      toast.success("🚀Demande envoyée avec succès  !");

    // Réinitialiser le formulaire ici
    setFormData({
      pays: '',
      typeVisa: '',
      personnes: '1',
      nationalite: '',
      dateArrivee: '',
      accepteConditions: false
    });
    setParticipants([
      {
        prenom: '',
        nom: '',
        dateNaissance: '',
        lieuNaissance: '',
        numeroPasseport: '',
        delivrancePasseport: '',
        expirationPasseport: '',
        email: '',
        adresse: '',
        justificatifs: []
      }
    ]);
    setStep(1); // Revenir à la première étape
    setError('');

  } catch (err) {
    alert("Erreur lors de l'envoi : " + err.message);
          toast.error("❌ Erreur lors d'envoie' !");

  }
  };
  
  
  const getJustificatifsByParticipantId = async (participantId) => {
  return await Justificatif.findAll({
    where: { participantId }
  });
};


  const steps = [
    <Step1
      key="step1"
      data={formData}
      onChange={(e) => {
        handleChange(e);
        if (e.target.name === 'personnes') {
          updateParticipantsCount(e.target.value);
        }
      }}
    />,
    <Step2Wrapper
      key="step2"
      participants={participants}
      onChange={handleParticipantChange}
    />,
    <Step3
      key="step3"
      data={formData}
      onChange={handleChange}
    />,
    <Step4
      key="step4"
      formData={formData}
      participants={participants}
      total={total}
    />
  ];

  const renderStepIndicator = () => (
    <div className="stepper-container mb-4 d-flex justify-content-center align-items-center">
      {[1, 2, 3, 4].map((num, i) => (
        <React.Fragment key={num}>
          <div
            className={`stepper-circle ${step === num ? 'current' : step > num ? 'completed' : ''}`}
            style={{
              backgroundColor: step === num ? '#ffc107' : step > num ? '#f0ad4e' : '#ddd',
              color: step >= num ? '#000' : '#666',
              borderColor: step >= num ? '#f0ad4e' : '#ccc',
              width: 35,
              height: 35,
              lineHeight: '35px',
              fontWeight: 'bold',
              borderRadius: '50%',
              textAlign: 'center',
              userSelect: 'none'
            }}
          >
            {num}
          </div>
          {i < 3 && (
            <div
              className={`stepper-line ${step > num ? 'completed' : ''}`}
              style={{
                backgroundColor: step > num ? '#f0ad4e' : '#ccc',
                height: '3px',
                width: '50px',
                margin: '0 10px'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
     <>
      <Toaster position="top-right" />
    <div
      className="background-visa"
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
      }}
    >
      <div
        className="bg-light rounded shadow p-4"
        style={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 0 15px rgba(0,0,0,0.3)'
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#003366' }}>
          Demande de Visa
        </h2>

        {renderStepIndicator()}

        {error && <div className="alert alert-danger">{error}</div>}
        {steps[step - 1]}

        <div className="d-flex justify-content-between mt-4">
          {step > 1 && (
            <button
              className="btn"
              style={{ backgroundColor: '#003366', color: 'white' }}
              onClick={prev}
            >
              Précédent
            </button>
          )}
          {step < 4 ? (
            <button
              className="btn ms-auto"
              style={{ backgroundColor: '#003366', color: 'white' }}
              onClick={next}
            >
              Suivant
            </button>
          ) : (
            <button
              className="btn btn-success ms-auto"
              onClick={handleSubmit}
            >
              Envoyer
            </button>
          )}
        </div>
      </div>
      </div>
          </>

  );
};

export default VisaTouristique;
