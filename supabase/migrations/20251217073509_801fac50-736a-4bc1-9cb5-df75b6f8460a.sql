-- Create sessions table for invite links
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 8),
  creator_name TEXT,
  partner_name TEXT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interest categories enum
CREATE TYPE public.interest_category AS ENUM (
  'food', 'drinks', 'outdoors', 'culture', 'entertainment', 'nightlife'
);

-- Specific interests table
CREATE TABLE public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category interest_category NOT NULL,
  icon TEXT,
  UNIQUE(name, category)
);

-- Session interests (links users to sessions with their interests)
CREATE TABLE public.session_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  is_creator BOOLEAN NOT NULL,
  interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Saved/liked activities
CREATE TABLE public.saved_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_activities ENABLE ROW LEVEL SECURITY;

-- Public read for sessions (accessed via code)
CREATE POLICY "Sessions are publicly readable" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sessions" ON public.sessions FOR UPDATE USING (true);

-- Public read for interests
CREATE POLICY "Interests are publicly readable" ON public.interests FOR SELECT USING (true);

-- Session interests policies
CREATE POLICY "Session interests are publicly readable" ON public.session_interests FOR SELECT USING (true);
CREATE POLICY "Anyone can add session interests" ON public.session_interests FOR INSERT WITH CHECK (true);

-- Saved activities policies
CREATE POLICY "Saved activities are publicly readable" ON public.saved_activities FOR SELECT USING (true);
CREATE POLICY "Anyone can save activities" ON public.saved_activities FOR INSERT WITH CHECK (true);

-- Seed interests data
INSERT INTO public.interests (name, category, icon) VALUES
-- Food
('Italian', 'food', '🍝'),
('Mexican', 'food', '🌮'),
('Sushi', 'food', '🍣'),
('Pizza', 'food', '🍕'),
('Brunch', 'food', '🥞'),
('Fine Dining', 'food', '🍽️'),
('Street Food', 'food', '🥡'),
('Vegetarian', 'food', '🥗'),
-- Drinks
('Wine Bars', 'drinks', '🍷'),
('Cocktails', 'drinks', '🍸'),
('Craft Beer', 'drinks', '🍺'),
('Coffee', 'drinks', '☕'),
('Bubble Tea', 'drinks', '🧋'),
-- Outdoors
('Hiking', 'outdoors', '🥾'),
('Beach', 'outdoors', '🏖️'),
('Parks', 'outdoors', '🌳'),
('Sunset Views', 'outdoors', '🌅'),
('Picnic', 'outdoors', '🧺'),
-- Culture
('Museums', 'culture', '🏛️'),
('Art Galleries', 'culture', '🎨'),
('Live Music', 'culture', '🎵'),
('Theater', 'culture', '🎭'),
('Bookstores', 'culture', '📚'),
-- Entertainment
('Movies', 'entertainment', '🎬'),
('Bowling', 'entertainment', '🎳'),
('Arcade', 'entertainment', '🕹️'),
('Mini Golf', 'entertainment', '⛳'),
('Escape Room', 'entertainment', '🔐'),
-- Nightlife
('Dancing', 'nightlife', '💃'),
('Live DJ', 'nightlife', '🎧'),
('Karaoke', 'nightlife', '🎤'),
('Rooftop Bar', 'nightlife', '🌃');

-- Enable realtime for sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_interests;