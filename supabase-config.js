/* ════════════════════════════════════════
   SUPABASE CONFIGURATION
   ════════════════════════════════════════ */

const SUPABASE_URL = 'https://yhxsisiycvkslwyzlesn.supabase.co/rest/v1';
const SUPABASE_KEY = 'sb_publishable_h6Eri67mOnrRL1mhsGFBiw_khpcDzgw';

/**
 * Helper function to perform requests to Supabase REST API
 * @param {string} table - The table name (e.g. 'users')
 * @param {string} method - GET, POST, PATCH, DELETE
 * @param {object} data - JSON payload for POST/PATCH
 * @param {string} query - Query parameters (e.g. '?email=eq.test@example.com')
 */
async function supabaseRequest(table, method = 'GET', data = null, query = '') {
  const url = `${SUPABASE_URL}/${table}${query}`;
  const options = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation' // Return the modified row(s) on POST/PATCH
    }
  };

  if (data && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Supabase request failed');
    }
    
    // For DELETE or 204 No Content, there might not be JSON
    if (response.status === 204) return null;
    
    return await response.json();
  } catch (error) {
    console.error(`Supabase Error (${method} ${table}):`, error);
    throw error;
  }
}
