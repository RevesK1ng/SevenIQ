-- SevenIQ Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  pro BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMestamptz NOT NULL DEFAULT NOW()
);

-- Usage events table for tracking explainer runs
CREATE TABLE IF NOT EXISTS public.usage_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('explainer_run')),
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMestamptz NOT NULL DEFAULT NOW()
);

-- Enhanced usage events table with answer tracking
CREATE TABLE IF NOT EXISTS public.explainer_runs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_text TEXT NOT NULL,
  explanation_mode TEXT NOT NULL CHECK (explanation_mode IN ('child', 'grandma', 'ceo', 'technical')),
  answer TEXT,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  method TEXT,
  word_count INTEGER,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMestamptz NOT NULL DEFAULT NOW()
);

-- Subscriptions table for Stripe integration
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  current_period_end TIMestamptz,
  updated_at TIMestamptz NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_pro ON public.profiles(pro);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON public.usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON public.usage_events(created_at);
CREATE INDEX IF NOT EXISTS idx_explainer_runs_user_id ON public.explainer_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_explainer_runs_mode ON public.explainer_runs(explanation_mode);
CREATE INDEX IF NOT EXISTS idx_explainer_runs_created_at ON public.explainer_runs(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explainer_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_self" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage events policies
CREATE POLICY "usage_select_self" ON public.usage_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_insert_self" ON public.usage_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Explainer runs policies
CREATE POLICY "explainer_runs_select_self" ON public.explainer_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "explainer_runs_insert_self" ON public.explainer_runs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "subs_select_self" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
-- Updates to subscriptions happen via server (service role) or webhook only

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user usage statistics
CREATE OR REPLACE FUNCTION public.get_user_usage_stats(user_uuid UUID)
RETURNS TABLE (
  total_runs INTEGER,
  runs_today INTEGER,
  favorite_mode TEXT,
  avg_confidence DECIMAL(3,2),
  success_rate DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_runs,
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE)::INTEGER as runs_today,
    explanation_mode as favorite_mode,
    AVG(confidence) as avg_confidence,
    (COUNT(*) FILTER (WHERE success = true)::DECIMAL / COUNT(*)::DECIMAL) as success_rate
  FROM public.explainer_runs
  WHERE user_id = user_uuid
  GROUP BY explanation_mode
  ORDER BY COUNT(*) DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.usage_events TO anon, authenticated;
GRANT ALL ON public.explainer_runs TO anon, authenticated;
GRANT ALL ON public.subscriptions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_usage_stats(UUID) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.usage_events IS 'Usage tracking for explainer runs and other events';
COMMENT ON TABLE public.explainer_runs IS 'Detailed tracking of explainer runs with answers and confidence';
COMMENT ON TABLE public.subscriptions IS 'Stripe subscription management';
COMMENT ON COLUMN public.profiles.pro IS 'Whether user has Pro subscription';
COMMENT ON COLUMN public.usage_events.kind IS 'Type of usage event (explainer_run)';
COMMENT ON COLUMN public.usage_events.meta IS 'Additional metadata for the usage event';
COMMENT ON COLUMN public.explainer_runs.answer IS 'The computed answer before AI explanation';
COMMENT ON COLUMN public.explainer_runs.confidence IS 'Confidence score of the computed answer (0-1)';
COMMENT ON COLUMN public.explainer_runs.method IS 'Method used to compute the answer';
COMMENT ON COLUMN public.explainer_runs.success IS 'Whether the explanation generation was successful';
