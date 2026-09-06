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
          <router-link to="/documents">Documents</router-link>
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
          <!-- Privacy and Terms stood here as href="#". Under hash routing that
               is not an inert link: it rewrites the hash and drops the reader
               onto the homepage from whatever page they were reading. Put them
               back as router-links once the two pages exist. -->
          <router-link to="/contact">Contact</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import { HOUSE_CHANNELS } from '../data/council.js';

const email = ref('');
function subscribe() {
  if (email.value) {
    alert('Thanks for subscribing!');
    email.value = '';
  }
}

// Lucide carries no brand marks, so the glyphs live in the council data
// module. The list itself is shared with the Contact page: adding a channel
// there adds it in both places rather than in two hand-copied arrays.
const socials = HOUSE_CHANNELS;

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
