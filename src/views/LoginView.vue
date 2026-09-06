<template>
  <!-- ══════════════════════════════════════════════════════════════════════
       THE PRIVATE ENTRANCE
       A door, not a login form on a marketing page. The left half states who
       this is for and offers the single way in; the right half is the House
       pass the member is about to be admitted against. Nothing here counts
       anything, and nothing floats.
       ══════════════════════════════════════════════════════════════════ -->
  <div class="portal entry">
    <span class="p-mark p-mark--right entry__mark" aria-hidden="true">Private</span>
    <div class="entry__layout p-shell">
      <!-- ── The address ────────────────────────────────────────────── -->
      <section class="entry__copy">
        <router-link to="/" class="entry__back">
          <ArrowLeft :size="14" :stroke-width="1.8" aria-hidden="true" />
          Sundarbans House
        </router-link>

        <p class="p-eyebrow">Members Only</p>
        <h1 class="entry__title">Welcome<br /><em>back.</em></h1>
        <p class="entry__lead">Your place inside Sundarbans House.</p>
        <p class="entry__body">
          The Lounge is a private space for Sundarbans House members to connect, learn, participate
          and belong. Sign in with the student email on the House register.
        </p>

        <div class="entry__action">
          <button
            type="button"
            class="p-btn p-btn--primary entry__google"
            :class="{ 'is-loading': googleLoading }"
            @click="loginWithGoogle"
          >
            <svg
              class="entry__google-icon"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.55-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.72c-.18-.55-.28-1.13-.28-1.72s.1-1.17.28-1.72V4.95H.96A8.996 8.996 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.42 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
              />
            </svg>
            <span>{{ googleLoading ? 'Verifying…' : 'Continue with Google' }}</span>
            <ArrowRight
              v-if="!googleLoading"
              class="p-arrow"
              :size="15"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </button>

          <p class="entry__message" :class="messageType" role="status" aria-live="polite">
            {{ message }}
          </p>
        </div>

        <p class="entry__note">
          Not on the register yet? Membership is managed by the House council. Reach them from the
          <router-link to="/contact">contact page</router-link>.
        </p>
      </section>

      <!-- ── The pass ────────────────────────────────────────────────
           A dark identity plate, not an illustration. Every line on it is
           either the house's own (crest, name, programme) or the live state
           of this sign-in. There is no member number, because the app does
           not issue one. -->
      <aside class="entry__pass" aria-label="Sundarbans House membership pass">
        <div class="pass">
          <span class="p-orbit pass__orbit" aria-hidden="true"></span>

          <div class="pass__top">
            <img class="pass__crest" :src="brand.crest" alt="" width="56" height="56" />
            <span class="pass__kind">House Pass</span>
          </div>

          <div class="pass__body">
            <p class="pass__house">
              Sundarbans House
              <span>Private Lounge</span>
            </p>
            <span class="pass__label">Member</span>
          </div>

          <div class="pass__foot">
            <span class="pass__status">
              <span class="pass__status-dot" :class="{ 'is-live': googleLoading }"></span>
              {{ googleLoading ? 'Verifying identity' : 'Awaiting verification' }}
            </span>
            <span class="pass__seal" aria-hidden="true">SH</span>
          </div>

          <!-- The plate's own architecture: four hairlines, drawn once. -->
          <span class="pass__corner pass__corner--tl" aria-hidden="true"></span>
          <span class="pass__corner pass__corner--br" aria-hidden="true"></span>
        </div>

        <p class="pass__caption">
          Access is checked against the House register at sign in. Nothing is stored beyond the
          approved email.
        </p>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { brand } from '../components/navigation/navigation.config.js';
import '../assets/portal.css';

const message = ref('');
const router = useRouter();

const messageType = computed(() => {
  if (!message.value) return '';
  return message.value.toLowerCase().includes('welcome') ? 'success' : 'error';
});

/** Apps Script web app URL — build-time only (Vite). Empty means misconfigured prod. */
function membershipCheckUrl() {
  const raw = import.meta.env.VITE_MEMBERSHIP_CHECK_URL;
  return typeof raw === 'string' ? raw.trim() : '';
}

async function checkMembershipRemote(endpoint, normalizedEmail) {
  const res = await fetch(`${endpoint}?email=${encodeURIComponent(normalizedEmail)}`, {
    redirect: 'follow',
  });
  if (!res.ok) throw new Error('membership check failed');
  const data = await res.json();
  return data.ok === true && data.allowed === true;
}

async function grantOrDenyAccess(rawEmail) {
  const normalized = rawEmail.trim().toLowerCase();
  const endpoint = membershipCheckUrl();
  let allowed;

  // Membership is Sheet-only (Apps Script). No local roster file.
  if (!endpoint) {
    googleLoading.value = false;
    message.value =
      'Membership check is not configured. Set VITE_MEMBERSHIP_CHECK_URL and redeploy.';
    console.error('[login] VITE_MEMBERSHIP_CHECK_URL missing — no Sheet check ran.');
    return false;
  }

  try {
    allowed = await checkMembershipRemote(endpoint, normalized);
  } catch (err) {
    googleLoading.value = false;
    message.value = "Couldn't reach the membership server. Check your connection and try again.";
    return false;
  }

  googleLoading.value = false;
  if (allowed) {
    message.value = 'Welcome to the Members Lounge. Redirecting...';
    localStorage.setItem('sundarbans_auth_token', normalized);
    setTimeout(() => {
      router.push('/lounge');
    }, 500);
    return true;
  }
  message.value = 'Access denied. Email not found in member registry.';
  return false;
}

// ── GOOGLE SIGN-IN & TEMPORARY DEV BYPASS ────────────────────────────────
// NOTE FOR RE-IMPLEMENTING GOOGLE OAUTH:
// The original Google OAuth login logic has been commented out below for local dev / lounge redesign work.
// To re-enable Google OAuth verification:
// 1. Uncomment the Google OAuth logic block inside `loginWithGoogle()`.
// 2. Remove / comment out the temporary DEV OAUTH BYPASS block.
// 3. Ensure `VITE_GOOGLE_CLIENT_ID` and `VITE_MEMBERSHIP_CHECK_URL` are configured.

const SECRETARY_DEV_EMAIL = 'sundarbans-sec@study.iitm.ac.in';
const googleLoading = ref(false);
let tokenClient = null;
let googleInitAttempts = 0;

function initGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId || clientId.includes('your-client-id')) return;

  if (!window.google?.accounts?.oauth2) {
    googleInitAttempts += 1;
    if (googleInitAttempts < 25) setTimeout(initGoogle, 200); // ~5s max wait
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'openid email profile',
    callback: handleGoogleToken,
    error_callback: () => {
      googleLoading.value = false;
      message.value = 'Google sign-in was cancelled or failed.';
    },
  });
}

async function handleGoogleToken(tokenResponse) {
  if (!tokenResponse?.access_token) {
    googleLoading.value = false;
    message.value = 'Google sign-in failed. Please try again.';
    return;
  }
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    });
    if (!res.ok) throw new Error('userinfo request failed');
    const profile = await res.json();
    if (!profile.email) {
      googleLoading.value = false;
      message.value = 'Could not read your Google account email.';
      return;
    }
    await grantOrDenyAccess(profile.email);
  } catch (err) {
    googleLoading.value = false;
    message.value = "Couldn't reach Google. Check your connection and try again.";
  }
}

function loginWithGoogle() {
  message.value = '';

  /* =========================================================================
   * TEMPORARY DEV OAUTH BYPASS: Direct login as Secretary ID for Lounge redesign
   * ========================================================================= */
  googleLoading.value = true;
  message.value = 'Dev Mode: Logging in as Secretary... Redirecting to Lounge';
  localStorage.setItem('sundarbans_auth_token', SECRETARY_DEV_EMAIL);
  setTimeout(() => {
    googleLoading.value = false;
    router.push('/lounge');
  }, 400);

  /* =========================================================================
   * ORIGINAL GOOGLE OAUTH AUTHENTICATION (COMMENTED OUT FOR LOCAL DEV)
   * =========================================================================
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId || clientId.includes('your-client-id')) {
    message.value = "Google sign-in isn't configured yet (missing client ID).";
    return;
  }
  if (!tokenClient) {
    message.value = 'Google sign-in is still loading. Try again in a second.';
    return;
  }
  googleLoading.value = true;
  tokenClient.requestAccessToken();
  ========================================================================= */
}

onMounted(() => {
  initGoogle();
});
</script>

<style scoped>
.entry {
  position: relative;
  display: grid;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
}
.entry__mark {
  top: 42%;
  color: rgba(241, 232, 208, 0.016);
}
.entry__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(2.5rem, 6vw, 6rem);
  padding-block: clamp(3rem, 8vh, 6rem);
}

/* ── Left: the address ───────────────────────────────────────────────── */
.entry__copy {
  max-width: 34rem;
}
.entry__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(2rem, 6vh, 3.5rem);
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
  text-decoration: none;
  transition: color var(--duration-link, 340ms) var(--p-ease);
}
.entry__back:hover {
  color: var(--p-gold-light);
}
.entry__back svg {
  transition: transform var(--duration-link, 340ms) var(--p-ease);
}
.entry__back:hover svg {
  transform: translateX(-3px);
}
.entry__title {
  margin-top: 1.25rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(3rem, 1.6rem + 6vw, 7rem);
  line-height: 0.92;
  letter-spacing: -0.025em;
  text-transform: uppercase;
}
.entry__title em {
  font-style: italic;
  text-transform: none;
  color: var(--p-gold-light);
}
.entry__lead {
  margin-top: 1.5rem;
  font-size: clamp(1rem, 0.95rem + 0.3vw, 1.25rem);
  color: var(--p-ink);
}
.entry__body {
  margin-top: 0.9rem;
  max-width: 42ch;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--p-ink-muted);
}
.entry__action {
  margin-top: clamp(2rem, 5vh, 2.75rem);
  max-width: 24rem;
}
.entry__google {
  width: 100%;
  padding-block: 1rem;
}
.entry__google-icon {
  width: 17px;
  height: 17px;
}
.entry__google.is-loading {
  pointer-events: none;
  opacity: 0.75;
}
.entry__message {
  min-height: 1.25rem;
  margin-top: 0.9rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--p-ink-faint);
}
.entry__message.error {
  color: #dd9a9a;
}
.entry__message.success {
  color: var(--p-live);
}
.entry__note {
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--p-line);
  max-width: 34ch;
  font-size: 0.75rem;
  line-height: 1.7;
  color: var(--p-ink-faint);
}
.entry__note a {
  color: var(--p-gold-deep);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
.entry__note a:hover {
  color: var(--p-gold-light);
}

/* ── Right: the pass ─────────────────────────────────────────────────── */
.entry__pass {
  justify-self: center;
  width: min(24rem, 100%);
}
.pass {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 5vh, 3rem);
  padding: clamp(1.75rem, 3vw, 2.25rem);
  aspect-ratio: 5 / 7;
  overflow: hidden;
  background: linear-gradient(168deg, #0a0f0c 0%, #060907 58%, #000000 100%);
  border: 1px solid var(--p-line-card);
  border-radius: var(--p-radius-lg);
  box-shadow: var(--shadow-lg);
}
/* The crest geometry, half off the plate, so the composition is layered
   rather than centred. */
.pass__orbit {
  width: 118%;
  right: -46%;
  top: 22%;
}
.pass__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.pass__crest {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--p-line-strong);
  object-fit: cover;
}
.pass__kind {
  font-size: 0.5625rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}
.pass__body {
  position: relative;
  z-index: 1;
  margin-top: auto;
}
.pass__top {
  position: relative;
  z-index: 1;
}
.pass__label {
  display: block;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--p-line);
  font-size: 0.625rem;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--p-gold);
}
.pass__house {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem);
  line-height: 1.05;
  text-transform: uppercase;
  color: var(--p-ink);
}
.pass__house span {
  display: block;
  margin-top: 0.35rem;
  font-family: var(--font-body);
  font-size: 0.625rem;
  letter-spacing: 0.34em;
  color: var(--p-gold-deep);
}
.pass__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--p-line);
}
.pass__status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
}
.pass__status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--p-ink-faint);
}
.pass__status-dot.is-live {
  background: var(--p-live);
  animation: p-pulse 2.8s var(--p-ease) infinite;
}
.pass__seal {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.08em;
  color: rgba(213, 166, 58, 0.22);
}
.pass__corner {
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  pointer-events: none;
}
.pass__corner--tl {
  top: 0.6rem;
  left: 0.6rem;
  border-top: 1px solid var(--p-line);
  border-left: 1px solid var(--p-line);
}
.pass__corner--br {
  right: 0.6rem;
  bottom: 0.6rem;
  border-right: 1px solid var(--p-line);
  border-bottom: 1px solid var(--p-line);
}
.pass__caption {
  margin-top: 1.25rem;
  font-size: 0.6875rem;
  line-height: 1.65;
  color: var(--p-ink-faint);
  text-align: center;
}

/* ── One column below a tablet: the door first, the pass underneath. ──── */
@media (max-width: 900px) {
  .entry__layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 3rem;
  }
  .entry__pass {
    order: 2;
    width: min(20rem, 100%);
  }
  .entry__copy {
    order: 1;
  }
  .entry__action {
    max-width: none;
  }
}
</style>
