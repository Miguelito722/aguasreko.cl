import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, Droplets, Eye, LogIn, UserPlus } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { itemCount, setIsOpen } = useCartContext();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize and update visit counter
    const initializeVisitCounter = () => {
      const currentCount = parseInt(localStorage.getItem('aguasreko_visit_count') || '0');
      const lastVisit = localStorage.getItem('aguasreko_last_visit');
      const today = new Date().toDateString();
      
      // Only increment if it's a new day or first visit
      if (lastVisit !== today) {
        const newCount = currentCount + 1;
        localStorage.setItem('aguasreko_visit_count', newCount.toString());
        localStorage.setItem('aguasreko_last_visit', today);
        setVisitCount(newCount);
      } else {
        setVisitCount(currentCount);
      }
    };

    initializeVisitCounter();
  }, []);

  const navItems = [
    { name: 'Productos', href: '#productos' },
    { name: 'Empresas', href: '#empresas' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' }
  ];

  const formatVisitCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Droplets className="h-10 w-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Aguas Reko
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-blue-600 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Visit Counter */}
              <motion.div
                className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {formatVisitCount(visitCount)} visitas
                </span>
              </motion.div>

              {/* Auth Buttons or User Menu */}
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <UserMenu />
                  ) : (
                    <div className="hidden md:flex items-center space-x-2">
                      <motion.button
                        onClick={() => openAuthModal('login')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          isScrolled
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Entrar</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => openAuthModal('register')}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Registro</span>
                      </motion.button>
                    </div>
                  )}
                </>
              )}

              {/* Cart Button */}
              <motion.button
                onClick={() => setIsOpen(true)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                {itemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <X className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            className={`lg:hidden overflow-hidden ${isMenuOpen ? 'mt-4' : ''}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 space-y-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
              {/* Mobile Visit Counter */}
              <div className="flex items-center justify-center space-x-2 px-4 py-2 text-blue-700">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {formatVisitCount(visitCount)} visitas totales
                </span>
              </div>
              
              <div className="border-t border-gray-200 mx-4"></div>
              
              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <>
                  <div className="px-4 py-2 space-y-2">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg font-medium"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg font-medium"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Crear Cuenta</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 mx-4"></div>
                </>
              )}
              
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg mx-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        </nav>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;