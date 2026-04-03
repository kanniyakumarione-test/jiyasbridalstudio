import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, BriefcaseBusiness, Check, GraduationCap, Scissors, Sparkles, Star, WandSparkles } from 'lucide-react';
import { pageTransition } from '../lib/motion';
import { buildWhatsAppUrl, siteConfig } from '../lib/siteConfig';

const programLevels = [
  {
    title: 'Basic',
    duration: '1 Month',
    note: 'Foundation learning for beginners who want a clear starting point in beauty and hair.',
  },
  {
    title: 'Advanced',
    duration: '3 Months',
    note: 'More detailed salon training with practical work, client handling, and skill refinement.',
  },
  {
    title: 'Professional',
    duration: '5 Months',
    note: 'Career-focused training built for students who want stronger salon readiness and placement support.',
  },
];

const courseCategories = [
  {
    title: 'Beauty Category',
    courses: [
      'Basic to Advanced Beauty',
      'Basic Beautician Course',
      'Advanced Beautician Course',
      'Beauty Therapy & Hair',
      'Professional Beautician Course',
      'Saree Draping',
    ],
  },
  {
    title: 'Hair Category',
    courses: [
      'Professional Hair Dressing',
      'Hair Stylist Course',
      'Hair Dressing Course',
      'Hair Extension Course',
      'Basic Hair Cutting',
      'Advanced Hair Styling',
      'Professional Hair Coloring',
    ],
  },
  {
    title: 'Makeup & Nails',
    courses: [
      'Makeup Artistry - 15 Days',
      'Bridal Makeup Artistry',
      'Professional Makeup Course',
      'Nail Artistry',
      'Nail Extension Course',
      'Advanced Nail Art',
    ],
  },
];

const academyBenefits = [
  'Certification provided after course completion',
  'Government certified training focus',
  '100% placement guarantee support',
  'Welcome kit for enrolled students',
];

const proHighlights = [
  'Advanced and professional tracks are handled as dedicated career-building programs.',
  'Best fit for students aiming for salon jobs, bridal work, or independent beauty service careers.',
  'Built around stronger practical exposure, service confidence, and placement-oriented support.',
];

const BeautySchool = () => {
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
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80"
            alt="Beauty school training session"
            className="editorial-image opacity-20"
            loading="lazy"
          />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>

        <div className="relative grid gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-14">
          <div>
            <div className="section-label">
              <GraduationCap className="h-4 w-4" />
              Jiya's Beauty School
            </div>
            <h1 className="mt-6 section-title max-w-4xl">Career-focused beauty training from basic to professional level.</h1>
            <p className="mt-6 max-w-2xl section-copy">
              Learn beauty, hair, makeup, nail artistry, hair extensions, and saree styling with structured training
              paths designed for beginners and future professionals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl(`Hello ${siteConfig.studioName}, I want details about beauty school courses.`)}
                target="_blank"
                rel="noreferrer"
                className="interactive-panel rounded-full bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.24em] text-black"
              >
                Ask On WhatsApp
              </a>
              <Link
                to="/contact"
                className="interactive-panel rounded-full border border-glass-border bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                Contact Studio
              </Link>
            </div>
          </div>

          <div className="premium-card p-6 md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Student Benefits</div>
            <div className="mt-5 space-y-4">
              {academyBenefits.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[1.35rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4"
                >
                  <div className="mt-1 rounded-full bg-accent/15 p-2 text-accent">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-[#ddd0bb]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="section-label">
            <Sparkles className="h-4 w-4" />
            Program Levels
          </div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#baa98e]">Basic, advanced, and professional learning paths</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {programLevels.map((item) => (
            <div key={item.title} className="premium-card interactive-panel p-6">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">{item.title}</div>
              <h2 className="mt-4 font-heading text-4xl text-white">{item.duration}</h2>
              <p className="mt-4 text-sm leading-7 text-[#d7cab5]">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="section-label">
            <WandSparkles className="h-4 w-4" />
            Course Categories
          </div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#baa98e]">Beauty, hair, makeup, nails, and styling</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {courseCategories.map((category) => (
            <div key={category.title} className="section-shell overflow-hidden p-6 md:p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">{category.title}</div>
              <div className="mt-5 space-y-3">
                {category.courses.map((course) => (
                  <div
                    key={course}
                    className="rounded-[1.2rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4 text-sm leading-7 text-[#eadfcb]"
                  >
                    {course}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell overflow-hidden p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,177,111,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
            <div className="relative">
              <div className="section-label">
                <Star className="h-4 w-4" />
                Advanced & Professional
              </div>
              <h2 className="mt-5 font-heading text-4xl text-white md:text-5xl">A separate focus for serious career-track students.</h2>
              <div className="mt-6 space-y-4">
                {proHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-[1.35rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4"
                  >
                    <div className="mt-1 rounded-full bg-accent/15 p-2 text-accent">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-[#ddd0bb]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="premium-card p-6 md:p-7">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                <Award className="h-4 w-4" />
                Certification
              </div>
              <p className="mt-4 text-sm leading-7 text-[#d6c9b4]">
                Students receive certification support after completing the selected course track.
              </p>
            </div>

            <div className="premium-card p-6 md:p-7">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                <BriefcaseBusiness className="h-4 w-4" />
                Placement Support
              </div>
              <p className="mt-4 text-sm leading-7 text-[#d6c9b4]">
                The academy positioning includes 100% placement guarantee support for students who complete the career tracks.
              </p>
            </div>

            <div className="premium-card p-6 md:p-7">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                <Scissors className="h-4 w-4" />
                Welcome Kit
              </div>
              <p className="mt-4 text-sm leading-7 text-[#d6c9b4]">
                A student welcome kit is included to help learners start training with better structure and preparation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Motion.main>
  );
};

export default BeautySchool;
