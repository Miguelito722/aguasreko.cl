import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartSidebar: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, total, isOpen, setIsOpen } = useCartContext();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      if (!isAuthenticated) {
        // Show auth requirement message
        alert('Debes iniciar sesión para realizar compras. Por favor, regístrate o inicia sesión desde el menú superior.');
        return;
      }

      // Store cart data in sessionStorage for the payment page
      const paymentData = {
        items: items,
        total: total
      };
      
      sessionStorage.setItem('aguasreko_payment_data', JSON.stringify(paymentData));
      
      // Navigate to payment page in same window
      window.location.hash = '#payment';
      window.location.reload();
    }
  };

  const sidebarVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
                <span>Tu Carrito</span>
              </h2>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    className="h-full flex flex-col justify-center items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
                    <p className="text-gray-500">Agrega productos para verlos aquí</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="bg-gray-50 rounded-xl p-4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ delay: index * 0.1 }}
                        layout
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                          </div>
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="h-4 w-4" />
                            </motion.button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                          </div>
                          <div className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(total)}</span>
                </div>
                
                {/* Auth Status Indicator */}
                {!isAuthenticated && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">
                        Inicia sesión para proceder con la compra
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <motion.button
                    onClick={handleCheckout}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                      isAuthenticated
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    whileHover={isAuthenticated ? { scale: 1.02 } : {}}
                    whileTap={isAuthenticated ? { scale: 0.98 } : {}}
                    disabled={!isAuthenticated}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>
                      {isAuthenticated ? 'Proceder al Pago' : 'Inicia Sesión para Comprar'}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={clearCart}
                    className="w-full text-red-600 hover:text-red-700 font-medium py-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Vaciar Carrito
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;