import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("spa_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await getProfile();

        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("spa_user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("spa_user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("spa_user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("spa_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);