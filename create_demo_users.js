const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsers() {
  console.log('Creating Admin Account...');
  const { data: adminData, error: adminErr } = await supabase.auth.signUp({
    email: 'admin2@kidstime.com',
    password: 'Admin@123',
    options: { data: { role: 'admin', first_name: 'Super', last_name: 'Admin' } }
  });
  if (adminErr) console.error('Admin Error:', adminErr.message);
  else {
    console.log('Admin created!', adminData.user?.id);
    // Update role in users table
    await supabase.from('users').update({ role: 'admin' }).eq('id', adminData.user.id);
  }

  console.log('Creating Parent Account...');
  const { data: parentData, error: parentErr } = await supabase.auth.signUp({
    email: 'parent2@kidstime.com',
    password: 'Parent@123',
    options: { data: { role: 'parent', first_name: 'Demo', last_name: 'Parent' } }
  });
  if (parentErr) console.error('Parent Error:', parentErr.message);
  else {
    console.log('Parent created!', parentData.user?.id);
    await supabase.from('users').update({ role: 'parent' }).eq('id', parentData.user.id);
  }
}

createUsers();
