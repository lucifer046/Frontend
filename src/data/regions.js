/**
 * Region directory — the chapters that have a meetups page.
 *
 * `slug` is the URL segment under /meetups; it must stay in step with the slug
 * map in `src/views/meetups/RegionMeetupsView.vue`. Images are the existing
 * Cloudinary city assets — no new artwork is introduced here.
 *
 * Authored in whatever order is convenient: consumers call `sortedRegions()`,
 * which orders by city name, so the grid stays alphabetical when this list is
 * edited.
 */

const CDN = 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit';

export const regions = [
  {
    slug: 'delhi-ncr',
    name: 'Delhi-NCR',
    members: '320+',
    image: `${CDN}/v1785911362/sundarbans/src/assets/regions/delhi.jpg`,
    badge: 'Most Active',
  },
  {
    slug: 'mumbai',
    name: 'Mumbai',
    members: '450+',
    image: `${CDN}/v1785911367/sundarbans/src/assets/regions/mumbai.jpg`,
    badge: 'Largest Chapter',
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    members: '390+',
    image: `${CDN}/v1785911358/sundarbans/src/assets/regions/bangalore.jpg`,
    badge: null,
  },
  {
    slug: 'kolkata',
    name: 'Kolkata',
    members: '280+',
    image: `${CDN}/v1785911364/sundarbans/src/assets/regions/kolkata.jpg`,
    badge: null,
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    members: '210+',
    image: `${CDN}/v1785911363/sundarbans/src/assets/regions/hyderabad.jpg`,
    badge: null,
  },
  {
    slug: 'patna',
    name: 'Patna',
    members: '180+',
    image: `${CDN}/v1785911369/sundarbans/src/assets/regions/patna.jpg`,
    badge: null,
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    members: '120+',
    image: `${CDN}/v1785911359/sundarbans/src/assets/regions/chandigarh.webp`,
    badge: 'Rising Chapter',
  },
  {
    slug: 'chennai',
    name: 'Chennai',
    members: '150+',
    image: `${CDN}/v1785911360/sundarbans/src/assets/regions/chennai.jpg`,
    badge: null,
  },
  {
    slug: 'lucknow',
    name: 'Lucknow',
    members: '110+',
    image: `${CDN}/v1785911366/sundarbans/src/assets/regions/lucknow.jpg`,
    badge: null,
  },
];

/**
 * Alphabetical by city name, case- and whitespace-insensitive so the order
 * holds however a future entry is typed. The slug breaks ties, keeping the
 * render order deterministic rather than sort-implementation dependent.
 */
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

export function sortedRegions(list = regions) {
  return [...list].sort(
    (a, b) => collator.compare(a.name.trim(), b.name.trim()) || collator.compare(a.slug, b.slug)
  );
}

/** Lookup used by the region pages to find their own card image. */
export function regionBySlug(slug) {
  return regions.find((region) => region.slug === slug) ?? null;
}
