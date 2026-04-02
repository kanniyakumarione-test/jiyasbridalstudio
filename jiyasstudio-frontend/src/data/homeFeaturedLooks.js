import { buildCloudinaryImageUrl, hasCloudinaryImageConfig, resolveCloudinaryImage } from '../lib/cloudinary';
import { loadGalleryMedia } from './galleryMedia';

const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export const defaultHomeFeaturedLookEntries = [
  {
    id: 'home-look:bridal-signature',
    title: 'Bridal Signature',
    category: 'Bridal Beauty',
    outcome: 'Soft glam finishing, balanced detail, and a polished look made for ceremony moments.',
    mediaFilename: 'bridal-purple-saree-chair-portrait.jpg',
    sortOrder: 0,
    isActive: true,
  },
  {
    id: 'home-look:hair-editorial',
    title: 'Hair Editorial',
    category: 'Hair Styling',
    outcome: 'Clean framing, expressive finish, and styling that feels current without losing softness.',
    mediaFilename: 'bridal-purple-saree-sunglasses-portrait.jpeg',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'home-look:makeup-finish',
    title: 'Makeup Finish',
    category: 'Makeup Look',
    outcome: 'Rich color balance, camera-ready detail, and a finish designed to photograph beautifully.',
    mediaFilename: 'bridal-red-saree-side-portrait.jpg',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'home-look:skin-glow',
    title: 'Skin Glow',
    category: 'Skin Ritual',
    outcome: 'Fresh texture, brighter finish, and glow-focused care designed for confident everyday beauty.',
    mediaFilename: 'beauty-school-CEO.jpg',
    sortOrder: 3,
    isActive: true,
  },
];

const normalizeFeaturedLookRow = (row, index) => {
  const isActiveRaw = row.isActive ?? row.IsActive ?? row.active ?? row.Active;
  const isActive =
    typeof isActiveRaw === 'boolean'
      ? isActiveRaw
      : !String(isActiveRaw ?? 'true')
          .trim()
          .match(/^(false|0|no)$/i);

  return {
    id: row.id || row.ID || row.Id || `home-look-${index + 1}`,
    title: String(row.title || row.Title || '').trim(),
    category: String(row.category || row.Category || '').trim(),
    outcome: String(row.outcome || row.Outcome || row.description || row.Description || '').trim(),
    mediaFilename: String(row.mediaFilename || row.MediaFilename || row.filename || row.Filename || '').trim(),
    sortOrder: Number.isFinite(Number(row.sortOrder || row.SortOrder)) ? Number(row.sortOrder || row.SortOrder) : index,
    isActive,
  };
};

const normalizeFilenameKey = (value = '') => String(value || '').trim().toLowerCase();

const buildFallbackImageSrc = (filename) =>
  hasCloudinaryImageConfig ? buildCloudinaryImageUrl(filename, { width: 900, height: 1100 }) : resolveCloudinaryImage(filename, '', { width: 900, height: 1100 });

const attachFeaturedLookImage = (entry, galleryMedia) => {
  const mediaItems = galleryMedia?.mediaItems || [];
  const matchingItem = mediaItems.find((item) => normalizeFilenameKey(item.filename) === normalizeFilenameKey(entry.mediaFilename));

  return {
    ...entry,
    image: matchingItem?.previewSrc || matchingItem?.posterSrc || matchingItem?.src || buildFallbackImageSrc(entry.mediaFilename),
  };
};

export async function loadHomeFeaturedLooks() {
  const galleryMedia = await loadGalleryMedia();
  const dedupeFeaturedLooks = (items) => {
    const seenKeys = new Set();

    return items.filter((entry) => {
      const dedupeKey = [
        String(entry.title || '').trim().toLowerCase(),
        String(entry.category || '').trim().toLowerCase(),
        String(entry.mediaFilename || '').trim().toLowerCase(),
      ].join('::');

      if (seenKeys.has(dedupeKey)) return false;
      seenKeys.add(dedupeKey);
      return true;
    });
  };

  if (scriptUrl) {
    try {
      const response = await fetch(`${scriptUrl}?entity=HomepageFeaturedLooks&_ts=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      const rows = Array.isArray(data?.data) ? data.data : [];

      if (data?.status === 'success' && rows.length > 0) {
        return dedupeFeaturedLooks(
          rows
            .map(normalizeFeaturedLookRow)
            .filter((entry) => entry.mediaFilename && entry.isActive)
            .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title))
            .map((entry) => attachFeaturedLookImage(entry, galleryMedia))
        ).slice(0, 4);
      }
    } catch (error) {
      console.warn('Falling back to bundled homepage featured looks because live featured look fetch failed.', error);
    }
  }

  return dedupeFeaturedLooks(defaultHomeFeaturedLookEntries.map((entry) => attachFeaturedLookImage(entry, galleryMedia))).slice(0, 4);
}
