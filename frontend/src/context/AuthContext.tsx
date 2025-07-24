import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (formData: any) => Promise<void>;
  signup: (formData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      axios.defaults.headers.common['x-auth-token'] = currentToken;
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signup = async (formData: any) => {
    const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    await loadUser();
  };

  const login = async (formData: any) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', formData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, user, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};