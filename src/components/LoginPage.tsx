import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, onClose }) => {
  const { login, resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el email de recuperación');
    }
  };

  if (resetEmailSent) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Email Enviado
        </h3>
        <p className="text-gray-600 mb-4">
          Hemos enviado un enlace para recuperar tu contraseña a {email}
        </p>
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Cerrar
        </button>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recuperar Contraseña
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'Enviando...' : 'Enviar Email'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowResetPassword(false)}
            className="w-full text-gray-600 hover:text-gray-700 text-sm"
          >
            Volver al inicio de sesión
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Iniciar Sesión
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Recordarme</span>
          </label>
          <button
            type="button"
            onClick={() => setShowResetPassword(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Olvidé mi contraseña
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          <ArrowRight className="w-4 h-4" />
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Regístrate aquí
          </button>
        </div>
      </form>
    </div>
  );
};
