import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbgzwwvrklhyvayhsexe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ3p3d3Zya2xoeXZheWhzZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzA1NjgsImV4cCI6MjA3NTcwNjU2OH0.PxZISI2gpZtkmX74ChD2Eq-Kt_UVYa2uwTxmRgPRepk';

export const supabase = createClient(supabaseUrl, supabaseKey);
