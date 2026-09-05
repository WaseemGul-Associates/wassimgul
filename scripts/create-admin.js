// One-off bootstrap: creates the first Admin account.
// Usage: node scripts/create-admin.js <email> <password> "<Full Name>"
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const [email, password, fullName] = process.argv.slice(2);
  if (!email || !password || !fullName) {
    console.error('Usage: node scripts/create-admin.js <email> <password> "<Full Name>"');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'admin' },
  });

  if (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }

  console.log(`Admin account created: ${data.user.email} (id: ${data.user.id})`);
}

main();
