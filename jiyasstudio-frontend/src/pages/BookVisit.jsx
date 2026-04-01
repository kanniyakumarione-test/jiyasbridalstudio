import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Calendar, CalendarClock, Check, CheckCircle2, Clock3, LoaderCircle, MapPin, Navigation, Sparkles } from 'lucide-react';
import { pageTransition } from '../lib/motion';

const serviceChoices = [
  'Hair Styling',
  'Skin Facial',
  'Hair Color',
  'Bridal Makeup',
  'Manicure & Pedicure',
  'Package Offer',
];

const timeChoices = ['Morning', 'Afternoon', 'Evening', 'Weekend'];
const slotChoices = [
  '9:00 AM',
  '11:00 AM',
  '1:00 PM',
  '3:00 PM',
  '5:00 PM',
  '7:00 PM',
  '9:00 PM',
];

const bookingPoints = [
  'Choose your service and ideal time before you message the studio.',
  'Add your home-service address or use current location for faster area checks.',
  'Open the map link if you want to verify the exact pinned location before sending.',
];

const bookingGallery = [
  {
    title: 'Hair Prep',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Skin Care',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Bridal Finish',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  plan: '',
  location: '',
};

const BookVisit = () => {
  const location = useLocation();
  // Parse ?services=... from query string
  const params = new URLSearchParams(location.search);
  const multiServices = params.get('services');
  const [selectedService, setSelectedService] = useState(serviceChoices[1]);
  const [selectedTime, setSelectedTime] = useState(timeChoices[2]);
  const [selectedSlot, setSelectedSlot] = useState(slotChoices[4]);
  const [preferredDate, setPreferredDate] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [geoState, setGeoState] = useState({
    status: 'idle',
    message: 'Add your address manually or fetch your current location.',
    coords: null,
  });

  const mapHref = useMemo(() => {
    if (geoState.coords) {
      const { latitude, longitude } = geoState.coords;
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    if (form.location.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.location.trim())}`;
    }

    return 'https://www.google.com/maps';
  }, [form.location, geoState.coords]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const detectedLocationText = geoState.coords
    ? `${geoState.coords.latitude}, ${geoState.coords.longitude}`
    : '';

  const bookingSummary = useMemo(
    () => [
      [multiServices ? 'Services' : 'Service', multiServices ? multiServices.split(',').join(', ') : selectedService],
      ['Visit Window', selectedTime],
      ['Preferred Slot', selectedSlot],
      ['Preferred Date', preferredDate || 'Select a date'],
      ['Location', form.location.trim() || 'Add address details'],
    ],
    [form.location, preferredDate, selectedService, selectedSlot, selectedTime, multiServices],
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({
        status: 'error',
        message: 'Current location is not supported on this device.',
        coords: null,
      });
      return;
    }

    setGeoState({
      status: 'loading',
      message: 'Fetching your current location from the browser...',
      coords: null,
    });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latitude = coords.latitude.toFixed(6);
        const longitude = coords.longitude.toFixed(6);

        setGeoState({
          status: 'success',
          message: 'Current location detected. Add your area, landmark, or full address below for easier confirmation.',
          coords: {
            latitude,
            longitude,
          },
        });
      },
      (error) => {
        const messages = {
          1: 'Location permission was denied. Please allow access or enter the address manually.',
          2: 'Unable to detect your position right now. Please try again in a better signal area.',
          3: 'Location request timed out. Please try again or enter the address manually.',
        };

        setGeoState({
          status: 'error',
          message: messages[error.code] ?? 'Unable to fetch your location right now.',
          coords: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleWhatsAppBooking = () => {
    const locationSummary = form.location.trim() || '-';
    const serviceLine = multiServices
      ? `Services: ${multiServices.split(',').join(', ')}`
      : `Service: ${selectedService}`;

    const bookingMessage = [
      "Hello Jiya's Studio, I want to book a visit.",
      `Name: ${form.name || '-'}`,
      `Phone: ${form.phone || '-'}`,
      `Email: ${form.email || '-'}`,
      serviceLine,
      `Preferred Time: ${selectedTime}`,
      `Preferred Slot: ${selectedSlot}`,
      `Preferred Date: ${preferredDate || '-'}`,
      `Plan: ${form.plan || '-'}`,
      `Location: ${locationSummary}`,
      detectedLocationText ? `Current location shared via map: ${mapHref}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(bookingMessage)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-shell min-h-screen px-[5%] pb-16 pt-32"
    >
      <section className="section-shell interactive-panel editorial-panel overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80"
            alt="Salon appointment planning"
            className="editorial-image opacity-20"
            loading="lazy"
          />
          <div className="editorial-overlay-soft absolute inset-0" />
        </div>

        <div className="relative grid gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-14">
          <div>
            <div className="section-label">
              <Sparkles className="h-4 w-4" />
              Book Visit
            </div>
            <h1 className="mt-6 section-title max-w-4xl">A separate booking page with better flow and faster location sharing.</h1>
            <p className="mt-6 max-w-2xl section-copy">
              Pick a service, choose your preferred time, and send the request with your address or current location so
              the studio can respond faster.
            </p>
          </div>

          <div className="premium-card p-6 md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Booking Checklist</div>
            <div className="mt-6 space-y-4">
              {bookingPoints.map((item) => (
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
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="interactive-panel rounded-full border border-glass-border bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                Contact Page
              </Link>
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="interactive-panel rounded-full border border-glass-border bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
              >
                Open In Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {bookingGallery.map((item) => (
            <div key={item.title} className="section-shell editorial-panel overflow-hidden">
              <div className="relative min-h-[240px]">
                <img src={item.image} alt={item.title} className="editorial-image absolute inset-0 opacity-80" loading="lazy" />
                <div className="editorial-overlay-bottom absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="font-heading text-3xl text-white">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="premium-card overflow-hidden p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Appointment Request</div>
                <h2 className="mt-3 font-heading text-4xl text-white md:text-5xl">Send a better booking request.</h2>
              </div>
              <div className="hidden rounded-full border border-[rgba(214,177,111,0.2)] bg-[rgba(214,177,111,0.08)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent md:inline-flex">
                Dedicated Booking Flow
              </div>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="premium-card block px-5 py-4">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Full Name</div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={updateField('name')}
                    placeholder="Enter your name"
                    className="mt-3 w-full bg-transparent text-white outline-none placeholder:text-[#988d78]"
                  />
                </label>
                <label className="premium-card block px-5 py-4">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Phone Number</div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={updateField('phone')}
                    placeholder="Your best contact number"
                    className="mt-3 w-full bg-transparent text-white outline-none placeholder:text-[#988d78]"
                  />
                </label>
              </div>

              <label className="premium-card block px-5 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Email Address</div>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="For detailed replies and event planning"
                  className="mt-3 w-full bg-transparent text-white outline-none placeholder:text-[#988d78]"
                />
              </label>

              {/* Hide single service selection if multiServices is present */}
              {!multiServices && (
                <div className="premium-card px-5 py-5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Preferred Service</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {serviceChoices.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedService(item)}
                        className={`rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                          selectedService === item
                            ? 'bg-accent text-black shadow-[0_12px_30px_rgba(214,177,111,0.24)]'
                            : 'border border-glass-border bg-white/[0.03] text-[#eadfc9] hover:border-[rgba(214,177,111,0.3)] hover:bg-white/[0.05]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="premium-card px-5 py-5">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Preferred Time</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {timeChoices.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedTime(item)}
                      className={`rounded-[1.1rem] px-4 py-4 text-left text-sm font-semibold transition-all duration-300 ${
                        selectedTime === item
                          ? 'bg-[linear-gradient(135deg,rgba(214,177,111,0.95),rgba(232,206,151,0.92))] text-black shadow-[0_16px_35px_rgba(214,177,111,0.2)]'
                          : 'border border-glass-border bg-white/[0.03] text-[#eadfc9] hover:border-[rgba(214,177,111,0.3)] hover:bg-white/[0.05]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
                <label className="premium-card block px-5 py-4">
                  <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                    <Calendar className="h-4 w-4" />
                    Preferred Date
                  </div>
                  <input
                    type="date"
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(event) => setPreferredDate(event.target.value)}
                    className="mt-3 w-full rounded-[1rem] border border-glass-border bg-white/[0.03] px-4 py-3 text-white outline-none"
                  />
                </label>

                <div className="premium-card px-5 py-5">
                  <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                    <Clock3 className="h-4 w-4" />
                    Preferred Slot
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {slotChoices.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedSlot(item)}
                        className={`rounded-[1rem] px-3 py-3 text-sm font-semibold transition-all duration-300 ${
                          selectedSlot === item
                            ? 'bg-accent text-black shadow-[0_12px_30px_rgba(214,177,111,0.24)]'
                            : 'border border-glass-border bg-white/[0.03] text-[#eadfc9] hover:border-[rgba(214,177,111,0.3)] hover:bg-white/[0.05]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="premium-card block px-5 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Your Plan</div>
                <textarea
                  value={form.plan}
                  onChange={updateField('plan')}
                  placeholder="Tell the studio about your event, preferred date, hair or skin concerns, or the package you want."
                  className="mt-3 min-h-[180px] w-full resize-none bg-transparent text-white outline-none placeholder:text-[#988d78]"
                />
              </label>

              <label className="premium-card block px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                    Location For Home Service
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-white/5 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white"
                  >
                    {geoState.status === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4 text-accent" />}
                    Use Current Location
                  </button>
                </div>
                {geoState.coords ? (
                  <div className="mt-4 rounded-[1.2rem] border border-[rgba(214,177,111,0.16)] bg-[rgba(214,177,111,0.08)] px-4 py-4">
                    <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-accent">
                      <MapPin className="h-4 w-4" />
                      Detected Current Location
                    </div>
                    <div className="mt-2 text-sm leading-7 text-[#eadfcb]">{detectedLocationText}</div>
                  </div>
                ) : null}
                <textarea
                  value={form.location}
                  onChange={updateField('location')}
                  placeholder="Area, city, landmark, apartment name, or full address for home-service availability"
                  className="mt-3 min-h-[120px] w-full resize-none bg-transparent text-white outline-none placeholder:text-[#988d78]"
                />
                <p
                  className={`mt-3 text-sm leading-7 ${
                    geoState.status === 'error' ? 'text-[#f0b6a8]' : 'text-[#cfc2ad]'
                  }`}
                >
                  {geoState.message}
                </p>
              </label>

              <div className="premium-card p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">Review Before Sending</div>
                    <h3 className="mt-2 font-heading text-3xl text-white">Cleaner booking confirmation flow.</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen((current) => !current)}
                    className="interactive-panel rounded-full border border-glass-border bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white md:text-sm"
                  >
                    {isReviewOpen ? 'Hide Review' : 'Review Request'}
                  </button>
                </div>

                {isReviewOpen ? (
                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="grid gap-3 md:grid-cols-2">
                      {bookingSummary.map(([label, value]) => (
                        <div key={label} className="rounded-[1.15rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4">
                          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-accent">{label}</div>
                          <div className="mt-2 text-sm leading-7 text-[#eadfcb]">{value}</div>
                        </div>
                      ))}
                      {detectedLocationText ? (
                        <div className="rounded-[1.15rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4 md:col-span-2">
                          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-accent">Live Location</div>
                          <div className="mt-2 text-sm leading-7 text-[#eadfcb]">Shared as a Google Maps link for easier route confirmation.</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="inline-flex items-center gap-2 text-sm leading-7 text-[#cfc2ad]">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        Request is ready to send.
                      </div>
                      <button
                        type="button"
                        onClick={handleWhatsAppBooking}
                        className="interactive-panel rounded-full bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[0.24em] text-black"
                      >
                        Send Booking On WhatsApp
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm leading-7 text-[#cfc2ad]">
                    Selected: <span className="text-white">{selectedService}</span>, <span className="text-white">{selectedTime}</span>, <span className="text-white">{selectedSlot}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="section-shell overflow-hidden p-6 md:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,177,111,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
              <div className="relative">
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Location Tools</div>
                <h2 className="mt-4 font-heading text-4xl text-white">Share a better pickup or service address.</h2>
                <div className="mt-5 rounded-[1.45rem] border border-[rgba(214,177,111,0.16)] bg-black/20 p-5">
                  <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
                    <MapPin className="h-4 w-4" />
                    Maps Support
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#eadfcb]">
                    Use current location to add your live coordinates, then open Google Maps to confirm the pin before
                    sending the request.
                  </p>
                </div>
                <div className="mt-5 grid gap-3">
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="interactive-panel rounded-[1.25rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4 text-sm font-semibold text-[#ddd1bb]"
                  >
                    Open Entered Location In Google Maps
                  </a>
                  <a
                    href="tel:+910000000000"
                    className="interactive-panel rounded-[1.25rem] border border-[rgba(214,177,111,0.12)] bg-white/[0.03] px-4 py-4 text-sm font-semibold text-[#ddd1bb]"
                  >
                    Call Studio To Confirm Location Availability
                  </a>
                </div>
              </div>
            </div>

            <div className="premium-card p-6 md:p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Booking Notes</div>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[#ddd1bb]">
                <p>Home service depends on selected service type, travel area, and timing availability.</p>
                <p>Adding landmark details helps the studio confirm the booking faster.</p>
                <p>For bridal or multi-service requests, contact first if you need schedule guidance before sending.</p>
              </div>
            </div>

            <div className="section-shell overflow-hidden p-6 md:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,177,111,0.18),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
              <div className="relative">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                  <CalendarClock className="h-4 w-4" />
                  Visit Window
                </div>
                <h2 className="mt-4 font-heading text-4xl text-white">Sunday to Saturday, 9:00 AM to 9:00 PM.</h2>
                <p className="mt-4 text-sm leading-7 text-[#d6c9b4]">
                  Choose your preferred time above, and the studio can confirm the closest available slot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Motion.main>
  );
};

export default BookVisit;
