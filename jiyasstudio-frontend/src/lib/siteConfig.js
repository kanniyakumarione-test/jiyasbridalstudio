const primaryPhone = '9486486955';
const secondaryPhone = '7558179673';
const landlinePhone = '04651356756';
const rawPhone = `+91${primaryPhone}`;
const normalizedPhone = rawPhone.replace(/[^\d+]/g, '');

export const siteConfig = {
  studioName: "Jiya's Studio",
  shortName: "Jiya's Studio",
  siteUrl: 'https://www.jiyasbridalstudio.com',
  locationLabel: 'Nagercoil',
  mapQuery: "Jiya's Studio Nagercoil",
  phoneDisplay: '+91 94864 86955',
  phoneHref: `tel:${normalizedPhone}`,
  phoneNumbers: [
    {
      label: 'Primary',
      display: '+91 94864 86955',
      href: `tel:+91${primaryPhone}`,
    },
    {
      label: 'Secondary',
      display: '+91 75581 79673',
      href: `tel:+91${secondaryPhone}`,
    },
    {
      label: 'Landline',
      display: '04651 356756',
      href: `tel:${landlinePhone}`,
    },
  ],
  whatsappNumber: `91${primaryPhone}`,
  email: 'jiyasbeauty@gmail.com',
  instagramHandle: '@jiyas_unisex_hair_studio',
  instagramUrl: 'https://www.instagram.com/jiyas_unisex_hair_studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  developersUrl: 'https://services.kanniyakumarione.com/',
  serviceHours: 'Sunday to Saturday, 9:00 AM to 9:00 PM',
  businessDescription:
    "Jiya's Studio is a premium beauty, hair, skin, bridal, and grooming studio in Nagercoil.",
};

export const buildWhatsAppUrl = (message) =>
  `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const buildMapSearchUrl = (query = siteConfig.mapQuery) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const buildMapEmbedUrl = (query = siteConfig.mapQuery) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
