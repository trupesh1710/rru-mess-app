import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return new Response(JSON.stringify({ success: false, error: 'Username and password are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (trimmedUsername.length < 3 || trimmedUsername.length > 20 || !/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid username.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (trimmedPassword.length < 6) {
      return new Response(JSON.stringify({ success: false, error: 'Password too short.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Username:', trimmedUsername, 'Password:', trimmedPassword);

    const query = `${supabaseUrl}/rest/v1/admins?select=password_hash&username=eq.${encodeURIComponent(trimmedUsername)}`;
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
    const isValid = await bcrypt.compare(trimmedPassword, data.password_hash);
    console.log('IsValid:', isValid);

    if (isValid) {
      const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here';
      const token = jwt.sign({ username: trimmedUsername }, jwtSecret, { expiresIn: '1h' });
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
