// Browser-compatible Transbank Service (Mock Implementation)
// Note: Real Transbank integration should be done on the backend for security

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
  private config: TransbankConfig;

  private constructor() {
    // Initialize with default configuration
    this.config = {
      commerceCode: import.meta.env.VITE_WEBPAY_COMMERCE_CODE || '597055555532',
      apiKey: import.meta.env.VITE_WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
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
      console.log(`Transbank mock service initialized for ${this.config.environment} environment`);
      console.log('Note: This is a frontend mock. Real integration should be done on the backend.');
    } catch (error) {
      console.error('Failed to initialize Transbank:', error);
      throw new Error('Transbank initialization failed');
    }
  }

  // Create a new transaction (Mock implementation)
  public async createTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    try {
      console.log('Creating Transbank transaction (MOCK):', request);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock response
      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockUrl = this.config.environment === 'production' 
        ? `https://webpay3g.transbank.cl/webpayserver/initTransaction`
        : `https://webpay3gint.transbank.cl/webpayserver/initTransaction`;

      const response = {
        token: mockToken,
        url: `${mockUrl}?token_ws=${mockToken}`
      };

      console.log('Transaction created successfully (MOCK):', response);

      return response;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  // Confirm a transaction (Mock implementation)
  public async confirmTransaction(token: string): Promise<TransactionConfirmation> {
    try {
      console.log('Confirming transaction with token (MOCK):', token);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock confirmation based on token
      const isApproved = !token.includes('rejected') && !token.includes('timeout');
      const currentDate = new Date().toISOString().split('T')[0];
      const currentDateTime = new Date().toISOString();

      const response: TransactionConfirmation = {
        vci: isApproved ? 'TSY' : 'TSN',
        amount: 25000, // Mock amount
        status: isApproved ? 'AUTHORIZED' : 'REJECTED',
        buyOrder: `ORDER-${Date.now()}`,
        sessionId: `SESSION-${Date.now()}`,
        cardDetail: {
          cardNumber: '************6623'
        },
        accountingDate: currentDate,
        transactionDate: currentDateTime,
        authorizationCode: isApproved ? `${Math.floor(Math.random() * 1000000)}` : '0',
        paymentTypeCode: 'VN',
        responseCode: isApproved ? 0 : -1,
        installmentsAmount: 25000,
        installmentsNumber: 0,
        balance: 0
      };

      console.log('Transaction confirmed (MOCK):', response);

      return response;
    } catch (error) {
      console.error('Error confirming transaction:', error);
      throw new Error(`Failed to confirm transaction: ${error.message}`);
    }
  }

  // Get transaction status (Mock implementation)
  public async getTransactionStatus(token: string): Promise<TransactionConfirmation> {
    try {
      // Reuse confirm transaction logic for status
      return await this.confirmTransaction(token);
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  // Refund a transaction (Mock implementation)
  public async refundTransaction(token: string, amount: number): Promise<any> {
    try {
      console.log('Refunding transaction (MOCK):', { token, amount });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = {
        type: 'REVERSED',
        authorizationCode: `${Math.floor(Math.random() * 1000000)}`,
        authorizationDate: new Date().toISOString(),
        nullifiedAmount: amount,
        balance: 0,
        responseCode: 0
      };

      console.log('Transaction refunded (MOCK):', response);

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

  // Mock method to simulate Webpay redirect
  public getWebpayRedirectUrl(token: string): string {
    const baseUrl = this.config.environment === 'production' 
      ? 'https://webpay3g.transbank.cl'
      : 'https://webpay3gint.transbank.cl';
    
    return `${baseUrl}/webpayserver/initTransaction?token_ws=${token}`;
  }

  // Mock method to simulate payment form
  public generateMockPaymentForm(token: string, returnUrl: string): string {
    return `
      <form id="webpay-form" action="${this.getWebpayRedirectUrl(token)}" method="POST">
        <input type="hidden" name="token_ws" value="${token}">
        <input type="hidden" name="return_url" value="${returnUrl}">
      </form>
      <script>
        console.log('Mock Webpay form generated. In real implementation, this would redirect to Transbank.');
        // Auto-submit form (in real scenario)
        // document.getElementById('webpay-form').submit();
      </script>
    `;
  }
}

// Export singleton instance
export const transbankService = TransbankService.getInstance();