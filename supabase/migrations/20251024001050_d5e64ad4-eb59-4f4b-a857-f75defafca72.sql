-- Create partners table for partner logos
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow all operations on partners" 
ON public.partners 
FOR ALL 
USING (true) 
WITH CHECK (true);