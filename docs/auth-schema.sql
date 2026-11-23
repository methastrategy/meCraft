-- ==============================================================================
-- meCraft Ecosystem — Supabase Auth, Profiles & Entitlements Schema v3.2.1
-- ==============================================================================

-- 1. Create profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free_member' CHECK (tier IN ('free_member', 'pro_monthly', 'pro_yearly', 'lifetime')),
  storage_used_bytes BIGINT DEFAULT 0,
  storage_limit_bytes BIGINT DEFAULT 104857600, -- 100 MB default for free members
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create subscriptions table for future billing integration (Stripe / LemonSqueezy / PromptPay)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('pro_monthly', 'pro_yearly', 'lifetime')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  provider TEXT DEFAULT 'stripe', -- 'stripe', 'lemonsqueezy', 'promptpay'
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create app entitlements table
CREATE TABLE IF NOT EXISTS public.app_entitlements (
  tier TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  is_unlocked BOOLEAN DEFAULT true,
  PRIMARY KEY (tier, feature_key)
);

-- Insert default feature entitlements
INSERT INTO public.app_entitlements (tier, feature_key, is_unlocked) VALUES
  -- Free Member Entitlements
  ('free_member', 'app:mepdf:basic', true),
  ('free_member', 'app:mephoto:basic', true),
  ('free_member', 'app:medoc:basic', true),
  ('free_member', 'app:melight:basic', true),
  ('free_member', 'app:mevector:basic', true),
  ('free_member', 'app:mefilm:basic', true),
  ('free_member', 'app:meaudio:basic', true),
  ('free_member', 'feature:4k_render', false),
  ('free_member', 'feature:ai_ocr_unlimited', false),
  ('free_member', 'feature:ai_bg_removal', false),
  ('free_member', 'feature:raw_color_curves', false),
  ('free_member', 'feature:cloud_backup', false),

  -- Pro Member Entitlements (Full Access)
  ('pro_monthly', 'app:mepdf:basic', true),
  ('pro_monthly', 'app:mephoto:basic', true),
  ('pro_monthly', 'app:medoc:basic', true),
  ('pro_monthly', 'app:melight:basic', true),
  ('pro_monthly', 'app:mevector:basic', true),
  ('pro_monthly', 'app:mefilm:basic', true),
  ('pro_monthly', 'app:meaudio:basic', true),
  ('pro_monthly', 'feature:4k_render', true),
  ('pro_monthly', 'feature:ai_ocr_unlimited', true),
  ('pro_monthly', 'feature:ai_bg_removal', true),
  ('pro_monthly', 'feature:raw_color_curves', true),
  ('pro_monthly', 'feature:cloud_backup', true),

  ('pro_yearly', 'app:mepdf:basic', true),
  ('pro_yearly', 'app:mephoto:basic', true),
  ('pro_yearly', 'app:medoc:basic', true),
  ('pro_yearly', 'app:melight:basic', true),
  ('pro_yearly', 'app:mevector:basic', true),
  ('pro_yearly', 'app:mefilm:basic', true),
  ('pro_yearly', 'app:meaudio:basic', true),
  ('pro_yearly', 'feature:4k_render', true),
  ('pro_yearly', 'feature:ai_ocr_unlimited', true),
  ('pro_yearly', 'feature:ai_bg_removal', true),
  ('pro_yearly', 'feature:raw_color_curves', true),
  ('pro_yearly', 'feature:cloud_backup', true)
ON CONFLICT (tier, feature_key) DO UPDATE SET is_unlocked = EXCLUDED.is_unlocked;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_entitlements ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Subscriptions: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- App Entitlements: Publicly readable for authenticated users
CREATE POLICY "Entitlements are readable by all authenticated users" 
  ON public.app_entitlements FOR SELECT 
  TO authenticated 
  USING (true);

-- 6. Automatically create profile upon user signup via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, tier)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'free_member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
