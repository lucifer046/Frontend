/**
 * Council roster — Sundarbans House, 2026–27
 *
 * The single source of truth for who holds which office. The Teams page renders
 * it as a directory; the Leaderboard page ranks the Lower House half of it. Add
 * or replace a member here and both pages follow — neither view keeps its own
 * copy of a name.
 *
 * Portraits are the processed 3:4 files on Cloudinary (see `media/manifest.json`).
 * `socials` carries only links that actually exist; an empty array is normal.
 * `email` is the office address for the Upper House and the coordinator's own
 * for the Lower House — the Teams cards and the Contact directory both read it
 * from here, so an address is corrected in exactly one place.
 */

const CDN = 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit';

/**
 * Upper House Council — authored Secretary-first so the DOM (and therefore the
 * reading order, the tab order, and the single-column stack on small screens)
 * leads with the senior office. The Teams grid re-seats the three at desktop.
 */
export const upperHouse = [
  {
    id: 'divya-prakash',
    name: 'Divya Prakash',
    role: 'Secretary',
    region: 'Delhi',
    council: 'UHC',
    email: 'sundarbans-sec@study.iitm.ac.in',
    lead: true,
    photo: `${CDN}/v1788444120/sundarbans/teams/Divya_Prakash.jpg`,
    socials: [{ label: 'LinkedIn', href: 'https://in.linkedin.com/in/divya-prakash-5b564b273' }],
  },
  {
    id: 'aditri-bordoloi',
    name: 'Aditri Bordoloi',
    role: 'Deputy Secretary',
    region: 'Bengaluru',
    council: 'UHC',
    email: 'sundarbans-ds@study.iitm.ac.in',
    photo: `${CDN}/v1788444111/sundarbans/teams/aditri.webp`,
    socials: [],
  },
  {
    id: 'anuraj-jit-saikia',
    name: 'Anuraj Jit Saikia',
    role: 'Web Admin',
    region: 'Kolkata',
    council: 'UHC',
    email: 'sundarbans-webad@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788455652/sundarbans/teams/anuraj.jpg`,
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anurajjitsaikia/' },
      { label: 'X', href: 'https://x.com/raja_saikia_' },
    ],
  },
];

/**
 * Lower House Council — the current Regional Coordinators. Source order is
 * irrelevant: consumers sort it (see `sortByRegion`).
 */
export const lowerHouse = [
  {
    id: 'prashansha-uniyal',
    name: 'Prashansha Uniyal',
    role: 'Regional Coordinator',
    region: 'Chandigarh',
    council: 'LHC',
    email: '26f2001093@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444129/sundarbans/teams/Prashansha_Uniyal.jpg`,
    socials: [{ label: 'LinkedIn', href: 'http://www.linkedin.com/in/prashansauniyal' }],
  },
  {
    id: 'niva-murabia',
    name: 'Niva Murabia',
    role: 'Regional Coordinator',
    region: 'Mumbai',
    council: 'LHC',
    email: '26f2001385@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444126/sundarbans/teams/Niva_Murabia.jpg`,
    socials: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/niva.murabia?igsi=MWY5OGF5aGF5MGowaQ==',
      },
    ],
  },
  {
    id: 'dhanashree-kulkarni',
    name: 'Dhanashree Kulkarni',
    role: 'Regional Coordinator',
    region: 'Mumbai',
    council: 'LHC',
    email: '26f1002254@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788455655/sundarbans/teams/Dhanashree_kulkarni.jpg`,
    socials: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/dhanashree-kulkarni-638779392?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      },
    ],
  },
  {
    id: 'sai-nikhil-vukka',
    name: 'Sai Nikhil Vukka',
    role: 'Regional Coordinator',
    region: 'Hyderabad',
    council: 'LHC',
    email: '25f2005507@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444130/sundarbans/teams/sai_nikhil_vukka.jpg`,
    socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/sai-nikhil-vukka-iitm/' }],
  },
  {
    id: 'dhanya-r',
    name: 'Dhanya R',
    role: 'Regional Coordinator',
    region: 'Chennai',
    council: 'LHC',
    email: '25f3000178@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444118/sundarbans/teams/Dhanya_R..jpg`,
    socials: [],
  },
  {
    id: 'abhisekh-chowdhury',
    name: 'Abhisekh Chowdhury',
    role: 'Regional Coordinator',
    region: 'Kolkata',
    council: 'LHC',
    email: '25f1000401@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444109/sundarbans/teams/Abhisekh_Chowdhury.jpg`,
    socials: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/abhisekh._.901?igsi=MXBxc3d3NWFvNGg5bg==',
      },
    ],
  },
  {
    id: 'mohammad-faizan-khan',
    name: 'Mohammad Faizan Khan',
    role: 'Regional Coordinator',
    region: 'Delhi',
    council: 'LHC',
    email: '25f2006707@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444124/sundarbans/teams/Mohammad_Faizan_Khan.jpg`,
    socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/faizan7457/' }],
  },
  {
    id: 'ansh-kumar',
    name: 'Ansh Kumar',
    role: 'Regional Coordinator',
    region: 'Lucknow',
    council: 'LHC',
    email: '25f2006129@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444112/sundarbans/teams/ansh_kumar.jpg`,
    socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/ansh-kumar-60113037b/' }],
  },
  {
    id: 'lavanya',
    name: 'Lavanya',
    role: 'Regional Coordinator',
    region: 'Patna',
    council: 'LHC',
    email: '25f3006431@ds.study.iitm.ac.in',
    photo: `${CDN}/v1788444122/sundarbans/teams/Lavanya.jpg`,
    socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/lavanya-90258b41b/' }],
  },
];

/** Case- and whitespace-insensitive, so the order survives a data edit. */
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

/**
 * Ordered by region only — never by the member's name. Two members may share a
 * region, so the id breaks ties and keeps the render order stable rather than
 * leaving it to the sort implementation.
 */
export function sortByRegion(members) {
  return [...members].sort(
    (a, b) => collator.compare(a.region.trim(), b.region.trim()) || collator.compare(a.id, b.id)
  );
}

/** Monogram for a member whose portrait is missing or fails to load. */
export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Brand marks for the three networks the roster links to. Lucide carries no
 * brand icons, so these stay as inline paths — the same set the footer uses.
 */
export const SOCIAL_ICONS = {
  LinkedIn:
    'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  Instagram:
    'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
  X: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
};
