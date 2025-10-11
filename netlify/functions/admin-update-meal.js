import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request) {
  if (request.method !== 'PATCH') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { token, id, ...mealData } = body;

    if (!token || !id || !mealData.date || !mealData.breakfast || !mealData.lunch || !mealData.snacks || !mealData.dinner) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields or token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update meal
    const { data, error } = await supabase
      .from('meals')
      .update(mealData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to update meal' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
