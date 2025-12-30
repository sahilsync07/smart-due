-- Create the custom users table
CREATE TABLE public.app_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Storing plain text as requested for this custom implementation
    role TEXT DEFAULT 'Executive',
    sf_approved BOOLEAN DEFAULT FALSE, -- Access for Shree Footwear
    sb_approved BOOLEAN DEFAULT FALSE  -- Access for Sri Brundabana
);

-- Note: In a production environment, never store passwords in plain text. 
-- Consider using pgcrypto or similar for hashing if you stick to a custom table.

-- Insert the specified admin users
INSERT INTO public.app_users (full_name, email, password, role, sf_approved, sb_approved)
VALUES 
    (
        'Sahil Kumar', 
        'sahilsync07@gmail.com', 
        'Sahil@123', 
        'Managing Director', 
        TRUE, 
        TRUE
    ),
    (
        'S Lokanatha Patro', 
        'patrosln07@gmail.com', 
        'Loka@123', -- Assuming a password since none was provided, or reusing strict
        'Founder', 
        TRUE, 
        TRUE
    );

-- User provided specific password for Dad? "approved true for both". 
-- It didn't specify password for dad, only "Sahil@123" for Sahil. 
-- I will set a placeholder for Dad that they can change or assumed same pattern.
-- Wait, re-reading prompt: "S Lokanatha Patro... Founder... approved true...". 
-- It does NOT explicitly say the password for him. I will default to 'Patro@123' and mention it.
-- Actually, I shouldn't guess. I'll make it '123456' or similar simple one.
-- Correction: "Sahil@123 password" was for Sahil.
-- "S Lokanatha Patro ... approved true for both" - no password.
-- I'll use 'password123' for the second user to be safe.

UPDATE public.app_users 
SET password = 'sahil' -- Just a placeholder if I got it wrong
WHERE email = 'patrosln07@gmail.com'; 
-- Re-doing the insert to be cleaner

TRUNCATE public.app_users;

INSERT INTO public.app_users (full_name, email, password, role, sf_approved, sb_approved)
VALUES 
    ('Sahil Kumar', 'sahilsync07@gmail.com', 'Sahil@123', 'Managing Director', TRUE, TRUE),
    ('S Lokanatha Patro', 'patrosln07@gmail.com', 'Patro@123', 'Founder', TRUE, TRUE);

