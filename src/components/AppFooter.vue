<template>
  <footer ref="footerEl" class="footer" :class="{ 'is-revealed': revealed }">
    <div class="container footer-inner">
      <!-- Typographic architecture, not a watermark: the house name set very
           large and barely above the black, sitting behind the closing rows.
           It lives inside the container so it can be sized off the content
           grid rather than the viewport, which is what keeps the whole word
           on screen at every width. Decorative, so it stays out of the
           accessibility tree. -->
      <span class="footer-wordmark" aria-hidden="true">Sundarbans</span>

      <div class="footer-grid">
        <!-- ── Brand ────────────────────────────────────────────────── -->
        <div class="fbrand">
          <div class="flogo">
            <span class="flogo-ring">
              <img
                src="https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911356/sundarbans/src/assets/LOGO.jpg"
                alt="Sundarbans House logo"
                class="flogo-img"
              />
            </span>
            <span class="flogo-text">
              <span class="fbrand-name">SUNDARBANS</span>
              <span class="fbrand-sub">IIT Madras BS Degree</span>
            </span>
          </div>
          <p class="ftagline">Empowering minds, building futures — one student at a time.</p>
          <router-link to="/community" class="fcta">
            <span>Join the House</span>
            <ArrowRight :size="15" :stroke-width="2.2" />
          </router-link>
        </div>

        <!-- ── Link columns ─────────────────────────────────────────── -->
        <nav class="flinks" aria-label="Quick links">
          <h2 class="fcol-title">Quick Links</h2>
          <router-link to="/about">About Us</router-link>
          <router-link to="/teams">Our Teams</router-link>
          <router-link to="/events">Events</router-link>
          <router-link to="/contact">Contact</router-link>
        </nav>

        <nav class="flinks" aria-label="Resources">
          <h2 class="fcol-title">Resources</h2>
          <router-link to="/study">Study Corner</router-link>
          <router-link to="/exam-cities">Exam Cities</router-link>
          <router-link to="/meetups">Meetups</router-link>
          <router-link to="/leaderboard">Leaderboard</router-link>
          <router-link to="/community">Communities</router-link>
          <router-link to="/lounge">Members Lounge</router-link>
        </nav>

        <!-- Plain editorial links, no card around the mark. -->
        <nav class="flinks fconnect" aria-label="Social">
          <h2 class="fcol-title">Connect</h2>
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path :d="s.path" />
            </svg>
            <span>{{ s.label }}</span>
          </a>
        </nav>
      </div>

      <!-- ── Closing / newsletter ───────────────────────────────────── -->
      <div class="fclose">
        <div class="fclose-copy">
          <h2 class="fcol-title">Stay Connected</h2>
          <p>Get the latest news and events from Sundarbans House.</p>
        </div>
        <form class="fsubscribe" @submit.prevent="subscribe">
          <label class="sr-only" for="footer-email">Email for newsletter</label>
          <input
            id="footer-email"
            v-model="email"
            type="email"
            class="fsubscribe-input"
            placeholder="Enter your email"
          />
          <button type="submit" class="fsubscribe-go" aria-label="Subscribe to newsletter">
            <ArrowRight :size="17" :stroke-width="2.2" />
          </button>
        </form>
      </div>

      <!-- ── Colophon ───────────────────────────────────────────────── -->
      <div class="footer-bottom">
        <p class="fiit">
          <img
            src="https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911353/sundarbans/src/assets/IITM-Logo.png"
            alt=""
            aria-hidden="true"
            class="fiit-logo"
          />
          IIT Madras Affiliated
        </p>
        <div class="fbl">
          <span class="fcopy">© 2026 Sundarbans House WebOps Team. All Rights Reserved.</span>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <router-link to="/contact">Contact</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

const email = ref('');
function subscribe() {
  if (email.value) {
    alert('Thanks for subscribing!');
    email.value = '';
  }
}

// Lucide carries no brand marks, so these three stay as inline paths.
const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/sundarbans-iitm/',
    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sundarbansiitm/',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@sundarbansiitm',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
];

// The footer is mounted globally, outside any view, so it cannot rely on a
// view's useScrollReveal() call — some routes never make one. One local
// observer, disconnected as soon as it has fired.
const footerEl = ref(null);
const revealed = ref(false);
let observer = null;

onMounted(() => {
  if (typeof IntersectionObserver !== 'function') {
    revealed.value = true;
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      revealed.value = true;
      observer?.disconnect();
      observer = null;
    },
    { threshold: 0.08 }
  );
  observer.observe(footerEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>
