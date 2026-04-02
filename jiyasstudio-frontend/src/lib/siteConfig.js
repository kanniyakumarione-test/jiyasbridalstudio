const rawPhone = '+917558179673';
const normalizedPhone = rawPhone.replace(/[^\d+]/g, '');

export const siteConfig = {
  studioName: "Jiya's Studio",
  shortName: "Jiya's Studio",
  siteUrl: 'https://www.jiyasbridalstudio.com',
  locationLabel: 'Nagercoil',
  mapQuery: "Jiya's Studio Nagercoil",
  phoneDisplay: '+91 75581 79673',
  phoneHref: `tel:${normalizedPhone}`,
  whatsappNumber: '917558179673',
  email: 'jiyasbeauty@gmail.com',
  instagramHandle: '@jiyasbeautyschool',
  instagramUrl: 'https://www.instagram.com/jiyasbeautyschool/?utm_source=ig_web_button_share_sheet',
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
