-- ─────────────────────────────────────────────────────────────
-- Migration 004: Row Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────

-- ── profiles ────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles: read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role & is_verified)
CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND is_verified = (SELECT is_verified FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can read all profiles
CREATE POLICY "profiles: admin read all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── announcements ────────────────────────────────────────────
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Verified warga can read all announcements
CREATE POLICY "announcements: read for verified warga"
  ON public.announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_verified = true
    )
  );

-- Only admins can insert/update/delete
CREATE POLICY "announcements: admin write"
  ON public.announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── document_requests ────────────────────────────────────────
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own requests
CREATE POLICY "doc_requests: read own"
  ON public.document_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own requests (if verified)
CREATE POLICY "doc_requests: insert own"
  ON public.document_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_verified = true
    )
  );

-- Admins can manage all requests
CREATE POLICY "doc_requests: admin all"
  ON public.document_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
