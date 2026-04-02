# Jiya's Studio Frontend

## Gallery media setup

The gallery now runs from remote CDN media in production, using Cloudinary for images and Cloudinary or another public video host for videos.

### Recommended setup

1. Upload every file from your gallery source set to Cloudinary using the same filenames.
2. Put them in the folder from `VITE_CLOUDINARY_IMAGE_FOLDER`.
3. Upload every file from your gallery video source set to a video-friendly CDN/platform using the same filenames.
4. Set `VITE_GALLERY_VIDEO_BASE_URL` to that public base path.
5. Optionally upload JPG posters for each video and point `VITE_GALLERY_VIDEO_POSTER_BASE_URL` at them.
6. Copy `.env.example` values into `.env` and rebuild.

### Notes

- If you prefer Cloudinary for videos too, set `VITE_CLOUDINARY_VIDEO_FOLDER` and leave `VITE_GALLERY_VIDEO_BASE_URL` empty.
- Video posters should match the video filename stem, for example `bridal-makeup-reel.jpg` for `bridal-makeup-reel.mp4`.
- The gallery now generates optimized Cloudinary image URLs for thumbnails and full views, which cuts image payload size significantly.

## Bulk Upload To Cloudinary

You can upload the current local gallery assets with one command.

1. Keep these public frontend values in `.env`: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_IMAGE_FOLDER`, `VITE_CLOUDINARY_VIDEO_FOLDER`
2. Add these server-side values to `.env` temporarily: `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Optional: run `npm run optimize:gallery` to create smaller upload-ready copies in `scripts/generated`
4. If you use the optimized copies, set `GALLERY_UPLOAD_IMAGE_SOURCE=scripts/generated/gallery-images` and `GALLERY_UPLOAD_VIDEO_SOURCE=scripts/generated/gallery-videos`
5. Run `npm run upload:gallery`

The script uploads:

- `GALLERY_UPLOAD_IMAGE_SOURCE` to `VITE_CLOUDINARY_IMAGE_FOLDER`
- `GALLERY_UPLOAD_VIDEO_SOURCE` to `VITE_CLOUDINARY_VIDEO_FOLDER`

The optimization script is useful here because your current Cloudinary account is rejecting uploads above 10 MB.

The frontend never needs `CLOUDINARY_API_SECRET`. After uploading, keep that secret out of any `VITE_*` variable and rotate it if it was ever exposed in the browser.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
