import {
  buildRemoteGalleryMediaFromEntries,
  defaultGalleryMediaEntries,
  hasRemoteGalleryMediaConfig,
  remoteGalleryMedia,
} from './galleryMedia.remote';

const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const isLiveEntryEnabled = (value) => {
  if (typeof value === 'boolean') return value;
  return !String(value ?? 'true')
    .trim()
    .match(/^(false|0|no)$/i);
};

function normalizeGalleryMediaRow(row, index) {
  return {
    id: row.id || row.ID || row.Id || `media-${index + 1}`,
    type: row.type || row.Type || 'image',
    filename: row.filename || row.fileName || row.FileName || row.src || '',
    title: row.title || row.Title || '',
    category: row.category || row.Category || '',
    description: row.description || row.Description || '',
    sortOrder: row.sortOrder || row.SortOrder || row.order || row.Order || index,
    isActive: isLiveEntryEnabled(row.isActive ?? row.IsActive ?? row.active ?? row.Active),
  };
}

export async function loadGalleryMedia() {
  if (scriptUrl) {
    try {
      const response = await fetch(`${scriptUrl}?entity=GalleryMedia&_ts=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      const rows = Array.isArray(data?.data) ? data.data : [];

      if (data?.status === 'success' && rows.length > 0) {
        return buildRemoteGalleryMediaFromEntries(rows.map(normalizeGalleryMediaRow));
      }
    } catch (error) {
      console.warn('Falling back to bundled gallery media because live media fetch failed.', error);
    }
  }

  if (hasRemoteGalleryMediaConfig) {
    return remoteGalleryMedia;
  }

  return {
    imageItems: [],
    videoItems: [],
    mediaItems: [],
  };
}

export { hasRemoteGalleryMediaConfig };
export { defaultGalleryMediaEntries };
