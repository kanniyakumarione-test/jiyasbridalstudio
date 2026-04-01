import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Award, Heart, Sparkles, Users } from 'lucide-react';
import { pageTransition } from '../lib/motion';
import ownerPortrait from '../assets/CEO.jpeg';

const values = [
  {
    title: 'Consultation First',
    text: 'We design services around face shape, skin needs, event timing, and how much upkeep the client actually wants.',
    icon: Users,
  },
  {
    title: 'Luxury Without Noise',
    text: 'Premium experience comes from pacing, cleanliness, confidence, and good finishing, not just decoration.',
    icon: Sparkles,
  },
  {
    title: 'Care That Lasts',
    text: 'Our service flow includes maintenance guidance so results continue to feel intentional after the appointment.',
    icon: Heart,
  },
];

const studioMoments = [
  {
    title: 'Hair Finish',
    subtitle: 'Cuts, gloss, movement',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Makeup Chair',
    subtitle: 'Bridal and occasion prep',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Skin Ritual',
    subtitle: 'Glow-focused studio care',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  },
];

const About = () => {
  return (
    <Motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-shell min-h-screen bg-obsidian px-[5%] pb-16 pt-28 md:pt-32"
    >
      <section className="section-shell overflow-hidden">
        <div className="grid gap-5 px-5 py-6 md:gap-6 md:px-8 md:py-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-8">
          <div>
            <div className="section-label">
              <Award className="h-4 w-4" />
              About The Studio
            </div>
            <h1 className="mt-4 max-w-[12ch] font-heading text-3xl leading-[0.98] text-white sm:text-4xl md:text-5xl lg:text-[3.85rem]">
              Built by Jiya, with confidence, craftsmanship, and a warmer kind of premium beauty service.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#d3c6b1] md:mt-4 md:text-[15px] md:leading-7 lg:max-w-[30rem]">
              Jiya&apos;s Studio is led by its owner, Jiya, with a vision for beauty care that feels personal,
              polished, and genuinely welcoming. Hair, skin, nails, and occasion styling all come together in one
              refined experience where every client should feel seen, guided, and beautifully looked after.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['15+ yrs', 'years of evolving studio service'],
                ['15k+', 'appointments and celebrations served'],
                ['4', 'core pillars: hair, skin, nails, bridal'],
              ].map(([value, label]) => (
                <div key={label} className="premium-card p-3.5 md:p-4">
                  <div className="font-heading text-2xl text-accent md:text-3xl">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-[#d5c8b3] md:text-sm md:leading-6">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="editorial-panel group overflow-hidden rounded-[1.6rem] border border-glass-border sm:rounded-[2rem] lg:max-h-[460px]">
            <div className="relative h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[460px]">
              <div className="absolute left-3 top-3 z-10 rounded-full border border-[rgba(214,177,111,0.25)] bg-black/35 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-accent backdrop-blur-sm transition-all duration-500 group-hover:border-[rgba(214,177,111,0.42)] group-hover:bg-black/45 lg:left-4 lg:top-4">
                Founder And Owner
              </div>
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/45 to-transparent px-4 pb-4 pt-14 transition-all duration-500 group-hover:pb-5 sm:px-5 sm:pb-5 lg:px-5 lg:pb-5">
                <div className="font-heading text-2xl text-white transition-transform duration-500 group-hover:-translate-y-1 sm:text-3xl lg:text-[2.2rem]">Jiya</div>
                <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#dfc999] transition-transform duration-500 group-hover:-translate-y-1 sm:text-xs">
                  Jiya&apos;s Studio
                </div>
              </div>
              <img
                src={ownerPortrait}
                alt="Jiya, owner of Jiya's Studio"
                className="h-[280px] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-110 sm:h-[340px] lg:h-[460px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {studioMoments.map((item) => (
            <div key={item.title} className="section-shell editorial-panel overflow-hidden">
              <div className="relative min-h-[300px]">
                <img src={item.image} alt={item.title} className="editorial-image absolute inset-0 opacity-80" loading="lazy" />
                <div className="editorial-overlay-bottom absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">{item.subtitle}</div>
                  <h2 className="mt-3 font-heading text-4xl text-white">{item.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="premium-card p-6 md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-accent">Meet The Owner</div>
            <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">Jiya built the studio around trust, elegance, and real care.</h2>
            <p className="mt-5 text-base leading-8 text-[#d7cab4]">
              The studio grew from Jiya&apos;s belief that clients deserve more than rushed appointments or generic
              service. Her approach centers on clear guidance, thoughtful finishing, and a calm premium environment
              that helps every visit feel personal.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="premium-card p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-3xl text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#d7cab4]">{value.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="section-shell px-6 py-10 md:px-10 md:py-12 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="section-label">Studio Principles</div>
              <h2 className="mt-5 section-title">Every service should feel beautiful before, during, and after.</h2>
            </div>
            <div className="space-y-4">
              {[
                'Clear conversations before major hair color, treatment facial, or bridal services.',
                'Thoughtful combinations so clients can plan one visit well instead of guessing what to book.',
                'Visual polish across interiors, product styling, and finishing details that support a premium memory.',
                'A calm environment where occasion bookings and regular self-care visits both feel welcome.',
              ].map((point) => (
                <div key={point} className="premium-card p-5 text-sm leading-7 text-[#e5dac7]">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'For everyday clients',
              text: 'The experience is structured for repeat care too: trims, clean-ups, pedicures, facial maintenance, and refresh appointments all sit naturally within the studio.',
            },
            {
              title: 'For occasion bookings',
              text: 'Bridal and event styling are supported with trials, timing clarity, and polished presentation so the service feels dependable as well as luxurious.',
            },
          ].map((item) => (
            <div key={item.title} className="section-shell p-8">
              <h3 className="font-heading text-4xl text-white">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-[#d8ccb8]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Motion.main>
  );
};

export default About;
