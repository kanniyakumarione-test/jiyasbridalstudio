// src/lib/lenis-init.js
// Initializes Lenis smooth scroll for the whole website
import Lenis from 'lenis';

export function initLenis() {
  if (typeof window === 'undefined') return;
  if (window.__lenisInitialized) return;
  window.__lenisInitialized = true;

  const lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Optional: Expose for debugging
  window.lenis = lenis;
}
