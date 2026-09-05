<template>
  <div class="video-bg-mode">
    <!-- HERO — a cinematic opening frame, not a UI panel over a video. -->
    <section class="hero-section" id="home-hero">
      <!-- Decorative background: one clip that plays through exactly once and
           then holds its final frame. aria-hidden + no controls — it carries
           no information, so it is out of the accessibility tree. Nothing
           here is scroll-driven: no scrub, no parallax, no frame sequence. -->
      <div class="hero-bg">
        <video
          v-if="playVideo"
          ref="heroVideo"
          class="hero-bg-video"
          :autoplay="!alreadyPlayed"
          muted
          playsinline
          preload="metadata"
          disablepictureinpicture
          poster="/assets/video/home-poster.webp"
          aria-hidden="true"
          tabindex="-1"
          @play="syncVideo"
          @ended="onEnded"
          @loadedmetadata="onMetadata"
        >
          <source src="/assets/video/home-1080.webm" type="video/webm" />
          <source src="/assets/video/home-1080.mp4" type="video/mp4" />
        </video>
        <!-- Save-Data / very slow link: the poster alone carries the hero. -->
        <div v-else class="hero-bg-still" aria-hidden="true"></div>
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-copy">
          <p class="hero-eyebrow animate-in" style="--delay: 0.25s">Welcome to</p>
          <h1 class="hero-title">
            <span class="hero-title-main animate-in" style="--delay: 0.42s">Sundarbans</span>
            <span class="hero-title-accent animate-in" style="--delay: 0.58s">House</span>
          </h1>
          <p class="hero-subtitle animate-in" style="--delay: 0.78s">
            Empowering minds, building futures. A vibrant student community driving excellence
            across <em>India's top online degree programme</em>.
          </p>
          <div class="hero-actions animate-in" style="--delay: 0.94s">
            <router-link to="/community" class="btn-hero-primary">
              <span>Join the Community</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </router-link>
            <router-link to="/about" class="btn-hero-secondary">
              <span>Explore More</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
          <div class="hero-stats animate-in" style="--delay: 1.1s">
            <div class="hero-stat">
              <div class="stat-number" data-count="5170">0</div>
              <div class="stat-label">Active Members</div>
            </div>
            <div class="stat-div"></div>
            <div class="hero-stat">
              <div class="stat-number" data-count="500">0</div>
              <div class="stat-label">Events Hosted</div>
            </div>
            <div class="stat-div"></div>
            <div class="hero-stat">
              <div class="stat-number" data-count="40">0</div>
              <div class="stat-label">Cities Connected</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT SECTION -->
    <section class="section about-section rs" id="home-about">
      <div class="container">
        <div class="about-grid">
          <div class="about-text-col">
            <div class="section-tag">Who We Are</div>
            <h2 class="section-title-xl">About <span class="tg">Sundarbans</span><br />House</h2>
            <p class="desc">
              Sundarbans House is a vibrant student community under the IIT Madras BS Degree
              Programme, fostering collaboration, leadership, and peer learning across India.
            </p>
            <p class="desc">
              We believe in the power of community — that learning together, supporting each other,
              and growing as one unit makes every individual stronger.
            </p>
            <div class="about-highlights">
              <div class="hi" v-for="h in aboutHighlights" :key="h.title">
                <div class="hi-icon">
                  <component :is="h.icon" :size="20" :stroke-width="1.8" />
                </div>
                <div>
                  <strong>{{ h.title }}</strong>
                  <p>{{ h.desc }}</p>
                </div>
              </div>
            </div>
            <router-link to="/about" class="learn-link"
              >Learn more about us
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
          <div class="about-img-col">
            <div class="about-img-stack">
              <div class="about-img-main">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80&auto=format&fit=crop"
                  alt="Students collaborating"
                />
              </div>
              <div class="about-img-secondary">
                <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80&auto=format&fit=crop"
                  alt="Study session"
                />
              </div>
              <div class="about-img-badge">
                <div class="ib-num"><Star :size="14" :stroke-width="1.8" /> 4.9</div>
                <div class="ib-label">Community Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section features-section rs">
      <div class="container">
        <div class="sec-hdr">
          <div class="section-tag">Our Offerings</div>
          <h2 class="section-title-xl">Everything you need to <span class="tg">thrive</span></h2>
          <p class="sec-sub">From study resources to community events — we've got you covered</p>
        </div>
        <div class="features-grid">
          <div
            class="fcard rc"
            v-for="(f, i) in features"
            :key="f.title"
            :style="{ '--card-delay': i * 0.12 + 's' }"
          >
            <div class="fcard-img"><img :src="f.img" :alt="f.title" /></div>
            <div class="fcard-body">
              <span class="fcard-num">{{ f.num }}</span>
              <div class="fcard-head">
                <span class="fcard-icon">
                  <component :is="f.icon" :size="18" :stroke-width="1.8" />
                </span>
                <h3>{{ f.title }}</h3>
              </div>
              <p>{{ f.desc }}</p>
              <router-link :to="f.url" class="flink"
                >{{ f.cta }}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA / ACADEMIC -->
    <section class="section cta-section rs" id="home-academics">
      <div class="container">
        <div class="cta-grid">
          <div class="cta-wrap">
            <div class="section-tag">Academic Excellence</div>
            <h2 class="cta-heading">Your Academic<br /><span class="cta-acc">Companion</span></h2>
            <p class="cta-sub">
              From Foundation to BS level, access structured academic resources designed to help you
              succeed. Join thousands of students already excelling.
            </p>
            <div class="cta-acts">
              <router-link to="/study" class="cta-btn-p"
                ><span>Go to Study Corner</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </router-link>
              <router-link to="/contact" class="cta-btn-o">Contact Us</router-link>
            </div>
            <div class="cta-trust">
              <span><Check :size="14" :stroke-width="2.2" /> Free for all members</span>
              <span><Check :size="14" :stroke-width="2.2" /> Updated regularly</span>
              <span><Check :size="14" :stroke-width="2.2" /> Expert-curated</span>
            </div>
          </div>
          <div class="cta-img-col">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop"
              alt="Students learning together"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Module scope — evaluated once per page load, shared by every mount of this
// view. Leaving the homepage unmounts it, so returning builds a brand new
// <video> that would autoplay from zero; this flag is what tells the new one
// the clip has already run. Its lifetime is exactly right: it survives any
// number of route changes and is gone after a genuine reload, which is the
// one case where a fresh play is wanted. (sessionStorage would be wrong —
// that outlives the reload too, and a <script setup> variable would be wrong
// the other way, since that body re-runs on every mount.)
let clipFinished = false;
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import {
  BookOpen,
  Trophy,
  Handshake,
  MapPin,
  Target,
  Globe2,
  Zap,
  Star,
  Check,
} from 'lucide-vue-next';
import { useScrollReveal, useCounters } from '../composables/useAnimations.js';

useScrollReveal();
useCounters();

// Features data — editorial numbered cards (see .fcard-num in style.css)
const features = [
  {
    num: '01',
    icon: BookOpen,
    title: 'Study Resources',
    desc: 'Comprehensive materials curated by toppers for all levels',
    img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80&auto=format&fit=crop',
    url: '/study',
    cta: 'Access Now',
  },
  {
    num: '02',
    icon: Trophy,
    title: 'Events & Competitions',
    desc: 'Hackathons, quizzes, cultural fests and much more',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format&fit=crop',
    url: '/events',
    cta: 'View Events',
  },
  {
    num: '03',
    icon: Handshake,
    title: 'Community',
    desc: 'Connect with 5000+ peers and build lasting friendships',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&auto=format&fit=crop',
    url: '/community',
    cta: 'Join Now',
  },
  {
    num: '04',
    icon: MapPin,
    title: 'City Meetups',
    desc: 'Meet fellow students in your city — Delhi to Bangalore',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format&fit=crop',
    url: '/meetups',
    cta: 'Find Meetups',
  },
];

// About-section highlight icons
const aboutHighlights = [
  {
    icon: Target,
    title: 'Mission-driven',
    desc: 'Empowering every student to achieve their academic goals',
  },
  {
    icon: Globe2,
    title: 'Nation-wide reach',
    desc: 'Members from 40+ cities across India',
  },
  {
    icon: Zap,
    title: 'Always active',
    desc: 'Events, study sessions and discussions every week',
  },
];

// ── Hero background clip ────────────────────────────────────────────────
// The clip is decorative motion with three rules:
//   1. It plays through exactly once and then holds its final decoded frame.
//      A paused/ended <video> keeps painting that frame, so the hero never
//      falls back to a black box and never needs a second still asset.
//   2. Nothing restarts it. Once `ended` has fired we never call play() and
//      never touch currentTime, so scrolling back to the top, an internal
//      state change or a re-render leaves the last frame exactly where it is.
//   3. It only decodes while it can actually be seen. The layer is fixed, so
//      without this it would keep compositing a full-viewport video behind
//      every opaque section below the hero — pure scroll cost for nothing.
const heroVideo = ref(null);

// Save-Data or a genuinely slow link: skip the clip entirely and let the
// poster carry the hero. One read of the Network Information API at setup,
// no listeners, no adaptive machinery. Reduced motion still loads the video
// (it is held on its first frame below) because that costs no motion.
function shouldPlayVideo() {
  const conn = typeof navigator !== 'undefined' ? navigator.connection : null;
  if (!conn) return true;
  if (conn.saveData) return false;
  return !/(^|-)(slow-2g|2g)$/.test(conn.effectiveType || '');
}
const playVideo = ref(shouldPlayVideo());

// Read once per mount from the module-scope flag above. Flipping it mid-mount
// would only be able to interrupt the clip that is currently running.
const alreadyPlayed = clipFinished;

function onEnded() {
  clipFinished = true;
}

function onMetadata() {
  const video = heroVideo.value;
  if (!video || !alreadyPlayed) return;
  // Seek to (not play up to) the end, so this mount opens on the frame the
  // previous one finished on. Backing off a hair keeps it inside the last
  // decodable frame rather than landing exactly on the boundary.
  video.currentTime = Math.max(0, (video.duration || 0) - 0.05);
}

let motionQuery = null;
let heroObserver = null;
let heroVisible = true;

// Called on mount, on every `play`, and whenever either input changes. The
// `play` hook is what makes reduced motion work: autoplay starts after mount,
// so a mount-time check alone would find an already-paused element, do
// nothing, and then let the clip run. Re-checking as playback begins pauses
// it on its first decoded frame instead.
function syncVideo() {
  const video = heroVideo.value;
  // Two terminal states, both meaning "the final frame is already on screen":
  // this mount played the clip out, or an earlier one did and onMetadata
  // parked us there. Neither has anything left to drive.
  if (!video || video.ended || alreadyPlayed) return;
  if (motionQuery?.matches || !heroVisible) {
    if (!video.paused) video.pause();
  } else if (video.paused) {
    // play() rejects when autoplay is blocked; the poster is still painted
    // underneath, so there is nothing to recover from.
    video.play().catch(() => {});
  }
}

onMounted(() => {
  document.body.classList.add('video-bg-mode');
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', syncVideo);

  const hero = document.getElementById('home-hero');
  if (hero && typeof IntersectionObserver === 'function') {
    heroObserver = new IntersectionObserver(
      (entries) => {
        heroVisible = entries.some((e) => e.isIntersecting);
        syncVideo();
      },
      // No threshold work and no scroll listener: the observer fires twice per
      // pass over the hero boundary and nothing in between.
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }
  syncVideo();
});

onUnmounted(() => {
  document.body.classList.remove('video-bg-mode');
  motionQuery?.removeEventListener('change', syncVideo);
  motionQuery = null;
  heroObserver?.disconnect();
  heroObserver = null;
});
</script>

<style scoped>
.fcard p,
.cta-sub {
  color: var(--text2);
}

.hi p {
  color: var(--text2);
}

/* Homepage tone rhythm: Hero A · About B · Offerings A · Academic B ·
   Footer black. Only --color-bg-black and --color-bg-forest, alternating. */
.cta-section {
  background: var(--color-bg-forest);
}

/* ===== CTA / ACADEMIC ===== */
.cta-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
}

.cta-img-col {
  border-radius: var(--rad2);
  overflow: hidden;
  aspect-ratio: 4/5;
}

.cta-img-col img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 900px) {
  .cta-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .cta-img-col {
    order: -1;
    aspect-ratio: 16/9;
  }
}
</style>
