// Transbank SDK Integration Service
import { WebpayPlus, Options, IntegrationType, Environment } from 'transbank-sdk';

export interface TransbankConfig {
  commerceCode: string;
  apiKey: string;
  environment: 'integration' | 'production';
}

export interface TransactionRequest {
  buyOrder: string;
  sessionId: string;
  amount: number;
  returnUrl: string;
}

export interface TransactionResponse {
  token: string;
  url: string;
}

export interface TransactionConfirmation {
  vci: string;
  amount: number;
  status: string;
  buyOrder: string;
  sessionId: string;
  cardDetail: {
    cardNumber: string;
  };
  accountingDate: string;
  transactionDate: string;
  authorizationCode: string;
  paymentTypeCode: string;
  responseCode: number;
  installmentsAmount: number;
  installmentsNumber: number;
  balance: number;
}

export class TransbankService {
  private static instance: TransbankService;
  private webpayPlus: any;
  private config: TransbankConfig;

  private constructor() {
    // Initialize with default configuration
    this.config = {
      commerceCode: import.meta.env.VITE_WEBPAY_COMMERCE_CODE || '597055555532', // Default integration commerce code
      apiKey: import.meta.env.VITE_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // Default integration API key
      environment: (import.meta.env.VITE_PAYMENT_ENV as 'integration' | 'production') || 'integration'
    };

    this.initializeWebpay();
  }

  public static getInstance(): TransbankService {
    if (!TransbankService.instance) {
      TransbankService.instance = new TransbankService();
    }
    return TransbankService.instance;
  }

  private initializeWebpay(): void {
    try {
      // Configure Webpay Plus with environment
      const environment = this.config.environment === 'production' 
        ? Environment.Production 
        : Environment.Integration;

      // Set configuration
      WebpayPlus.configureForIntegration(this.config.commerceCode, this.config.apiKey);
      
      if (this.config.environment === 'production') {
        WebpayPlus.configureForProduction(this.config.commerceCode, this.config.apiKey);
      }

      this.webpayPlus = WebpayPlus;
      
      console.log(`Transbank initialized for ${this.config.environment} environment`);
    } catch (error) {
      console.error('Failed to initialize Transbank:', error);
      throw new Error('Transbank initialization failed');
    }
  }

  // Create a new transaction
  public async createTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    try {
      console.log('Creating Transbank transaction:', request);

      const response = await this.webpayPlus.Transaction.create(
        request.buyOrder,
        request.sessionId,
        request.amount,
        request.returnUrl
      );

      console.log('Transaction created successfully:', response);

      return {
        token: response.token,
        url: response.url
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  // Confirm a transaction
  public async confirmTransaction(token: string): Promise<TransactionConfirmation> {
    try {
      console.log('Confirming transaction with token:', token);

      const response = await this.webpayPlus.Transaction.commit(token);

      console.log('Transaction confirmed:', response);

      return response;
    } catch (error) {
      console.error('Error confirming transaction:', error);
      throw new Error(`Failed to confirm transaction: ${error.message}`);
    }
  }

  // Get transaction status
  public async getTransactionStatus(token: string): Promise<TransactionConfirmation> {
    try {
      const response = await this.webpayPlus.Transaction.status(token);
      return response;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  // Refund a transaction
  public async refundTransaction(token: string, amount: number): Promise<any> {
    try {
      const response = await this.webpayPlus.Transaction.refund(token, amount);
      return response;
    } catch (error) {
      console.error('Error refunding transaction:', error);
      throw new Error(`Failed to refund transaction: ${error.message}`);
    }
  }

  // Update configuration
  public updateConfig(newConfig: Partial<TransbankConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeWebpay();
  }

  // Get current configuration
  public getConfig(): TransbankConfig {
    return { ...this.config };
  }

  // Validate configuration
  public validateConfig(): boolean {
    return !!(this.config.commerceCode && this.config.apiKey);
  }

  // Generate unique buy order
  public static generateBuyOrder(): string {
    return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate session ID
  public static generateSessionId(): string {
    return `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Format amount for Transbank (must be integer)
  public static formatAmount(amount: number): number {
    return Math.round(amount);
  }

  // Validate amount
  public static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 999999999; // Max amount allowed by Transbank
  }

  // Get test cards for integration environment
  public static getTestCards() {
    return {
      approved: {
        number: '4051885600446623',
        cvv: '123',
        expiryMonth: '11',
        expiryYear: '25'
      },
      rejected: {
        number: '4051885600446631',
        cvv: '123',
        expiryMonth: '11',
        expiryYear: '25'
      },
      timeout: {
        number: '4051885600446649',
        cvv: '123',
        expiryMonth: '11',
        expiryYear: '25'
      }
    };
  }
}

// Export singleton instance
export const transbankService = TransbankService.getInstance();