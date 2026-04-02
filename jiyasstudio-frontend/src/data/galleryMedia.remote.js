import { buildCloudinaryImageUrl } from '../lib/cloudinary';

export const imageFilenames = [
  'A-group-christmas-photo.jpeg',
  'beauty-school-CEO.jpg',
  'beauty-school-course-poster.jpg',
  'bridal-purple-saree-chair-portrait.jpg',
  'bridal-purple-saree-close-portrait.jpeg',
  'bridal-purple-saree-full-length-portrait.jpeg',
  'bridal-purple-saree-sunglasses-portrait.jpeg',
  'bridal-red-saree-earring-portrait.jpg',
  'bridal-red-saree-hand-pose-portrait.jpg',
  'bridal-red-saree-jewelry-closeup.jpg',
  'bridal-red-saree-look-collage.jpg',
  'bridal-red-saree-side-portrait.jpg',
  'bridal-red-saree-soft-focus-portrait.jpg',
  'facial-offer-poster.jpg',
  'festival-offer-poster.png',
  'studio-owner-black-white-corridor-portrait.jpeg',
];

export const videoFilenames = [
  'beauty-illustration-promo-reel.mp4',
  'bridal-earring-side-profile-reel.mp4',
  'bridal-lehenga-wrapped-in-love-reel.mp4',
  'bridal-makeover-title-reel.mp4',
  'bridal-makeup-reel.mp4',
  'bridal-purple-smoke-promo-reel.mp4',
  'ear-piercing-closeup-reel.mp4',
  'green-gown-bridal-necklace-styling-reel.MP4',
  'green-gown-curls-hairstyling-reel.mp4',
  'green-gown-hairstyling-prep-reel.MP4',
  'green-gown-mirror-prep-reel.mp4',
  'kids-bob-haircut-reveal-reel.mp4',
  'Kids-fun-reel.mp4',
  'kids-haircut-closeup-reel.mp4',
  'kids-haircut-in-salon-reel.mp4',
  'kids-mini-makeover-reel.mp4',
  'mens-Earpiercing-reel.mp4',
  'mens-hair-design-creative-poster-reel.mp4',
  'mens-hair-setting-spray-reel.mp4',
  'mens-haircut-before-closeup-reel.mp4',
  'mens-hairline-transformation-reel.mp4',
  'mint-gown-bridal-smile-hairstyling-reel.mp4',
  'mint-gown-outdoor-bridal-portrait-reel.mp4',
  'mint-saree-studio-portrait-reel.mp4',
  'party-makeup-application-reel.mp4',
  'pink-glam-makeover-promo-reel.mp4',
  'stage-walk-reel.mp4',
  'traditional-braid-jewelry-styling-reel.mp4',
  'unisex-salon-made-for-men-promo-reel.mp4',
  'wet-hair-treatment-back-view-reel.mp4',
  'womens-day-event-opening-reel.mp4',
];

export const getCategoryFromValue = (value) => {
  const normalized = value.toLowerCase();

  if (normalized.includes('bridal') || normalized.includes('makeup')) return 'Bridal';
  if (normalized.includes('hair') || normalized.includes('cut')) return 'Hair';
  if (normalized.includes('skin') || normalized.includes('glow')) return 'Skin';
  return 'Studio';
};

export const getTitleFromFilename = (filename) =>
  filename
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getMoodCopy = (category, type) => {
  const copyByCategory = {
    Bridal: 'Soft ceremony glam with polished detail, balance, and camera-ready finish.',
    Hair: 'Movement, shape, and texture framed to feel current and flattering.',
    Skin: 'Glow-led treatment moments focused on freshness, calm, and clarity.',
    Studio: "A closer look at the space, rituals, and signature atmosphere at Jiya's Studio.",
  };

  return `${copyByCategory[category]} ${type === 'video' ? 'Watch the transformation in motion.' : 'Pause on the details.'}`;
};

const trimTrailingSlash = (value = '') => value.replace(/\/+$/g, '');
const normalizeDotExtension = (value = '') => (value.startsWith('.') ? value : `.${value}`);

const getBaseName = (filename) => filename.replace(/\.[^.]+$/, '');

const trimSlash = (value = '') => value.replace(/^\/+|\/+$/g, '');
const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
const imageFolder = trimSlash(import.meta.env.VITE_CLOUDINARY_IMAGE_FOLDER || '');
const cloudinaryVideoFolder = trimSlash(import.meta.env.VITE_CLOUDINARY_VIDEO_FOLDER || '');
const videoBaseUrl = trimTrailingSlash(import.meta.env.VITE_GALLERY_VIDEO_BASE_URL || '');
const videoPosterBaseUrl = trimTrailingSlash(import.meta.env.VITE_GALLERY_VIDEO_POSTER_BASE_URL || '');
const videoPosterExt = normalizeDotExtension((import.meta.env.VITE_GALLERY_VIDEO_POSTER_EXT || 'jpg').trim());

const hasRemoteImages = Boolean(cloudName && imageFolder);
const hasCloudinaryVideos = Boolean(cloudName && cloudinaryVideoFolder);
const hasDirectVideos = Boolean(videoBaseUrl);
const hasRemoteVideos = hasCloudinaryVideos || hasDirectVideos;

const buildCloudinaryVideoUrl = (filename) => {
  if (!hasCloudinaryVideos) return '';

  return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/video/upload/q_auto:good,vc_auto,f_mp4/${cloudinaryVideoFolder}/${encodeURIComponent(
    getBaseName(filename)
  )}`;
};

const buildCloudinaryVideoPosterUrl = (filename) => {
  if (!hasCloudinaryVideos) return '';

  return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/video/upload/so_0,f_jpg,q_auto,w_900,h_1100,c_fill/${cloudinaryVideoFolder}/${encodeURIComponent(
    getBaseName(filename)
  )}.jpg`;
};

const buildDirectUrl = (baseUrl, filename) => (baseUrl ? `${baseUrl}/${encodeURIComponent(filename)}` : '');

const normalizeEntryType = (value) => (String(value || '').toLowerCase() === 'video' ? 'video' : 'image');
const normalizeFilenameKey = (value) => String(value || '').trim().toLowerCase();

export const getGalleryMediaEntryKey = (entry) => {
  const type = normalizeEntryType(entry?.type);
  const filenameKey = normalizeFilenameKey(entry?.filename);
  return filenameKey ? `${type}:${filenameKey}` : '';
};

const normalizeEntry = (entry, index) => {
  const type = normalizeEntryType(entry.type);
  const filename = String(entry.filename || '').trim();
  const category = String(entry.category || '').trim() || getCategoryFromValue(filename || entry.title || type);
  const title = String(entry.title || '').trim() || getTitleFromFilename(filename || `${type}-${index + 1}`);
  const description = String(entry.description || '').trim() || getMoodCopy(category, type);
  const sortOrder = Number.isFinite(Number(entry.sortOrder)) ? Number(entry.sortOrder) : index;
  const isActiveRaw = entry.isActive;
  const isActive =
    typeof isActiveRaw === 'boolean'
      ? isActiveRaw
      : !String(isActiveRaw ?? 'true')
          .trim()
          .match(/^(false|0|no)$/i);

  return {
    id: entry.id || `${type}:${filename || title.toLowerCase().replace(/\s+/g, '-')}`,
    type,
    filename,
    title,
    category,
    description,
    sortOrder,
    isActive,
  };
};

export const defaultGalleryMediaEntries = [
  ...imageFilenames.map((filename, index) => ({
    id: `image:${filename}`,
    type: 'image',
    filename,
    title: getTitleFromFilename(filename),
    category: getCategoryFromValue(filename),
    description: getMoodCopy(getCategoryFromValue(filename), 'image'),
    sortOrder: index,
    isActive: true,
  })),
  ...videoFilenames.map((filename, index) => ({
    id: `video:${filename}`,
    type: 'video',
    filename,
    title: getTitleFromFilename(filename),
    category: getCategoryFromValue(filename),
    description: getMoodCopy(getCategoryFromValue(filename), 'video'),
    sortOrder: imageFilenames.length + index,
    isActive: true,
  })),
];

export function buildRemoteGalleryMediaFromEntries(entries = []) {
  const normalizedEntries = entries
    .map(normalizeEntry)
    .filter((entry) => entry.filename && entry.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title));

  const dedupedEntries = [];
  const seenEntryKeys = new Set();

  normalizedEntries.forEach((entry) => {
    const entryKey = getGalleryMediaEntryKey(entry);
    if (!entryKey || seenEntryKeys.has(entryKey)) return;
    seenEntryKeys.add(entryKey);
    dedupedEntries.push(entry);
  });

  const imageEntries = dedupedEntries.filter((entry) => entry.type === 'image');
  const videoEntries = dedupedEntries.filter((entry) => entry.type === 'video');

  const imageItems = hasRemoteImages
    ? imageEntries.map((entry) => ({
        ...entry,
        src: buildCloudinaryImageUrl(entry.filename, { width: 2200 }),
        previewSrc: buildCloudinaryImageUrl(entry.filename, { width: 900, height: 1100 }),
        posterSrc: buildCloudinaryImageUrl(entry.filename, { width: 900, height: 1100 }),
      }))
    : [];

  const videoItems = hasRemoteVideos
    ? videoEntries.map((entry) => {
        const directPoster =
          videoPosterBaseUrl ? `${videoPosterBaseUrl}/${encodeURIComponent(getBaseName(entry.filename))}${videoPosterExt}` : '';
        const cloudinaryPoster = buildCloudinaryVideoPosterUrl(entry.filename);
        const previewPoster = directPoster || cloudinaryPoster;

        return {
          ...entry,
          src: hasCloudinaryVideos ? buildCloudinaryVideoUrl(entry.filename) : buildDirectUrl(videoBaseUrl, entry.filename),
          previewSrc: previewPoster,
          posterSrc: previewPoster,
        };
      })
    : [];

  const mediaItems = [...imageItems, ...videoItems].map((item, index) => ({
    ...item,
    indexLabel: String(index + 1).padStart(2, '0'),
  }));

  return {
    imageItems,
    videoItems,
    mediaItems,
  };
}

const { imageItems, videoItems, mediaItems } = buildRemoteGalleryMediaFromEntries(defaultGalleryMediaEntries);

export const hasRemoteGalleryMediaConfig = hasRemoteImages || hasRemoteVideos;

export const remoteGalleryMedia = {
  imageItems,
  videoItems,
  mediaItems,
};
