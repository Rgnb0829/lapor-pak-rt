-- ─────────────────────────────────────────────────────────────
-- Migration 003: document_requests table (Layanan Surat)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.document_requests (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  purpose       TEXT        NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')),
  admin_notes   TEXT,
  requested_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER document_requests_updated_at
  BEFORE UPDATE ON public.document_requests
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_doc_requests_user ON public.document_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_requests_status ON public.document_requests(status);
