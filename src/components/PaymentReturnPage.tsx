import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowLeft, Receipt, CreditCard } from 'lucide-react';
import { transbankService } from '../services/transbankService';

const PaymentReturnPage: React.FC = () => {
  const [transactionStatus, setTransactionStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processReturn = async () => {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token_ws') || urlParams.get('token');
        
        if (!token) {
          setError('No se encontró el token de transacción');
          setTransactionStatus('failed');
          return;
        }

        console.log('Processing return with token:', token);

        // Confirm transaction with Transbank
        const result = await transbankService.confirmTransaction(token);
        
        console.log('Transaction result:', result);

        // Determine status based on response
        if (result.status === 'AUTHORIZED') {
          setTransactionStatus('success');
          setTransactionData(result);
          
          // Store successful transaction
          const transactionRecord = {
            ...result,
            timestamp: new Date().toISOString(),
            token
          };
          
          const transactions = JSON.parse(localStorage.getItem('aguasreko_transactions') || '[]');
          transactions.push(transactionRecord);
          localStorage.setItem('aguasreko_transactions', JSON.stringify(transactions));
          
        } else {
          setTransactionStatus('failed');
          setError(`Transacción rechazada: ${result.status}`);
        }
        
      } catch (error) {
        console.error('Error processing payment return:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setTransactionStatus('failed');
      }
    };

    processReturn();
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
  };

  const goHome = () => {
    window.location.href = '/';
  };

  if (transactionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Procesando Pago</h2>
          <p className="text-gray-600">Confirmando tu transacción con el banco...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Status Icon */}
        <motion.div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            transactionStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {transactionStatus === 'success' ? (
            <CheckCircle className="h-10 w-10 text-green-600" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600" />
          )}
        </motion.div>

        {/* Title and Message */}
        <h2 className={`text-3xl font-bold mb-4 ${
          transactionStatus === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transactionStatus === 'success' ? '¡Pago Exitoso!' : 'Pago Fallido'}
        </h2>

        <p className="text-gray-600 mb-6">
          {transactionStatus === 'success' 
            ? 'Tu pago ha sido procesado correctamente. Recibirás un email de confirmación.'
            : `Hubo un problema con tu pago: ${error}`
          }
        </p>

        {/* Transaction Details */}
        {transactionStatus === 'success' && transactionData && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Detalles de la Transacción
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-semibold text-green-600">
                  {formatPrice(transactionData.amount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Orden:</span>
                <span className="font-mono text-gray-900">{transactionData.buyOrder}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Autorización:</span>
                <span className="font-mono text-gray-900">{transactionData.authorizationCode}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tarjeta:</span>
                <span className="font-mono text-gray-900">
                  {formatCardNumber(transactionData.cardNumber)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="text-gray-900">
                  {new Date(transactionData.transactionDate).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            onClick={goHome}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              transactionStatus === 'success'
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al Inicio</span>
          </motion.button>

          {transactionStatus === 'failed' && (
            <motion.button
              onClick={() => window.history.back()}
              className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Intentar Nuevamente
            </motion.button>
          )}
        </div>

        {/* Support Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            ¿Tienes problemas? Contacta nuestro soporte:
          </p>
          <p className="text-sm font-semibold text-blue-800">
            📞 +56 9 6906 1698
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentReturnPage;