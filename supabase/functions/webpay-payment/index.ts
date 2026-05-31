import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WebPayConfig {
  commerceCode: string;
  apiKey: string;
  environment: 'integration' | 'test' | 'live';
}

interface PaymentRequest {
  amount: number;
  buyOrder: string;
  sessionId: string;
  returnUrl: string;
}

interface PaymentResponse {
  url: string;
  token: string;
}

const getWebPayConfig = (): WebPayConfig => {
  const environment = Deno.env.get('WEBPAY_ENVIRONMENT') || 'integration';
  const commerceCode = Deno.env.get('WEBPAY_COMMERCE_CODE') || '';
  const apiKey = Deno.env.get('WEBPAY_API_KEY') || '';

  if (!commerceCode || !apiKey) {
    throw new Error('WebPay credentials not configured');
  }

  return {
    commerceCode,
    apiKey,
    environment: environment as 'integration' | 'test' | 'live'
  };
};

const getWebPayBaseUrl = (environment: string): string => {
  switch (environment) {
    case 'live':
      return 'https://webpay3g.transbank.cl';
    case 'test':
      return 'https://webpay3gtest.transbank.cl';
    default:
      return 'https://webpay3gint.transbank.cl';
  }
};

const createWebPayTransaction = async (
  paymentData: PaymentRequest,
  config: WebPayConfig
): Promise<PaymentResponse> => {
  const baseUrl = getWebPayBaseUrl(config.environment);
  const endpoint = `${baseUrl}/rswebpaytransaction/api/webpay/v1.0/transactions`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Tbk-Api-Key-Id': config.commerceCode,
      'Tbk-Api-Key-Secret': config.apiKey,
    },
    body: JSON.stringify({
      buy_order: paymentData.buyOrder,
      session_id: paymentData.sessionId,
      amount: Math.round(paymentData.amount),
      return_url: paymentData.returnUrl,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WebPay error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  return {
    url: result.url,
    token: result.token,
  };
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const body = await req.json();
      const { amount, buyOrder, userId, userName, userEmail } = body;

      if (!amount || !buyOrder || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const config = getWebPayConfig();
      const sessionId = `${userId}_${Date.now()}`;
      const returnUrl = `${req.headers.get('origin')}/payment-return`;

      const paymentResponse = await createWebPayTransaction({
        amount,
        buyOrder,
        sessionId,
        returnUrl,
      }, config);

      await supabaseClient.from('payment_transactions').insert({
        user_id: userId,
        buy_order: buyOrder,
        session_id: sessionId,
        amount,
        token: paymentResponse.token,
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          url: paymentResponse.url,
          token: paymentResponse.token,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const token = url.searchParams.get('token_ws');

      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Missing token' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const config = getWebPayConfig();
      const baseUrl = getWebPayBaseUrl(config.environment);
      const endpoint = `${baseUrl}/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': config.commerceCode,
          'Tbk-Api-Key-Secret': config.apiKey,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WebPay error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      const status = result.status === 'AUTHORIZED' ? 'completed' :
                      result.status === 'FAILED' ? 'failed' : 'cancelled';

      await supabaseClient
        .from('payment_transactions')
        .update({
          status,
          response_code: result.response_code,
          authorization_code: result.authorization_code,
          card_number: result.card_number,
          transaction_date: result.transaction_date,
          updated_at: new Date().toISOString(),
        })
        .eq('token', token);

      return new Response(
        JSON.stringify({
          success: true,
          transaction: result,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('WebPay error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
