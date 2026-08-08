/**
 * Server-side API URL helper.
 *
 * In Docker:  NEXT_PRIVATE_API_URL=http://fmi_backend/api/v1  (internal network, set in .env.production)
 * Locally:    falls back to NEXT_PUBLIC_API_URL or http://localhost:8000/api/v1
 *
 * NEXT_PRIVATE_API_URL is intentionally NOT prefixed with NEXT_PUBLIC_ so it is
 * never exposed to the browser bundle.
 */
export function getServerApiUrl(): string {
  if (typeof window === 'undefined') {
    // We are on the server. Try the private variable, fallback to Docker service, then localhost.
    return (
      process.env.NEXT_PRIVATE_API_URL ||
      'http://backend:80/api/v1'
    );
  }
  // On the client, always use the public URL
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    'https://findmyinterior.com/api/v1'
  );
}
