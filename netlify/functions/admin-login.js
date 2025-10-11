import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://nbgzwwvrklhyvayhsexe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZ3p3d3Zya2xoeXZheWhzZXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDEzMDU2OCwiZXhwIjoyMDc1NzA2NTY4fQ.xhIj8Qk318c3AbhgwOHAhIPTqqzQSgCXf4xViM8QVvE';

export default async function handler(request) {
  console.log('Function called with method:', request.method);
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { username, password } = body;
    if (!username || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Missing username or password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Username:', username, 'Password:', password);

    const query = `${supabaseUrl}/rest/v1/admins?select=password_hash&username=eq.${encodeURIComponent(username)}`;
    const response = await fetch(query, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Supabase response status:', response.status, response.statusText);
      return new Response(JSON.stringify({ success: false, error: 'Database query failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const dataArray = await response.json();
    console.log('Data array:', dataArray);

    if (dataArray.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = dataArray[0];
    const isValid = await bcrypt.compare(password, data.password_hash);
    console.log('IsValid:', isValid);

    if (isValid) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return new Response(JSON.stringify({ success: true, token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
