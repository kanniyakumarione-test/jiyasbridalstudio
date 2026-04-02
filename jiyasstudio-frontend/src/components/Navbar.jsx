import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Menu, Moon, ShoppingCart, SunMedium, X, ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Wigs', to: '/wigs' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
  { label: 'Book Visit', to: '/book-visit' },
];

const desktopNavItems = navItems.filter((item) => item.to !== '/book-visit');
const mobileMenuItems = navItems.filter((item) => item.to !== '/book-visit');

const buildBookingLink = (services) =>
  services.length
    ? `/book-visit?services=${encodeURIComponent(services.map((s) => `${s.name} (${s.sectionTitle})`).join(', '))}`
    : '#';

const CartModal = ({ cartCount, onClose, onRemove, selectedServices }) => (
  <div className="fixed inset-0 z-[9999] bg-black/72 px-4 py-6 backdrop-blur-md" onClick={onClose}>
    <div
      className="mx-auto flex max-h-[calc(100vh-3rem)] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-glass-border bg-[linear-gradient(180deg,rgba(24,21,17,0.98),rgba(12,10,8,0.98))] shadow-[0_28px_90px_rgba(0,0,0,0.6)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4 border-b border-[rgba(214,177,111,0.14)] px-6 py-5 md:px-7">
        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Selection Cart</div>
          <h2 className="mt-2 font-heading text-3xl text-white">Your picked services</h2>
          <p className="mt-2 text-sm leading-6 text-[#cfc2ad]">
            Review everything before moving into booking.
          </p>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-glass-border bg-white/5 text-[#eadfc9] transition-all duration-300 hover:border-accent/40 hover:text-white"
          onClick={onClose}
          aria-label="Close cart"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {cartCount === 0 ? (
        <div className="px-6 py-12 text-center md:px-7">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-glass-border bg-accent/10 text-accent">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <div className="mt-5 font-heading text-3xl text-white">Cart is empty</div>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#cfc2ad]">
            Add a few services from any category and they will appear here for quick booking.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-[rgba(214,177,111,0.12)] px-6 py-4 md:px-7">
            <div className="text-sm uppercase tracking-[0.22em] text-[#b8a98f]">Selected Items</div>
            <div className="rounded-full border border-[rgba(214,177,111,0.2)] bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {cartCount} Total
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto px-4 py-3 md:px-5">
            {selectedServices.map((service) => (
              <li
                key={`${service.name}-${service.sectionTitle}`}
                className="mb-3 flex items-center justify-between gap-4 rounded-[1.4rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4 last:mb-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold text-white">{service.name}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    {service.sectionTitle}
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-red-400/25 bg-red-400/8 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-red-300 transition-colors duration-300 hover:border-red-300/45 hover:text-red-100"
                  onClick={() => onRemove(service)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="border-t border-[rgba(214,177,111,0.14)] bg-white/[0.02] px-6 py-5 md:px-7">
        <Link
          to={buildBookingLink(selectedServices)}
          className={`flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] transition-all duration-300 ${
            cartCount === 0
              ? 'pointer-events-none border border-glass-border bg-white/5 text-[#8e8068]'
              : 'border border-accent bg-accent text-black hover:-translate-y-0.5 hover:bg-[#e2c88e]'
          }`}
          onClick={onClose}
        >
          Continue To Booking
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </div>
);

const Navbar = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const isDarkTheme = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('selectedServices') || '[]').length;
    } catch {
      return 0;
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('selectedServices') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const updateCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem('selectedServices') || '[]');
        setCartCount(items.length);
        setSelectedServices(items);
      } catch {
        setCartCount(0);
        setSelectedServices([]);
      }
    };

    window.addEventListener('storage', updateCart);
    const interval = setInterval(updateCart, 1000);

    return () => {
      window.removeEventListener('storage', updateCart);
      clearInterval(interval);
    };
  }, []);

  const removeService = (service) => {
    const updated = selectedServices.filter(
      (item) => !(item.name === service.name && item.sectionTitle === service.sectionTitle),
    );
    setSelectedServices(updated);
    setCartCount(updated.length);
    localStorage.setItem('selectedServices', JSON.stringify(updated));
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <Motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-[110] mx-auto w-[94%] max-w-[1440px]"
      >
        <div
          className={`premium-card rounded-[2rem] px-4 py-3 backdrop-blur-2xl md:px-5 xl:px-6 ${
            isDarkTheme
              ? 'max-xl:bg-[linear-gradient(180deg,rgba(16,13,10,0.96),rgba(12,10,8,0.94))]'
              : 'max-xl:border-[rgba(214,177,111,0.18)] max-xl:bg-[linear-gradient(180deg,rgba(255,250,243,0.96),rgba(249,241,229,0.94))] max-xl:shadow-[0_18px_48px_rgba(113,84,34,0.14)]'
          }`}
        >
          <div className="hidden items-center justify-between gap-3 xl:flex xl:gap-5">
            <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3 pr-1 md:gap-4" onClick={closeMenu}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-[radial-gradient(circle_at_top,rgba(214,177,111,0.22),rgba(255,255,255,0.02))]">
                <img
                  src="/logo.png"
                  alt="Jiya's Unisex Beauty & Hair Studio"
                  className="h-9 w-9 rounded-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="font-heading text-[1.18rem] uppercase tracking-[0.15em] text-white md:text-[1.45rem]">
                  Jiya&apos;s
                </div>
                <div className="max-w-[12rem] text-[0.54rem] uppercase leading-[1.55] tracking-[0.24em] text-[#cdbd9d] md:max-w-none md:text-[0.58rem]">
                  Beauty, Hair &amp; Skin Studio
                </div>
              </div>
            </Link>

            <div className="min-w-0 flex-1 items-center justify-center xl:flex">
              <div className="flex items-center gap-1 rounded-full border border-glass-border bg-black/15 px-3 py-2">
                {desktopNavItems.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
                        active ? 'bg-accent text-black shadow-[0_10px_30px_rgba(214,177,111,0.24)]' : 'text-[#ded2be] hover:bg-white/[0.05] hover:text-accent'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex h-12 items-center gap-2 rounded-full border border-glass-border bg-white/[0.03] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#eadfc9] transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06]"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <SunMedium className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-accent" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>

              <button
                type="button"
                className="relative flex h-12 items-center gap-3 rounded-full border border-glass-border bg-white/[0.03] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#eadfc9] transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06]"
                onClick={() => setCartOpen(true)}
                aria-label="View cart"
              >
                <ShoppingCart className="h-[18px] w-[18px] text-accent" />
                <span>Cart</span>
                <span className="rounded-full bg-accent px-2 py-0.5 text-[0.62rem] font-bold text-black">
                  {cartCount}
                </span>
              </button>

              <Link
                to="/book-visit"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-accent bg-accent px-6 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-black transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#e2c88e]"
              >
                Book Visit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="xl:hidden">
            <div className="flex items-center justify-between gap-3">
              <Link to="/" className="flex min-w-0 flex-1 items-center gap-3" onClick={closeMenu}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-glass-border bg-[radial-gradient(circle_at_top,rgba(214,177,111,0.24),rgba(255,255,255,0.02))]">
                  <img
                    src="/logo.png"
                    alt="Jiya's Unisex Beauty & Hair Studio"
                    className="h-8 w-8 rounded-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div
                    className={`truncate font-heading text-[1rem] uppercase tracking-[0.14em] sm:text-[1.08rem] ${
                      isDarkTheme ? 'text-white' : 'text-[#2c1e12]'
                    }`}
                  >
                    Jiya&apos;s
                  </div>
                  <div
                    className={`truncate text-[0.48rem] uppercase tracking-[0.22em] sm:text-[0.52rem] ${
                      isDarkTheme ? 'text-[#cdbd9d]' : 'text-[#8f7449]'
                    }`}
                  >
                    Beauty, Hair &amp; Skin Studio
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:border-accent/40 ${
                    isDarkTheme
                      ? 'border-glass-border bg-white/5 text-white'
                      : 'border-[rgba(214,177,111,0.22)] bg-white/88 text-[#2c1e12]'
                  }`}
                  aria-label="View cart"
                >
                  <ShoppingCart className="h-4.5 w-4.5 text-accent" />
                  {cartCount > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-bold text-black">
                      {cartCount}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:border-accent/40 ${
                    isDarkTheme
                      ? 'border-glass-border bg-white/5 text-white'
                      : 'border-[rgba(214,177,111,0.22)] bg-white/88 text-[#2c1e12]'
                  }`}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <SunMedium className="h-4.5 w-4.5 text-accent" /> : <Moon className="h-4.5 w-4.5 text-accent" />}
                </button>
                <button
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:border-accent/40 ${
                    isDarkTheme
                      ? 'border-glass-border bg-white/5 text-white'
                      : 'border-[rgba(214,177,111,0.22)] bg-white/88 text-[#2c1e12]'
                  }`}
                  onClick={() => setIsOpen((value) => !value)}
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Link
                to="/book-visit"
                onClick={closeMenu}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-accent bg-accent px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-black transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#e2c88e]"
              >
                Book Visit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div
                className={`rounded-full border px-3 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] ${
                  isDarkTheme
                    ? 'border-glass-border bg-white/[0.03] text-[#cdbd9d]'
                    : 'border-[rgba(214,177,111,0.2)] bg-white/78 text-[#8f7449]'
                }`}
              >
                {location.pathname === '/' ? 'Home' : desktopNavItems.find((item) => item.to === location.pathname)?.label ?? 'Menu'}
              </div>
            </div>
          </div>
        </div>
      </Motion.div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[7.25rem] z-[105] mx-auto w-[94%] max-w-[1440px] xl:hidden"
          >
            <div
              className={`premium-card rounded-[1.75rem] px-5 pb-5 pt-6 xl:bg-transparent ${
                isDarkTheme
                  ? 'bg-[linear-gradient(180deg,rgba(16,13,10,0.97),rgba(11,9,7,0.95))]'
                  : 'border-[rgba(214,177,111,0.18)] bg-[linear-gradient(180deg,rgba(255,250,243,0.98),rgba(249,241,229,0.96))] shadow-[0_18px_48px_rgba(113,84,34,0.14)]'
              }`}
            >
              <div className="mt-3 mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-accent">Explore</div>
              <div className="grid gap-3">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className={`rounded-[1.4rem] px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] transition-colors ${
                      location.pathname === item.to
                        ? 'bg-accent text-black'
                        : isDarkTheme
                          ? 'border border-glass-border bg-white/5 text-[#e6decd]'
                          : 'border border-[rgba(214,177,111,0.18)] bg-white/82 text-[#3b2a1b]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div
                className={`mt-5 rounded-2xl border p-4 text-sm leading-7 ${
                  isDarkTheme
                    ? 'border-glass-border bg-black/25 text-[#cfc3ad]'
                    : 'border-[rgba(214,177,111,0.18)] bg-white/74 text-[#5d4933]'
                }`}
              >
                Consultation-friendly timings: Sunday to Saturday, 9:00 AM to 9:00 PM.
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{cartOpen ? <CartModal cartCount={cartCount} onClose={() => setCartOpen(false)} onRemove={removeService} selectedServices={selectedServices} /> : null}</AnimatePresence>
    </>
  );
};

export default Navbar;
