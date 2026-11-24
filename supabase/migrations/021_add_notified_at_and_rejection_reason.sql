-- Migration 021: Track submitter email notifications (idempotency) and optional rejection reason

ALTER TABLE public.mods
  ADD COLUMN IF NOT EXISTS notified_at      timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE INDEX IF NOT EXISTS mods_unnotified_submissions_idx
  ON public.mods(status, submitted_by)
  WHERE submitted_by IS NOT NULL AND notified_at IS NULL;
