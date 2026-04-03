import { useEffect, useMemo, useState } from 'react';

function readPerformanceProfile() {
  if (typeof window === 'undefined') {
    return {
      prefersReducedMotion: false,
      isCoarsePointer: false,
      isSmallViewport: false,
      lowPowerDevice: false,
      saveDataEnabled: false,
      slowConnection: false,
      allowHeavyEffects: true,
      allowAmbientMotion: true,
      allowAutoplayVideo: true,
    };
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isSmallViewport = window.innerWidth < 1024;
  const lowCoreCount = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 6;
  const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 6;
  const connection = typeof navigator !== 'undefined' ? navigator.connection || navigator.mozConnection || navigator.webkitConnection : null;
  const saveDataEnabled = Boolean(connection?.saveData);
  const slowConnection = typeof connection?.effectiveType === 'string' && /(^|-)2g$|3g/.test(connection.effectiveType);
  const lowPowerDevice = Boolean(lowCoreCount || lowMemory);

  const allowHeavyEffects = !(prefersReducedMotion || saveDataEnabled || slowConnection || lowPowerDevice || (isCoarsePointer && isSmallViewport));
  const allowAmbientMotion = !(prefersReducedMotion || saveDataEnabled || slowConnection);
  const allowAutoplayVideo = !(prefersReducedMotion || saveDataEnabled || slowConnection || (isCoarsePointer && isSmallViewport));

  return {
    prefersReducedMotion,
    isCoarsePointer,
    isSmallViewport,
    lowPowerDevice,
    saveDataEnabled,
    slowConnection,
    allowHeavyEffects,
    allowAmbientMotion,
    allowAutoplayVideo,
  };
}

export function getPerformanceProfile() {
  return readPerformanceProfile();
}

export function usePerformanceProfile() {
  const [profile, setProfile] = useState(() => readPerformanceProfile());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    const updateProfile = () => {
      setProfile(readPerformanceProfile());
    };

    updateProfile();
    window.addEventListener('resize', updateProfile, { passive: true });
    reducedMotionQuery.addEventListener?.('change', updateProfile);
    coarsePointerQuery.addEventListener?.('change', updateProfile);

    return () => {
      window.removeEventListener('resize', updateProfile);
      reducedMotionQuery.removeEventListener?.('change', updateProfile);
      coarsePointerQuery.removeEventListener?.('change', updateProfile);
    };
  }, []);

  return useMemo(() => profile, [profile]);
}
