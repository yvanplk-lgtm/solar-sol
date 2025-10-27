-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. RLS policy for user_roles (users can view their own roles, admins can view all)
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Drop the insecure admin_settings table
DROP TABLE IF EXISTS public.admin_settings;

-- 7. Update RLS policies for all tables to require authentication

-- Clients: Only admins can access
DROP POLICY IF EXISTS "Allow all operations on clients" ON public.clients;
CREATE POLICY "Only admins can view clients"
ON public.clients
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert clients"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update clients"
ON public.clients
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete clients"
ON public.clients
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Invoices: Only admins can access
DROP POLICY IF EXISTS "Allow all operations on invoices" ON public.invoices;
CREATE POLICY "Only admins can view invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert invoices"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Products: Only admins can access
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;
CREATE POLICY "Only admins can view products"
ON public.products
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Company settings: Only admins can access
DROP POLICY IF EXISTS "Allow all operations on company_settings" ON public.company_settings;
CREATE POLICY "Only admins can view company_settings"
ON public.company_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update company_settings"
ON public.company_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Gallery items: Public can view, only admins can modify
DROP POLICY IF EXISTS "Allow all operations on gallery_items" ON public.gallery_items;
CREATE POLICY "Anyone can view gallery items"
ON public.gallery_items
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert gallery items"
ON public.gallery_items
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete gallery items"
ON public.gallery_items
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Team members: Public can view, only admins can modify
DROP POLICY IF EXISTS "Allow all operations on team_members" ON public.team_members;
CREATE POLICY "Anyone can view team members"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Partners: Public can view, only admins can modify
DROP POLICY IF EXISTS "Allow all operations on partners" ON public.partners;
CREATE POLICY "Anyone can view partners"
ON public.partners
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert partners"
ON public.partners
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update partners"
ON public.partners
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete partners"
ON public.partners
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Contact info: Public can view, only admins can modify
DROP POLICY IF EXISTS "Allow all operations on contact_info" ON public.contact_info;
DROP POLICY IF EXISTS "Allow public read access to contact_info" ON public.contact_info;
CREATE POLICY "Anyone can view contact info"
ON public.contact_info
FOR SELECT
USING (true);

CREATE POLICY "Only admins can update contact info"
ON public.contact_info
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));