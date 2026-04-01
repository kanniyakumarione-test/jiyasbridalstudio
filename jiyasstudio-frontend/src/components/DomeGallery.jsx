import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

const MediaItem = ({ src, alt, className, style, grayscale }) => {
  const isVideo = src.toLowerCase().includes('.mp4') || src.includes('video');
  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return (
    <img
      src={src}
      className={className}
      style={style}
      alt={alt}
      draggable={false}
    />
  );
};

export default function DomeGallery({
  images = [],
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#060010',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '600px',
  openedImageHeight = '600px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = false
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const cancelTapRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const pointerTypeRef = useRef('mouse');
  const tapTargetRef = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const autoRotateRAF = useRef(null);

  const driftRotation = useCallback(() => {
    if (draggingRef.current || focusedElRef.current || openingRef.current) return;
    
    rotationRef.current.y = wrapAngleSigned(rotationRef.current.y + 0.05); // Subtle drift
    applyTransform(rotationRef.current.x, rotationRef.current.y);
    autoRotateRAF.current = requestAnimationFrame(driftRotation);
  }, []);

  useEffect(() => {
    autoRotateRAF.current = requestAnimationFrame(driftRotation);
    return () => cancelAnimationFrame(autoRotateRAF.current);
  }, [driftRotation]);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.style.overflow = 'hidden';
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.style.overflow = '';
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const lockedRadiusRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const aspect = w / h;
      let basis = aspect >= 1.3 ? w : minDim;
      
      let radius = basis * fit;
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge');
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const centeredLeft = frameR.left - mainR.left + (frameR.width - frameR.width) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - frameR.height) / 2;

        enlargedOverlay.style.left = `${centeredLeft}px`;
        enlargedOverlay.style.top = `${centeredTop}px`;
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius, openedImageWidth, openedImageHeight]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      const step = () => {
        vX *= 0.95;
        vY *= 0.95;
        if (Math.abs(vX) < 0.01 && Math.abs(vY) < 0.01) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [maxVerticalRotationDeg, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        pointerTypeRef.current = event.pointerType || 'mouse';
        if (pointerTypeRef.current === 'touch') lockScroll();
        draggingRef.current = true;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: event.clientX, y: event.clientY };
        tapTargetRef.current = event.target.closest?.('.item__image') || null;
      },
      onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0] }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
        const dxTotal = event.clientX - startPosRef.current.x;
        const dyTotal = event.clientY - startPosRef.current.y;

        const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = startRotRef.current.y + dxTotal / dragSensitivity;

        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);

        if (last) {
          draggingRef.current = false;
          const dx = event.clientX - startPosRef.current.x;
          const dy = event.clientY - startPosRef.current.y;
          const dist2 = dx * dx + dy * dy;
          const isTap = dist2 <= (pointerTypeRef.current === 'touch' ? 100 : 36);

          if (!isTap) {
            const [vx, vy] = [velArr[0] * dirArr[0], velArr[1] * dirArr[1]];
            startInertia(vx, vy);
          } else if (tapTargetRef.current) {
            openItemFromElement(tapTargetRef.current);
          }
          if (pointerTypeRef.current === 'touch') unlockScroll();
        }
      }
    },
    { target: mainRef, eventOptions: { passive: false } }
  );

  const openItemFromElement = el => {
    if (openingRef.current) return;
    openingRef.current = true;
    openStartedAtRef.current = performance.now();
    lockScroll();
    const parent = el.parentElement;
    focusedElRef.current = el;

    const offsetX = getDataNumber(parent, 'offsetX', 0);
    const offsetY = getDataNumber(parent, 'offsetY', 0);
    const sizeX = getDataNumber(parent, 'sizeX', 2);
    const sizeY = getDataNumber(parent, 'sizeY', 2);

    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
    const parentY = normalizeAngle(parentRot.rotateY);
    const globalY = normalizeAngle(rotationRef.current.y);
    let rotY = -(parentY + globalY) % 360;
    if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - rotationRef.current.x;

    parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
    parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

    const refDiv = document.createElement('div');
    refDiv.className = 'item__image item__image--reference opacity-0';
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv);

    const tileR = refDiv.getBoundingClientRect();
    const mainR = mainRef.current?.getBoundingClientRect();
    const frameR = frameRef.current?.getBoundingClientRect();

    if (!mainR || !frameR) {
       openingRef.current = false;
       return;
    }

    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    el.style.visibility = 'hidden';

    const overlay = document.createElement('div');
    overlay.className = 'enlarge';
    overlay.style.cssText = `position:absolute; left:${frameR.left - mainR.left}px; top:${frameR.top - mainR.top}px; width:${frameR.width}px; height:${frameR.height}px; z-index:30; border-radius:${openedImageBorderRadius}; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,.35); transition: transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease; transform-origin: top left;`;

    const rawSrc = parent.dataset.src || '';
    const isVideo = rawSrc.toLowerCase().endsWith('.mp4');
    
    if (isVideo) {
      const vdo = document.createElement('video');
      vdo.src = rawSrc;
      vdo.style.cssText = 'width:100%; height:100%; object-fit:cover;';
      vdo.autoPlay = true;
      vdo.muted = true;
      vdo.loop = true;
      vdo.playsInline = true;
      overlay.appendChild(vdo);
    } else {
      const img = document.createElement('img');
      img.src = rawSrc;
      img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
      overlay.appendChild(img);
    }

    viewerRef.current.appendChild(overlay);

    const sx0 = tileR.width / frameR.width;
    const sy0 = tileR.height / frameR.height;
    overlay.style.transform = `translate(${tileR.left - frameR.left}px, ${tileR.top - frameR.top}px) scale(${sx0}, ${sy0})`;
    overlay.style.opacity = '0';

    setTimeout(() => {
      overlay.style.opacity = '1';
      overlay.style.transform = 'translate(0,0) scale(1)';
      rootRef.current?.setAttribute('data-enlarging', 'true');
    }, 16);
  };

  const closeItem = useCallback(() => {
    const el = focusedElRef.current;
    if (!el) return;
    const parent = el.parentElement;
    const overlay = viewerRef.current?.querySelector('.enlarge');
    if (!overlay) return;

    overlay.style.opacity = '0';
    overlay.style.transform = `translate(${originalTilePositionRef.current.left - frameRef.current.getBoundingClientRect().left}px, ${originalTilePositionRef.current.top - frameRef.current.getBoundingClientRect().top}px) scale(${originalTilePositionRef.current.width / frameRef.current.getBoundingClientRect().width})`;
    
    setTimeout(() => {
      overlay.remove();
      el.style.visibility = 'visible';
      focusedElRef.current = null;
      rootRef.current?.removeAttribute('data-enlarging');
      openingRef.current = false;
      parent.querySelector('.item__image--reference')?.remove();
      unlockScroll();
    }, enlargeTransitionMs);
  }, [enlargeTransitionMs, unlockScroll]);

  const cssStyles = `
    .sphere-root { 
      --radius: 520px; 
      --viewer-pad: 72px; 
      --circ: calc(var(--radius) * 3.14159); 
      --rot-y: calc(360deg / var(--segments-x)); 
      --rot-x: calc(360deg / var(--segments-y)); 
      --item-width: calc(var(--circ) / var(--segments-x)); 
      --item-height: calc(var(--circ) / var(--segments-y)); 
    }
    .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }
    .stage { 
      width: 100%; height: 100%; display: grid; place-items: center; 
      position: absolute; inset: 0; perspective: calc(var(--radius) * 2.5); 
    }
    .sphere { 
      transform: translateZ(calc(var(--radius) * -1)); 
      will-change: transform; position: absolute; 
    }
    .sphere-item { 
      width: calc(var(--item-width) * var(--item-size-x)); 
      height: calc(var(--item-height) * var(--item-size-y)); 
      position: absolute; inset: -999px; margin: auto; 
      transform: rotateY(calc(var(--rot-y) * var(--offset-x) + var(--rot-y-delta, 0deg))) 
                 rotateX(calc(var(--rot-x) * var(--offset-y) + var(--rot-x-delta, 0deg))) 
                 translateZ(var(--radius)); 
      backface-visibility: hidden; 
    }
    .item__image { 
      position: absolute; inset: 8px; 
      border-radius: var(--tile-radius); 
      overflow: hidden; cursor: pointer; 
      transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), 
                  box-shadow 600ms, filter 600ms;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .item__image:hover {
      transform: scale(1.08) translateZ(30px);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 40px rgba(234, 223, 203, 0.15);
      z-index: 10;
    }
    .sphere-root[data-enlarging="true"] .scrim { opacity: 1 !important; pointer-events: all !important; }
    
    /* Cinematic Video Indicator */
    .sphere-item[data-type="video"]::after {
      content: '';
      position: absolute;
      top: 20px; right: 20px;
      width: 6px; height: 6px;
      background: #eadfcb;
      border-radius: 50%;
      box-shadow: 0 0 10px #eadfcb;
      opacity: 0.6;
      pointer-events: none;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div ref={rootRef} className="sphere-root relative w-full h-full overflow-hidden bg-transparent" style={{ '--segments-x': segments, '--segments-y': segments }}>
        <main ref={mainRef} className="absolute inset-0 grid place-items-center select-none touch-none">
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div key={i} className="sphere-item" data-src={it.src} data-offset-x={it.x} data-offset-y={it.y} data-size-x={it.sizeX} data-size-y={it.sizeY} data-type={images[i % images.length]?.type} style={{ '--offset-x': it.x, '--offset-y': it.y, '--item-size-x': it.sizeX, '--item-size-y': it.sizeY }}>
                  <div className="item__image" onClick={e => openItemFromElement(e.currentTarget)}>
                    <MediaItem src={it.src} alt={it.alt} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="scrim absolute inset-0 z-10 opacity-0 bg-black/60 backdrop-blur-sm pointer-events-none transition-opacity duration-500" ref={scrimRef} onClick={closeItem} />
          <div ref={viewerRef} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-[var(--viewer-pad)]">
            <div ref={frameRef} className="viewer-frame h-full aspect-square" />
          </div>
        </main>
      </div>
    </>
  );
}
