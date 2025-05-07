import React, { createContext, useContext, useState, useEffect } from 'react';

// Crée le contexte
const UserContext = createContext({
  user: null,
  setUser: (user) => {},
  logout: () => {},
});

// Provider
export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('session');
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
  }, []);

  // Fonction pour se connecter (sauvegarde + état)
  const setUser = (user) => {
    localStorage.setItem('session', JSON.stringify(user));
    setUserState(user);
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('session'); // ✅ correspond bien à la clé utilisée dans setUser
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé
export const useUser = () => useContext(UserContext);
