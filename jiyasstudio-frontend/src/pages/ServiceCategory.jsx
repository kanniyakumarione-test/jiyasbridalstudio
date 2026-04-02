import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeIndianRupee } from 'lucide-react';
import { findServiceSectionBySlug } from '../data/servicesData';
import { pageTransition } from '../lib/motion';

const LIVE_CATEGORY_CACHE_PREFIX = 'jiya-live-category-v1:';
const LIVE_CATEGORY_CACHE_TTL = 1000 * 60 * 10;

const ServiceCategory = () => {
  const { slug } = useParams();
  const [liveSection, setLiveSection] = useState(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const lowPowerDevice =
      (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 6) ||
      (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 6);

    const updateMotionMode = () => {
      setReduceMotion(mediaQuery.matches || coarsePointer.matches || window.innerWidth < 1100 || lowPowerDevice);
    };

    updateMotionMode();
    mediaQuery.addEventListener?.('change', updateMotionMode);
    coarsePointer.addEventListener?.('change', updateMotionMode);
    window.addEventListener('resize', updateMotionMode);

    return () => {
      mediaQuery.removeEventListener?.('change', updateMotionMode);
      coarsePointer.removeEventListener?.('change', updateMotionMode);
      window.removeEventListener('resize', updateMotionMode);
    };
  }, []);

  useEffect(() => {
    const fetchLiveCategory = async () => {
      if (!scriptUrl) return;
      try {
        const cacheKey = `${LIVE_CATEGORY_CACHE_PREFIX}${slug}`;
        const cachedValue = window.sessionStorage.getItem(cacheKey);
        if (cachedValue) {
          const cached = JSON.parse(cachedValue);
          if (cached?.expiresAt > Date.now() && cached?.data) {
            setLiveSection(cached.data);
            return;
          }
        }

        setIsLiveLoading(true);
        const resp = await fetch(`${scriptUrl}?entity=Services`);
        const data = await resp.json();
        if (data.status === 'success' && data.data && Array.isArray(data.data)) {
          // Flatten match because we are in a specific category
          const matchingItems = data.data.filter(item => {
            const itemSlug = (item.subcategory || 'General').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            return itemSlug === slug;
          });

          if (matchingItems.length > 0) {
            const first = matchingItems[0];
            const nextSection = {
              title: first.subcategory || 'General',
              note: first.note || 'Professional salon care.',
              image: first.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=80',
              items: matchingItems.map(m => ({ name: m.name, price: m.price }))
            };
            setLiveSection(nextSection);
            window.sessionStorage.setItem(cacheKey, JSON.stringify({ data: nextSection, expiresAt: Date.now() + LIVE_CATEGORY_CACHE_TTL }));
          }
        }
      } catch (err) {
        console.error('Error fetching live category:', err);
      } finally {
        setIsLiveLoading(false);
      }
    };
    fetchLiveCategory();
  }, [scriptUrl, slug]);

  const staticSection = findServiceSectionBySlug(slug ?? '');
  const section = liveSection || staticSection;

  // Cart state in localStorage to persist across categories
  const [selectedServices, setSelectedServices] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('selectedServices') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  }, [selectedServices]);

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.name === service.name && s.sectionTitle === service.sectionTitle);
      if (exists) {
        return prev.filter((s) => !(s.name === service.name && s.sectionTitle === service.sectionTitle));
      } else {
        return [...prev, service];
      }
    });
  };

  if (!section) {
    return (
      <main className="min-h-screen bg-obsidian px-[5%] pb-16 pt-32">
        <div className="premium-card p-10 text-center">
          <h1 className="font-heading text-5xl text-white">Category Not Found</h1>
          <p className="mt-4 text-base leading-8 text-[#d3c6b1]">This service category does not exist or may have been renamed.</p>
          <Link to="/services" className="interactive-panel mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black">Back To Services</Link>
        </div>
      </main>
    );
  }

  return (
    <Motion.main
      variants={reduceMotion ? undefined : pageTransition}
      initial={reduceMotion ? false : 'initial'}
      animate={reduceMotion ? undefined : 'animate'}
      exit={reduceMotion ? undefined : 'exit'}
      className="page-shell min-h-screen bg-obsidian px-[5%] pb-16 pt-32"
    >
      <section className="section-shell interactive-panel editorial-panel overflow-hidden">
        <div className="absolute inset-0">
          <img src={section.image} alt={section.title} className="editorial-image opacity-24" />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-12 lg:px-14">
          <Link to="/services" className="section-label"><ArrowLeft className="h-4 w-4" />Back To Services</Link>
          <h1 className="mt-6 section-title">{section.title}</h1>
          <p className="mt-5 max-w-3xl section-copy">{section.note}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-glass-border bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.24em] text-accent">{section.items.length} Services In This Category</div>
            {isLiveLoading ? <div className="text-xs uppercase tracking-[0.24em] text-[#8f826d]">Refreshing live menu...</div> : null}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="section-shell p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.items.map((item) => {
              const checked = selectedServices.find((s) => s.name === item.name && s.sectionTitle === section.title);
              return (
                <Motion.article
                  key={`${section.title}-${item.name}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={reduceMotion ? undefined : { duration: 0.32 }}
                  className="interactive-panel premium-card flex h-full flex-col justify-between rounded-[28px] p-5 md:p-6"
                >
                  <div>
                    <div className="inline-flex rounded-full border border-[rgba(214,177,111,0.28)] bg-[rgba(214,177,111,0.1)] px-3 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.24em] text-accent">
                      {section.title}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold tracking-[0.02em] text-white md:text-2xl">
                      {item.name}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#d7c8b3]">
                      Premium studio care for {item.name.toLowerCase()} with pricing curated from the latest service sheet.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(214,177,111,0.16)] pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b6a58b]">
                      Starting Price
                    </span>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(214,177,111,0.14)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent md:text-base">
                      <BadgeIndianRupee className="h-4 w-4" />
                      {item.price}
                    </div>
                    <button
                      className={`ml-4 rounded-full border px-3 py-1 text-xs font-semibold ${checked ? 'bg-accent text-black border-accent' : 'bg-white/10 text-accent border-glass-border'}`}
                      onClick={() => toggleService({ ...item, sectionTitle: section.title })}
                    >
                      {checked ? 'Remove' : 'Add'}
                    </button>
                  </div>
                </Motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </Motion.main>
  );
};

export default ServiceCategory;
