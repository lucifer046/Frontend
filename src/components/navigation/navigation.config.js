/**
 * Navigation source of truth — Sundarbans House
 *
 * One list, consumed by both the desktop rail and the mobile drawer, so the
 * two can never drift. Routes here mirror `src/router/index.js` exactly; this
 * file must never invent a path.
 *
 * `homeSectionId` is the id of the homepage section a given item previews.
 * While the visitor is on "/", the rail's indicator follows whichever of these
 * sections is on screen (see `useSectionSpy`). Clicking always navigates to the
 * real route — the indicator tracks reading position, it does not hijack links.
 * Drop the field to opt an item out of section tracking.
 */
import {
  Home,
  BookOpen,
  CalendarDays,
  MapPin,
  MapPinned,
  Info,
  Handshake,
  UsersRound,
  Mail,
  ShieldCheck,
  Armchair,
  GraduationCap,
} from 'lucide-vue-next';

/** The crest is the same Cloudinary asset the preloader and footer already use. */
export const brand = {
  route: '/',
  crest:
    'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911356/sundarbans/src/assets/LOGO.jpg',
  name: 'SUNDARBANS',
  subtitle: 'IIT MADRAS BS DEGREE',
};

export const navigationItems = [
  { id: 'home', label: 'Home', route: '/', icon: Home, homeSectionId: 'home-hero' },
  {
    id: 'study',
    label: 'Study Corner',
    route: '/study',
    icon: BookOpen,
    homeSectionId: 'home-academics',
  },
  { id: 'events', label: 'Events', route: '/events', icon: CalendarDays },
  { id: 'meetups', label: 'Meetups', route: '/meetups', icon: MapPin },
  { id: 'exam-cities', label: 'Exam Cities', route: '/exam-cities', icon: MapPinned },
  { id: 'about', label: 'About', route: '/about', icon: Info, homeSectionId: 'home-about' },
  { id: 'community', label: 'Community', route: '/community', icon: Handshake },
  { id: 'teams', label: 'Teams', route: '/teams', icon: UsersRound },
  { id: 'contact', label: 'Contact', route: '/contact', icon: Mail },
];

/**
 * Bottom zone. Same visual grammar as the links above — icon, label, gold tick
 * — deliberately not three filled buttons. `/login` is the existing Lounge
 * entry point (the router guard on /lounge bounces anonymous visitors there).
 */
export const actionItems = [
  {
    id: 'verify',
    label: 'Verify Certificate',
    route: '/verify-certificate',
    icon: ShieldCheck,
  },
  { id: 'lounge', label: 'Lounge', route: '/login', icon: Armchair },
  {
    id: 'course',
    label: 'Course',
    href: 'https://app.onlinedegree.iitm.ac.in/auth/login?next=https://app.onlinedegree.iitm.ac.in/student_dashboard/latest_updates',
    icon: GraduationCap,
    external: true,
  },
];

/** The members area ships its own header (MembersNavbar), so the rail stands down. */
const RAIL_HIDDEN_ROUTES = ['/lounge', '/dashboard'];

export function isRailHiddenFor(path) {
  return RAIL_HIDDEN_ROUTES.includes(path);
}

/**
 * "/" must match exactly or every route would light up Home; everything else
 * matches its own subtree, so /community/technical keeps Community lit and
 * /meetups/patna keeps Meetups lit.
 */
export function isRouteActive(item, path) {
  if (!item.route) return false;
  if (item.route === '/') return path === '/';
  return path === item.route || path.startsWith(`${item.route}/`);
}

/** Section ids the homepage must expose for indicator tracking to work. */
export const homeSectionIds = navigationItems
  .filter((item) => item.homeSectionId)
  .map((item) => item.homeSectionId);
