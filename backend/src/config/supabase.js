const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Create Supabase client with service role key (backend only)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;