import backpackMain from '../assets/backpack_main.png';
import backpackSide from '../assets/backpack_side.png';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface SizeOption {
  size: string;
  stock: number;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface EnrichedProduct {
  id: number;
  title: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  onSale: boolean;
  rating: { rate: number; count: number };
  description: string;
  specifications: Specification[];
  colors: ColorOption[];
  sizes: SizeOption[];
  images: string[];
  reviews: Review[];
  category: string;
}

const BRANDS = ['SUMMIT // WILDERNESS', 'Arc\'teryx', 'Patagonia', 'Osprey', 'Black Diamond', 'Mammut'];

const COLORS: ColorOption[] = [
  { id: 'alpine-green', name: 'Alpine Green', hex: '#1e3a2f' },
  { id: 'slate-grey', name: 'Slate Grey', hex: '#4b5563' },
  { id: 'sunset-orange', name: 'Sunset Orange', hex: '#d97706' },
  { id: 'obsidian', name: 'Obsidian Black', hex: '#111827' }
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Sarah K.',
    rating: 5,
    date: '2026-05-12',
    title: 'Unrivaled Quality & Fit',
    comment: 'Took this on a 4-day trek in the Rockies. Withstood heavy rain on day 2 and kept all my gear bone dry. The ergonomics are exceptional—hardly felt any shoulder strain.'
  },
  {
    id: 'r2',
    author: 'Marcus V.',
    rating: 4,
    date: '2026-04-29',
    title: 'Excellent, but fits snug',
    comment: 'Incredibly durable material and premium buckles. My only note is that the sizing is a bit snug if you plan on layering underneath. Consider sizing up if you are between sizes.'
  },
  {
    id: 'r3',
    author: 'Dave R.',
    rating: 5,
    date: '2026-04-15',
    title: 'Top-tier outdoor engineering',
    comment: 'The attention to detail is amazing. The seam sealing, zip quality, and weight distribution are exactly what you expect for premium outdoor gear. Worth every penny.'
  }
];

export function enrichProduct(apiProduct: any): EnrichedProduct {
  const id = apiProduct.id;
  
  const brand = BRANDS[id % BRANDS.length];

  let title = apiProduct.title;
  let category = apiProduct.category;
  let specifications: Specification[] = [];

  if (id === 1) {
    title = 'Apex Ranger 35L Multi-Day Pack';
    category = 'Technical Packs';
    specifications = [
      { key: 'Capacity', value: '35 Liters' },
      { key: 'Material', value: '420D Nylon Ripstop, TPU Laminate' },
      { key: 'Weight', value: '1.2 kg (2.6 lbs)' },
      { key: 'Frame', value: 'Anti-Gravity Aluminum Wire Frame' },
      { key: 'Hydration Compatible', value: 'Yes (Up to 3L Reservoir)' },
      { key: 'Warranty', value: 'Lifetime Guarantee' }
    ];
  } else if (apiProduct.category.includes('clothing')) {
    title = apiProduct.title.replace(/Casual|Slim Fit|Premium/g, '').trim();
    if (title.toLowerCase().includes('jacket')) {
      title = `Helios Insulated Storm Hoody`;
    } else {
      title = `${title} Merino Trail Shell`;
    }
    category = 'Technical Apparel';
    specifications = [
      { key: 'Material', value: '88% Merino Wool, 12% Recycled Nylon' },
      { key: 'Waterproofing', value: 'DWR (Durable Water Repellent) Finish' },
      { key: 'Breathability Rating', value: '20,000 g/m²/24h' },
      { key: 'Fit', value: 'Athletic Trim' },
      { key: 'Warranty', value: 'Limited Lifetime Warranty' }
    ];
  } else {
    if (category === 'electronics') {
      title = title.replace(/Western Digital|Seagate|SanDisk/g, '').trim();
      title = `Trek-Core GPS Navigation & Alt-Watch`;
      category = 'Alpine Electronics';
      specifications = [
        { key: 'Battery Life', value: 'Up to 45 hours in full GPS mode' },
        { key: 'Sensors', value: 'Altimeter, Barometer, 3-Axis Compass' },
        { key: 'Water Resistance', value: 'IPX8 (Submersible up to 10m)' },
        { key: 'Connectivity', value: 'Bluetooth Smart, ANT+' },
        { key: 'Weight', value: '62g' }
      ];
    } else {
      title = `Apex Sentinel Carbon Trekking Poles`;
      category = 'Mountaineering Gear';
      specifications = [
        { key: 'Shaft Material', value: '100% High-Modulus Carbon Fiber' },
        { key: 'Grip', value: 'Natural Cork Grip with EVA Extension' },
        { key: 'Length Range', value: '100cm - 135cm' },
        { key: 'Collapsed Size', value: '62cm' },
        { key: 'Weight Per Pair', value: '380g (13.4 oz)' }
      ];
    }
  }

  const onSale = id % 2 !== 0;
  const price = apiProduct.price;
  const originalPrice = onSale ? Math.round((price * 1.35) * 100) / 100 : null;

  const colors = id === 1 || category.includes('Apparel') ? COLORS : COLORS.slice(0, 3);

  const sizes = STANDARD_SIZES.map((size, index) => {
    const seed = (id * 7 + index * 13) % 10;
    let stock = 15;
    if (seed === 1 || seed === 4) {
      stock = 0;
    } else if (seed === 2 || seed === 7) {
      stock = 2;
    } else if (seed === 5) {
      stock = 1;
    }
    return { size, stock };
  });

  let images = [apiProduct.image];

  if (id === 1) {
    images = [
      backpackMain,
      backpackSide,
      'https://images.unsplash.com/photo-1551632879-25b2d7a90620?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop'
    ];
  } else {
    if (category.includes('Apparel')) {
      images = [
        apiProduct.image,
        'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=800&auto=format&fit=crop'
      ];
    } else {
      images = [
        apiProduct.image,
        'https://images.unsplash.com/photo-1533630988607-c81b29d1a3e7?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
      ];
    }
  }

  return {
    id,
    title,
    brand,
    price,
    originalPrice,
    onSale,
    rating: apiProduct.rating || { rate: 4.5, count: 48 },
    description: apiProduct.description,
    specifications,
    colors,
    sizes,
    images,
    reviews: REVIEWS,
    category
  };
}
