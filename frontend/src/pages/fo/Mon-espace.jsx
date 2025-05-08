import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
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
  IconButton
} from '@mui/material';
import {
  Email,
  Lock,
  Security,
  Notifications,
  Facebook,
  Delete,
  Edit,
  AddPhotoAlternate,
  Language,
  Search,
  Save
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from "../../contexts/UserContext";
import authService from "../../services-call/auth";
import serviceCall from '../../services-call/utilisateur';

const SettingsPanel = () => {
  const personalInfoRef = useRef(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const { user } = useUser();
  const token = user?.token;

  // Chargement des données utilisateur avec le token du contexte
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
  const token = session?.token;  // Récupère le token de l'objet session
  console.log("Token récupéré depuis la session :", token);  // Log pour vérifier
    if (!token) {
      console.error("Aucun token trouvé !");
      return;
    }

    authService.getCurrentUser({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de l’utilisateur :", error);
      });
  }, []);


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
        console.error('Erreur lors de la mise à jour :', error);
      });
  };
  

  const infos = [
    { label: 'Nom', field: 'nom', icon: <Edit /> },
    { label: 'Prenom', field: 'prenom', icon: <Edit /> },
    { label: 'N° Téléphone', field: 'telephone', icon: <Edit /> },
    { label: 'Email', field: 'email', icon: <Email /> },
    { label: 'Mot de passe', field: 'motDePasse', icon: <Lock /> },
    
  ];

  if (!userInfo) {
    return <Typography align="center">Chargement...</Typography>;
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
            {infos.map(({ label, field, icon }) => (
              <ListItem key={field} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  secondary={
                    editField === field ? (
                      <TextField
                        fullWidth
                        type={field === 'motDePasse' ? 'password' : 'text'}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        size="small"
                      />
                    ) : (
                      userInfo[field]
                    )
                  }
                />
                <Box>
                  {editField === field ? (
                    <IconButton color="primary" onClick={saveEdit}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => startEdit(field)}>
                      <Edit />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
            ))}
          </Box>
        </Collapse>
        
        
      </Section>

      <Divider sx={{ my: 3 }} />

      

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

const Section = ({ title, children, refProp }) => (
  <motion.div
    ref={refProp}
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
);

const SettingItem = ({ icon, text, action }) => (
  <ListItem sx={{
    py: 2,
    px: 0,
    '&:not(:last-child)': {
      borderBottom: '1px solid',
      borderColor: 'divider'
    }
  }}>
    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
      {icon}
    </ListItemIcon>
    <ListItemText
      primary={text}
      primaryTypographyProps={{ variant: 'body1' }}
    />
    <Box>
      {action}
    </Box>
  </ListItem>
);

export default SettingsPanel;
