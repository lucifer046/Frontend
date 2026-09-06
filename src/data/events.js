/**
 * Events, the single source of truth for the public Events page.
 *
 * Two lists live here and nothing else keeps a hard-coded copy:
 *
 *   upcomingEvents  everything the House has announced but not yet run
 *   pastEvents      the archive, newest first, shown as the film reel
 *
 * An upcoming entry may carry `dateISO` (YYYY-MM-DD). Once that day has
 * passed, `splitEvents()` moves the entry into the archive at runtime, so the
 * page never advertises an event that already happened. `date` stays the
 * human-readable label the UI prints.
 *
 * `type` must match one of FILTER_TABS below, which is what the Upcoming
 * Events filter row switches on. `category` is the free-text label printed on
 * the card, so it can be finer-grained than the filter.
 */

export const FILTER_TABS = ['All', 'Workshops', 'Meetups', 'Competitions', 'Talks'];

/** Used whenever an event has no image, or its image fails to load, so the
 *  page never shows a broken-image glyph. */
export const FALLBACK_EVENT_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop';

// ─── UPCOMING ────────────────────────────────────────────────────────────────
// Add announced events here. Shape:
// {
//   title: 'My Workshop',
//   category: 'Workshop',
//   type: 'Workshops',            // one of FILTER_TABS
//   desc: 'One or two lines.',
//   date: 'June 2026',
//   dateISO: '2026-06-15',        // machine date, drives auto-migration
//   time: '6:00 PM',
//   location: 'Online (Zoom)',
//   img: 'https://...',
//   link: '/contact',             // optional, the card action
//   featured: true,               // optional, forces the highlight slot
// }
export const upcomingEvents = [];

// ─── ARCHIVE ─────────────────────────────────────────────────────────────────
// Newest first. The reel reads this order directly.
export const pastEvents = [
  {
    title: 'Career in Research',
    category: 'Guest Talk',
    desc: 'PhD scholars discuss research life, opportunities and how to get started',
    date: 'May 2026',
    location: 'Virtual',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'Bengaluru Student meetup',
    category: 'Offline Meetup',
    desc: 'The first ever sumdarbans student meetup in Bengaluru, started with light conversations and turned into heartfelt conversations.',
    date: 'May 2026',
    location: 'Talk over tables cafe',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911324/sundarbans/public/assets/pastevent/bengaluru_meetup_608_1.png',
  },
  {
    title: 'Delhi Meetup 2026',
    category: 'Offline Meetup',
    desc: 'Network with Sundarbans members in Delhi: food, fun and friendships',
    date: 'April 2026',
    location: 'Delhi',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'Chennai Meetup 2026',
    category: 'Offline Meetup',
    desc: 'Connect with fellow students in Chennai: sessions, games and more',
    date: 'March 2026',
    location: 'Chennai',
    img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'Shakti Series: Episode 1',
    category: 'Empowerment',
    desc: 'Inaugural session of the empowerment series celebrating strength, resilience and community spirit',
    date: 'October 2025',
    location: 'Virtual',
    img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'Navrang 2.0: Celebrate Navratri',
    category: 'Cultural',
    desc: 'Nine nights of vibrant cultural celebration featuring dance, music and festive traditions',
    date: 'September 2025',
    location: 'Virtual',
    img: 'https://images.unsplash.com/photo-1567591370762-b3db2e82eb3e?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'Pre-Independence Day Session',
    category: 'Guest Talk',
    desc: 'Inspiring talk by Capt. Albert Louis on patriotism, sacrifice and the journey of our nation',
    date: 'August 2025',
    location: 'Virtual',
    img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'Paradox Champions League: Football Faceoff',
    category: 'Sports',
    desc: "High-energy football tournament at Paradox'25, strategy, skill and spirit on the field",
    date: 'May 2025',
    location: 'Offline',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911324/sundarbans/public/assets/pastevent/2025-05-15_12-44-00_UTC.jpg',
  },
  {
    title: 'Ghost in the Firewall',
    category: 'Technical',
    desc: "Capture-the-flag style cybersecurity challenge at Paradox'25, decode, defend and uncover the rogue AI",
    date: 'May 2025',
    location: 'Offline',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911323/sundarbans/public/assets/pastevent/2025-05-14_08-34-35_UTC.jpg',
  },
  {
    title: 'Hack Eclipse: 24-hour Hackathon',
    category: 'Hackathon',
    desc: 'Round-the-clock coding marathon where teams built innovative solutions across environment, healthcare, fintech and more',
    date: 'May 2025',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911322/sundarbans/public/assets/pastevent/2025-05-09_06-25-51_UTC.jpg',
  },
  {
    title: 'Paradox Badminton League 2.0',
    category: 'Sports',
    desc: 'Inter-house badminton tournament with intense rallies and fierce competition across divisions',
    date: 'May 2025',
    location: 'Virtual',
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'IPL Auction Showdown',
    category: 'E-Sports',
    desc: 'Strategic mock IPL auction where participants built dream teams with limited budgets',
    date: 'May 2025',
    location: 'Virtual',
    img: 'https://images.unsplash.com/photo-1540747913346-19212a4f3b1e?w=500&q=80&auto=format&fit=crop',
  },
  {
    title: 'FrameQuest: Photography Contest',
    category: 'Cultural',
    desc: 'Three-round photography contest with a 6000 rupee prize pool, portraits that tell a lasting story',
    date: 'February 2025',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911320/sundarbans/public/assets/pastevent/2025-02-10_10-25-33_UTC.jpg',
  },
  {
    title: 'Into the Shadows: Special Forces Talk',
    category: 'Guest Talk',
    desc: 'Gripping session with Maj. Sushant Singh on courage, resilience and life as a Special Forces operative',
    date: 'February 2025',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911321/sundarbans/public/assets/pastevent/2025-02-13_02-15-54_UTC.jpg',
  },
  {
    title: 'Python Odyssey',
    category: 'Workshop',
    desc: '7-episode hands-on Python journey covering fundamentals, OOP and Flask web development',
    date: 'February 2025',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911319/sundarbans/public/assets/pastevent/2025-02-06_00-30-44_UTC.jpg',
  },
  {
    title: 'Mahabharata: Science Meets History',
    category: 'Guest Talk',
    desc: 'Nilesh Oak takes the audience through scientific dating of the Mahabharata and the mysteries of ancient India',
    date: 'January 2025',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911318/sundarbans/public/assets/pastevent/2025-01-27_08-57-27_UTC.jpg',
  },
  {
    title: 'Frames of Freedom: Republic Day Photography',
    category: 'Cultural',
    desc: "Photography contest celebrating patriotism and India's culture, themes of Tiranga, Unsung Heroes and India in Motion",
    date: 'January 2025',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911317/sundarbans/public/assets/pastevent/2025-01-25_01-20-01_UTC.jpg',
  },
  {
    title: 'Navodaya: Voices of Power with Smriti Irani',
    category: 'Guest Talk',
    desc: 'Grand finale of Voices of Power featuring Smriti Irani on leadership, empowerment and women shaping the future',
    date: 'December 2024',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911316/sundarbans/public/assets/pastevent/2024-12-05_11-31-48_UTC.jpg',
  },
  {
    title: 'Dinkar Ki Pratiksha: Open Mic',
    category: 'Cultural',
    desc: 'Collaborative open mic celebrating the 116th birth anniversary of poet Ramdhari Singh Dinkar, poetry across all languages',
    date: 'September 2024',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911315/sundarbans/public/assets/pastevent/2024-09-23_06-54-49_UTC.jpg',
  },
  {
    title: 'Sundarbans BS Talent Show',
    category: 'Cultural',
    desc: 'Platform for IITM BS students to showcase their extraordinary talents to the wider community',
    date: 'July 2024',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911314/sundarbans/public/assets/pastevent/2024-07-16_11-41-17_UTC.jpg',
  },
  {
    title: 'How to Improve Concentration: Swami Mukundanand',
    category: 'Guest Talk',
    desc: 'Enlightening session by IIT-IIM alumnus and spiritual leader Swami Mukundanand Ji on focus and Vedic wisdom',
    date: 'March 2023',
    location: 'Virtual',
    img: 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911313/sundarbans/public/assets/pastevent/2023-03-22_09-54-19_UTC.jpg',
  },
];

/**
 * Split the two lists by today's date.
 *
 * An upcoming entry without `dateISO` stays upcoming (there is no machine date
 * to judge it by); one whose date has passed is demoted to the front of the
 * archive, so the reel opens with the most recent thing that happened.
 */
export function splitEvents(now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const live = [];
  const demoted = [];

  for (const ev of upcomingEvents) {
    if (ev.dateISO && new Date(ev.dateISO) < today) demoted.push(ev);
    else live.push(ev);
  }

  return { upcoming: live, past: [...demoted, ...pastEvents] };
}
