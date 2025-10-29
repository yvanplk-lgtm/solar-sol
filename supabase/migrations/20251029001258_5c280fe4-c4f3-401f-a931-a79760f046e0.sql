-- Add footer_text column to contact_info table
ALTER TABLE public.contact_info 
ADD COLUMN footer_text text DEFAULT 'Merci pour votre confiance';

COMMENT ON COLUMN public.contact_info.footer_text IS 'Custom footer text for invoices and quotes';