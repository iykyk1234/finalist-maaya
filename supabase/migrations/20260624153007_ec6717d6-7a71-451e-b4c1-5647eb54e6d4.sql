
DROP POLICY IF EXISTS "Authenticated users can list products" ON public.products;

ALTER TABLE public.products ALTER COLUMN seller_id DROP NOT NULL;

CREATE POLICY "Anyone can list products"
  ON public.products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;

CREATE POLICY "Anyone can upload product images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');
