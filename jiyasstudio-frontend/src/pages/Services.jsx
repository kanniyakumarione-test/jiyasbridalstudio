import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Crown, Scissors, Search, Shield, Sparkles, TicketPercent, WandSparkles } from 'lucide-react';
import { packages, serviceGroups } from '../data/servicesData';
import RupeeRangeSlider from '../components/RupeeRangeSlider';
import { fadeInUp, pageTransition } from '../lib/motion';

const LIVE_SERVICES_CACHE_KEY = 'jiya-live-services-v1';
const LIVE_SERVICES_CACHE_TTL = 1000 * 60 * 10;

const p = (value) => Number(String(value).replace(/,/g, '').match(/\d+/)?.[0] ?? 0);
const matchText = (section, query) => !query || [section.title, section.note, ...(section.items ?? []).map((i) => i.name ?? i)].join(' ').toLowerCase().includes(query);

const groupIcons = { women: Sparkles, hair: Scissors, men: Crown };

const CategoryCard = ({ title, note, image, count, slug }) => (
  <Link to={`/services/${slug}`} className="section-shell interactive-panel editorial-panel group block overflow-hidden text-left">
    <div className="absolute inset-0">
      <img
        src="/logo.png"
        alt="Jiya's Studio logo"
        className="h-full w-full object-contain object-center p-4 opacity-16 transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div className="editorial-overlay-soft absolute inset-0" />
    </div>
    <div className="relative flex min-h-[220px] flex-col justify-between p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-full border border-glass-border bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">{count} Services</div>
      </div>
      <div>
        <h3 className="font-heading text-4xl text-white md:text-5xl">{title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#d4c6b0]">{note}</p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-accent">Open Category<ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></div>
      </div>
    </div>
  </Link>
);

const FilterDropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={containerRef} className="relative z-[70]">
      <div className="premium-card px-4 py-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">{label}</div>
        <button type="button" onClick={() => setIsOpen((current) => !current)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-glass-border bg-white/[0.03] px-4 py-3 text-left text-white transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.05]">
          <span>{activeOption.label}</span>
          <ChevronDown className={`h-4 w-4 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-[120] overflow-hidden rounded-[1.25rem] border border-glass-border bg-[#121212] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
          <div className="max-h-72 overflow-y-auto p-2">
            {options.map((option) => (
              <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${option.value === value ? 'bg-accent text-black' : 'text-[#eadfc9] hover:bg-white/[0.06]'}`}>
                <span>{option.label}</span>
                {option.value === value ? <Check className="h-4 w-4" /> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const OfferCardBody = ({ title, note, items, strike, offer, slug }) => (
  <Link to={`/packages/${slug}`} className="section-shell interactive-panel editorial-panel group block overflow-hidden text-left">
    <div className="absolute inset-0">
      <img
        src="/logo.png"
        alt="Jiya's Studio logo"
        className="h-full w-full object-contain object-center p-4 opacity-16 transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div className="editorial-overlay-soft absolute inset-0" />
    </div>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" />
    <div className="relative flex min-h-[320px] flex-col justify-between p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-full border border-[rgba(214,177,111,0.24)] bg-[rgba(214,177,111,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          {items.length} Inclusions
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#eadfc9]">
          Package
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col">
        <div className="text-sm font-semibold uppercase tracking-[0.32em] text-accent">{title}</div>
        <p className="mt-4 max-w-xl text-base leading-8 text-[#e4d8c2]">{note}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {items.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#ddd0bb]"
            >
              {item}
            </span>
          ))}
          {items.length > 3 ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#ddd0bb]">
              +{items.length - 3} More
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {strike ? (
              <div className="rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 line-through">
                Rs.{strike}
              </div>
            ) : null}
            <div className="rounded-full bg-accent px-5 py-2.5 text-lg font-bold text-black shadow-[0_14px_30px_rgba(214,177,111,0.22)]">
              Rs.{offer}/-
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Open Package
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const OfferCard = ({ reduceMotion, ...props }) =>
  reduceMotion ? (
    <OfferCardBody {...props} />
  ) : (
    <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInUp}>
      <OfferCardBody {...props} />
    </Motion.div>
  );



const Services = () => {
  const [liveServices, setLiveServices] = useState([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rupeeRange, setRupeeRange] = useState([0, 20000]);
  const [selectedServices, setSelectedServices] = useState([]); // Cart state
  const [reduceMotion, setReduceMotion] = useState(false);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Fetch live services from Google Sheets
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
    const fetchLiveServices = async () => {
      if (!scriptUrl) return;
      try {
        const cachedValue = window.sessionStorage.getItem(LIVE_SERVICES_CACHE_KEY);
        if (cachedValue) {
          const cached = JSON.parse(cachedValue);
          if (cached?.expiresAt > Date.now() && Array.isArray(cached?.data) && cached.data.length > 0) {
            setLiveServices(cached.data);
            return;
          }
        }

        setIsLiveLoading(true);
        const resp = await fetch(`${scriptUrl}?entity=Services`);
        const data = await resp.json();
        if (data.status === 'success' && data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Transform flat sheet data into nested groups
          const groups = [
            { key: 'women', label: "Women's Services", subtitle: 'Beauty, skin, nails, bridal support', sections: [] },
            { key: 'hair', label: 'Hair Studio', subtitle: 'Cuts, styling, color, care, treatments', sections: [] },
            { key: 'men', label: "Men's Grooming", subtitle: 'Cuts, facials, bleaching, skin care, packages', sections: [] },
          ];

          data.data.forEach(item => {
            if (!item || !item.category) return;
            const categoryLower = String(item.category).toLowerCase();
            const groupKey = categoryLower.includes('women') ? 'women' : 
                             categoryLower.includes('hair') ? 'hair' : 'men';
            const group = groups.find(g => g.key === groupKey);
            
            const subcat = item.subcategory || 'General';
            const subcatSlug = subcat.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            
            let section = group.sections.find(s => s.title === subcat);
            if (!section) {
              section = { 
                title: subcat, 
                slug: subcatSlug,
                note: item.note || 'Professional salon care.', 
                image: item.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=80',
                items: [] 
              };
              group.sections.push(section);
            }
            section.items.push({ name: item.name || 'Unnamed Service', price: item.price || '0' });
          });
          
          // Only use live services if we actually found sections
          const validGroups = groups.filter(g => g.sections.length > 0);
          if (validGroups.length > 0) {
            setLiveServices(groups);
            window.sessionStorage.setItem(
              LIVE_SERVICES_CACHE_KEY,
              JSON.stringify({ data: groups, expiresAt: Date.now() + LIVE_SERVICES_CACHE_TTL })
            );
          }
        }
      } catch (err) {
        console.error('Error fetching live services:', err);
      } finally {
        setIsLiveLoading(false);
      }
    };
    fetchLiveServices();
  }, [scriptUrl]);

  // Use live services if available, otherwise fallback to static data
  const activeServiceGroups = liveServices.length > 0 ? liveServices : serviceGroups;

  const q = deferredSearchTerm.trim().toLowerCase();

  // Add/remove service from cart
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

  // WhatsApp message builder
  const getWhatsAppMessage = () => {
    if (!selectedServices.length) return '';
    const list = selectedServices.map((s, i) => `${i + 1}. ${s.name} (${s.sectionTitle})`).join('%0A');
    return `Hi, I would like to book the following services:%0A${list}`;
  };

  const categoryOptions = [
    { value: 'all', label: 'All categories' },
    { value: 'women', label: "Women's services" },
    { value: 'hair', label: 'Hair studio' },
    { value: 'men', label: "Men's grooming" },
    { value: 'packages', label: 'Packages' },
  ];

  // Helper for rupee range filter
  const inRupeeRange = (price) => p(price) >= rupeeRange[0] && p(price) <= rupeeRange[1];


  // Find all matching services (flattened)
  const matchingServices = useMemo(() => {
    if (!q) return [];

    const nextMatches = [];

    activeServiceGroups
      .filter((group) => categoryFilter === 'all' || categoryFilter === group.key)
      .forEach((group) => {
        group.sections.forEach((section) => {
          section.items.forEach((item) => {
            if (item.name && item.name.toLowerCase().includes(q) && inRupeeRange(item.price)) {
              nextMatches.push({
                ...item,
                sectionTitle: section.title,
                groupLabel: group.label,
                groupKey: group.key,
              });
            }
          });
        });
      });

    return nextMatches;
  }, [activeServiceGroups, categoryFilter, q, rupeeRange]);

  const filteredGroups = useMemo(
    () =>
      !q
        ? activeServiceGroups
            .filter((group) => categoryFilter === 'all' || categoryFilter === group.key)
            .map((group) => ({
              ...group,
              sections: group.sections
                .map((section) => {
                  const items = section.items.filter((item) => inRupeeRange(item.price));
                  const keep = items.length > 0 || section.items.some((item) => inRupeeRange(item.price));
                  return keep
                    ? {
                        ...section,
                        items,
                        count: section.items.length,
                        slug:
                          section.slug ??
                          section.title
                            .toLowerCase()
                            .replace(/&/g, 'and')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, ''),
                      }
                    : null;
                })
                .filter(Boolean),
            }))
            .filter((group) => group.sections.length)
        : [],
    [activeServiceGroups, categoryFilter, q, rupeeRange]
  );

  const filteredPackages = useMemo(
    () =>
      categoryFilter === 'all' || categoryFilter === 'packages'
        ? packages.filter((pkg) => (!q || matchText({ ...pkg, note: '' }, q)) && inRupeeRange(pkg.offer))
        : [],
    [categoryFilter, q, rupeeRange]
  );

  return (
    <Motion.main
      variants={reduceMotion ? undefined : pageTransition}
      initial={reduceMotion ? false : 'initial'}
      animate={reduceMotion ? undefined : 'animate'}
      exit={reduceMotion ? undefined : 'exit'}
      className="page-shell min-h-screen px-[5%] pb-16 pt-32 transition-colors duration-500"
    >
      <section className="section-shell interactive-panel editorial-panel overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1600&q=80" alt="Premium beauty service" className="editorial-image opacity-20" />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>
        <div className="relative grid gap-10 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14">
          <div>
            <div className="section-label"><WandSparkles className="h-4 w-4" />Service Menu</div>
            <h1 className="mt-6 section-title max-w-3xl">Explore hair, skin, bridal, and grooming services with ease.</h1>
            <p className="mt-6 max-w-2xl section-copy">
              Browse each category, check the available treatments, and find the services that fit your beauty routine,
              event plans, or regular maintenance needs.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              'Dedicated categories make it easier to explore the full service menu.',
              'Search and filters help you quickly find the right treatment or price range.',
              'Packages stay visible for clients who want ready-made beauty combinations.',
            ].map((item) => <div key={item} className="premium-card interactive-panel flex items-start gap-4 p-5"><div className="mt-1 rounded-full bg-accent/15 p-2 text-accent"><Check className="h-4 w-4" /></div><p className="text-sm leading-7 text-[#ddd0bb]">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section className="relative z-50 py-10">
        <div className="premium-card interactive-panel overflow-visible p-0 md:p-0 shadow-lg rounded-3xl bg-[#181511]/90 border border-glass-border">
          <div className="flex flex-col gap-0 md:gap-2 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
              <div className="section-label flex items-center gap-2 text-lg md:text-xl"><Search className="h-5 w-5" />Smart Filters</div>
              <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-[#baa98e]">Search by service, category, and rupee range</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
              {/* Unified filter card style for all three boxes */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="h-full bg-[#1e1a15]/80 rounded-2xl border border-glass-border px-6 py-5 flex flex-col justify-between">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent flex items-center gap-2">
                    <Search className="h-5 w-5 text-accent" /> Search
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search service, package, facial, haircut..."
                    className="w-full bg-transparent text-white outline-none placeholder:text-[#988d78] text-base md:text-lg"
                    style={{ minWidth: 0 }}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="h-full bg-[#1e1a15]/80 rounded-2xl border border-glass-border px-6 py-5 flex flex-col justify-between">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">Category</div>
                  <FilterDropdown label=" " value={categoryFilter} options={categoryOptions} onChange={setCategoryFilter} />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="h-full bg-[#1e1a15]/80 rounded-2xl border border-glass-border px-6 py-5 flex flex-col justify-between">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">Rupee Range</div>
                  <RupeeRangeSlider
                    min={0}
                    max={20000}
                    value={rupeeRange}
                    onChange={setRupeeRange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Show matching services if searching, otherwise show categories */}

      {q && matchingServices.length > 0 && (
        <section className="py-10">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="section-label"><Search className="h-4 w-4" />Matching Services</div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#baa98e]">Results for "{searchTerm}"</p>
            {isLiveLoading ? <p className="text-xs uppercase tracking-[0.24em] text-[#8f826d]">Refreshing live menu...</p> : null}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matchingServices.map((item, idx) => {
              const checked = selectedServices.find((s) => s.name === item.name && s.sectionTitle === item.sectionTitle);
              return (
                <div key={item.name + idx} className="premium-card interactive-panel flex flex-col gap-2 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{item.groupLabel} &mdash; {item.sectionTitle}</div>
                    <button
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ml-2 ${checked ? 'bg-accent text-black border-accent' : 'bg-white/10 text-accent border-glass-border'}`}
                      onClick={() => toggleService(item)}
                    >
                      {checked ? 'Remove' : 'Add'}
                    </button>
                  </div>
                  <div className="font-heading text-2xl text-white">{item.name}</div>
                  <div className="text-lg font-bold text-accent">₹{item.price}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {!q && filteredGroups.map((group) => {
        const Icon = groupIcons[group.key] ?? Shield;
        return (
          <section key={group.key} className="py-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="section-label"><Icon className="h-4 w-4" />{group.label}</div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#baa98e]">{group.subtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.sections.map((section) => (
                <CategoryCard
                  key={section.title}
                  title={section.title}
                  note={section.note}
                  image={section.image}
                  count={section.count}
                  slug={section.slug}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* WhatsApp booking bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-[999] flex w-full max-w-xl -translate-x-1/2 justify-center px-4">
          <Link
            to={`/book-visit?services=${encodeURIComponent(selectedServices.map(s => s.name + ' (' + s.sectionTitle + ')').join(', '))}`}
            className="whatsapp-btn flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl transition-colors hover:bg-[#1ebe57] sm:w-auto sm:px-8 sm:py-4 sm:text-lg sm:tracking-[0.22em]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 6.107h-.001a9.87 9.87 0 0 1-4.988-1.361l-.357-.213-3.717.982.993-3.627-.232-.373A9.86 9.86 0 0 1 1.989 11.5c0-5.246 4.262-9.5 9.507-9.5 2.54 0 4.927.99 6.713 2.787A9.432 9.432 0 0 1 21.996 11.5c.003 5.246-4.259 9.5-9.504 9.5zm8.413-17.913A11.413 11.413 0 0 0 11.496 0C5.148 0 0 5.148 0 11.5c0 2.026.533 4.006 1.545 5.732L.057 23.19a1.13 1.13 0 0 0 1.414 1.414l6.008-1.487A11.44 11.44 0 0 0 11.496 23C17.844 23 23 17.852 23 11.5a11.42 11.42 0 0 0-3.515-8.424z"/></svg>
            Book Selected on WhatsApp
          </Link>
        </div>
      )}

      {filteredPackages.length ? (
        <section className="py-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="section-label"><TicketPercent className="h-4 w-4" />Packages</div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#baa98e]">Offer pricing and combo bundles</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredPackages.map((item) => <OfferCard key={item.title} reduceMotion={reduceMotion} {...item} />)}</div>
        </section>
      ) : null}

      {q && matchingServices.length === 0 && (
        <section className="py-10">
          <div className="premium-card p-8 text-center">
            <div className="font-heading text-4xl text-white">No services match these filters.</div>
            <p className="mt-4 text-base leading-8 text-[#d3c6b1]">Try a broader search term, switch category, or raise the price limit.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setRupeeRange([0, 20000]); }} className="interactive-panel mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black">Reset Filters<ChevronRight className="h-4 w-4" /></button>
          </div>
        </section>
      )}
    </Motion.main>
  );
};

export default Services;
