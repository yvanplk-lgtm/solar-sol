-- Create admin_settings table for admin credentials
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password TEXT NOT NULL DEFAULT 'yvan221Z',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default admin password
INSERT INTO public.admin_settings (password) VALUES ('yvan221Z');

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy allowing all operations
CREATE POLICY "Allow all operations on admin_settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);
