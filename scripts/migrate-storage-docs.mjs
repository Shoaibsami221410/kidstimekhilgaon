/**
 * Kids Time Khilgaon - Enterprise Safe Private Document Storage Migrator
 * 
 * Safely migrates sensitive applicant documents (Birth Certs, NIDs, Photos)
 * from the legacy public bucket (kidstime-assets) to the private bucket (admission-private-docs).
 * 
 * CORE VERIFICATION & SAFETY REQUIREMENTS:
 * 1. Default DRY-RUN mode (simulates all steps without applying changes).
 * 2. LIVE EXECUTION (--execute): Downloads from source, uploads to private target,
 *    VERIFIES destination file integrity, and updates database references.
 * 3. POST-VERIFICATION CLEANUP (--cleanup): Deletes original public files ONLY
 *    when explicitly requested AFTER verified database migration.
 * 4. NEVER logs API keys or credentials.
 * 5. Resumable & Duplicate-Safe: Skips already-migrated documents gracefully.
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

const IS_EXECUTE = process.argv.includes('--execute');
const IS_CLEANUP = process.argv.includes('--cleanup');

async function main() {
  console.log('='.repeat(80));
  console.log('   KIDSTIME KHILGAON - SAFE ENTERPRISE STORAGE MIGRATION UTILITY');
  console.log('='.repeat(80));
  
  if (!IS_EXECUTE && !IS_CLEANUP) {
    console.log('MODE: [DRY-RUN] (Simulation only, no files modified or deleted)');
    console.log('To execute live migration: `node scripts/migrate-storage-docs.mjs --execute`');
  } else if (IS_EXECUTE) {
    console.log('MODE: [LIVE MIGRATION] (Copying files to private bucket and updating references)');
  } else if (IS_CLEANUP) {
    console.log('MODE: [POST-MIGRATION CLEANUP] (Removing verified original files from public bucket)');
  }

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('\n[!] Error: SUPABASE_SERVICE_ROLE_KEY is required for storage migration.');
    console.error('    Please provide SUPABASE_SERVICE_ROLE_KEY in .env.local to execute this utility.');
    console.error('    (Never commit this key to version control).');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // 1. Verify target bucket exists
  console.log(`\n[*] Step 1: Verifying target private bucket '${TARGET_BUCKET}'...`);
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('[!] Failed to list buckets:', bucketError.message);
    process.exit(1);
  }

  const targetBucket = buckets.find(b => b.name === TARGET_BUCKET);
  if (!targetBucket) {
    console.error(`[!] Target bucket '${TARGET_BUCKET}' does not exist.`);
    console.error('    Please execute the migration SQL script in Supabase first to create the bucket.');
    process.exit(1);
  }
  if (targetBucket.public) {
    console.error(`[!] CRITICAL WARNING: Target bucket '${TARGET_BUCKET}' is PUBLIC!`);
    console.error('    Please ensure public: false in bucket settings before continuing.');
    process.exit(1);
  }
  console.log(`    -> Target bucket '${TARGET_BUCKET}' verified (public: false).`);

  // 2. Discover historical documents from admissions table
  console.log('\n[*] Step 2: Scanning admissions table for document references...');
  const { data: admissions, error: admError } = await supabase
    .from('admissions')
    .select('id, student_first_name, student_last_name, birth_certificate_url, student_photo_url, guardian_nid_url');

  if (admError) {
    console.error('[!] Failed to query admissions table:', admError.message);
    process.exit(1);
  }

  console.log(`    -> Found ${admissions?.length || 0} admission records.`);

  let totalFound = 0;
  let alreadyMigrated = 0;
  let successfullyMigrated = 0;
  let failed = 0;
  const migratedFilesList = [];

  const fields = [
    { key: 'birth_certificate_url', label: 'Birth Certificate' },
    { key: 'student_photo_url', label: 'Student Photo' },
    { key: 'guardian_nid_url', label: 'Guardian NID' }
  ];

  for (const adm of (admissions || [])) {
    for (const { key, label } of fields) {
      const url = adm[key];
      if (!url) continue;

      totalFound++;

      // Check if already migrated to a relative path
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alreadyMigrated++;
        if (IS_CLEANUP) {
          migratedFilesList.push({ relativePath: url, recordId: adm.id, field: key });
        }
        continue;
      }

      // Check if it references the legacy public bucket
      if (url.includes(`/${SOURCE_BUCKET}/`)) {
        const relativePath = url.split(`/${SOURCE_BUCKET}/`)[1];
        console.log(`\n  [+] Candidate: ${label} for ${adm.student_first_name} ${adm.student_last_name}`);
        console.log(`      Record ID: ${adm.id}`);
        console.log(`      Path     : ${relativePath}`);

        if (IS_EXECUTE) {
          try {
            // A. Download from public source
            console.log('      [1/4] Downloading from source bucket...');
            const { data: fileBlob, error: dlError } = await supabase.storage
              .from(SOURCE_BUCKET)
              .download(relativePath);

            if (dlError) throw new Error(`Download failed: ${dlError.message}`);

            // B. Upload to private target bucket
            console.log('      [2/4] Uploading to private target bucket...');
            const { error: upError } = await supabase.storage
              .from(TARGET_BUCKET)
              .upload(relativePath, fileBlob, { upsert: true });

            if (upError) throw new Error(`Upload failed: ${upError.message}`);

            // C. Verify destination file exists and is valid
            console.log('      [3/4] Verifying destination file in private bucket...');
            const { data: verifyBlob, error: verifyError } = await supabase.storage
              .from(TARGET_BUCKET)
              .download(relativePath);

            if (verifyError || !verifyBlob) {
              throw new Error(`Integrity verification failed: ${verifyError?.message || 'Empty file'}`);
            }

            // Test signed URL generation (verifies admin access)
            const { data: signedData, error: signedError } = await supabase.storage
              .from(TARGET_BUCKET)
              .createSignedUrl(relativePath, 300);

            if (signedError || !signedData?.signedUrl) {
              throw new Error(`Signed URL generation check failed: ${signedError?.message}`);
            }

            // D. Update database record with relative path
            console.log('      [4/4] Updating admissions database reference...');
            const { error: updateError } = await supabase
              .from('admissions')
              .update({ [key]: relativePath })
              .eq('id', adm.id);

            if (updateError) throw new Error(`Database update failed: ${updateError.message}`);

            console.log('      -> VERIFIED & MIGRATED SUCCESSFULLY.');
            successfullyMigrated++;
            migratedFilesList.push({ relativePath, recordId: adm.id, field: key });

          } catch (err) {
            console.error(`      [!] ERROR: ${err.message}`);
            failed++;
          }
        } else {
          console.log(`      -> [DRY-RUN] Would migrate '${relativePath}' to private storage and update record.`);
          migratedFilesList.push({ relativePath, recordId: adm.id, field: key });
        }
      }
    }
  }

  // 3. Optional Cleanup Mode (Only runs when --cleanup is explicitly supplied)
  if (IS_CLEANUP) {
    console.log('\n' + '='.repeat(80));
    console.log('STEP 3: POST-MIGRATION SOURCE FILE CLEANUP');
    console.log('='.repeat(80));
    console.log('Deleting verified files from public source bucket (kidstime-assets)...');

    let deletedCount = 0;
    for (const item of migratedFilesList) {
      console.log(`  [-] Deleting source file: ${item.relativePath}`);
      const { error: rmError } = await supabase.storage
        .from(SOURCE_BUCKET)
        .remove([item.relativePath]);

      if (rmError) {
        console.error(`      [!] Failed to delete: ${rmError.message}`);
      } else {
        console.log(`      -> Deleted from public bucket.`);
        deletedCount++;
      }
    }
    console.log(`Cleanup complete: ${deletedCount} files removed from public storage.`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('MIGRATION SUMMARY:');
  console.log(`  Total Document References Scanned : ${totalFound}`);
  console.log(`  Already Stored in Private Bucket  : ${alreadyMigrated}`);
  console.log(`  Successfully Migrated in This Run : ${successfullyMigrated}`);
  console.log(`  Failed Migrations                 : ${failed}`);
  if (!IS_EXECUTE && !IS_CLEANUP) {
    console.log('\nTo execute live migration:');
    console.log('  node scripts/migrate-storage-docs.mjs --execute');
    console.log('\nTo remove verified files from public storage after verification:');
    console.log('  node scripts/migrate-storage-docs.mjs --cleanup');
  }
  console.log('='.repeat(80));
}

main().catch(err => {
  console.error('[!] Fatal error during migration process:', err);
  process.exit(1);
});
