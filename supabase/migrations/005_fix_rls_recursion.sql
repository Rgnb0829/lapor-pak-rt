-- ─────────────────────────────────────────────────────────────
-- Migration 005: Fix RLS infinite recursion on profiles table
--
-- Root cause: policies queried public.profiles inside their own
-- USING/WITH CHECK expressions, causing PostgreSQL to recursively
-- evaluate SELECT policies → infinite loop.
--
-- Fix: SECURITY DEFINER helper functions bypass RLS entirely,
-- so policies can safely read role/is_verified without recursion.
-- ─────────────────────────────────────────────────────────────

-- ── 1. Drop old problematic policies ─────────────────────────
DROP POLICY IF EXISTS "profiles: read own"       ON public.profiles;
DROP POLICY IF EXISTS "profiles: update own"     ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;

DROP POLICY IF EXISTS "announcements: read for verified warga" ON public.announcements;
DROP POLICY IF EXISTS "announcements: admin write"             ON public.announcements;

DROP POLICY IF EXISTS "doc_requests: read own"    ON public.document_requests;
DROP POLICY IF EXISTS "doc_requests: insert own"  ON public.document_requests;
DROP POLICY IF EXISTS "doc_requests: admin all"   ON public.document_requests;

-- ── 2. Helper functions (SECURITY DEFINER bypasses RLS) ──────

-- Returns current user's role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Returns current user's verification status without triggering RLS
CREATE OR REPLACE FUNCTION public.get_my_is_verified()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT is_verified FROM public.profiles WHERE id = auth.uid()
$$;

-- ── 3. Recreate profiles policies ────────────────────────────

-- Users can read their own profile
CREATE POLICY "profiles: read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile, cannot change role or is_verified
CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role       = public.get_my_role()
    AND is_verified = public.get_my_is_verified()
  );

-- Admins can read all profiles (uses function, no recursion)
CREATE POLICY "profiles: admin read all"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() = 'admin');

-- ── 4. Recreate announcements policies ───────────────────────

-- Verified warga can read all announcements
CREATE POLICY "announcements: read for verified warga"
  ON public.announcements FOR SELECT
  USING (public.get_my_is_verified() = true);

-- Only admins can insert/update/delete
CREATE POLICY "announcements: admin write"
  ON public.announcements FOR ALL
  USING (public.get_my_role() = 'admin');

-- ── 5. Recreate document_requests policies ───────────────────

-- Users can read their own requests
CREATE POLICY "doc_requests: read own"
  ON public.document_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own requests (only if verified)
CREATE POLICY "doc_requests: insert own"
  ON public.document_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.get_my_is_verified() = true
  );

-- Admins can manage all requests
CREATE POLICY "doc_requests: admin all"
  ON public.document_requests FOR ALL
  USING (public.get_my_role() = 'admin');
