/**
 * Kids Time Khilgaon - Safe Private Document Storage Migration Utility
 * 
 * Safely migrates sensitive applicant documents (Birth Certs, NIDs, Photos)
 * from the legacy public bucket (kidstime-assets) to the private bucket (admission-private-docs).
 * 
 * SAFETY DIRECTIVES:
 * - Runs in DRY-RUN mode by default.
 * - Verifies successful copy before recording migration status.
 * - NEVER deletes original files until human administrator verifies.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SOURCE_BUCKET = 'kidstime-assets';
const TARGET_BUCKET = 'admission-private-docs';
const DRY_RUN = !process.argv.includes('--execute');

async function main() {
  console.log('='.repeat(75));
  console.log('   KIDSTIME KHILGAON - PRIVATE DOCUMENT STORAGE MIGRATOR');
  console.log('='.repeat(75));
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (Simulated, no changes applied)' : 'LIVE EXECUTION'}`);

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('\n[!] Error: SUPABASE_SERVICE_ROLE_KEY is required for storage migration.');
    console.error('    Please provide SUPABASE_SERVICE_ROLE_KEY in .env.local to execute this utility.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // 1. Verify target bucket exists
  console.log(`\n[*] Verifying target bucket: '${TARGET_BUCKET}'...`);
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('[!] Failed to list buckets:', bucketError.message);
    process.exit(1);
  }

  const targetExists = buckets.some(b => b.name === TARGET_BUCKET);
  if (!targetExists) {
    console.error(`[!] Target bucket '${TARGET_BUCKET}' does not exist.`);
    console.error('    Please execute the migration SQL script in Supabase first to create the bucket.');
    process.exit(1);
  }
  console.log(`    -> Target bucket '${TARGET_BUCKET}' verified.`);

  // 2. Query admission records with legacy URLs
  console.log('\n[*] Scanning admissions table for legacy document links...');
  const { data: admissions, error: admError } = await supabase
    .from('admissions')
    .select('id, student_first_name, student_last_name, birth_certificate_url, student_photo_url, guardian_nid_url');

  if (admError) {
    console.error('[!] Failed to query admissions:', admError.message);
    process.exit(1);
  }

  console.log(`    -> Found ${admissions?.length || 0} admission records to evaluate.`);

  let migratedFiles = 0;

  for (const adm of (admissions || [])) {
    const fields = ['birth_certificate_url', 'student_photo_url', 'guardian_nid_url'];

    for (const field of fields) {
      const url = adm[field];
      if (url && url.includes(`/${SOURCE_BUCKET}/`)) {
        const relativePath = url.split(`/${SOURCE_BUCKET}/`)[1];
        console.log(`\n  [+] Candidate file: ${field} for ${adm.student_first_name} ${adm.student_last_name}`);
        console.log(`      Path: ${relativePath}`);

        if (!DRY_RUN) {
          // Download from source
          const { data: fileBlob, error: dlError } = await supabase.storage
            .from(SOURCE_BUCKET)
            .download(relativePath);

          if (dlError) {
            console.error(`      [!] Download failed: ${dlError.message}`);
            continue;
          }

          // Upload to private target
          const { error: upError } = await supabase.storage
            .from(TARGET_BUCKET)
            .upload(relativePath, fileBlob, { upsert: true });

          if (upError) {
            console.error(`      [!] Upload to private bucket failed: ${upError.message}`);
            continue;
          }

          // Update record reference
          const { error: updateError } = await supabase
            .from('admissions')
            .update({ [field]: relativePath })
            .eq('id', adm.id);

          if (updateError) {
            console.error(`      [!] Database reference update failed: ${updateError.message}`);
            continue;
          }

          console.log(`      -> Successfully migrated to private bucket and updated database reference.`);
          migratedFiles++;
        } else {
          console.log(`      -> [DRY-RUN] Would copy to '${TARGET_BUCKET}/${relativePath}' and update record.`);
          migratedFiles++;
        }
      }
    }
  }

  console.log('\n' + '='.repeat(75));
  console.log(`Migration Summary: ${migratedFiles} document references evaluated.`);
  if (DRY_RUN) {
    console.log('To execute live migration: `node scripts/migrate-storage-docs.mjs --execute`');
  }
  console.log('='.repeat(75));
}

main().catch(err => {
  console.error('[!] Fatal error during migration:', err);
  process.exit(1);
});
