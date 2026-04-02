const trimSlash = (value = '') => value.replace(/^\/+|\/+$/g, '');

const encodePath = (...parts) =>
  parts
    .filter(Boolean)
    .map((part) => trimSlash(part))
    .filter(Boolean)
    .map((part) =>
      part
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/')
    )
    .join('/');

const getBaseName = (filename = '') => filename.replace(/\.[^.]+$/, '');

export const cloudinaryCloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
export const cloudinaryImageFolder = trimSlash(import.meta.env.VITE_CLOUDINARY_IMAGE_FOLDER || '');
export const hasCloudinaryImageConfig = Boolean(cloudinaryCloudName && cloudinaryImageFolder);

export function buildCloudinaryImageUrl(filename, { width, height } = {}) {
  if (!hasCloudinaryImageConfig) return '';

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, 'c_fill', 'g_auto');

  return `https://res.cloudinary.com/${encodeURIComponent(cloudinaryCloudName)}/image/upload/${transforms.join(',')}/${encodePath(
    cloudinaryImageFolder,
    getBaseName(filename)
  )}`;
}

export function resolveCloudinaryImage(filename, fallbackSrc, options) {
  return buildCloudinaryImageUrl(filename, options) || fallbackSrc;
}
