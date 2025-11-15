import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, User } from '@/lib/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await db.init();
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        const userData = await db.get<User>('users', userId);
        if (userData) {
          setUser({ ...userData, isOnline: true });
          await db.put('users', { ...userData, isOnline: true, lastSeen: Date.now() });
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      id: userId,
      email,
      displayName,
      status: 'Hey there! I am using ChitChat',
      isOnline: true,
      lastSeen: Date.now(),
    };

    await db.add('users', newUser);
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem(`password_${userId}`, password);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const users = await db.getAll<User>('users');
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser) {
      throw new Error('User not found');
    }

    const storedPassword = localStorage.getItem(`password_${foundUser.id}`);
    if (storedPassword !== password) {
      throw new Error('Invalid password');
    }

    const updatedUser = { ...foundUser, isOnline: true, lastSeen: Date.now() };
    await db.put('users', updatedUser);
    localStorage.setItem('currentUserId', foundUser.id);
    setUser(updatedUser);
  };

  const logout = async () => {
    if (user) {
      await db.put('users', { ...user, isOnline: false, lastSeen: Date.now() });
    }
    localStorage.removeItem('currentUserId');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await db.put('users', updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};