export const slugifyServiceTitle = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const consultationPrice = 'Consultation';

export const wigServices = {
  title: 'Wig Studio',
  note: 'Private support for wig services, consultations, extensions, and wig sales with personalised guidance on fit, finish, comfort, and maintenance.',
  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  categories: [
    {
      title: 'Services',
      note: 'Core wig styling, revamp, reset, and maintenance support for a polished natural finish.',
      items: [
        { name: 'Wig Fitting and Finish Styling', price: consultationPrice },
        { name: 'Wig Wash and Reset', price: consultationPrice },
        { name: 'Wig Curling / Straightening', price: consultationPrice },
        { name: 'Wig Cut Customisation', price: consultationPrice },
        { name: 'Wig Colour Refresh', price: consultationPrice },
        { name: 'Wig Repair and Revamp', price: consultationPrice },
      ],
    },
    {
      title: 'Consultation',
      note: 'One-to-one guidance for choosing the right wig, topper, look direction, and upkeep plan.',
      items: [
        { name: 'Wig Consultation', price: consultationPrice },
        { name: 'Hair Topper Guidance', price: consultationPrice },
      ],
    },
    {
      title: 'Extensions',
      note: 'Extension guidance, blending, styling, and maintenance support based on hair type and finish goals.',
      items: [
        { name: 'Hair Extension Consultation', price: consultationPrice },
        { name: 'Extension Colour Match and Blend', price: consultationPrice },
        { name: 'Extension Fitting Guidance', price: consultationPrice },
        { name: 'Clip-In Extension Styling', price: consultationPrice },
        { name: 'Extension Wash and Reset', price: consultationPrice },
        { name: 'Extension Curling / Straightening', price: consultationPrice },
        { name: 'Extension Maintenance and Revamp', price: consultationPrice },
      ],
    },
    {
      title: 'Wig Sales',
      note: 'Wigs are also available for sale. Pricing depends on hair type, length, density, and customisation, so contact the studio on WhatsApp or phone.',
      items: [
        { name: 'Ready-to-Wear Wigs', price: 'Contact on WhatsApp or Phone' },
        { name: 'Customised Wigs', price: 'Contact on WhatsApp or Phone' },
        { name: 'Premium Human Hair Wigs', price: 'Contact on WhatsApp or Phone' },
      ],
    },
  ],
};

const womenEssentials = [
  { title: 'Bleaching', note: 'Classic and full-coverage bleach options from the service sheet.', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Fruit Bleach', price: '300' }, { name: 'Oxy Bleach', price: '350' }, { name: 'Herbal Bleach', price: '350' }, { name: 'Lacto Bleach', price: '400' }, { name: 'Pearl Bleach', price: '350' }, { name: 'Golden Bleach', price: '400' }, { name: 'Intaglow Bleach', price: '400' }, { name: 'Yellow Bleach', price: '300' }, { name: 'Diamond Bleach', price: '350' }, { name: 'Hand Bleach', price: '500' }, { name: 'Leg Bleach', price: '650' }, { name: 'Back Neck Bleach', price: '350' }, { name: 'Detaning', price: '450' }, { name: 'Full Body Bleach', price: '4000' }] },
  { title: 'Skin Facial', note: 'Skin-focused facial menu for routine glow and treatment prep.', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Clean Up', price: '550' }, { name: 'Ordinary Facial', price: '750' }, { name: 'Fruit Facial', price: '850' }, { name: 'Papaya Facial', price: '1200' }, { name: 'Pearl Facial', price: '1400' }, { name: 'Wine Facial', price: '2000' }, { name: 'Diamond Facial', price: '2500' }, { name: 'Anti Ageing Facial', price: '2500' }, { name: 'Golden Facial', price: '3000' }, { name: 'Skin Whitening Facial', price: '3500' }, { name: 'Advance Gold Facial', price: '3500' }, { name: 'Inta Glow Facial', price: '2500' }, { name: 'Gel Facial', price: '2500' }, { name: 'Natural Fruit Facial', price: '3500' }, { name: 'O3+', price: '4000' }] },
  { title: 'Threading', note: 'Quick grooming services for brows, face, and precision clean-up.', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Eyebrow Threading', price: '60' }, { name: 'Upper Lip', price: '30+' }, { name: 'Chin', price: '50+' }, { name: 'Hair Razer', price: '70' }, { name: 'Face Threading', price: '170' }] },
  { title: 'Skin Polishing', note: 'Body polishing and brightening support for hands, legs, and neck.', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Hand Polishing', price: '650' }, { name: 'Leg Polishing', price: '800' }, { name: 'Back Neck Polishing', price: '350' }, { name: 'Front Nek Polishing Full', price: '450' }, { name: 'Full Body Polishing', price: '3500' }] },
  { title: 'Hands and Foot Care', note: 'Manicure, pedicure, spa, shaping, and nail maintenance services.', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Normal Manicure', price: '500' }, { name: 'Normal Pedicure', price: '750' }, { name: 'Special Manicure', price: '650' }, { name: 'Waterless Pedicure', price: '1100' }, { name: 'Paraffin Mani/Pedi', price: '1200' }, { name: 'Special Pedicure', price: '850' }, { name: 'Spa Manicure', price: '1000' }, { name: 'French Pedicure', price: '950' }, { name: 'Flower Pedicure', price: '900' }, { name: 'Spa Pedicure', price: '1500' }, { name: 'Nail Shaping & Polishing', price: '250' }, { name: 'Nail Art (Per Finger)', price: '200' }, { name: 'Nail Cut & File', price: '200' }, { name: 'Nail Polishing', price: '150' }] },
  { title: 'Treatment Facial', note: 'Advanced corrective and brightening facial treatments.', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Skin Brightening Treatment Facial', price: '2800' }, { name: 'Multivitamin Treatment Per Sitting', price: '2000' }, { name: 'Revitalizing Treatment', price: '2500' }, { name: 'Hydra Facial', price: '5000' }, { name: 'Tan Removing Facial', price: '2300' }, { name: 'Acne Treatment Per Sitting', price: '1800' }, { name: 'Pimple Treatment Per Sitting', price: '1800' }, { name: 'Under Eye Treatment Per Sitting', price: '850' }, { name: 'Innovative Facial', price: '3500' }, { name: 'Aroma Facial', price: '3500' }, { name: 'Glowing Facial', price: '3200' }, { name: 'Tea Tree Facial', price: '1800' }, { name: 'Led Facial', price: '3500' }, { name: 'Classic Facial', price: '2500' }, { name: 'Firming & Sculpting Facial', price: '4500' }, { name: 'Lymphatic Facial', price: '3500' }, { name: 'Galvanic Facial', price: '3000' }, { name: 'Lightening Facial', price: '4500' }, { name: 'Microdermabrasion Facial', price: '5000' }, { name: 'Firming & Contouring Facial', price: '5000' }, { name: 'Hydrating Facial', price: '3500' }, { name: 'High Frequency Facial', price: '3500' }, { name: 'Dry Skin Facial', price: '2800' }, { name: 'Glow Oil Facial (Argan, Moroccan)', price: '4500' }] },
  { title: 'Waxing', note: 'Sheet pricing for waxing and body hair removal services.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Hand Waxing', price: '550' }, { name: 'Leg Waxing', price: '650' }, { name: 'Full Leg Waxing', price: '1300' }, { name: 'Under Arm Waxing', price: '170' }, { name: 'Full Face Waxing', price: '250' }, { name: 'Bean Waxing', price: '650+' }, { name: 'Rica Wax', price: '750+' }, { name: 'Hair Cream Removal', price: '750' }, { name: 'Body Waxing', price: '5000' }] },
  { title: 'Detaning and Mehndi', note: 'De-tan removal and bridal mehndi design services.', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Face Detaining', price: '450' }, { name: 'Neck Detaining', price: '450' }, { name: 'Hand De Tan Removing', price: '850' }, { name: 'Leg De Tan Removing', price: '950' }, { name: 'Full Body Tan Removing', price: '4500' }, { name: 'Half Hand Mehndi', price: '800' }, { name: 'Full Hand Mehndi', price: '1500' }, { name: 'Bridal Mehndi', price: '2500+' }, { name: 'Neck Mehndi Designs', price: '3000+' }, { name: 'Leg Mehndi Designs', price: '800' }, { name: 'Full Leg Mehndi', price: '1800' }, { name: 'Arabic Design', price: '2000+' }, { name: 'Creative Designs', price: '3500+' }] },
  { title: 'Make Up', note: 'Occasion beauty from saree drape to bridal and celebrity makeup.', image: 'https://images.unsplash.com/photo-1523263685509-57c1d050d19b?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Saree Drape', price: '1000' }, { name: 'Hair Do', price: '1000' }, { name: 'Pro Hair Do', price: '1500+' }, { name: 'Normal Makeup', price: '7000' }, { name: 'Bridal Makeup', price: '12000' }, { name: 'Mac / Huda / Kryolan', price: '10000' }, { name: 'Party Makeup', price: '8000' }, { name: 'Guest Makeup', price: '5000' }, { name: 'Celebrity Makeup', price: '18000' }, { name: 'Air Brush Makeup', price: '20000' }, { name: 'HD Makeup', price: '15000' }, { name: 'Sweat Proof', price: '16000' }, { name: 'Water Proof', price: '17000' }] },
  { title: 'Nail Art', note: 'Nail extensions, polish, shaping, and per-finger art.', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Nail Trim & Shaping', price: '250' }, { name: 'Nail Gel Polishing', price: '100+' }, { name: 'Nail Extension', price: '200+' }, { name: 'Permanent Nail Extension', price: '200+' }, { name: 'Nail Art (Per Finger)', price: '100' }] },
];

const hairAndStudio = [
  { title: 'Hair Cuts', note: "Layering, bobs, bangs, and shape-driven women's cuts.", image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Straight Cut', price: '300' }, { name: 'U Cut', price: '350' }, { name: 'V Cut', price: '400' }, { name: 'Layer Cut With Setting', price: '950' }, { name: 'Step Cut With Setting', price: '850' }, { name: 'Angled Bob', price: '600' }, { name: 'Butterfly Layer', price: '850' }, { name: 'Voluminous Layers', price: '900' }, { name: 'Balancing Layer With Settings', price: '950' }, { name: 'Feather Cut With Setting', price: '1000' }, { name: 'Multi Layer Cut', price: '1000' }, { name: 'French Cut-Front', price: '150' }, { name: 'Layer With Bangs', price: '1200' }, { name: 'Graduation Layer With Setting', price: '1200' }, { name: 'Uniform Layer', price: '1000' }, { name: 'Layer Bob', price: '1200' }, { name: 'Crown Layer', price: '900' }] },
  { title: 'Babies Hair Cut', note: "Children's haircut menu from classic trims to pixie cuts.", image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Bob Cut', price: '300' }, { name: 'Dora Cut', price: '350' }, { name: 'Boy Cut', price: '200' }, { name: 'Diana Cut', price: '400' }, { name: 'Mushroom Cut', price: '400' }, { name: 'Pixie Cut', price: '450' }, { name: 'Baby Shalini Cut', price: '300' }] },
  { title: 'Hair Care and Treatment', note: 'Smoothing, rebonding, spa, keratin, and scalp recovery services.', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Straightening Start', price: '7000+' }, { name: 'Smoothening', price: '7000+' }, { name: 'Rebonding', price: '5000+' }, { name: 'Perming', price: '5000+' }, { name: 'Keratin', price: '8000+' }, { name: 'Biotin Treatment', price: '8000+' }, { name: 'Permanent Blow Dry', price: '5000+' }, { name: 'Dandruff Treatment', price: '2500+' }, { name: 'Keratin Spa', price: '2000' }, { name: 'Hair Spa Normal', price: '900' }, { name: 'Special Spa', price: '1200' }, { name: 'De Tox Spa', price: '1800' }, { name: 'Dandruff Treatment (Per Sitting)', price: '1200' }, { name: 'Anti Hair Fall Treatment (Per Sitting)', price: '1200+' }, { name: 'Split End Remover', price: '600' }] },
  { title: 'Hair Styling', note: 'Styling, wash menu, and finish services for everyday or events.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Ironing', price: '1000+' }, { name: 'Tongs', price: '1200+' }, { name: 'Perming', price: '1200+' }, { name: 'Curling', price: '1000+' }, { name: 'Hair Crimping', price: '650' }, { name: 'Hair Setting', price: '700' }, { name: 'Hair Blow Dry', price: '750' }, { name: 'Hair Wash Normal', price: '200' }, { name: 'Hair Dandruff Wash', price: '450' }, { name: 'Hair Detox Wash', price: '300' }, { name: 'Hair Scalp Cleansing Wash', price: '350' }, { name: 'Hair Color Wash', price: '400' }, { name: 'Hair Conditioning', price: '250' }, { name: 'Hair Treatment Wash', price: '350' }, { name: 'Hair Mask', price: '650' }, { name: 'Hair Hot Water Wash', price: '450' }, { name: 'Hair Frizzy Control Wash', price: '400' }, { name: 'Head Oil Massage', price: '650' }, { name: 'Repair Hair Wash', price: '400' }, { name: 'Curly Care Wash', price: '450' }, { name: 'Hair Pack', price: '700' }] },
  { title: 'Hair Styling and Special Services', note: 'Styling rates plus quick special studio add-ons.', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Hair Full Ironing', price: '750+' }, { name: 'Hair Blow Dry Setting', price: '750+' }, { name: 'Hair Curling', price: '1000+' }, { name: 'Hair Crimping', price: '650+' }, { name: 'Hair Volume Setting', price: '700+' }, { name: 'Wart Remover', price: '200+' }, { name: 'Ear Piercing', price: '500' }, { name: 'Nose Piercing', price: '300' }] },
  { title: 'Hair Coloring', note: 'Coloring, touch-up, bleaching support, and highlight services.', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Hair Dye', price: '650+' }, { name: 'Fashion / Global G Colouring', price: '1000' }, { name: 'Hair Pre-Lightening', price: '600+' }, { name: 'Hair Colouring', price: '1500+' }, { name: 'Hair Blond', price: '1000+' }, { name: 'Hair Highlights - Per Streak', price: '350' }, { name: 'Root Touch Up', price: '650+' }, { name: 'Grey Coverage', price: '650+' }, { name: 'GlobalL Colouring', price: '500' }, { name: 'Ear Piercing', price: '500' }] },
];

const mensServices = [
  { title: 'Normal Service', note: "Men's daily grooming, cut, shave, and wash combos.", image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80', items: [{ name: "Men's Hair Cut", price: '180' }, { name: "Student's Hair Cut", price: '130' }, { name: 'Shaving', price: '80' }, { name: 'Beard Setting', price: '100' }, { name: 'Hair Cut With Wash', price: '200' }] },
  { title: "Men's Hair Coloring", note: "Hair and beard coloring menu from the men's service sheet.", image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Hair Coloring', price: '450' }, { name: 'Global Coloring Hair', price: '600' }, { name: 'Loreal Color', price: '900' }, { name: 'Grey Coverage', price: '350' }, { name: 'Beard Coloring', price: '100' }, { name: 'Hair Highlighting (Per Streaks)', price: '150' }, { name: 'Front Coloring', price: '450' }, { name: 'Full Coloring', price: '1000' }, { name: 'Hair Spa', price: '700' }] },
  { title: "Men's Facial", note: "Men-specific facials from normal care to premium hydra options.", image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Normal Facial', price: '650' }, { name: 'Fruit Facial', price: '850' }, { name: 'Papaya Facial', price: '900' }, { name: 'Acne Facial', price: '1200' }, { name: 'Pimple Facial (Per Sitting)', price: '850' }, { name: 'Galvanic Facial', price: '2500' }, { name: 'Whitening Facial', price: '1500' }, { name: 'Whitening Facial Ultra', price: '2500' }, { name: 'Wine Facial', price: '1200' }, { name: 'Vitamin C Facial', price: '1800' }, { name: 'Aroma Facial', price: '2500' }, { name: 'Charcoal Facial', price: '1750' }, { name: 'Rice Oil Facial', price: '1850' }, { name: 'Hydra Facial', price: '3500' }, { name: 'Hydra Facial Ultra', price: '4500' }, { name: 'Golden Facial', price: '2500' }, { name: 'Diamond Facial', price: '2500' }, { name: 'Facial (Premium)', price: '3500' }] },
  { title: "Men's Bleaching and Skin Care", note: 'De-tan, bleach, face massage, and scrub support for men.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Face Pack (Normal)', price: '300' }, { name: 'Face Bleaching', price: '350' }, { name: 'Neck Bleaching', price: '400' }, { name: 'Hand Bleaching', price: '750' }, { name: 'Leg Bleaching', price: '900' }, { name: 'Face Detaining', price: '450' }, { name: 'Neck Detaining', price: '350' }, { name: 'Pimple Treatment', price: '1700' }, { name: 'Face Scrubbing', price: '180' }, { name: 'Face Massage', price: '250' }] },
  { title: "Men's Waxing and Pedi-Manicure", note: "Men's waxing and foot-care sheet pricing.", image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', items: [{ name: 'Hand', price: '450' }, { name: 'Leg', price: '600' }, { name: 'Full Body', price: '3500' }, { name: 'Undr Arm', price: '300' }, { name: 'Pedicure', price: '500' }, { name: 'Special Pedicure', price: '700' }, { name: 'Spa Pedicure', price: '800' }, { name: 'Crystal Pedicure', price: '900' }, { name: 'Chocolate', price: '1000' }, { name: 'Ice Cream Pedicure', price: '1500' }, { name: 'Luxury Pedicure', price: '2000' }] },
];

export const packages = [
  { title: 'Package 1', strike: '5060', offer: '4807', note: 'Glow and grooming combo with bleach, massage, manicure, and facial care.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80', items: ['Threading', 'Pearl Bleach', 'Oil Massage', 'Manicure', 'Whitening Facial'] },
  { title: 'Package 2', strike: '6860', offer: '6174', note: 'A fuller beauty bundle covering waxing, spa care, and a premium facial finish.', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80', items: ['Threading', 'De Tanning', 'Hand Waxing', 'Pedicure', 'Hair Spa', 'Golden Facial', 'Neck Bleach', 'Hand Bleach'] },
  { title: 'Package 3', strike: '7810', offer: '7029', note: 'Salon day package with detox spa, waxing, manicure, and brightening facial care.', image: 'https://images.unsplash.com/photo-1523263685509-57c1d050d19b?auto=format&fit=crop&w=1200&q=80', items: ['Threading', 'De Tan', 'Head Oil Massage', 'Manicure', 'Pedicure Special', 'Waxing Leg', 'Hair Spa Detox', 'Brightening Facial'] },
  { title: 'Package 5', strike: '9560', offer: '8604', note: 'Premium self-care bundle with hydra facial, detox spa, waxing, bleach, and layered cut.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80', items: ['Threading', 'Detaining', 'Hydra Facial', 'Detox Hair Spa', 'Spa Pedicure', 'Leg Waxing', 'Hand Waxing', 'Leg & Hand Bleaching', 'Hair Cut Layer'] },
  { title: "Men's Package 3", strike: '1300', offer: '1040', note: 'Quick men’s grooming bundle with cut, beard, facial, and tan-off care.', image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80', items: ['Hair Cutting', 'Beard Setting', 'Fruit Facial', 'Face Tan Off'] },
  { title: "Men's Package 4", strike: '1050', offer: '840', note: 'Compact men’s refresh package with grooming, de-tan, and massage support.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80', items: ['Hair Cutting', 'Beard Setting', 'Detaining', 'Head Massage'] },
  { title: "Men's Package 5", strike: '2700', offer: '2159', note: 'Combo care with haircut, beard, facial service, and pedicure.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80', items: ['Hair Cutting', 'Beard Setting', 'Dan Off Facial', 'Pedicure'] },
  { title: "Men's Package 6", strike: '530', offer: '499', note: 'Minimal men’s grooming package for haircut, beard shaping, and massage.', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=1200&q=80', items: ['Hair Cut', 'Beard Designing', 'Head Massage'] },
  { title: "Men's Package 7", strike: '830', offer: '748', note: 'Wash and finish bundle with beard work, massage, and face wash.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80', items: ['Haircut With Wash', 'Beard Setting', 'Face Wash', 'Head Massage', 'Shoulder Massage'] },
].map((pkg) => ({ ...pkg, slug: slugifyServiceTitle(pkg.title) }));

export const serviceGroups = [
  { key: 'women', label: "Women's Services", subtitle: 'Beauty, skin, nails, bridal support', sections: womenEssentials },
  { key: 'hair', label: 'Hair Studio', subtitle: 'Cuts, styling, color, care, treatments', sections: hairAndStudio },
  { key: 'men', label: "Men's Grooming", subtitle: 'Cuts, facials, bleaching, skin care, packages', sections: mensServices },
];

export const allServiceSections = serviceGroups.flatMap((group) =>
  group.sections.map((section) => ({ ...section, groupKey: group.key, slug: slugifyServiceTitle(section.title) })),
);

export const findServiceSectionBySlug = (slug) => allServiceSections.find((section) => section.slug === slug);
export const findPackageBySlug = (slug) => packages.find((pkg) => pkg.slug === slug);
