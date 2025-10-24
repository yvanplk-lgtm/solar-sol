-- Create contact_info table for company contact details
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  address TEXT NOT NULL DEFAULT 'Abidjan, Côte d''Ivoire',
  phone TEXT NOT NULL DEFAULT '+225 XX XX XX XX XX',
  email TEXT NOT NULL DEFAULT 'contact@mhshs-ci.com'
);

-- Enable Row Level Security
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to contact_info" 
ON public.contact_info 
FOR SELECT 
USING (true);

-- Create policy for all operations (for admin)
CREATE POLICY "Allow all operations on contact_info" 
ON public.contact_info 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert default contact info
INSERT INTO public.contact_info (address, phone, email) 
VALUES ('Abidjan, Côte d''Ivoire', '+225 XX XX XX XX XX', 'contact@mhshs-ci.com');