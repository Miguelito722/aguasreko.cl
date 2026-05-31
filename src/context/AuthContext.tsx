import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, RegisterData, UserRole } from '../types/auth';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mapSupabaseUserToUser = (supabaseUser: SupabaseUser, profile?: any): User | null => {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || supabaseUser.user_metadata?.name || '',
    phone: profile?.phone || supabaseUser.user_metadata?.phone || '',
    address: profile?.address || supabaseUser.user_metadata?.address || '',
    city: profile?.city || supabaseUser.user_metadata?.city || '',
    region: profile?.region || supabaseUser.user_metadata?.region || '',
    role: profile?.role || 'user',
    isVerified: profile?.is_verified || supabaseUser.email_confirmed_at !== null,
    createdAt: profile?.created_at || supabaseUser.created_at,
    updatedAt: profile?.updated_at || supabaseUser.updated_at || supabaseUser.created_at
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user.id);
          const mappedUser = mapSupabaseUserToUser(session.user, profile);
          if (mounted) setUser(mappedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const mappedUser = mapSupabaseUserToUser(session.user, profile);
          setUser(mappedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);

    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (userData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      console.log('Attempting registration for:', userData.email);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
            region: userData.region || ''
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        if (error.message.includes('already registered')) {
          throw new Error('Este email ya está registrado');
        }
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Error al crear el usuario');
      }

      console.log('Registration successful for user:', data.user.id);

      // If email confirmation is disabled, the user will be automatically signed in
      if (data.session) {
        console.log('User automatically signed in');
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const mappedUser = mapSupabaseUserToUser(data.user, profile);
        setUser(mappedUser);
      }

    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor verifica tu email antes de iniciar sesión');
        }
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        const mappedUser = mapSupabaseUserToUser(data.user, profile);
        setUser(mappedUser);

        try {
          await supabase.from('access_logs').insert({
            user_id: data.user.id,
            action: 'login',
            resource: 'auth'
          });
        } catch (logError) {
          console.error('Error logging access:', logError);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (user) {
        await supabase.from('access_logs').insert({
          user_id: user.id,
          action: 'logout',
          resource: 'auth'
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          region: userData.region
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...userData });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
