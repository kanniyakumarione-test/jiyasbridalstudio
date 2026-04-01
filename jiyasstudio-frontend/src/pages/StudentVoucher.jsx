import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400;700&family=Montserrat:wght@100;400;700&display=swap';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const getOrdinal = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatVoucherDate = (date) => {
  const year = date.getFullYear();
  const month = date.toLocaleString('en-IN', { month: 'long' });
  const day = date.getDate();
  return `${day}${getOrdinal(day)} ${month} ${year}`.toUpperCase();
};

const initialValues = {
  studentName: '',
  idCardNumber: '',
  contact: '',
};

const VOUCHER_WIDTH = 1200;
const VOUCHER_HEIGHT = 550;

const VoucherSvg = ({ studentName, studentId, studentCode, validity, idPrefix, logoSrc }) => {
  const baseId = `${idPrefix}-luxury`;
  const displayName = studentName || 'Privileged Guest';
  const displayId = studentId || '0000 0000 0000';
  const displayCode = studentCode || 'JS-9999';

  return (
    <svg
      viewBox={`0 0 ${VOUCHER_WIDTH} ${VOUCHER_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Luxury student gift voucher"
      style={{ display: 'block', width: '100%', height: 'auto', background: '#080808' }}
    >
      <defs>
        <linearGradient id={`${baseId}-foil`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A6E2F" />
          <stop offset="20%" stopColor="#CBB279" />
          <stop offset="40%" stopColor="#E1CD9A" />
          <stop offset="50%" stopColor="#F5EFD8" />
          <stop offset="60%" stopColor="#E1CD9A" />
          <stop offset="80%" stopColor="#CBB279" />
          <stop offset="100%" stopColor="#8A6E2F" />
        </linearGradient>

        <radialGradient id={`${baseId}-bgGrad`} cx="50%" cy="42%" r="78%">
          <stop offset="0%" stopColor="#191919" />
          <stop offset="55%" stopColor="#0b0b0b" />
          <stop offset="100%" stopColor="#040404" />
        </radialGradient>

        <radialGradient id={`${baseId}-glow`} cx="50%" cy="38%" r="48%">
          <stop offset="0%" stopColor="rgba(203,178,121,0.18)" />
          <stop offset="100%" stopColor="rgba(203,178,121,0)" />
        </radialGradient>

        <filter id={`${baseId}-textShadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect width={VOUCHER_WIDTH} height={VOUCHER_HEIGHT} fill={`url(#${baseId}-bgGrad)`} />
      <rect x="26" y="26" width="1148" height="498" rx="24" fill="none" stroke={`url(#${baseId}-foil)`} strokeWidth="1.1" opacity="0.9" />
      <rect x="44" y="44" width="1112" height="462" rx="18" fill="none" stroke="rgba(245,239,216,0.18)" strokeWidth="0.9" />
      <rect x="58" y="58" width="1084" height="434" rx="14" fill="url(#${baseId}-glow)" opacity="0.7" />

      <path d="M 52 152 L 52 52 L 152 52" fill="none" stroke={`url(#${baseId}-foil)`} strokeWidth="1" opacity="0.6" />
      <path d="M 1048 52 L 1148 52 L 1148 152" fill="none" stroke={`url(#${baseId}-foil)`} strokeWidth="1" opacity="0.6" />
      <path d="M 52 398 L 52 498 L 152 498" fill="none" stroke={`url(#${baseId}-foil)`} strokeWidth="1" opacity="0.6" />
      <path d="M 1048 498 L 1148 498 L 1148 398" fill="none" stroke={`url(#${baseId}-foil)`} strokeWidth="1" opacity="0.6" />

      <image href={logoSrc} x="108" y="88" width="94" height="94" preserveAspectRatio="xMidYMid meet" opacity="0.98" />

      <text
        x="600"
        y="86"
        fill={`url(#${baseId}-foil)`}
        fontFamily="Cinzel, serif"
        fontSize="14"
        textAnchor="middle"
        letterSpacing="10"
        fontWeight="700"
      >
        EXCLUSIVE STUDIO PASS
      </text>

      <text
        x="600"
        y="156"
        fill="#F7F2E8"
        fontFamily="'Bodoni Moda', serif"
        fontSize="92"
        fontWeight="800"
        fontStyle="italic"
        textAnchor="middle"
        filter={`url(#${baseId}-textShadow)`}
      >
        Jiya&apos;s Studio
      </text>

      <text
        x="600"
        y="190"
        fill="rgba(255,255,255,0.58)"
        fontFamily="Montserrat, sans-serif"
        fontSize="12"
        textAnchor="middle"
        letterSpacing="5"
      >
        BEAUTY . HAIR . LUXURY STUDENT EXPERIENCE
      </text>

      <g transform="translate(600, 274)">
        <text
          y="0"
          fill={`url(#${baseId}-foil)`}
          fontFamily="'Bodoni Moda', serif"
          fontSize="60"
          fontWeight="900"
          textAnchor="middle"
        >
          ₹500 OFF
        </text>
        <rect x="-176" y="18" width="352" height="1" fill={`url(#${baseId}-foil)`} opacity="0.38" />
        <text
          y="50"
          fill="rgba(255,255,255,0.78)"
          fontFamily="Montserrat, sans-serif"
          fontSize="12"
          fontWeight="400"
          textAnchor="middle"
          letterSpacing="3"
        >
          ON SERVICES VALUED AT ₹1000 OR MORE
        </text>
      </g>

      <line x1="168" y1="348" x2="1032" y2="348" stroke={`url(#${baseId}-foil)`} strokeWidth="0.8" opacity="0.28" />

      <g transform="translate(108, 366)">
        <text fill="rgba(255,255,255,0.44)" fontFamily="Montserrat, sans-serif" fontSize="10" letterSpacing="5">
          MEMBER NAME
        </text>
        <text y="48" fill="#FFFFFF" fontFamily="'Bodoni Moda', serif" fontSize="36" fontWeight="600">
          {displayName}
        </text>

        <g transform="translate(0, 76)">
          <text fill={`url(#${baseId}-foil)`} fontFamily="Montserrat, sans-serif" fontSize="9" letterSpacing="4" fontWeight="700">
            STUDENT IDENTIFICATION
          </text>
          <text y="24" fill="rgba(255,255,255,0.85)" fontFamily="Montserrat, sans-serif" fontSize="16" fontWeight="300">
            {displayId}
          </text>
        </g>
      </g>

      <g transform="translate(924, 366)">
        <text fill="rgba(255,255,255,0.44)" fontFamily="Montserrat, sans-serif" fontSize="10" letterSpacing="5" textAnchor="end">
          SECURITY CODE
        </text>
        <text
          y="44"
          fill={`url(#${baseId}-foil)`}
          fontFamily="'Bodoni Moda', serif"
          fontSize="31"
          fontWeight="700"
          textAnchor="end"
        >
          {displayCode}
        </text>

        <g transform="translate(0, 68)">
          <text fill="rgba(255,255,255,0.44)" fontFamily="Montserrat, sans-serif" fontSize="9" letterSpacing="4" textAnchor="end">
            EXPIRES ON
          </text>
          <text y="24" fill="#FFFFFF" fontFamily="Montserrat, sans-serif" fontSize="18" fontWeight="400" textAnchor="end">
            {validity}
          </text>
        </g>
      </g>

      <g transform="translate(1038, 88)">
        <circle cx="0" cy="54" r="42" fill="none" stroke={`url(#${baseId}-foil)`} strokeWidth="1.2" opacity="0.9" />
        <circle cx="0" cy="54" r="32" fill="none" stroke="rgba(245,239,216,0.35)" strokeWidth="0.9" />
        <text x="0" y="52" fill={`url(#${baseId}-foil)`} fontFamily="Cinzel, serif" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="3">
          VALID
        </text>
        <text x="0" y="69" fill="#FFFFFF" fontFamily="Montserrat, sans-serif" fontSize="10" textAnchor="middle" letterSpacing="2">
          1 DAY
        </text>
      </g>

      <text
        x="600"
        y="498"
        fill="rgba(255,255,255,0.32)"
        fontFamily="Montserrat, sans-serif"
        fontSize="9"
        textAnchor="middle"
        letterSpacing="3"
      >
        VALID AT NAGERCOIL STUDIO ONLY | NON-TRANSFERABLE | REDEEMABLE ON LUXURY SERVICES
      </text>
    </svg>
  );
};

export default function StudentVoucher() {
  const [formValues, setFormValues] = useState(initialValues);
  const [showVoucher, setShowVoucher] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState('/logo.png');
  const [isLightTheme, setIsLightTheme] = useState(false);
  const exportSvgRef = useRef(null);
  const visibleId = useId().replace(/:/g, '');
  const exportId = `${visibleId}-export`;

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const existing = document.querySelector(`link[href="${FONT_HREF}"]`);
    if (existing) return undefined;

    const fontLink = document.createElement('link');
    fontLink.href = FONT_HREF;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    return () => {
      if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadLogo = async () => {
      try {
        const response = await fetch('/logo.png');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted && typeof reader.result === 'string') setLogoDataUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Logo preload failed', error);
      }
    };

    loadLogo();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const getThemeState = () =>
      document.documentElement.classList.contains('theme-light') ||
      document.body.classList.contains('theme-light');

    const updateThemeState = () => setIsLightTheme(getThemeState());
    updateThemeState();

    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const studentCode = formValues.idCardNumber.trim()
    ? `JS-${formValues.idCardNumber.trim().slice(-4).padStart(4, '0')}`
    : 'JS-9999';
  const validity = formatVoucherDate(tomorrow);
  const pageStyle = isLightTheme
    ? {
        fontFamily: "'Montserrat', sans-serif",
        background:
          'radial-gradient(circle at 10% 0%, rgba(214,177,111,0.18), transparent 28%), radial-gradient(circle at 100% 10%, rgba(214,177,111,0.14), transparent 24%), linear-gradient(180deg, #fdfaf5 0%, #f6efe4 55%, #efe5d7 100%)',
        color: '#21180f',
      }
    : {
        fontFamily: "'Montserrat', sans-serif",
        background: 'radial-gradient(circle at top, rgba(55,55,55,0.24), rgba(5,5,5,0.96) 28%), #050505',
        color: '#ffffff',
      };
  const formCardStyle = isLightTheme
    ? {
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,241,231,0.94))',
        color: '#21180f',
        borderColor: 'rgba(181, 142, 76, 0.18)',
        boxShadow: '0 28px 80px rgba(96, 71, 32, 0.14)',
      }
    : {
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
      };
  const previewStyle = isLightTheme ? { color: '#21180f' } : { color: '#ffffff' };
  const previewTitleStyle = isLightTheme
    ? { fontFamily: "'Bodoni Moda', serif", color: '#22170f' }
    : { fontFamily: "'Bodoni Moda', serif", color: '#f8f2e7' };
  const refineButtonStyle = isLightTheme
    ? {
        backgroundColor: 'rgba(255,255,255,0.78)',
        color: '#3e2f1f',
        borderColor: 'rgba(181, 142, 76, 0.22)',
      }
    : {
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: '#f4ede0',
      };
  const downloadButtonStyle = isLightTheme
    ? {
        backgroundColor: '#1a130d',
        color: '#f7f1e4',
      }
    : {
        backgroundColor: '#f7f4ed',
        color: '#111111',
      };
  const voucherFrameStyle = isLightTheme
    ? {
        borderColor: 'rgba(181, 142, 76, 0.24)',
        boxShadow: '0 35px 90px rgba(96, 71, 32, 0.16)',
        background: 'rgba(255,255,255,0.5)',
      }
    : undefined;

  const handleChange = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => {
    setFormValues(initialValues);
    setShowVoucher(false);
  };

  const handleDownload = async () => {
    if (!exportSvgRef.current) return;

    try {
      setIsDownloading(true);

      // Save to Google Sheets ONLY when downloading
      const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;
      if (scriptUrl) {
        try {
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create',
              studentName: formValues.studentName,
              idCardNumber: formValues.idCardNumber,
              contact: formValues.contact
            }),
          });
        } catch (error) {
          console.error('Error saving to Google Sheets:', error);
        }
      }

      const svgElement = exportSvgRef.current.querySelector('svg');
      if (!svgElement) throw new Error('Voucher SVG not found');

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const image = new Image();

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = svgUrl;
      });

      const scale = 3;
      const canvas = document.createElement('canvas');
      canvas.width = VOUCHER_WIDTH * scale;
      canvas.height = VOUCHER_HEIGHT * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      ctx.scale(scale, scale);
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, VOUCHER_WIDTH, VOUCHER_HEIGHT);
      ctx.drawImage(image, 0, 0, VOUCHER_WIDTH, VOUCHER_HEIGHT);
      URL.revokeObjectURL(svgUrl);

      const link = document.createElement('a');
      link.download = `JIYA-SIGNATURE-${(formValues.studentName || 'GUEST').replace(/\s+/g, '-').toUpperCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Voucher download failed', error);
      window.alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#050505] px-3 pb-6 pt-24 text-white md:px-8 md:pb-10 md:pt-36"
      style={pageStyle}
    >
      <div className="mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {!showVoucher ? (
            <Motion.section
              key="voucher-form"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-lg rounded-[3rem] border border-white/5 bg-[#0f0f0f] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] md:p-12"
              style={formCardStyle}
            >
              <div className="mb-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#CBB279]/40 bg-[radial-gradient(circle_at_center,rgba(203,178,121,0.16),rgba(255,255,255,0.02))]">
                  <img src="/logo.png" alt="Jiya's Studio logo" className="h-12 w-12 object-contain" />
                </div>
                <h2 className="mb-4 text-sm uppercase tracking-[0.5em] text-[#CBB279]">Luxury Identity</h2>
                <h1 className={`text-4xl italic ${isLightTheme ? 'text-[#23180f]' : 'text-white'}`} style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  Issue Signature Pass
                </h1>
              </div>

              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowVoucher(true);
                }}
              >
                <div>
                  <input
                    type="text"
                    value={formValues.studentName}
                    onChange={(e) => handleChange('studentName', e.target.value)}
                    className={`w-full border-b bg-transparent py-4 text-2xl italic outline-none transition-all placeholder:opacity-20 focus:border-[#CBB279] ${isLightTheme ? 'border-[#bfa57a]/35 text-[#24190f]' : 'border-white/10 text-white'}`}
                    style={{ fontFamily: "'Bodoni Moda', serif" }}
                    placeholder="Full Legal Name"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formValues.idCardNumber}
                    onChange={(e) => handleChange('idCardNumber', e.target.value)}
                    className={`w-full border-b bg-transparent py-4 text-xl font-light outline-none transition-all placeholder:opacity-20 focus:border-[#CBB279] ${isLightTheme ? 'border-[#bfa57a]/35 text-[#24190f]' : 'border-white/10 text-white'}`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    placeholder="Student ID"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={formValues.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    className={`w-full border-b bg-transparent py-4 text-xl font-light outline-none transition-all placeholder:opacity-20 focus:border-[#CBB279] ${isLightTheme ? 'border-[#bfa57a]/35 text-[#24190f]' : 'border-white/10 text-white'}`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    placeholder="Contact Number (Admin Only)"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className={`rounded-[1.8rem] border px-5 py-4 ${isLightTheme ? 'border-[#bfa57a]/20 bg-white/70' : 'border-white/8 bg-white/[0.03]'}`}>
                    <div className="text-[0.65rem] uppercase tracking-[0.35em] text-[#CBB279]">Security Code</div>
                    <div className={`mt-2 text-lg ${isLightTheme ? 'text-[#24190f]' : 'text-white'}`} style={{ fontFamily: "'Bodoni Moda', serif" }}>
                      {studentCode}
                    </div>
                  </div>

                  <div className={`rounded-[1.8rem] border px-5 py-4 ${isLightTheme ? 'border-[#bfa57a]/20 bg-white/70' : 'border-white/8 bg-white/[0.03]'}`}>
                    <div className="text-[0.65rem] uppercase tracking-[0.35em] text-[#CBB279]">Expires On</div>
                    <div className={`mt-2 text-sm ${isLightTheme ? 'text-[#24190f]' : 'text-white'}`}>{validity}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`rounded-full border px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:border-[#CBB279]/40 ${isLightTheme ? 'border-[#bfa57a]/25 text-[#5a4733] hover:text-[#24190f]' : 'border-white/10 text-white/70 hover:text-white'}`}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-gradient-to-r from-[#8A6E2F] to-[#CBB279] px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:brightness-110 active:scale-[0.99]"
                  >
                    Generate Signature Pass
                  </button>
                </div>
              </form>
            </Motion.section>
          ) : (
            <Motion.section
              key="voucher-preview"
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5 md:space-y-8"
              style={previewStyle}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[0.72rem] uppercase tracking-[0.4em] text-[#CBB279]">Signature Preview</div>
                  <h2 className="mt-1 text-[2rem] italic leading-none md:mt-2 md:text-5xl" style={previewTitleStyle}>
                    Luxury Voucher Ready
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVoucher(false)}
                    className="rounded-full border border-white/10 px-5 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/75 transition-all hover:border-[#CBB279]/40 hover:text-white md:px-6 md:py-3 md:text-[0.68rem] md:tracking-[0.28em]"
                    style={refineButtonStyle}
                  >
                    Refine Details
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="rounded-full bg-white px-5 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-black transition-all hover:bg-[#CBB279] disabled:opacity-50 md:px-6 md:py-3 md:text-[0.68rem] md:tracking-[0.28em]"
                    style={downloadButtonStyle}
                  >
                    {isDownloading ? 'Processing...' : 'Download Pass'}
                  </button>
                </div>
              </div>

              <div className="-mx-1 overflow-hidden rounded-[1.6rem] border border-white/5 shadow-[0_30px_70px_-18px_rgba(0,0,0,0.65)] md:mx-0 md:rounded-[2rem] md:shadow-[0_60px_120px_-20px_rgba(0,0,0,1)]" style={voucherFrameStyle}>
                <VoucherSvg
                  studentName={formValues.studentName}
                  studentId={formValues.idCardNumber}
                  studentCode={studentCode}
                  validity={validity}
                  idPrefix={visibleId}
                  logoSrc={logoDataUrl}
                />
              </div>
            </Motion.section>
          )}
        </AnimatePresence>
      </div>

      <div ref={exportSvgRef} style={{ position: 'fixed', top: -9999, left: 0 }}>
        <VoucherSvg
          studentName={formValues.studentName}
          studentId={formValues.idCardNumber}
          studentCode={studentCode}
          validity={validity}
          idPrefix={exportId}
          logoSrc={logoDataUrl}
        />
      </div>
    </div>
  );
}
