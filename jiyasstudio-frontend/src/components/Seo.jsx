import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../lib/siteConfig';

const routeMeta = {
  '/': {
    title: `${siteConfig.shortName} | Premium Hair, Skin & Bridal Studio`,
    description:
      'Explore premium hair, skin, bridal, and grooming services with a calm studio experience in Nagercoil.',
  },
  '/about': {
    title: `About | ${siteConfig.shortName}`,
    description:
      "Learn about Jiya's Studio, its service philosophy, and the premium beauty experience behind the brand.",
  },
  '/services': {
    title: `Services | ${siteConfig.shortName}`,
    description:
      'Browse the full Jiya\'s Studio service menu covering hair, skin, bridal, nails, wigs, and grooming.',
  },
  '/gallery': {
    title: `Gallery | ${siteConfig.shortName}`,
    description:
      "View Jiya's Studio photos and videos across bridal, hair, skin, makeover, and studio beauty work.",
  },
  '/contact': {
    title: `Contact | ${siteConfig.shortName}`,
    description:
      'Contact Jiya\'s Studio for bookings, WhatsApp support, map directions, and beauty consultation help.',
  },
  '/book-visit': {
    title: `Book Visit | ${siteConfig.shortName}`,
    description:
      'Book a salon visit, choose services and time slots, and share your address or current location with Jiya\'s Studio.',
  },
  '/wigs': {
    title: `Wigs | ${siteConfig.shortName}`,
    description:
      'Explore wig consultations, styling, maintenance, and fitting support at Jiya\'s Studio.',
  },
  '/beauty-school': {
    title: `Beauty School | ${siteConfig.shortName}`,
    description:
      'Explore beauty school courses from basic to professional level including hair, makeup, nail artistry, hair extensions, saree styling, certification, and placement support.',
  },
  '/student-voucher': {
    title: `Student Voucher | ${siteConfig.shortName}`,
    description:
      'Generate and manage Jiya\'s Studio student vouchers for exclusive offers and studio benefits.',
  },
  '/admin': {
    title: `Admin | ${siteConfig.shortName}`,
    description: 'Admin dashboard for Jiya\'s Studio records, service menu, and promotions.',
  },
};

function ensureMeta(name, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  return element;
}

function ensureLink(rel) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  return element;
}

export default function Seo() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const matchedKey = Object.keys(routeMeta).find((key) =>
      key !== '/' && path.startsWith(key),
    ) || (routeMeta[path] ? path : '/');
    const meta = routeMeta[matchedKey] ?? routeMeta['/'];
    const canonicalUrl = `${siteConfig.siteUrl.replace(/\/$/, '')}${path}`;

    document.title = meta.title;
    ensureMeta('description').setAttribute('content', meta.description);
    ensureMeta('og:title', 'property').setAttribute('content', meta.title);
    ensureMeta('og:description', 'property').setAttribute('content', meta.description);
    ensureMeta('og:type', 'property').setAttribute('content', 'website');
    ensureMeta('og:url', 'property').setAttribute('content', canonicalUrl);
    ensureMeta('twitter:card').setAttribute('content', 'summary_large_image');
    ensureMeta('twitter:title').setAttribute('content', meta.title);
    ensureMeta('twitter:description').setAttribute('content', meta.description);
    ensureLink('canonical').setAttribute('href', canonicalUrl);
  }, [location.pathname]);

  return null;
}
