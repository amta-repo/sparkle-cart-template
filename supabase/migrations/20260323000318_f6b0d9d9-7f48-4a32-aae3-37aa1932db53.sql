ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'mtn_momo',
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_reference text,
ADD COLUMN IF NOT EXISTS payer_phone text,
ADD COLUMN IF NOT EXISTS payment_currency text NOT NULL DEFAULT 'XOF';

CREATE INDEX IF NOT EXISTS idx_orders_user_payment_status ON public.orders(user_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON public.orders(payment_reference);