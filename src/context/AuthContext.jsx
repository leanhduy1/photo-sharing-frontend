import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photosRefesh, setPhotosRefresh] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.checkAuth();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const refreshPhotos = () => setPhotosRefresh((prev) => prev + 1);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, photosRefesh, refreshPhotos }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
