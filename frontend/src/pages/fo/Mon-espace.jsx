import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Avatar,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Email,
  Lock,
  Notifications,
  Facebook,
  Edit,
  AddPhotoAlternate,
  Search,
  Save,
  PictureAsPdf
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from "../../contexts/UserContext";
import authService from "../../services-call/auth";
import serviceCall from '../../services-call/utilisateur';
import factureService from '../../services-call/facture';

const SettingsPanel = () => {
  const personalInfoRef = useRef(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [factures, setFactures] = useState([]);
  const [loadingFactures, setLoadingFactures] = useState(false);
  const [errorFactures, setErrorFactures] = useState(null);

  const { user } = useUser();
  const token = user?.token;
console.log("[SettingsPanel] token depuis useUser:", token);
  // Chargement des données utilisateur
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
     const tokenFromStorage = session?.token;
    console.log("[SettingsPanel] token depuis localStorage session:", tokenFromStorage);

   

    if (!tokenFromStorage) {
      console.error("Aucun token trouvé !");
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    
    authService.getCurrentUser({
      headers: { Authorization: `Bearer ${tokenFromStorage}` },
    })
      .then((response) => {
        if (response.data) {
          const userData = response.data;
          const completeUserData = {
            ...userData,
            nom: userData.nom || 'Non spécifié',
            prenom: userData.prenom || 'Non spécifié',
            email: userData.email || 'Non spécifié',
            telephone: userData.telephone || 'Non spécifié'
          };
          setUserInfo(completeUserData);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  // Chargement des factures
  useEffect(() => {
    if (!token) return;

    setLoadingFactures(true);
    setErrorFactures(null);
    console.log("[SettingsPanel] Chargement des factures...");

    factureService.getMesFactures(token)
      .then(formattedFactures => {
        console.log("[SettingsPanel] Factures formatées reçues:", formattedFactures);
        setFactures(formattedFactures);
      })
      .catch(err => {
        console.error("[SettingsPanel] Erreur:", err);
        setErrorFactures(err.message || "Erreur lors du chargement des factures");
        setFactures([]);
      })
      .finally(() => {
        setLoadingFactures(false);
      });
  }, [token]);

  // Télécharger une facture
  const handleDownloadFacture = async (filename, displayName) => {
    if (!token || !userInfo) return;

    try {
      const factureData = {
        ...factures.find(f => f.filename === filename),
        nom: userInfo.nom,
        prenom: userInfo.prenom,
        email: userInfo.email,
        telephone: userInfo.telephone
      };

      const response = await factureService.downloadFacture(filename, token, factureData);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', displayName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      setErrorFactures(err.message || "Impossible de télécharger la facture");
    }
  };

  const toggleEditForm = () => {
    setShowEditForm(prev => !prev);
    setEditField(null);
    setTimeout(() => {
      personalInfoRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const startEdit = (field) => {
    setEditField(field);
    setTempValue(userInfo[field]);
  };

  const saveEdit = () => {
    if (!editField) return;
    const updatedField = { [editField]: tempValue };

    serviceCall.updateItem(userInfo.id, updatedField)
      .then(() => {
        setUserInfo(prev => ({ ...prev, ...updatedField }));
        setEditField(null);
      })
      .catch(error => {
        console.error('Erreur mise à jour:', error);
      });
  };

  const infos = [
    { label: 'Nom', field: 'nom', icon: <Edit />, editable: true },
    { label: 'Prénom', field: 'prenom', icon: <Edit />, editable: true },
    { label: 'N° Téléphone', field: 'telephone', icon: <Edit />, editable: true },
    { label: 'Email', field: 'email', icon: <Email />, editable: false },
    { label: 'Mot de passe', field: 'motDePasse', icon: <Lock />, editable: true, type: 'password' },
  ];

  const renderFactures = () => {
    if (loadingFactures) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      );
    }

    if (errorFactures) {
      return (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorFactures}
        </Typography>
      );
    }

    if (factures.length === 0) {
      return <Typography>Aucune facture disponible</Typography>;
    }

    return (
      <List disablePadding>
        {factures.map((facture) => {
          const factureDate = new Date(facture.date);
          const formattedDate = isNaN(factureDate.getTime())
            ? 'Date inconnue'
            : factureDate.toLocaleDateString('fr-FR');

          return (
            <ListItem key={facture.id} sx={{ pl: 0 }}>
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <PictureAsPdf />
              </ListItemIcon>
              <ListItemText
                primary={`Facture #${facture.numero || '0001'}`}
                secondary={`Émise le: ${formattedDate}`}
              />
              <Button
                variant="outlined"
                onClick={() => handleDownloadFacture(
                  facture.filename, 
                  `Facture_${facture.numero || '0001'}.pdf`
                )}
              >
                Télécharger
              </Button>
            </ListItem>
          );
        })}
      </List>
    );
  };

  if (loadingUser) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Impossible de charger les informations utilisateur
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      p: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Paramètres
        </Typography>
      </motion.div>

      <TextField
        fullWidth
        placeholder="Taper ici pour rechercher"
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
        }}
        sx={{ mb: 4 }}
      />

      <Section title="Informations personnelles" refProp={personalInfoRef}>
        <SettingItem
          icon={<AddPhotoAlternate />}
          text="Télécharger une photo"
          action={<Avatar sx={{ width: 56, height: 56 }} />}
        />
        <SettingItem
          icon={<Edit />}
          text="Modifier le profil"
          action={
            <Button variant="outlined" onClick={toggleEditForm}>
              {showEditForm ? 'Fermer' : 'Modifier'}
            </Button>
          }
        />
        <Collapse in={showEditForm} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, mb: 2, pl: 6 }}>
            {infos.map(({ label, field, icon, editable, type }) => (
              <ListItem key={field} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  secondary={
                    editField === field && editable ? (
                      <TextField
                        fullWidth
                        type={type || 'text'}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        size="small"
                      />
                    ) : (
                      userInfo[field] || 'Non spécifié'
                    )
                  }
                />
                <Box>
                  {editField === field && editable ? (
                    <IconButton color="primary" onClick={saveEdit}>
                      <Save />
                    </IconButton>
                  ) : editable ? (
                    <IconButton onClick={() => startEdit(field)}>
                      <Edit />
                    </IconButton>
                  ) : null}
                </Box>
              </ListItem>
            ))}
          </Box>
        </Collapse>
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Mes factures">
        {renderFactures()}
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Activer les notifications par e-mail">
        <SettingItem
          icon={<Notifications />}
          text="Activer"
          action={<Switch defaultChecked />}
        />
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Comptes de réseaux sociaux">
        <SettingItem
          icon={<Facebook />}
          text="Messenger"
          action={<Button variant="outlined">Lier</Button>}
        />
      </Section>
    </Box>
  );
};

const Section = React.forwardRef(({ title, children }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Typography variant="h5" gutterBottom sx={{
      fontWeight: 'bold',
      color: 'primary.main',
      mb: 2
    }}>
      {title}
    </Typography>
    <List disablePadding>
      {children}
    </List>
  </motion.div>
));

const SettingItem = ({ icon, text, action }) => (
  <ListItem sx={{ pl: 0, justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </Box>
    {action}
  </ListItem>
);

export default SettingsPanel;