import React, { useState, useEffect } from 'react';
import PaymentPage from './PaymentPage';
import { CartItem } from '../types';

const PaymentRouter: React.FC = () => {
  const [paymentData, setPaymentData] = useState<{ items: CartItem[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment data from sessionStorage
    const storedData = sessionStorage.getItem('aguasreko_payment_data');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPaymentData(data);
      } catch (error) {
        console.error('Error parsing payment data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const handleClose = () => {
    // Clear payment data and go back to main page
    sessionStorage.removeItem('aguasreko_payment_data');
    window.location.hash = '';
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  if (!paymentData || paymentData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">No se encontró información de pago válida.</p>
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <PaymentPage
      cartItems={paymentData.items}
      total={paymentData.total}
      onClose={handleClose}
    />
  );
};

export default PaymentRouter;