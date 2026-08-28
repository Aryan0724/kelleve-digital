/**
 * Centralized image URL resolver for TrueDial.
 * Handles all image URL formats: absolute URLs, /storage paths, base64 (legacy), and nulls.
 */

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://findmyinterior.com';

// Generic placeholder (a light grey box with a subtle icon feel)
export const PLACEHOLDER_IMAGE = '/placeholder-business.svg';

/**
 * Resolves any raw image value coming from the API into a usable <img src> URL.
 * - Absolute URLs (https://...) → returned as-is
 * - /storage/... paths → prefixed with BACKEND_BASE_URL
 * - storage/... (no leading slash) → prefixed with BACKEND_BASE_URL/
 * - data:image/... base64 strings → returned as-is (legacy support)
 * - null / empty / invalid → PLACEHOLDER_IMAGE
 */
export function resolveImageUrl(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  const trimmed = raw.trim();

  // Already a full URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Base64 legacy support
  if (trimmed.startsWith('data:image')) {
    return trimmed;
  }

  // /storage/... path
  if (trimmed.startsWith('/storage/')) {
    return `${BACKEND_BASE_URL}${trimmed}`;
  }

  // storage/... (no leading slash)
  if (trimmed.startsWith('storage/')) {
    return `${BACKEND_BASE_URL}/${trimmed}`;
  }

  // Unknown format — fallback to placeholder
  return PLACEHOLDER_IMAGE;
}

/**
 * Returns the first valid resolved image from an array of gallery items.
 * Falls back to cover_image, then placeholder.
 */
export function resolveListingCoverImage(
  coverImage: string | null | undefined,
  gallery?: Array<{ image_url?: string | null } | string | null> | null
): string {
  // Try cover_image first
  const coverResolved = resolveImageUrl(coverImage);
  if (coverResolved !== PLACEHOLDER_IMAGE) return coverResolved;

  // Try first gallery item
  if (gallery && gallery.length > 0) {
    const first = gallery[0];
    if (typeof first === 'string') {
      const r = resolveImageUrl(first);
      if (r !== PLACEHOLDER_IMAGE) return r;
    } else if (first && typeof first === 'object' && 'image_url' in first) {
      const r = resolveImageUrl(first.image_url);
      if (r !== PLACEHOLDER_IMAGE) return r;
    }
  }

  return PLACEHOLDER_IMAGE;
}

/**
 * Resolves an array of gallery image URLs, filtering out broken/empty ones.
 */
export function resolveGalleryImages(
  gallery: Array<{ image_url?: string | null; sort_order?: number } | string | null> | null | undefined
): string[] {
  if (!gallery || gallery.length === 0) return [];

  return gallery
    .map((item) => {
      if (typeof item === 'string') return resolveImageUrl(item);
      if (item && typeof item === 'object' && 'image_url' in item) return resolveImageUrl(item.image_url);
      return PLACEHOLDER_IMAGE;
    })
    .filter((url) => url !== PLACEHOLDER_IMAGE);
}
