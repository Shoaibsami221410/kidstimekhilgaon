import { createClient } from './client';

export const PRIVATE_ADMISSIONS_BUCKET = 'admission-private-docs';
export const LEGACY_PUBLIC_BUCKET = 'kidstime-assets';

/**
 * Generates an authenticated short-lived signed URL for a sensitive applicant document.
 * Handles both relative storage paths and legacy public URLs for seamless backward compatibility.
 */
export async function getSecureDocumentUrl(pathOrUrl: string, expiresInSeconds: number = 300): Promise<string> {
  if (!pathOrUrl) return '';

  const supabase = createClient();

  // If it's already a relative path in the private bucket
  if (!pathOrUrl.startsWith('http://') && !pathOrUrl.startsWith('https://')) {
    const { data, error } = await supabase.storage
      .from(PRIVATE_ADMISSIONS_BUCKET)
      .createSignedUrl(pathOrUrl, expiresInSeconds);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  // If it's an existing legacy public URL, extract the path and check if it's in private storage
  if (pathOrUrl.includes(`/${PRIVATE_ADMISSIONS_BUCKET}/`)) {
    const relativePath = pathOrUrl.split(`/${PRIVATE_ADMISSIONS_BUCKET}/`)[1];
    if (relativePath) {
      const { data, error } = await supabase.storage
        .from(PRIVATE_ADMISSIONS_BUCKET)
        .createSignedUrl(relativePath, expiresInSeconds);
      if (!error && data?.signedUrl) return data.signedUrl;
    }
  }

  // Graceful fallback to legacy URL (preserves functionality during migration phase)
  return pathOrUrl;
}
