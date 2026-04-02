import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { AtSign, CalendarClock, Check, Clock3, Mail, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { pageTransition } from '../lib/motion';
import { buildMapEmbedUrl, buildMapSearchUrl, buildWhatsAppUrl, siteConfig } from '../lib/siteConfig';

const mapEmbedSrc = buildMapEmbedUrl();
const mapDirectionsHref = buildMapSearchUrl();

const contactChannels = [
  {
    icon: Phone,
    eyebrow: 'Call Studio',
    title: 'Speak directly for urgent timing changes or bridal planning.',
    body: 'Best for quick confirmations, consultation slots, and schedule updates before your visit.',
    actionLabel: 'Call Now',
    href: siteConfig.phoneHref,
  },
  {
    icon: MessageCircle,
    eyebrow: 'WhatsApp',
    title: 'Share your preferred date, package, and service list in one message.',
    body: 'Ideal for clients who want fast replies and a simple way to discuss appointment timing.',
    actionLabel: 'Open WhatsApp',
    href: buildWhatsAppUrl(`Hello ${siteConfig.studioName}, I want to ask about an appointment.`),
  },
  {
    icon: Mail,
    eyebrow: 'Email Support',
    title: 'Use email for detailed event notes, skin concerns, or first-visit questions.',
    body: 'A good option when you want to explain your requirements clearly before you book.',
    actionLabel: 'Send Email',
    href: `mailto:${siteConfig.email}`,
  },
];

const studioNotes = [
  { icon: CalendarClock, label: 'Studio Days', value: 'Sunday to Saturday' },
  { icon: Clock3, label: 'Opening Hours', value: '9:00 AM to 9:00 PM' },
  { icon: MapPin, label: 'Visit Style', value: 'Walk-ins possible, but premium services are best booked in advance' },
  { icon: AtSign, label: 'Instagram', value: siteConfig.instagramHandle },
];

const supportPrompts = [
  'Need help choosing the right package before you book?',
  'Want to know whether home service is available in your area?',
  'Planning a bridal appointment and need a smoother consultation flow?',
];

const supportBenefits = [
  'Quick answers for service selection before booking.',
  'Clear guidance for bridal consultations and premium appointments.',
  'Home-service availability checks based on your area and timing.',
];

const Contact = () => {
  return (
    <Motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-shell min-h-screen bg-obsidian px-[5%] pb-16 pt-32"
    >
      <section className="section-shell interactive-panel editorial-panel overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80"
            alt="Salon consultation space"
            className="editorial-image opacity-20"
            loading="lazy"
          />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>

        <div className="relative grid gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-14">
          <div>
            <div className="section-label">
              <Sparkles className="h-4 w-4" />
              Contact Studio
            </div>
            <h1 className="mt-6 section-title max-w-4xl">A cleaner contact page built for support, not form overload.</h1>
            <p className="mt-6 max-w-2xl section-copy">
              Reach the studio for questions, consultation guidance, timing checks, or service recommendations. Booking
              now has its own dedicated flow so this page stays easier to scan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book-visit"
                className="interactive-panel rounded-full bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.24em] text-black"
              >
                Book Visit
              </Link>
              <a
                href={buildWhatsAppUrl(`Hello ${siteConfig.studioName}, I need help with a service.`)}
                target="_blank"
                rel="noreferrer"
                className="interactive-panel rounded-full border border-glass-border bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                Ask On WhatsApp
              </a>
            </div>
          </div>

          <div className="premium-card p-6 md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Quick Support</div>
            <div className="mt-5 space-y-4">
              {supportPrompts.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4 text-sm leading-7 text-[#ddd1bb]"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.45rem] border border-[rgba(214,177,111,0.16)] bg-[linear-gradient(180deg,rgba(214,177,111,0.12),rgba(214,177,111,0.03))] p-5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Better Flow</div>
              <p className="mt-3 text-sm leading-7 text-[#eadfcb]">
                Contact the studio here for answers first, then move to the dedicated booking page when you are ready
                to lock in a visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="grid items-start gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid content-start gap-5">
            <div className="grid gap-5 md:grid-cols-3">
              {contactChannels.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="premium-card interactive-panel flex h-full flex-col p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(214,177,111,0.12)] text-accent shadow-[0_12px_24px_rgba(214,177,111,0.08)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent">
                      {item.eyebrow}
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#d7cab5]">{item.body}</p>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="mt-6 inline-flex w-fit rounded-full border border-glass-border bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                    >
                      {item.actionLabel}
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="section-shell overflow-hidden p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(214,177,111,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Why Contact First</div>
                  <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">Start with guidance, then book with confidence.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-8 text-[#d7cab5]">
                    This contact page works best as a calm support space for questions, service planning, and first-time
                    client help before moving into the booking flow.
                  </p>
                </div>

                <div className="space-y-4">
                  {supportBenefits.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-4 rounded-[1.35rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4"
                    >
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(214,177,111,0.14)] text-accent">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-[#ddd1bb]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-shell overflow-hidden p-4 md:p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,177,111,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
              <div className="relative">
                <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Studio Map</div>
                    <h2 className="mt-3 font-heading text-3xl text-white md:text-4xl">Find the studio faster.</h2>
                  </div>
                  <a
                    href={mapDirectionsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-glass-border bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Open In Maps
                  </a>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(214,177,111,0.14)] bg-black/20">
                  <iframe
                    title="Jiya's Studio map"
                    src={mapEmbedSrc}
                    className="h-[320px] w-full md:h-[420px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="section-shell overflow-hidden p-6 md:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,177,111,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
              <div className="relative">
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Studio Details</div>
                <h2 className="mt-4 font-heading text-4xl text-white">Everything important in one calm place.</h2>
                <div className="mt-5 space-y-4">
                  {studioNotes.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-start gap-4 rounded-[1.35rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(214,177,111,0.12)] text-accent">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                            {item.label}
                          </div>
                          <p className="mt-2 text-sm leading-7 text-[#ddd1bb]">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="premium-card p-6 md:p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Next Step</div>
              <h2 className="mt-4 font-heading text-4xl text-white">Ready to reserve your slot?</h2>
              <p className="mt-4 text-sm leading-7 text-[#d6c9b4]">
                Use the separate booking page for preferred services, time slot selection, home-service address, and
                current-location sharing.
              </p>
              <Link
                to="/book-visit"
                className="interactive-panel mt-6 inline-flex rounded-full bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.24em] text-black"
              >
                Open Booking Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Motion.main>
  );
};

export default Contact;
