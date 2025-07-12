import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface ProtectedCheckoutProps {
  children: React.ReactNode;
  onProceed: () => void;
}

const ProtectedCheckout: React.FC<ProtectedCheckoutProps> = ({ children, onProceed }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, user } = useAuth();

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onProceed();
  };

  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ShieldCheck className="h-10 w-10 text-blue-600" />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Inicia Sesión para Comprar
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Para realizar compras y acceder a ofertas exclusivas, necesitas tener una cuenta en Aguas Reko.
        </p>

        <div className="space-y-4">
          <motion.button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="h-5 w-5" />
            <span>Iniciar Sesión</span>
          </motion.button>

          <motion.button
            onClick={() => {
              setAuthMode('register');
              setShowAuthModal(true);
            }}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="h-5 w-5" />
            <span>Crear Cuenta Nueva</span>
          </motion.button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">Beneficios de tener cuenta:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Historial de pedidos</li>
            <li>• Direcciones guardadas</li>
            <li>• Ofertas exclusivas</li>
            <li>• Proceso de compra más rápido</li>
          </ul>
        </div>
      </motion.div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default ProtectedCheckout;