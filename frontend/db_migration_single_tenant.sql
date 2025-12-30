-- 1. Rename existing tables (which were implicitly for Sri Brundabana) to have _sb suffix
ALTER TABLE IF EXISTS dues RENAME TO dues_sb;
ALTER TABLE IF EXISTS orders RENAME TO orders_sb;
ALTER TABLE IF EXISTS billers RENAME TO billers_sb;

-- 2. Create tables for Shree Footwear (_sf) with the same structure
-- We use 'INCLUDING ALL' to copy constraints, indexes, and defaults (like id generation)
CREATE TABLE IF NOT EXISTS dues_sf (LIKE dues_sb INCLUDING ALL);
CREATE TABLE IF NOT EXISTS orders_sf (LIKE orders_sb INCLUDING ALL);
CREATE TABLE IF NOT EXISTS billers_sf (LIKE billers_sb INCLUDING ALL);

-- 3. Ensure the shared users table exists (if not created by previous steps)
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'Executive',
    sf_approved BOOLEAN DEFAULT FALSE,
    sb_approved BOOLEAN DEFAULT FALSE
);

-- 4. Seed users if the table was just created (using ON CONFLICT to avoid errors)
INSERT INTO public.app_users (full_name, email, password, role, sf_approved, sb_approved)
VALUES 
    ('Sahil Kumar', 'sahilsync07@gmail.com', 'Sahil@123', 'Managing Director', TRUE, TRUE),
    ('S Lokanatha Patro', 'patrosln07@gmail.com', 'Patro@123', 'Founder', TRUE, TRUE)
ON CONFLICT (email) DO UPDATE 
SET sf_approved = TRUE, sb_approved = TRUE;
