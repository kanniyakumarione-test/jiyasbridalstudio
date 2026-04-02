import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  Crown,
  Gem,
  HeartHandshake,
  Scissors,
  Sparkles,
  Star,
} from 'lucide-react';
import Hero3D from '../components/Hero3D';
import { fadeInUp, staggerContainer } from '../lib/motion';
import bridalWork1 from '../assets/images/bridal-purple-saree-chair-portrait.jpg';
import hairWork1 from '../assets/images/bridal-red-saree-soft-focus-portrait.jpg';
import makeupWork1 from '../assets/images/bridal-red-saree-jewelry-closeup.jpg';
import skinWork1 from '../assets/images/bridal-red-saree-look-collage.jpg';

const signatureCollections = [
  {
    title: 'Hair Design',
    text: 'Precision cuts, glossing, color refresh, wig styling, smoothening, and finish styling built around face shape and lifestyle.',
    icon: Scissors,
  },
  {
    title: 'Skin Rituals',
    text: 'Clean-ups, advanced facials, polishing, and treatment-led sessions tailored to texture, tan, and hydration needs.',
    icon: Sparkles,
  },
  {
    title: 'Occasion Beauty',
    text: 'Bridal, engagement, festive, and editorial looks planned with draping, trial notes, and timing support.',
    icon: Crown,
  },
];

const whyUs = [
  'Comfort-first consultation before every major service',
  'Curated menu covering hair, skin, nails, and bridal prep',
  'Luxury textures, layered lighting, and premium in-studio atmosphere',
  'Visible structure for maintenance plans, memberships, and event bookings',
];

const testimonials = [
  {
    quote:
      'The studio feels polished and calm, but the real difference is how thoughtfully the team guides every decision.',
    author: 'Regular hair color client',
    service: 'Hair color refresh',
  },
  {
    quote:
      'My bridal trial was clear, organized, and confidence-building. On the wedding day, everything flowed beautifully.',
    author: 'Bridal booking client',
    service: 'Bridal makeup',
  },
  {
    quote:
      'Facial recommendations felt practical instead of pushy, and the finish on my skin looked fresh for days.',
    author: 'Skin care client',
    service: 'Skin ritual',
  },
  {
    quote:
      'The mani-pedi service felt relaxing, premium, and very clean. I would happily come back for monthly care.',
    author: 'Repeat care client',
    service: 'Luxury pedi-care',
  },
  {
    quote:
      'I booked a package before an event and it saved time while still feeling curated and professional.',
    author: 'Package booking client',
    service: 'Glow package',
  },
];

const marqueeItems = [
  'Bridal Trials',
  'Luxury Facials',
  'Hair Spa Rituals',
  'Keratin & Smoothening',
  'Premium Makeup',
  'Nail Art & Extensions',
  'Wig Fitting & Styling',
  'Home Service Available',
  'Detan & Skin Glow Care',
];

const testimonialCarousel = [...testimonials, ...testimonials];
const featuredLooks = [
  {
    title: 'Bridal Signature',
    category: 'Bridal Beauty',
    image: bridalWork1,
    outcome: 'Soft glam finishing, balanced detail, and a polished look made for ceremony moments.',
  },
  {
    title: 'Hair Editorial',
    category: 'Hair Styling',
    image: hairWork1,
    outcome: 'Clean framing, expressive finish, and styling that feels current without losing softness.',
  },
  {
    title: 'Makeup Finish',
    category: 'Makeup Look',
    image: makeupWork1,
    outcome: 'Rich color balance, camera-ready detail, and a finish designed to photograph beautifully.',
  },
  {
    title: 'Skin Glow',
    category: 'Skin Ritual',
    image: skinWork1,
    outcome: 'Fresh texture, brighter finish, and glow-focused care designed for confident everyday beauty.',
  },
];

const Home = ({ theme = 'dark' }) => {
  return (
    <main className="relative overflow-hidden pt-28 md:pt-32 transition-colors duration-500">
      <Hero3D theme={theme} />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_22%,rgba(212,175,55,0.08),transparent_25%),radial-gradient(circle_at_20%_38%,rgba(255,244,214,0.04),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 dark:via-black/40 dark:to-black" />
      <section className="px-[5%] pb-8">
        <div className="section-shell editorial-panel relative z-10 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury salon interior"
              className="editorial-image opacity-34"
            />
            <div className="editorial-overlay-soft absolute inset-0" />
          </div>

          <div className="relative grid gap-8 px-6 py-14 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.72fr)] lg:gap-6 lg:px-12 xl:min-h-[76vh] xl:items-end">
            <Motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
              <Motion.div variants={fadeInUp} className="section-label">
                <Star className="h-4 w-4" />
                Premium Hair, Skin & Bridal Studio
              </Motion.div>

              <Motion.h1
                variants={fadeInUp}
                className="mt-6 max-w-3xl font-heading text-[3.2rem] leading-[0.92] text-primary sm:text-[4.1rem] md:text-[5.6rem] lg:text-[6.3rem] xl:text-[7rem]"
              >
                More than a salon.
                <span className="text-gradient block">A complete beauty destination.</span>
              </Motion.h1>

              <Motion.p variants={fadeInUp} className="mt-5 max-w-xl text-base leading-7 text-[#ddd1bb] md:text-lg">
                Jiya&apos;s Studio blends premium interiors, thoughtful consultation, and visible craftsmanship
                across hair, skin, nails, and event-ready beauty services.
              </Motion.p>

              <Motion.div variants={fadeInUp} className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="interactive-panel rounded-full bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-black transition-transform duration-300 hover:-translate-y-0.5 md:text-sm"
                >
                  Reserve Appointment
                </Link>
                <Link
                  to="/services"
                  className="interactive-panel rounded-full border border-glass-border bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-primary md:text-sm"
                >
                  View Service Menu
                </Link>
              </Motion.div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="grid max-w-[36rem] gap-3 self-end justify-self-end"
            >
              <div className="premium-card interactive-panel grid gap-3 rounded-[1.6rem] p-4 md:grid-cols-3">
                {[
                  ['15+ yrs', 'Years shaping beauty routines'],
                  ['15k+', 'Appointments and celebrations served'],
                  ['1', 'Destination for hair, skin, and bridal'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[1rem] bg-black/25 p-3">
                    <div className="font-heading text-3xl leading-none text-accent md:text-[2.15rem]">{value}</div>
                    <div className="mt-2 text-sm leading-5 text-[#d2c5ae]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="premium-card interactive-panel rounded-[1.6rem] p-5">
                <div className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent md:text-xs">
                  <CalendarDays className="h-4 w-4" />
                  This Week At The Studio
                </div>
                <div className="mt-3 space-y-2.5 text-sm leading-6 text-[#ebdfcb]">
                  <p>Bridal trial appointments with look mapping and finish planning.</p>
                  <p>Glow-focused facial bookings and pre-event skin prep sessions.</p>
                  <p>Consultation-led hair refresh slots for cuts, glossing, and color corrections.</p>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      <section className="px-[5%] py-10">
        <div className="section-shell relative z-10 overflow-hidden px-0 py-5">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div key={`${item}-${index}`} className="marquee-pill">
                <span className="marquee-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-10">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="premium-card interactive-panel p-8">
            <div className="section-label">
              <Gem className="h-4 w-4" />
              Signature Experience
            </div>
            <h2 className="mt-5 font-heading text-5xl leading-none text-primary">A richer, calmer, more premium visit.</h2>
            <p className="mt-5 section-copy">
              From the first greeting to the finishing mirror check, the studio experience is designed to feel
              polished, warm, and beautifully paced.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {signatureCollections.map((item) => {
              const Icon = item.icon;
              return (
                <Motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={fadeInUp}
                  className="premium-card interactive-panel p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-3xl text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#d6cab7]">{item.text}</p>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-10">
        <div className="section-shell relative z-10 overflow-hidden p-5 sm:p-8 md:p-10">
          <div className="mb-8">
            <div className="section-label">
              <HeartHandshake className="h-4 w-4" />
              Client Feedback
            </div>
            <h2 className="mt-5 font-heading text-3xl leading-tight text-primary sm:text-4xl md:text-5xl">
              What clients say after the service.
            </h2>
          </div>

          <div className="overflow-hidden px-0 py-2">
            <div className="testimonial-track">
              {testimonialCarousel.map((item, index) => (
                <div key={`${item.author}-${item.service}-${index}`} className="testimonial-card premium-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-accent">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <div className="rounded-full border border-glass-border bg-accent/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#d6c7b0]">
                      {item.service}
                    </div>
                  </div>
                  <p className="mt-5 font-heading text-[1.95rem] leading-tight text-primary sm:mt-6 sm:text-3xl">&ldquo;{item.quote}&rdquo;</p>
                  <p className="mt-6 text-sm uppercase tracking-[0.22em] text-[#c8b99d]">{item.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-[5%] py-10">
        <div className="section-shell relative z-10 p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="section-label">
                <Sparkles className="h-4 w-4" />
                Featured Looks
              </div>
              <h2 className="mt-5 font-heading text-4xl text-primary md:text-5xl">A few standout looks from the studio.</h2>
            </div>
            <Link
              to="/gallery"
              className="interactive-panel rounded-full border border-glass-border bg-accent/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
            >
              View Full Gallery
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredLooks.map((item) => (
              <div key={item.title} className="premium-card interactive-panel overflow-hidden p-4">
                <div className="relative overflow-hidden rounded-[1.4rem]">
                  <img src={item.image} alt={item.title} className="h-72 w-full object-cover transition-transform duration-700 hover:scale-[1.03]" loading="lazy" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.72))]" />
                  <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f1e5cf]">
                    {item.category}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-heading text-3xl text-white">{item.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#d6cab7]">{item.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-10">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="section-shell p-8 md:p-10">
            <div className="section-label">
              <Award className="h-4 w-4" />
              Why Clients Return
            </div>
            <h2 className="mt-5 section-title max-w-3xl">
              Beauty services that feel elevated without losing personal care.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {whyUs.map((point) => (
                <div key={point} className="premium-card interactive-panel flex items-start gap-4 p-5">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-[#e4d8c2]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell editorial-panel overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80"
              alt="Beauty treatment"
              className="editorial-image opacity-72"
            />
            <div className="editorial-overlay-bottom absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Studio Standard</div>
              <p className="mt-4 max-w-md text-base leading-8 text-secondary">
                Clean execution, premium textures, good lighting, and client communication that makes every visit
                feel confidently handled.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[5%] py-10">
        <div className="section-shell relative z-10 px-6 py-10 md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="section-label">
                <HeartHandshake className="h-4 w-4" />
                Client Journey
              </div>
              <h2 className="mt-5 section-title">A smoother path from consultation to final look.</h2>
              <p className="mt-5 section-copy max-w-xl">
                Every appointment is planned with care, clear guidance, and the right service flow so clients feel
                comfortable from consultation to the final finish.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                ['01', 'Consultation', 'We understand goals, event context, and maintenance comfort before making recommendations.'],
                ['02', 'Service Mapping', 'Clients get clearer expectations on timing, combinations, and the best-fit treatment path.'],
                ['03', 'Refined Delivery', 'Hair, skin, and finishing details are handled with calm pacing and visible attention to detail.'],
                ['04', 'Aftercare Clarity', 'Maintenance suggestions help clients preserve the look between visits.'],
              ].map(([step, title, text]) => (
                <div key={step} className="premium-card interactive-panel grid gap-3 p-5 md:grid-cols-[90px_1fr] md:items-start">
                  <div className="font-heading text-4xl text-accent">{step}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-primary">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#d5c8b3]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-[5%] pb-14 pt-10">
        <div className="section-shell editorial-panel home-footer-bridge relative z-10 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1519415943484-b60278cbf3ad?auto=format&fit=crop&w=1600&q=80"
              alt="Studio hair styling"
              className="editorial-image home-footer-bridge-image opacity-24"
            />
            <div className="editorial-overlay-soft home-footer-bridge-overlay absolute inset-0" />
          </div>
          <div className="relative flex flex-col gap-8 px-6 py-12 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14">
            <div className="max-w-3xl">
              <div className="section-label">Now Booking</div>
              <h2 className="mt-5 section-title">Book your next visit and experience the studio at its best.</h2>
              <p className="mt-5 section-copy max-w-2xl">
                Discover the services, explore recent looks, and reach out for appointments, bridal bookings, and
                beauty consultations with ease.
              </p>
            </div>
            <Link
              to="/contact"
              className="interactive-panel inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[0.24em] text-black"
            >
              Start Booking
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
