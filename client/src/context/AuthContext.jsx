import React, { createContext, useState, useContext, useEffect } from "react";
import { checkAuthStatus, loginUser, signupUser, logoutUser } from "../api/api";

//create new context
const AuthContext = createContext();

// provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      const data = await checkAuthStatus();
      if (data) {
        setUser(data);
        setIsLoggedIn(true);
      }
    }
    checkStatus();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data) {
      setUser(data);
      setIsLoggedIn(true);
    }
  };

  const signup = async (email, username, password) => {
    const data = await signupUser(email, username, password);
    if (data) {
      setUser({ email: data.email, username: data.username });
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook to consume the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
