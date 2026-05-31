/*
  # Payment Transactions Table

  1. Purpose
    - Store WebPay payment transaction records
    - Track payment status and details
    - Maintain audit trail of all transactions

  2. New Tables
    - `payment_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `buy_order` (text, unique)
      - `session_id` (text, unique)
      - `token` (text, unique)
      - `amount` (integer)
      - `status` (text: pending, completed, failed, cancelled)
      - `response_code` (integer)
      - `authorization_code` (text)
      - `card_number` (text, masked)
      - `transaction_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Security (RLS)
    - Enable RLS on payment_transactions
    - Users can read their own transactions
    - Only system (edge functions) can insert/update

  4. Important Notes
    - Card numbers are stored masked (only last 4 digits)
    - Transactions are immutable after completion
    - Status transitions: pending -> completed | failed | cancelled
*/

CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  buy_order text UNIQUE NOT NULL,
  session_id text UNIQUE NOT NULL,
  token text UNIQUE,
  amount integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  response_code integer,
  authorization_code text,
  card_number text,
  transaction_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions"
  ON payment_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_buy_order ON payment_transactions(buy_order);