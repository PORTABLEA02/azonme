import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'admin@school.fr',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '2',
      name: 'Jean Martin',
      email: 'teacher@school.fr',
      role: 'teacher',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '3',
      name: 'Sophie Leroy',
      email: 'student@school.fr',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '4',
      name: 'Pierre Moreau',
      email: 'parent@school.fr',
      role: 'parent',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const login = async (email: string, password: string, role: string): Promise<void> => {
    setIsLoading(true);
    
    // Check if teacher is inactive and prevent login
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser && foundUser.role === 'teacher') {
      // In a real app, you would check the teacher's status from the database
      // For demo purposes, we'll assume all demo teachers are active
      // But in production, you would add this check:
      // if (teacherStatus === 'inactive') {
      //   throw new Error('Compte enseignant désactivé. Contactez l\'administration.');
      // }
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Identifiants incorrects');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};