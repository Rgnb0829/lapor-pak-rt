-- ─────────────────────────────────────────────────────────────
-- Migration 002: announcements table (Mading)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.announcements (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title      VARCHAR(255) NOT NULL,
  content    TEXT         NOT NULL,
  image_url  TEXT,
  category   VARCHAR(50)  DEFAULT 'umum' CHECK (category IN ('umum', 'keamanan', 'kebersihan', 'sosial', 'lainnya')),
  author_id  UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_author ON public.announcements(author_id);
