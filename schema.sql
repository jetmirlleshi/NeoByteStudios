-- Waitlist table for NeoByteStudios divisions
-- Run this on your Neon database to set up the waitlist

CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  division TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (email, division)
);

-- Index for querying by division
CREATE INDEX IF NOT EXISTS idx_waitlist_division ON waitlist (division);

-- Index for querying by email
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);
