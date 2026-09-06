<template>
  <div class="app-shell" :class="{ 'app-shell--railed': !isPortalRoute }">
    <!-- PRELOADER
         An institutional title card, not a spinner. The crest is on screen from
         the first frame and does not move again: the only motion is the legend
         turning slowly around it and the hairline filling underneath. Nothing
         reveals itself, nothing pops, and the card leaves by fading out.
         There is no halo, no glow and no pulse. -->
    <div
      id="preloader"
      v-if="loading"
      :style="{ opacity: preloaderOpacity }"
      role="status"
      aria-live="polite"
      aria-label="Loading Sundarbans House"
    >
      <div class="preloader-inner">
        <div class="preloader-crest">
          <!-- Two concentric rules and the orbiting legend, all one SVG so the
               ring and the text can never drift out of register. -->
          <svg class="preloader-orbit" viewBox="0 0 240 240" aria-hidden="true">
            <defs>
              <path id="orbitPath" d="M 120,120 m -96,0 a 96,96 0 1,1 192,0 a 96,96 0 1,1 -192,0" />
            </defs>
            <circle class="preloader-ring preloader-ring--outer" cx="120" cy="120" r="112" />
            <circle class="preloader-ring preloader-ring--inner" cx="120" cy="120" r="62" />
            <g class="preloader-orbit-text">
              <text>
                <textPath href="#orbitPath" startOffset="0%">
                  SUNDARBANS HOUSE · IIT MADRAS BS DEGREE · SUNDARBANS HOUSE · IIT MADRAS BS DEGREE
                  ·
                </textPath>
              </text>
            </g>
          </svg>

          <!-- Exactly one mark, never two. The crest is simply present: it does
               not fade in, scale in or arrive over anything, so nothing reveals
               itself part-way through the sequence. The monogram is a genuine
               substitute — it renders only if the artwork fails to load — not a
               layer sitting underneath waiting to be covered. -->
          <span class="preloader-logo">
            <img
              v-if="!showFallback"
              src="https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911356/sundarbans/src/assets/LOGO.jpg"
              alt=""
              class="preloader-logo-img"
              fetchpriority="high"
              @error="showFallback = true"
            />
            <span v-else class="preloader-logo-letter" aria-hidden="true">S</span>
          </span>
        </div>

        <div class="preloader-bar" aria-hidden="true">
          <span class="preloader-fill" :style="{ width: fillWidth }"></span>
        </div>
        <p class="preloader-text">Loading Sundarbans…</p>
      </div>
    </div>

    <!-- SEARCH OVERLAY -->
    <div class="search-overlay" :class="{ open: searchOpen }" @click.self="searchOpen = false">
      <div class="search-box">
        <div class="search-input-row">
          <Search :size="18" :stroke-width="2" />
          <input
            id="searchInput"
            type="text"
            v-model="searchQuery"
            @input="filterSearch"
            placeholder="Search pages, resources, events..."
            aria-label="Search pages, resources, events"
            ref="searchInputEl"
          />
          <button
            type="button"
            class="search-close-btn"
            @click="searchOpen = false"
            aria-label="Close search"
          >
            <X :size="16" :stroke-width="2.2" />
          </button>
        </div>
        <div class="search-hint">Press Ctrl+K to open • Esc to close</div>
        <div id="searchResults">
          <template v-if="!searchQuery.trim()">
            <div class="search-empty">Start typing to search...</div>
          </template>
          <template v-else-if="filteredPages.length === 0">
            <div class="search-empty">No results found for "{{ searchQuery }}"</div>
          </template>
          <template v-else>
            <router-link
              v-for="p in filteredPages"
              :key="p.url"
              :to="p.url"
              class="search-result-item"
              @click="searchOpen = false"
            >
              <div class="sri-icon"><component :is="p.icon" :size="17" :stroke-width="1.8" /></div>
              <div>
                <div class="sri-title">{{ p.title }}</div>
                <div class="sri-desc">{{ p.desc }}</div>
              </div>
            </router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- BACK TO TOP -->
    <button
      id="backToTop"
      :class="{ visible: showBackToTop, 'is-portal': isPortalRoute }"
      @click="scrollTop"
      aria-label="Back to top"
    >
      <ChevronUp :size="18" :stroke-width="2.5" />
    </button>

    <!-- PRIMARY NAVIGATION — vertical rail (desktop) / drawer (mobile) -->
    <VerticalNavigation />

    <!-- ROUTER VIEW
         Deliberately NOT wrapped in <transition mode="out-in">.

         That combination made mounting the destination conditional on the
         outgoing view finishing its animation, and Vue drives both halves of a
         transition from requestAnimationFrame: it removes `*-enter-from` and
         arms the end-detection inside `nextFrame`. When no animation frames
         are delivered (a backgrounded or occluded tab, a heavily janked one),
         the leave never resolves, the incoming component is never created, and
         the route renders nothing at all until a reload, which works only
         because a fresh load has no outgoing view to wait for.

         So the swap is now plain: the destination mounts with the navigation,
         and the entrance is a CSS animation on the wrapper. If frames are
         starved the animation simply does not play and the page is readable
         anyway, because the resting state is the visible one.

         The key is the path, not the full path, so moving between hash
         anchors on one route does not replay the entrance. -->
    <router-view v-slot="{ Component, route }">
      <div :key="route.path" class="page-swap">
        <component :is="Component" />
      </div>
    </router-view>

    <!-- GLOBAL FOOTER -->
    <AppFooter v-if="!isPortalRoute" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import {
  Search,
  X,
  ChevronUp,
  Home,
  BookOpen,
  Trophy,
  Images,
  MapPin,
  Info,
  Handshake,
  UsersRound,
  Mail,
  Share2,
  LockKeyhole,
} from 'lucide-vue-next';
import AppFooter from './components/AppFooter.vue';
import VerticalNavigation from './components/navigation/VerticalNavigation.vue';
import { isRailHiddenFor } from './components/navigation/navigation.config.js';

const route = useRoute();

// One source of truth with the navigation config: the member portal — its
// entrance and both rooms — ships its own header and footer, so neither the
// rail, the reserved gutter nor the public footer applies there.
const isPortalRoute = computed(() => isRailHiddenFor(route.path));

// --- PRELOADER ---
const loading = ref(true);
const preloaderOpacity = ref('1');
const fillWidth = ref('0%');
const showFallback = ref(false);

onMounted(() => {
  fillWidth.value = '100%';
  setTimeout(() => {
    preloaderOpacity.value = '0';
    setTimeout(() => {
      loading.value = false;
    }, 700);
  }, 1200);
});

// --- BACK TO TOP ---
// The navigation no longer reads scroll position (the rail is a fixed
// architectural element, not a bar that changes with the hero), so this is all
// that is left of the old scroll-state machinery.
const showBackToTop = ref(false);
let scrollTicking = false;
function applyScrollState() {
  showBackToTop.value = window.scrollY > 400;
  scrollTicking = false;
}
function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(applyScrollState);
}
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- SEARCH ---
const searchOpen = ref(false);
const searchQuery = ref('');
const searchInputEl = ref(null);
// Icon components, not emoji: rendered dynamically via <component :is="p.icon" />
const pages = [
  { title: 'Home', url: '/', desc: 'Welcome to Sundarbans House', icon: Home },
  {
    title: 'Study Corner',
    url: '/study',
    desc: 'Academic resources and materials',
    icon: BookOpen,
  },
  {
    title: 'Events',
    url: '/events',
    desc: 'Upcoming events, workshops and competitions',
    icon: Trophy,
  },
  {
    title: 'Gallery',
    url: '/gallery',
    desc: 'Photos and memories from our community',
    icon: Images,
  },
  {
    title: 'Meetups',
    url: '/meetups',
    desc: 'City meetups across India',
    icon: MapPin,
  },
  {
    title: 'About',
    url: '/about',
    desc: 'About Sundarbans House and our mission',
    icon: Info,
  },
  {
    title: 'Community',
    url: '/community',
    desc: 'Tech, Cultural and Academic communities',
    icon: Handshake,
  },
  {
    title: 'Teams',
    url: '/teams',
    desc: 'Meet our leadership and team members',
    icon: UsersRound,
  },
  {
    title: 'Contact',
    url: '/contact',
    desc: 'Get in touch with us',
    icon: Mail,
  },
  {
    title: 'Social Media',
    url: '/social',
    desc: 'Follow us on social platforms',
    icon: Share2,
  },
  {
    title: 'Members Lounge',
    url: '/lounge',
    desc: 'Login to members area',
    icon: LockKeyhole,
  },
];
const filteredPages = computed(() => {
  if (!searchQuery.value.trim()) return [];
  return pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
function filterSearch() {}
function openSearch() {
  searchOpen.value = true;
  nextTick(() => searchInputEl.value?.focus());
}

// Keyboard shortcuts
function onKeyDown(e) {
  if (e.key === 'Escape') {
    searchOpen.value = false;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('scroll', onScroll, { passive: true });
  applyScrollState();
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('scroll', onScroll);
});
</script>

<style>
/* The page transition ("page-turn") and every navigation token live in
   src/assets/navigation.css, next to the component that defines the
   interaction language they belong to. */
</style>
