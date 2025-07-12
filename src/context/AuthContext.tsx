import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, RegisterData } from '../types/auth';
import { SecurityUtils } from '../utils/security';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('aguasreko_user');
        const sessionToken = localStorage.getItem('aguasreko_session');
        
        if (storedUser && sessionToken) {
          const userData = JSON.parse(storedUser);
          const tokenData = JSON.parse(sessionToken);
          
          // Check if session is still valid (24 hours)
          const now = new Date().getTime();
          const sessionAge = now - tokenData.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('aguasreko_user');
            localStorage.removeItem('aguasreko_session');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('aguasreko_user');
        localStorage.removeItem('aguasreko_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Validate input data
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (userData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('aguasreko_users') || '[]');
      const emailExists = existingUsers.some((u: User) => u.email === userData.email);
      
      if (emailExists) {
        throw new Error('Este email ya está registrado');
      }

      // Create new user
      const newUser: User = {
        id: SecurityUtils.generateSecureToken(16),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        region: userData.region,
        createdAt: new Date().toISOString(),
        isVerified: false
      };

      // Hash password and store user
      const hashedPassword = SecurityUtils.hashPassword(userData.password);
      const userWithPassword = { ...newUser, password: hashedPassword };
      
      existingUsers.push(userWithPassword);
      localStorage.setItem('aguasreko_users', JSON.stringify(existingUsers));

      // Create session
      const sessionToken = {
        userId: newUser.id,
        timestamp: new Date().getTime(),
        token: SecurityUtils.generateSecureToken(32)
      };

      localStorage.setItem('aguasreko_user', JSON.stringify(newUser));
      localStorage.setItem('aguasreko_session', JSON.stringify(sessionToken));

      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const existingUsers = JSON.parse(localStorage.getItem('aguasreko_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Verify password
      const isValidPassword = SecurityUtils.verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Create session
      const sessionToken = {
        userId: user.id,
        timestamp: new Date().getTime(),
        token: SecurityUtils.generateSecureToken(32)
      };

      const { password: _, ...userWithoutPassword } = user;
      
      localStorage.setItem('aguasreko_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('aguasreko_session', JSON.stringify(sessionToken));

      setUser(userWithoutPassword);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('aguasreko_user');
    localStorage.removeItem('aguasreko_session');
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = { ...user, ...userData };
      
      // Update in storage
      const existingUsers = JSON.parse(localStorage.getItem('aguasreko_users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...userData };
        localStorage.setItem('aguasreko_users', JSON.stringify(existingUsers));
      }
      
      localStorage.setItem('aguasreko_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};