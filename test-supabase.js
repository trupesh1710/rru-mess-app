import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://nbgzwvwrklhyvayhsexe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ3p3d3Zya2xoeXZheWhzZXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDEzMDU2OCwiZXhwIjoyMDc1NzA2NTY4fQ.xhIj8Qk318c3AbhgwOHAhIPTqqzQSgCXf4xViM8QVvE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('username', 'admin')
      .single();

    console.log('Data:', data);
    console.log('Error:', error);

    if (data) {
      const isValid = await bcrypt.compare('admin123', data.password_hash);
      console.log('IsValid:', isValid);
      if (isValid) {
        console.log('Login successful!');
      } else {
        console.log('Password mismatch');
      }
    } else {
      console.log('No admin found');
    }
  } catch (err) {
    console.error('Test error:', err);
  }
}

testLogin();
