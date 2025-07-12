export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  createdAt: string;
  isVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
}

export interface LoginData {
  email: string;
  password: string;
}