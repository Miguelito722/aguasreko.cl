// Payment Configuration and Environment Management
import { transbankService } from '../services/transbankService';

export interface PaymentConfig {
  environment: 'sandbox' | 'production';
  webpay: {
    commerceCode: string;
    apiKey: string;
    baseUrl: string;
    returnUrl: string;
    finalUrl: string;
  };
  mach: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    webhookSecret: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    webhookId: string;
  };
  mercadopago: {
    accessToken: string;
    publicKey: string;
    baseUrl: string;
    webhookSecret: string;
  };
}

// Environment-based configuration
const getPaymentConfig = (): PaymentConfig => {
  const environment = (import.meta.env.VITE_PAYMENT_ENV as 'sandbox' | 'production') || 'sandbox';
  
  if (environment === 'production') {
    return {
      environment: 'production',
      webpay: {
        commerceCode: import.meta.env.VITE_WEBPAY_COMMERCE_CODE || '597055555532',
        apiKey: import.meta.env.VITE_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        baseUrl: 'https://webpay3g.transbank.cl',
        returnUrl: `${window.location.origin}/payment-return`,
        finalUrl: `${window.location.origin}/payment-final`
      },
      mach: {
        clientId: import.meta.env.VITE_MACH_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_MACH_CLIENT_SECRET || '',
        baseUrl: 'https://api.mach.cl',
        webhookSecret: import.meta.env.VITE_MACH_WEBHOOK_SECRET || ''
      },
      paypal: {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || '',
        baseUrl: 'https://api.paypal.com',
        webhookId: import.meta.env.VITE_PAYPAL_WEBHOOK_ID || ''
      },
      mercadopago: {
        accessToken: import.meta.env.VITE_MP_ACCESS_TOKEN || '',
        publicKey: import.meta.env.VITE_MP_PUBLIC_KEY || '',
        baseUrl: 'https://api.mercadopago.com',
        webhookSecret: import.meta.env.VITE_MP_WEBHOOK_SECRET || ''
      }
    };
  }

  // Sandbox configuration
  return {
    environment: 'sandbox',
    webpay: {
      commerceCode: '597055555532',
      apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      baseUrl: 'https://webpay3gint.transbank.cl',
      returnUrl: `${window.location.origin}/payment-return`,
      finalUrl: `${window.location.origin}/payment-final`
    },
    mach: {
      clientId: 'sandbox_client_id',
      clientSecret: 'sandbox_client_secret',
      baseUrl: 'https://sandbox-api.mach.cl',
      webhookSecret: 'sandbox_webhook_secret'
    },
    paypal: {
      clientId: 'sandbox_paypal_client_id',
      clientSecret: 'sandbox_paypal_client_secret',
      baseUrl: 'https://api.sandbox.paypal.com',
      webhookId: 'sandbox_webhook_id'
    },
    mercadopago: {
      accessToken: 'TEST-access-token',
      publicKey: 'TEST-public-key',
      baseUrl: 'https://api.mercadopago.com',
      webhookSecret: 'sandbox_webhook_secret'
    }
  };
};

export const paymentConfig = getPaymentConfig();

// SSL Certificate validation for PCI DSS compliance
export const validateSSL = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/ssl-check');
    const { valid, certificate } = await response.json();
    
    if (!valid) {
      console.error('SSL Certificate validation failed');
      return false;
    }
    
    // Verify certificate meets PCI DSS requirements
    const requiredFeatures = ['TLS 1.2+', 'SHA-256', 'RSA 2048+'];
    const hasRequiredFeatures = requiredFeatures.every(feature => 
      certificate.features.includes(feature)
    );
    
    return hasRequiredFeatures;
  } catch (error) {
    console.error('SSL validation error:', error);
    return false;
  }
};