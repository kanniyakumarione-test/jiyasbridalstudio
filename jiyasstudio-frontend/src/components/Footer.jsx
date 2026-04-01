import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AtSign, CalendarClock, MapPin, Phone, Sparkles } from 'lucide-react';

const quickLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Wigs', '/wigs'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact'],
  ['Book Visit', '/book-visit'],
];

const studioHighlights = [
  'Signature facials and glow prep',
  'Bridal trials and occasion makeup',
  'Hair color refresh and correction',
  'Luxury nail and self-care rituals',
];

const Footer = () => {
  return (
    <footer className="px-[5%] pb-10 pt-0" style={{ background: 'var(--footer-bg, transparent)' }}>
      <div className="section-shell overflow-hidden">
        <div className="relative px-6 py-8 md:px-10 md:py-10 lg:px-12">
          <div className="grid gap-6 border-b border-glass-border pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="section-label">
                <Sparkles className="h-4 w-4" />
                Jiya's Studio
              </div>
              <h2 className="mt-5 section-title">
                Premium beauty,
                <span className="text-gradient block">beautifully guided.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#cebea5]">
                Hair, skin, bridal, and self-care services in one polished studio experience designed to feel calm,
                elevated, and confidence-building from consultation to final look.
              </p>
            </div>

            <div className="premium-card p-5 md:p-6" style={{ background: 'var(--footer-card-bg, rgba(255,255,255,0.02))' }}>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Ready To Book</div>
              <p className="mt-3 text-sm leading-7 text-[#ddd1bb]">
                Reserve a visit, ask for bridal guidance, or check home-service availability for your area.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/book-visit"
                  className="interactive-panel inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black"
                >
                  Book Visit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="interactive-panel rounded-full border border-glass-border bg-accent/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]"
                >
                  Contact Studio
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 pt-8 md:grid-cols-2 xl:grid-cols-[0.95fr_0.75fr_0.75fr_1fr]">
            <div>
              <div className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">Studio Note</div>
              <p className="max-w-md text-sm leading-7 text-[#d7cab5]">
                Designed for clients who want beauty services that feel premium, personal, and clearly handled.
              </p>
            </div>

            <div>
              <div className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">Explore</div>
              <div className="grid gap-3 text-sm text-[#e8decb]">
                {quickLinks.map(([label, href]) => (
                  <Link key={href} to={href} className="transition-colors duration-300 hover:text-accent">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">Popular Services</div>
              <div className="grid gap-3 text-sm text-[#e8decb]">
                {studioHighlights.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">Visit & Connect</div>
              <div className="grid gap-4 text-sm text-[#e8decb]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-accent" />
                  <span>By-appointment beauty studio with consultation-led service planning.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>Call for bookings, event timelines, and premium service guidance.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-4 w-4 text-accent" />
                  <span>Sunday to Saturday, 9:00 AM to 9:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <AtSign className="h-4 w-4 text-accent" />
                  <span>@jiyas.unisex.studio</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-glass-border pt-6 text-sm text-[#b8a98f] md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} Jiya&apos;s Studio.</p>
            <a
              href="https://services.kanniyakumarione.com/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-300 hover:text-accent"
            >
              Contact Developers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
