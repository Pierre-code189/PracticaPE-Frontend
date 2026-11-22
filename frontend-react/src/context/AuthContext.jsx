import { createContext, useContext, useState, useCallback } from 'react';
import { currentUser, saveSession, clearSession } from '../api/utils';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => currentUser());

  const login = useCallback(async (email, code) => {
    const res = await api.verifyOtp(email, code);
    saveSession(res.access_token, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
