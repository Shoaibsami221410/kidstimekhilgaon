import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials. Please check your .env.local file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkConnection() {
  console.log("Connecting to:", supabaseUrl)
  
  // Try to query the 'users' table that we created in the SQL migration
  const { data, error } = await supabase.from('users').select('*').limit(1)
  
  if (error) {
    console.error("❌ Connection failed or table missing:", error.message)
    console.error(error)
  } else {
    console.log("✅ Success! Your database is connected.")
    console.log(`✅ The 'users' table exists and is accessible.`)
  }
}

checkConnection()
