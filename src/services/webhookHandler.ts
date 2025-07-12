import crypto from 'crypto';
import { paymentConfig } from '../config/payment';

// Webhook signature verification for security
export class WebhookHandler {
  // Verify Webpay webhook signature
  static verifyWebpaySignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', paymentConfig.webpay.apiKey)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Verify Mach webhook signature
  static verifyMachSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', paymentConfig.mach.webhookSecret)
      .update(payload)
      .digest('base64');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'base64'),
      Buffer.from(expectedSignature, 'base64')
    );
  }

  // Verify PayPal webhook signature
  static verifyPayPalSignature(
    payload: string,
    headers: Record<string, string>
  ): boolean {
    const authAlgo = headers['paypal-auth-algo'];
    const transmission_id = headers['paypal-transmission-id'];
    const cert_id = headers['paypal-cert-id'];
    const transmission_sig = headers['paypal-transmission-sig'];
    const transmission_time = headers['paypal-transmission-time'];
    
    // PayPal signature verification logic would go here
    // This requires PayPal's webhook verification SDK
    return true; // Simplified for demo
  }

  // Verify Mercado Pago webhook signature
  static verifyMercadoPagoSignature(
    payload: string,
    signature: string,
    timestamp: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', paymentConfig.mercadopago.webhookSecret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Process webhook events
  static async processWebhook(
    provider: 'webpay' | 'mach' | 'paypal' | 'mercadopago',
    payload: any,
    headers: Record<string, string>
  ) {
    try {
      switch (provider) {
        case 'webpay':
          return await this.processWebpayWebhook(payload, headers);
        case 'mach':
          return await this.processMachWebhook(payload, headers);
        case 'paypal':
          return await this.processPayPalWebhook(payload, headers);
        case 'mercadopago':
          return await this.processMercadoPagoWebhook(payload, headers);
        default:
          throw new Error(`Unknown payment provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Webhook processing error for ${provider}:`, error);
      throw error;
    }
  }

  private static async processWebpayWebhook(payload: any, headers: Record<string, string>) {
    const signature = headers['tbk-signature'];
    if (!this.verifyWebpaySignature(JSON.stringify(payload), signature)) {
      throw new Error('Invalid Webpay webhook signature');
    }

    // Process Webpay payment confirmation
    const { transaction_id, status, amount } = payload;
    
    if (status === 'AUTHORIZED') {
      await this.updateOrderStatus(transaction_id, 'completed', amount);
      await this.sendConfirmationEmail(transaction_id);
    } else {
      await this.updateOrderStatus(transaction_id, 'failed', amount);
    }

    return { status: 'processed' };
  }

  private static async processMachWebhook(payload: any, headers: Record<string, string>) {
    const signature = headers['mach-signature'];
    if (!this.verifyMachSignature(JSON.stringify(payload), signature)) {
      throw new Error('Invalid Mach webhook signature');
    }

    const { payment_id, status, amount } = payload;
    
    if (status === 'approved') {
      await this.updateOrderStatus(payment_id, 'completed', amount);
      await this.sendConfirmationEmail(payment_id);
    } else {
      await this.updateOrderStatus(payment_id, 'failed', amount);
    }

    return { status: 'processed' };
  }

  private static async processPayPalWebhook(payload: any, headers: Record<string, string>) {
    if (!this.verifyPayPalSignature(JSON.stringify(payload), headers)) {
      throw new Error('Invalid PayPal webhook signature');
    }

    const { event_type, resource } = payload;
    
    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const { id, status, amount } = resource;
      await this.updateOrderStatus(id, 'completed', amount.value);
      await this.sendConfirmationEmail(id);
    } else if (event_type === 'PAYMENT.CAPTURE.DENIED') {
      const { id, amount } = resource;
      await this.updateOrderStatus(id, 'failed', amount.value);
    }

    return { status: 'processed' };
  }

  private static async processMercadoPagoWebhook(payload: any, headers: Record<string, string>) {
    const signature = headers['x-signature'];
    const timestamp = headers['x-request-id'];
    
    if (!this.verifyMercadoPagoSignature(JSON.stringify(payload), signature, timestamp)) {
      throw new Error('Invalid Mercado Pago webhook signature');
    }

    const { type, data } = payload;
    
    if (type === 'payment') {
      const paymentId = data.id;
      // Fetch payment details from Mercado Pago API
      const paymentDetails = await this.fetchMercadoPagoPayment(paymentId);
      
      if (paymentDetails.status === 'approved') {
        await this.updateOrderStatus(paymentId, 'completed', paymentDetails.transaction_amount);
        await this.sendConfirmationEmail(paymentId);
      } else {
        await this.updateOrderStatus(paymentId, 'failed', paymentDetails.transaction_amount);
      }
    }

    return { status: 'processed' };
  }

  private static async updateOrderStatus(orderId: string, status: string, amount: number) {
    // Update order status in database
    console.log(`Updating order ${orderId} to status: ${status}, amount: ${amount}`);
    
    // In a real implementation, this would update your database
    const orderUpdate = {
      orderId,
      status,
      amount,
      updatedAt: new Date().toISOString(),
    };
    
    // Store in localStorage for demo purposes
    const existingOrders = JSON.parse(localStorage.getItem('aguasreko_orders') || '[]');
    const updatedOrders = existingOrders.map((order: any) => 
      order.orderId === orderId ? { ...order, ...orderUpdate } : order
    );
    
    if (!existingOrders.find((order: any) => order.orderId === orderId)) {
      updatedOrders.push(orderUpdate);
    }
    
    localStorage.setItem('aguasreko_orders', JSON.stringify(updatedOrders));
  }

  private static async sendConfirmationEmail(orderId: string) {
    // Send confirmation email to customer
    console.log(`Sending confirmation email for order: ${orderId}`);
    
    // In a real implementation, this would trigger an email service
    const emailData = {
      orderId,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    // Store email log for demo purposes
    const emailLogs = JSON.parse(localStorage.getItem('aguasreko_emails') || '[]');
    emailLogs.push(emailData);
    localStorage.setItem('aguasreko_emails', JSON.stringify(emailLogs));
  }

  private static async fetchMercadoPagoPayment(paymentId: string) {
    // Fetch payment details from Mercado Pago API
    const response = await fetch(`${paymentConfig.mercadopago.baseUrl}/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${paymentConfig.mercadopago.accessToken}`,
      },
    });
    
    return response.json();
  }
}