import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeIndianRupee, Check, MessageCircle, TicketPercent } from 'lucide-react';
import { findPackageBySlug } from '../data/servicesData';
import { pageTransition } from '../lib/motion';
import { buildWhatsAppUrl, siteConfig } from '../lib/siteConfig';

const wa = (title, items, offer) =>
  buildWhatsAppUrl(
    `Hello Jiya's Studio, I want to book ${title} for Rs.${offer}/-. Inclusions: ${items.join(', ')}. Please share availability.`,
  );

const PackageDetail = () => {
  const { slug } = useParams();
  const pkg = findPackageBySlug(slug ?? '');

  if (!pkg) {
    return (
      <main className="min-h-screen bg-obsidian px-[5%] pb-16 pt-32">
        <div className="premium-card p-10 text-center">
          <h1 className="font-heading text-5xl text-white">Package Not Found</h1>
          <p className="mt-4 text-base leading-8 text-[#d3c6b1]">This offer package does not exist or may have been renamed.</p>
          <Link to="/services" className="interactive-panel mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black">Back To Services</Link>
        </div>
      </main>
    );
  }

  return (
    <Motion.main variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-shell min-h-screen bg-obsidian px-[5%] pb-16 pt-32">
      <section className="section-shell interactive-panel editorial-panel overflow-hidden">
        <div className="absolute inset-0">
          <img src={pkg.image} alt={pkg.title} className="editorial-image opacity-24" />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>
        <div className="relative px-6 py-10 md:px-10 md:py-12 lg:px-14">
          <Link to="/services" className="section-label"><ArrowLeft className="h-4 w-4" />Back To Services</Link>
          <h1 className="mt-6 section-title">{pkg.title}</h1>
          <p className="mt-5 max-w-3xl section-copy">{pkg.note}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-full border border-glass-border bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.24em] text-accent">
              {pkg.items.length} Services In This Bundle
            </div>
            {pkg.strike ? (
              <div className="rounded-full border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 line-through">
                Rs.{pkg.strike}
              </div>
            ) : null}
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black">
              <TicketPercent className="h-4 w-4" />
              Offer Rs.{pkg.offer}/-
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="section-shell p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pkg.items.map((item, index) => (
              <Motion.article
                key={`${pkg.title}-${item}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
                className="interactive-panel premium-card flex h-full flex-col justify-between rounded-[28px] p-5 md:p-6"
              >
                <div>
                  <div className="inline-flex rounded-full border border-[rgba(214,177,111,0.28)] bg-[rgba(214,177,111,0.1)] px-3 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.24em] text-accent">
                    Inclusion {String(index + 1).padStart(2, '0')}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold tracking-[0.02em] text-white md:text-2xl">
                    {item}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#d7c8b3]">
                    Part of the {pkg.title.toLowerCase()} offer for a more complete studio experience.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 border-t border-[rgba(214,177,111,0.16)] pt-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  <Check className="h-4 w-4" />
                  Included In Package
                </div>
              </Motion.article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={wa(pkg.title, pkg.items, pkg.offer)} target="_blank" rel="noreferrer" className="interactive-panel inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black"><MessageCircle className="h-4 w-4" />Book {pkg.title} On WhatsApp</a>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(214,177,111,0.14)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent md:text-base">
              <BadgeIndianRupee className="h-4 w-4" />
              Offer Price {pkg.offer}
            </div>
            <div className="text-sm leading-7 text-[#d7c8b3]">
              Need to reschedule or cancel? Please contact {siteConfig.shortName} directly as early as possible.
            </div>
          </div>
        </div>
      </section>
    </Motion.main>
  );
};

export default PackageDetail;
