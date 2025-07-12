import { paymentConfig } from '../config/payment';
import { CartItem } from '../types';

// Base API service with security headers
class PaymentAPIService {
  private baseHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
  };

  private async makeSecureRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.baseHeaders,
        ...options.headers,
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Webpay Plus Integration
  async createWebpayTransaction(orderData: {
    amount: number;
    orderId: string;
    customerInfo: any;
    items: CartItem[];
  }) {
    const payload = {
      buy_order: orderData.orderId,
      session_id: `session_${Date.now()}`,
      amount: orderData.amount,
      return_url: paymentConfig.webpay.returnUrl,
    };

    return this.makeSecureRequest('/api/webpay/create', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${paymentConfig.webpay.apiKey}`,
        'Tbk-Api-Key-Id': paymentConfig.webpay.commerceCode,
      },
    });
  }

  async confirmWebpayTransaction(token: string) {
    return this.makeSecureRequest('/api/webpay/confirm', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'Authorization': `Bearer ${paymentConfig.webpay.apiKey}`,
        'Tbk-Api-Key-Id': paymentConfig.webpay.commerceCode,
      },
    });
  }

  // Mach Integration
  async createMachPayment(orderData: {
    amount: number;
    description: string;
    customerInfo: any;
  }) {
    const payload = {
      amount: orderData.amount,
      currency: 'CLP',
      description: orderData.description,
      customer: {
        email: orderData.customerInfo.email,
        phone: orderData.customerInfo.phone,
        name: orderData.customerInfo.name,
      },
      callback_url: `${window.location.origin}/api/webhooks/mach`,
      return_url: `${window.location.origin}/payment-return`,
    };

    return this.makeSecureRequest('/api/mach/create', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${await this.getMachAccessToken()}`,
      },
    });
  }

  private async getMachAccessToken() {
    const response = await this.makeSecureRequest('/api/mach/auth', {
      method: 'POST',
      body: JSON.stringify({
        client_id: paymentConfig.mach.clientId,
        client_secret: paymentConfig.mach.clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    return response.access_token;
  }

  // PayPal Integration
  async createPayPalOrder(orderData: {
    amount: number;
    currency: string;
    items: CartItem[];
    customerInfo: any;
  }) {
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: orderData.currency,
              value: orderData.amount.toFixed(2),
            },
          },
        },
        items: orderData.items.map(item => ({
          name: item.name,
          unit_amount: {
            currency_code: orderData.currency,
            value: (item.price / 800).toFixed(2), // Convert CLP to USD
          },
          quantity: item.quantity.toString(),
        })),
        shipping: {
          address: {
            address_line_1: orderData.customerInfo.address,
            admin_area_2: orderData.customerInfo.city,
            admin_area_1: orderData.customerInfo.region,
            country_code: 'CL',
          },
        },
      }],
      application_context: {
        return_url: `${window.location.origin}/payment-return`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        brand_name: 'Aguas Reko',
        locale: 'es-CL',
        user_action: 'PAY_NOW',
      },
    };

    return this.makeSecureRequest('/api/paypal/create', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${await this.getPayPalAccessToken()}`,
      },
    });
  }

  private async getPayPalAccessToken() {
    const response = await this.makeSecureRequest('/api/paypal/auth', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${paymentConfig.paypal.clientId}:${paymentConfig.paypal.clientSecret}`)}`,
      },
    });

    return response.access_token;
  }

  // Mercado Pago Integration
  async createMercadoPagoPreference(orderData: {
    items: CartItem[];
    customerInfo: any;
  }) {
    const payload = {
      items: orderData.items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'CLP',
      })),
      payer: {
        name: orderData.customerInfo.name,
        email: orderData.customerInfo.email,
        phone: {
          number: orderData.customerInfo.phone,
        },
        address: {
          street_name: orderData.customerInfo.address,
          city: orderData.customerInfo.city,
        },
      },
      back_urls: {
        success: `${window.location.origin}/payment-success`,
        failure: `${window.location.origin}/payment-failure`,
        pending: `${window.location.origin}/payment-pending`,
      },
      auto_return: 'approved',
      notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
      external_reference: `ORDER-${Date.now()}`,
    };

    return this.makeSecureRequest('/api/mercadopago/create', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${paymentConfig.mercadopago.accessToken}`,
      },
    });
  }
}

export const paymentAPI = new PaymentAPIService();