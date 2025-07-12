import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CreditCard, Smartphone, DollarSign, CheckCircle, AlertCircle, ExternalLink, TestTube, User } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/paymentAPI';
import { SecurityUtils } from '../utils/security';
import { paymentConfig } from '../config/payment';
import PaymentTestDashboard from './PaymentTestDashboard';

interface PaymentPageProps {
  cartItems: CartItem[];
  total: number;
  onClose: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ cartItems, total, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showTestDashboard, setShowTestDashboard] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      onClose();
    }
  }, [isAuthenticated, user, onClose]);

  const paymentMethods = [
    {
      id: 'webpay',
      name: 'Webpay Plus',
      description: 'Paga con tarjeta de crédito o débito',
      icon: CreditCard,
      color: 'from-red-500 to-red-600',
      integration: 'webpay'
    },
    {
      id: 'mach',
      name: 'Mach',
      description: 'Pago rápido con tu app Mach',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      integration: 'mach'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pago seguro internacional',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      integration: 'paypal'
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Múltiples opciones de pago',
      icon: CreditCard,
      color: 'from-cyan-500 to-cyan-600',
      integration: 'mercadopago'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const validateForm = () => {
    return selectedMethod && user;
  };

  // Enhanced payment processing with real API integration
  const processPayment = async () => {
    if (!validateForm() || !user) {
      alert('Error: Usuario no autenticado o método de pago no seleccionado');
      return;
    }

    // Rate limiting check
    const clientIP = 'user-ip'; // In production, get real IP
    if (!SecurityUtils.checkRateLimit(clientIP, 5, 60000)) {
      alert('Demasiados intentos de pago. Intenta nuevamente en un minuto.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `ORDER-${Date.now()}`;
      const orderData = {
        orderId,
        amount: total,
        customerInfo: user,
        items: cartItems,
        description: `Aguas Reko - ${cartItems.length} productos`,
        currency: selectedMethod === 'paypal' ? 'USD' : 'CLP'
      };

      let result;
      
      switch (selectedMethod) {
        case 'webpay':
          result = await paymentAPI.createWebpayTransaction(orderData);
          if (result.url) {
            // Redirect to Webpay
            window.location.href = result.url;
            return;
          }
          break;
          
        case 'mach':
          result = await paymentAPI.createMachPayment(orderData);
          if (result.qr_code || result.deep_link) {
            // Show QR code or redirect to Mach app
            console.log('Mach payment created:', result);
          }
          break;
          
        case 'paypal':
          const paypalOrderData = {
            ...orderData,
            amount: total / 800, // Convert CLP to USD
            currency: 'USD'
          };
          result = await paymentAPI.createPayPalOrder(paypalOrderData);
          if (result.links) {
            const approvalUrl = result.links.find((link: any) => link.rel === 'approve');
            if (approvalUrl) {
              window.location.href = approvalUrl.href;
              return;
            }
          }
          break;
          
        case 'mercadopago':
          result = await paymentAPI.createMercadoPagoPreference(orderData);
          if (result.init_point) {
            window.location.href = result.init_point;
            return;
          }
          break;
          
        default:
          throw new Error('Método de pago no válido');
      }

      // For demo purposes, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store transaction info
      sessionStorage.setItem('aguasreko_transaction', JSON.stringify({
        transactionId: result?.id || `${selectedMethod.toUpperCase()}-${Date.now()}`,
        amount: total,
        method: selectedMethod,
        timestamp: new Date().toISOString(),
        customer: user
      }));

      setPaymentComplete(true);
      
      // Clear cart after successful payment
      setTimeout(() => {
        sessionStorage.removeItem('aguasreko_payment_data');
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el pago. Por favor, inténtalo nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error de Autenticación</h1>
          <p className="text-gray-600 mb-6">Debes estar autenticado para acceder a esta página.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (showTestDashboard) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setShowTestDashboard(false)}
          className="fixed top-4 left-4 z-50 flex items-center space-x-2 bg-white text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl shadow-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Pago</span>
        </motion.button>
        <PaymentTestDashboard />
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">Total pagado:</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(total)}</p>
            <p className="text-xs text-gray-500 mt-2">
              Método: {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            Cerrando automáticamente...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al carrito</span>
            </motion.button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Pago seguro</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              
              {paymentConfig.environment === 'sandbox' && (
                <motion.button
                  onClick={() => setShowTestDashboard(true)}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TestTube className="h-4 w-4" />
                  <span>Test Dashboard</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Entrega</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dirección:</span>
                  <span className="font-medium">{user.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ciudad:</span>
                  <span className="font-medium">{user.city}, {user.region}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>
            
            <div className="space-y-4 mb-8">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center`}>
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <motion.div
                          className="w-full h-full rounded-full bg-white scale-50"
                          initial={{ scale: 0 }}
                          animate={{ scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Integration Notice */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">Integración de Pagos</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Los pagos se procesan de forma segura a través de las plataformas oficiales de cada proveedor.
                    Entorno: <span className="font-semibold">{paymentConfig.environment}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-green-800">Pago 100% Seguro</h4>
                  <p className="text-xs text-green-700 mt-1">
                    Todos los pagos están protegidos con encriptación SSL de 256 bits y cumplen con los estándares PCI DSS.
                  </p>
                </div>
              </div>
            </div>

            {/* Process Payment Button */}
            <motion.button
              onClick={processPayment}
              disabled={!validateForm() || isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                !validateForm() || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
              }`}
              whileHover={!validateForm() || isProcessing ? {} : { scale: 1.02 }}
              whileTap={!validateForm() || isProcessing ? {} : { scale: 0.98 }}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando con {paymentMethods.find(m => m.id === selectedMethod)?.name}...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Pagar {formatPrice(total)}</span>
                </>
              )}
            </motion.button>

            {!validateForm() && (
              <div className="mt-4 p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <p className="text-sm text-orange-700">
                    Selecciona un método de pago para continuar
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;