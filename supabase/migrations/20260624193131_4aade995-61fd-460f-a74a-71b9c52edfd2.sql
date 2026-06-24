
-- 1) Restrict public SELECT and add authenticated SELECT
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

CREATE POLICY "Authenticated users can view products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

-- Public-safe view without contact info
CREATE OR REPLACE VIEW public.products_public
WITH (security_invoker = true) AS
SELECT id, seller_id, name, brand, description, price, category,
       image_url, locality, seller_name, rating, created_at
FROM public.products;

-- Allow anon read of the safe view only
CREATE POLICY "Anon can view non-contact product fields"
ON public.products
FOR SELECT
TO anon
USING (false);

GRANT SELECT ON public.products_public TO anon, authenticated;

-- 2) Fix permissive INSERT (always-true check + anon allowed)
DROP POLICY IF EXISTS "Anyone can list products" ON public.products;

CREATE POLICY "Authenticated users can list their own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);
