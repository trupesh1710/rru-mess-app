# TODO: Add Database Authentication for Admin

## Steps to Complete

- [x] Create netlify/functions/admin-login.js for serverless login API
- [x] Create netlify.toml for Netlify configuration
- [x] Add @supabase/supabase-js and bcryptjs to package.json dependencies
- [x] Modify src/AdminLogin.jsx to call the Netlify function for authentication
- [x] Modify src/AdminPanel.jsx to check for authentication token instead of 'isAdmin'
- [x] Set up Supabase database table and insert default admin user
- [ ] Test the login functionality locally with netlify dev
- [ ] Deploy to Netlify and verify  

## Notes
- Supabase URL: https://nbgzwvwrklhyvayhsexe.supabase.co
- Supabase Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ3p3d3Zya2xoeXZheWhzZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzA1NjgsImV4cCI6MjA3NTcwNjU2OH0.PxZISI2gpZtkmX74ChD2Eq-Kt_UVYa2uwTxmRgPRepk
- Default admin: username 'admin', password 'admin123' (hashed in DB)
