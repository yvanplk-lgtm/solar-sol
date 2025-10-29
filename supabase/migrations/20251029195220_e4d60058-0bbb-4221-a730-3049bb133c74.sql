-- Add website column to contact_info table
ALTER TABLE public.contact_info 
ADD COLUMN website text DEFAULT 'mhshs-ci.com';

COMMENT ON COLUMN public.contact_info.website IS 'Company website URL';