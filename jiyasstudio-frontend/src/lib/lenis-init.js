// src/lib/lenis-init.js
// Initializes Lenis smooth scroll for the whole website
import Lenis from 'lenis';

export function initLenis() {
  if (typeof window === 'undefined') return;
  if (window.__lenisInitialized) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const lowPowerDevice =
    (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4);

  if (prefersReducedMotion || isTouchDevice || lowPowerDevice) {
    return;
  }

  window.__lenisInitialized = true;

  const lenis = new Lenis({
    duration: 0.8,
    lerp: 0.11,
    smoothWheel: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.05,
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
