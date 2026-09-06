/**
 * The authenticated member, read once and shared by every portal surface.
 *
 * The only thing the app actually knows about a signed-in member is the email
 * the membership check approved, which is what `sundarbans_auth_token` holds.
 * Everything below is derived from that string — nothing is invented, and a
 * field the token cannot support (a house, a member number, a join date) is
 * simply absent rather than filled with a plausible placeholder.
 */
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export const AUTH_TOKEN_KEY = 'sundarbans_auth_token';

function readToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch {
    // Private mode / embedded webview: treat storage loss as signed out.
    return '';
  }
}

/**
 * "23f1000052@ds.study.iitm.ac.in" → "23f1000052"
 * "priya.nair@…"                   → "Priya Nair"
 *
 * A roll number is left exactly as issued (upper-cased letters read as noise
 * in a greeting), while a human-shaped local part is title-cased so the hero
 * can say "Welcome back, Priya" instead of echoing a raw account string.
 */
function displayNameFrom(email) {
  const local = String(email).split('@')[0] || '';
  if (!local) return 'Member';
  if (/\d/.test(local)) return local;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function initialsFrom(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '·';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function usePortalMember() {
  const router = useRouter();
  const email = ref(readToken());

  const isAuthenticated = computed(() => Boolean(email.value));
  const displayName = computed(() => displayNameFrom(email.value));
  const initials = computed(() => initialsFrom(displayName.value));
  /** First word only — what the greeting uses. */
  const firstName = computed(() => displayName.value.split(' ')[0]);

  /** Bounce an unauthenticated visitor; returns false if the caller should stop. */
  function requireAuth() {
    email.value = readToken();
    if (!email.value) {
      router.push('/login');
      return false;
    }
    return true;
  }

  function logout() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* storage unavailable — the redirect below still signs the member out */
    }
    email.value = '';
    router.push('/login');
  }

  return { email, displayName, firstName, initials, isAuthenticated, requireAuth, logout };
}

/**
 * `v-reveal` — the portal's single entrance effect. One observer per element,
 * disconnected as soon as it fires, so a long page does not keep dozens alive.
 */
export const vReveal = {
  mounted(el) {
    el.classList.add('p-reveal');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    // Anything already on screen when it mounts is revealed at once, without
    // waiting to be observed. An IntersectionObserver callback is only
    // delivered while the document is being rendered, so a view mounted in a
    // tab that is not painting would otherwise hold its opening sections at
    // zero opacity: content that is in the viewport is never hidden pending an
    // observation that may not arrive.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    el.__revealObserver = observer;
  },
  unmounted(el) {
    el.__revealObserver?.disconnect();
    delete el.__revealObserver;
  },
};
