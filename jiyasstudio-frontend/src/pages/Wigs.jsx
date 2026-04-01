import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, WandSparkles } from 'lucide-react';
import { wigServices } from '../data/servicesData';
import { fadeInUp, pageTransition } from '../lib/motion';

const WigCard = ({ name, price }) => (
  <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeInUp}>
    <div className="premium-card interactive-panel flex h-full flex-col justify-between rounded-[1.8rem] p-6">
      <div>
        <div className="inline-flex rounded-full border border-[rgba(214,177,111,0.24)] bg-[rgba(214,177,111,0.1)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-accent">
          Wig Service
        </div>
        <h3 className="mt-5 font-heading text-3xl text-white">{name}</h3>
        <p className="mt-3 text-sm leading-7 text-[#d6cab7]">
          Consultation-led wig support designed around fit, finish, comfort, and natural-looking confidence.
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[rgba(214,177,111,0.14)] pt-4">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b6a58b]">Pricing</span>
        <div className="rounded-full bg-accent px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-black">
          {price}
        </div>
      </div>
    </div>
  </Motion.div>
);

const WigPage = () => {
  return (
    <Motion.main variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-shell min-h-screen bg-obsidian px-[5%] pb-16 pt-32">
      <section className="section-shell editorial-panel overflow-hidden">
        <div className="absolute inset-0">
          <img src={wigServices.image} alt={wigServices.title} className="editorial-image opacity-24" />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>
        <div className="relative grid gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14">
          <div>
            <div className="section-label">
              <WandSparkles className="h-4 w-4" />
              Dedicated Wig Page
            </div>
            <h1 className="mt-6 section-title max-w-3xl">{wigServices.title}</h1>
            <p className="mt-6 max-w-2xl section-copy">{wigServices.note}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/book-visit"
                className="interactive-panel inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-black"
              >
                Book Wig Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="interactive-panel inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white"
              >
                Ask A Question
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              'Private consultations for wig choice, fit, and face-framing direction.',
              'Styling and revamp support for fresh installs, reset appointments, and event looks.',
              'Maintenance-focused care for washing, reshaping, and natural finish refinement.',
            ].map((item) => (
              <div key={item} className="premium-card interactive-panel flex items-start gap-4 p-5">
                <div className="mt-1 rounded-full bg-accent/15 p-2 text-accent">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-[#ddd0bb]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="section-label">
            <Sparkles className="h-4 w-4" />
            Wig Services
          </div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#baa98e]">Standalone page outside the main services directory</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wigServices.items.map((item) => (
            <WigCard key={item.name} {...item} />
          ))}
        </div>
      </section>
    </Motion.main>
  );
};

export default WigPage;
