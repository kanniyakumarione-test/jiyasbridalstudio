// src/lib/lenis-init.js
// Initializes Lenis smooth scroll for the whole website
import Lenis from 'lenis';
import { getPerformanceProfile } from './performance';

export function initLenis() {
  if (typeof window === 'undefined') return;
  if (window.__lenisInitialized) return;

  const { prefersReducedMotion, isCoarsePointer, lowPowerDevice, saveDataEnabled, slowConnection } = getPerformanceProfile();

  if (prefersReducedMotion || isCoarsePointer || lowPowerDevice || saveDataEnabled || slowConnection) {
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
    window.__lenisRaf = requestAnimationFrame(raf);
  }
  window.__lenisRaf = requestAnimationFrame(raf);

  // Optional: Expose for debugging
  window.lenis = lenis;
}
