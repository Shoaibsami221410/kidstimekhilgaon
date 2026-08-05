import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function check() {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      teachers (
        id,
        qualifications,
        experience,
        users (
          full_name
        )
      )
    `)
    .eq("id", "c1111111-1111-1111-1111-111111111111")
    .single()

  if (error) {
    console.error("DB Error:", error.message, error.details, error.hint)
  } else {
    console.log("Success! Data:", JSON.stringify(data, null, 2))
  }
}

check()
