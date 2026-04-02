import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Aperture, ArrowLeft, ArrowRight, ArrowUpRight, Image as ImageIcon, Play, X } from 'lucide-react';

const imageGlob = import.meta.glob('../assets/images/*.{png,jpg,jpeg,webp}', { eager: true });
const videoGlob = import.meta.glob('../assets/videos/*.{mp4,MP4}', { eager: true });

const INITIAL_IMAGE_COUNT = 4;
const INITIAL_VIDEO_COUNT = 3;

const getCategoryFromPath = (path) => {
  const value = path.toLowerCase();

  if (value.includes('bridal') || value.includes('makeup')) return 'Bridal';
  if (value.includes('hair') || value.includes('cut')) return 'Hair';
  if (value.includes('skin') || value.includes('glow')) return 'Skin';
  return 'Studio';
};

const getTitleFromPath = (path) =>
  path
    .split('/')
    .pop()
    .split('.')[0]
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getMoodCopy = (category, type) => {
  const copyByCategory = {
    Bridal: 'Soft ceremony glam with polished detail, balance, and camera-ready finish.',
    Hair: 'Movement, shape, and texture framed to feel current and flattering.',
    Skin: 'Glow-led treatment moments focused on freshness, calm, and clarity.',
    Studio: "A closer look at the space, rituals, and signature atmosphere at Jiya's Studio.",
  };

  return `${copyByCategory[category]} ${type === 'video' ? 'Watch the transformation in motion.' : 'Pause on the details.'}`;
};

const imageItems = Object.entries(imageGlob)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, module]) => ({
    id: path,
    src: module.default,
    title: getTitleFromPath(path),
    category: getCategoryFromPath(path),
    type: 'image',
  }));

const posterByCategory = imageItems.reduce((map, item) => {
  if (!map[item.category]) map[item.category] = item.src;
  return map;
}, {});

const videoItems = Object.entries(videoGlob)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, module], index) => ({
    id: path,
    src: module.default,
    title: getTitleFromPath(path),
    category: getCategoryFromPath(path),
    type: 'video',
    posterSrc: posterByCategory[getCategoryFromPath(path)] ?? imageItems[index % Math.max(imageItems.length, 1)]?.src ?? '',
  }));

const mediaItems = [...imageItems, ...videoItems].map((item, index) => ({
  ...item,
  indexLabel: String(index + 1).padStart(2, '0'),
  posterSrc: item.type === 'image' ? item.src : item.posterSrc,
  description: getMoodCopy(item.category, item.type),
}));

function GalleryPreviewMedia({ item, className = '' }) {
  const containerRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (item.type !== 'video') return undefined;

    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '180px 0px',
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [item.id, item.type]);

  if (item.type === 'video') {
    return (
      <div ref={containerRef} className={className}>
        {shouldLoadVideo ? (
          <video
            src={item.src}
            poster={item.posterSrc}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          />
        ) : (
          <img
            src={item.posterSrc}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <img
      src={item.posterSrc ?? item.src}
      alt={item.title}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

export default function Gallery() {
  const [visibleImages, setVisibleImages] = useState(INITIAL_IMAGE_COUNT);
  const [visibleVideos, setVisibleVideos] = useState(INITIAL_VIDEO_COUNT);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [activeItemId, setActiveItemId] = useState(mediaItems[0]?.id ?? null);

  const filteredImages = imageItems;
  const filteredVideos = videoItems;
  const filteredMedia = mediaItems;

  const featuredItem = useMemo(
    () =>
      filteredMedia.find((item) => item.id === activeItemId) ??
      filteredMedia.find((item) => item.type === 'image') ??
      filteredMedia[0] ??
      null,
    [activeItemId, filteredMedia]
  );

  const lookbookStrip = useMemo(() => {
    const imageFirst = [
      ...filteredMedia.filter((item) => item.type === 'image'),
      ...filteredMedia.filter((item) => item.type === 'video'),
    ];

    return imageFirst.slice(0, 8);
  }, [filteredMedia]);

  const visibleImageItems = filteredImages.slice(0, visibleImages);
  const visibleVideoItems = filteredVideos.slice(0, visibleVideos);
  const lightboxImageIndex =
    lightboxItem?.type === 'image' ? filteredImages.findIndex((item) => item.id === lightboxItem.id) : -1;

  const openPreviousImage = () => {
    if (lightboxImageIndex < 0 || filteredImages.length < 2) return;
    const previousIndex = (lightboxImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxItem(filteredImages[previousIndex]);
  };

  const openNextImage = () => {
    if (lightboxImageIndex < 0 || filteredImages.length < 2) return;
    const nextIndex = (lightboxImageIndex + 1) % filteredImages.length;
    setLightboxItem(filteredImages[nextIndex]);
  };

  useEffect(() => {
    if (!featuredItem && filteredMedia[0]) {
      setActiveItemId(filteredMedia[0].id);
      return;
    }

    if (featuredItem && featuredItem.id !== activeItemId) {
      setActiveItemId(featuredItem.id);
    }
  }, [activeItemId, featuredItem, filteredMedia]);

  useEffect(() => {
    if (lightboxItem) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [lightboxItem]);

  useEffect(() => {
    if (!lightboxItem) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxItem(null);
      }

      if (lightboxItem.type === 'image' && event.key === 'ArrowLeft') {
        openPreviousImage();
      }

      if (lightboxItem.type === 'image' && event.key === 'ArrowRight') {
        openNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxItem, lightboxImageIndex, filteredImages]);

  const lightboxMarkup =
    lightboxItem && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[220] bg-[rgba(4,4,4,0.96)] backdrop-blur-xl"
            onClick={() => setLightboxItem(null)}
          >
            {lightboxItem.type === 'image' ? (
              <div
                className="relative flex h-screen w-screen items-center justify-center p-3 sm:p-5 md:p-8"
                onClick={(event) => event.stopPropagation()}
              >
                {filteredImages.length > 1 ? (
                  <button
                    type="button"
                    onClick={openPreviousImage}
                    className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-white/25 hover:bg-black/85 md:left-6 md:h-14 md:w-14"
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-white/25 hover:bg-black/85 md:right-6 md:top-6"
                  aria-label="Close viewer"
                >
                  <X className="h-5 w-5" />
                </button>

                {filteredImages.length > 1 ? (
                  <button
                    type="button"
                    onClick={openNextImage}
                    className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-white/25 hover:bg-black/85 md:right-6 md:h-14 md:w-14"
                    aria-label="Next image"
                  >
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                ) : null}

                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-md md:bottom-6">
                  <span>{lightboxItem.category}</span>
                  {lightboxImageIndex >= 0 ? <span>{lightboxImageIndex + 1}/{filteredImages.length}</span> : null}
                </div>

                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0a0a0a] shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:rounded-[2rem]">
                  <img
                    src={lightboxItem.src}
                    alt={lightboxItem.title}
                    className="block max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                className="relative flex h-screen w-screen items-center justify-center p-3 sm:p-5 md:p-8"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white transition-all hover:border-white/25 hover:bg-black/85 md:right-6 md:top-6"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex h-full w-full max-w-5xl items-center justify-center overflow-hidden rounded-[1.2rem] border border-white/10 bg-black shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:rounded-[2rem]">
                  <video
                    src={lightboxItem.src}
                    poster={lightboxItem.posterSrc}
                    className="max-h-full w-full object-contain"
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                  />
                </div>
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <main className="page-shell relative min-h-screen overflow-hidden px-4 pb-20 pt-36 sm:px-[5%] md:pb-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(214,177,111,0.18),transparent_64%)] blur-3xl" />
          <div className="absolute right-[-10%] top-[28rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_68%)] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-[28rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        </div>

      <section className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="section-label">
              <Aperture className="h-4 w-4" />
              Modern Gallery
            </div>

            <div className="max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-accent/80 md:text-[0.72rem]">Jiya&apos;s Studio Visual Edit</p>
              <h1 className="mt-4 font-heading text-[3.1rem] leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.2rem] md:text-[5.3rem] xl:text-[6.8rem]">
                Cleaner,
                <span className="block pl-0 italic text-accent sm:pl-6 md:pl-10 xl:pl-16">sharper, more premium.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#e7dece]/75 sm:text-base md:text-lg md:leading-8">
                The gallery now feels closer to a fashion-led lookbook instead of an old image dump, with stronger hierarchy, better spacing,
                and a more polished first impression across photos and videos.
              </p>
            </div>
          </div>

          {featuredItem && (
            <div className="section-shell rounded-[2rem] p-3 sm:p-4 md:rounded-[2.7rem] md:p-5">
              <button
                type="button"
                onClick={() => setLightboxItem(featuredItem)}
                className="group relative block w-full overflow-hidden rounded-[1.7rem] text-left md:rounded-[2.2rem]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] md:rounded-[2.2rem]">
                  <GalleryPreviewMedia item={featuredItem} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />

                  <div className="gallery-hero-overlay absolute inset-0" />

                  <div className="absolute inset-x-4 top-4 flex items-start justify-between md:inset-x-8 md:top-8">
                    <div className="max-w-[8rem] text-[0.58rem] uppercase tracking-[0.35em] text-white/44 md:max-w-[9rem] md:text-[0.68rem] md:tracking-[0.42em]">
                      Signature highlight
                    </div>
                    <div className="gallery-tag rounded-full border border-white/10 px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.24em] text-accent/80 backdrop-blur-md md:text-[0.64rem]">
                      Featured
                    </div>
                  </div>

                  <div className="absolute left-4 top-20 flex flex-wrap items-center gap-2.5 md:left-8 md:top-28 md:gap-3">
                    <span className="gallery-tag rounded-full border border-white/15 px-3 py-2 text-[0.56rem] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md md:text-[0.62rem] md:tracking-[0.28em]">
                      {featuredItem.category}
                    </span>
                    <span className="gallery-tag rounded-full border border-white/15 px-3 py-2 text-[0.56rem] font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md md:text-[0.62rem] md:tracking-[0.28em]">
                      {featuredItem.type === 'video' ? 'Video' : 'Image'}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-[0.62rem] uppercase tracking-[0.3em] text-accent/80 md:text-[0.7rem] md:tracking-[0.38em]">Cover Story</div>
                        <h2 className="mt-3 max-w-xl font-heading text-3xl leading-[0.92] text-white sm:text-4xl md:text-[3.6rem]">{featuredItem.title}</h2>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-[#f0e7d8]/78 md:mt-4 md:text-base md:leading-7">{featuredItem.description}</p>
                      </div>
                      <div className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform duration-500 group-hover:scale-105 md:flex">
                        {featuredItem.type === 'video' ? <Play className="h-5 w-5 fill-white" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="relative mx-auto mt-10 max-w-7xl overflow-hidden">
        <div className="section-shell rounded-[2rem] px-4 py-5 md:rounded-[2.3rem] md:px-6">
          <div className="mb-5">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-accent/80 md:text-[0.72rem] md:tracking-[0.38em]">Lookbook Strip</p>
              <h3 className="mt-2 font-heading text-3xl text-white">Slow moving gallery rail</h3>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="flex w-max gap-4 [animation:marquee-scroll_38s_linear_infinite] hover:[animation-play-state:paused]">
            {[...lookbookStrip, ...lookbookStrip].map((item, index) => {
              const isActive = featuredItem?.id === item.id;

              return (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  onClick={() => setActiveItemId(item.id)}
                  className={`group relative h-40 w-[220px] flex-none overflow-hidden rounded-[1.6rem] border text-left transition-all md:h-48 md:w-[260px] ${
                    isActive
                      ? 'border-accent shadow-[0_22px_45px_rgba(214,177,111,0.2)]'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <GalleryPreviewMedia item={item} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.78))]" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.32em] text-accent/80">Look {item.indexLabel}</div>
                    <div className="mt-2 font-heading text-2xl leading-none text-white">{item.title}</div>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="mb-5">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.34em] text-accent/80">Photos</p>
            <h2 className="mt-2 font-heading text-3xl text-white md:text-4xl">Image Gallery</h2>
          </div>
        </div>

        {visibleImageItems.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleImageItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.02] text-left transition-all hover:-translate-y-1 hover:border-accent/35"
              >
                <div className="relative aspect-[4/4.6] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.78))]" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-accent/80">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Image
                    </div>
                    <h3 className="mt-2 font-heading text-[1.7rem] leading-none text-white md:text-[1.9rem]">{item.title}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-sm text-[#eadfcb]/70">
            No images found in this category.
          </div>
        )}

        {visibleImages < filteredImages.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleImages((count) => count + INITIAL_IMAGE_COUNT)}
              className="rounded-full border border-accent/30 px-6 py-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-accent transition-colors hover:bg-accent hover:text-black"
            >
              Load More Images
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="mb-5">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.34em] text-accent/80">Videos</p>
            <h2 className="mt-2 font-heading text-3xl text-white md:text-4xl">Video Gallery</h2>
          </div>
        </div>

        {visibleVideoItems.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVideoItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.02] text-left transition-all hover:-translate-y-1 hover:border-accent/35"
              >
                <div className="relative aspect-video overflow-hidden">
                  <GalleryPreviewMedia item={item} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.78))]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-accent/80">
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Video
                      </div>
                      <h3 className="mt-2 font-heading text-2xl leading-none text-white">{item.title}</h3>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
                      <Play className="h-4 w-4 fill-white" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-6 text-sm text-[#eadfcb]/70">
            No videos found in this category.
          </div>
        )}

        {visibleVideos < filteredVideos.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleVideos((count) => count + INITIAL_VIDEO_COUNT)}
              className="rounded-full border border-accent/30 px-6 py-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-accent transition-colors hover:bg-accent hover:text-black"
            >
              Load More Videos
            </button>
          </div>
        )}
      </section>

      </main>
      {lightboxMarkup}
    </>
  );
}
