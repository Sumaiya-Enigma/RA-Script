'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getMeApi, loginApi, signupApi, googleAuthApi, 
  updateProfileApi, changePasswordApi 
} from '../lib/api-client';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  is_active: boolean;
  google_id?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  loginWithGoogle: (token: string, email?: string, name?: string, picture?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { full_name?: string; username?: string; email?: string; role?: string; avatar_url?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const defaultUser: User = {
  id: 1,
  username: 'dilafrojlija',
  email: 'dilafrojlija@gmail.com',
  full_name: 'Dilafroj Lija',
  role: 'Senior Regulatory Affairs Manager',
  avatar_url: undefined,
  is_active: true
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  token: null,
  isAuthenticated: true,
  isLoading: false,
  isAuthModalOpen: false,
  isProfileModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  openProfileModal: () => {},
  closeProfileModal: () => {},
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rascript_access_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getMeApi();
          if (userData) {
            setUser(userData);
          }
        } catch (e) {
          console.warn("Session restore failed, using default state", e);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const saveAuthSession = (authData: { access_token: string; user: User }) => {
    setToken(authData.access_token);
    setUser(authData.user);
    localStorage.setItem('rascript_access_token', authData.access_token);
    closeAuthModal();
  };

  const login = async (usernameOrEmail: string, password: string) => {
    const res = await loginApi({ username_or_email: usernameOrEmail, password });
    saveAuthSession(res);
  };

  const signup = async (username: string, email: string, password: string, fullName?: string) => {
    const res = await signupApi({ username, email, password, full_name: fullName });
    saveAuthSession(res);
  };

  const loginWithGoogle = async (gToken: string, email?: string, name?: string, picture?: string) => {
    const res = await googleAuthApi({ token: gToken, email, name, picture });
    saveAuthSession(res);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rascript_access_token');
  };

  const updateProfile = async (data: { full_name?: string; username?: string; email?: string; role?: string; avatar_url?: string }) => {
    if (token) {
      const updatedUser = await updateProfileApi(data);
      setUser(updatedUser);
    } else {
      // Local demo mode update
      setUser(prev => prev ? { ...prev, ...data } : { ...defaultUser, ...data });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (token) {
      await changePasswordApi({ current_password: currentPassword, new_password: newPassword });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        isProfileModalOpen,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
