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
  YouTube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  WhatsApp:
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488',
};

/**
 * The House's own channels, in the order they are offered to a visitor.
 * The footer and the Contact page both render this list, so a new channel is
 * added once and appears in both places. Member profiles are separate: these
 * are the House accounts, not anyone's personal ones.
 */
export const HOUSE_CHANNELS = [
  {
    label: 'WhatsApp',
    handle: 'Official channel',
    href: 'https://www.whatsapp.com/channel/0029Vb83wumAzNc2qMQOQX0b',
    path: SOCIAL_ICONS.WhatsApp,
  },
  {
    label: 'LinkedIn',
    handle: 'sundarbans-iitm',
    href: 'https://www.linkedin.com/company/sundarbans-iitm/',
    path: SOCIAL_ICONS.LinkedIn,
  },
  {
    label: 'Instagram',
    handle: '@sundarbansiitm',
    href: 'https://www.instagram.com/sundarbansiitm/',
    path: SOCIAL_ICONS.Instagram,
  },
  {
    label: 'YouTube',
    handle: '@sundarbansiitm',
    href: 'https://www.youtube.com/@sundarbansiitm',
    path: SOCIAL_ICONS.YouTube,
  },
];
