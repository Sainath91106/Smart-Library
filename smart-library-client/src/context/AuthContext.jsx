import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Decode JWT to extract payload
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Validate that user has required fields
        if (parsed && parsed.role && parsed._id) {
          return parsed;
        }
        // Invalid user data, clear it
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setLoading(false);
  }, [token, user]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const authToken = response.data?.token;
    const userData = response.data?.user;

    if (!authToken || !userData) {
      throw new Error('Invalid response from server');
    }

    setToken(authToken);
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      points: userData.points,
      isActive: userData.isActive,
    });
    
    return { 
      token: authToken, 
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        points: userData.points,
        isActive: userData.isActive,
      }
    };
  };

  const register = async (name, email, password, role = 'student') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    const authToken = response.data?.token;
    const userData = response.data?.user;

    if (!authToken || !userData) {
      throw new Error('Invalid response from server');
    }

    setToken(authToken);
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      points: userData.points,
      isActive: userData.isActive,
    });
    
    return { 
      token: authToken, 
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        points: userData.points,
        isActive: userData.isActive,
      }
    };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
