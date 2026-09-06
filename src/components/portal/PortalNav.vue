<template>
  <!-- ══ DESKTOP / TABLET — a hairline shelf, not a bar ══════════════════
       The portal header carries three things and nothing else: where you
       are (the crest), where you can go (six words), and who you are (the
       account control). The active item is marked by a short gold rule
       under the word: no pill, no fill, no glow. -->
  <header class="pnav" :class="{ 'is-scrolled': scrolled }">
    <div class="pnav__inner">
      <router-link to="/lounge" class="pnav__brand" aria-label="Members Lounge home">
        <img class="pnav__crest" :src="brand.crest" alt="" width="34" height="34" />
        <span class="pnav__brand-text">
          <span class="pnav__brand-name">Sundarbans</span>
          <span class="pnav__brand-sub">Members Lounge</span>
        </span>
      </router-link>

      <nav class="pnav__links" aria-label="Members portal">
        <router-link
          v-for="item in items"
          :key="item.id"
          :to="item.to"
          class="pnav__link"
          :class="{ 'is-active': activeId === item.id }"
          :aria-current="activeId === item.id ? 'page' : undefined"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="pnav__account" ref="accountEl">
        <button
          type="button"
          class="pnav__account-btn"
          :class="{ 'is-open': accountOpen }"
          :aria-expanded="accountOpen"
          aria-haspopup="true"
          @click="accountOpen = !accountOpen"
        >
          <span class="pnav__avatar" aria-hidden="true">{{ initials }}</span>
          <span class="pnav__account-name">{{ displayName }}</span>
          <ChevronDown class="pnav__chev" :size="14" :stroke-width="1.8" aria-hidden="true" />
        </button>

        <transition name="pnav-pop">
          <div v-if="accountOpen" class="pnav__panel" role="menu">
            <div class="pnav__panel-id">
              <span class="pnav__avatar pnav__avatar--lg" aria-hidden="true">{{ initials }}</span>
              <span class="pnav__panel-text">
                <span class="pnav__panel-name">{{ displayName }}</span>
                <span class="pnav__panel-email">{{ email }}</span>
              </span>
            </div>
            <span class="pnav__panel-role">House Member</span>
            <div class="pnav__panel-actions">
              <router-link to="/" class="p-btn p-btn--ghost p-btn--small" @click="close">
                Public site
              </router-link>
              <button
                type="button"
                class="p-btn p-btn--ghost p-btn--small pnav__logout"
                @click="onLogout"
              >
                <LogOut :size="13" :stroke-width="1.8" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>

  <!-- ══ MOBILE — a bottom bar, within reach of a thumb ══════════════════
       Teleported to <body> on purpose. The router's page transition puts a
       `transform` on the view root for the length of the animation, and a
       transformed ancestor becomes the containing block for `position: fixed`
       descendants: left inside the view, this bar would detach from the
       viewport and slide down the document on every navigation into the
       portal. Rendered at the body, no ancestor can ever capture it. -->
  <Teleport to="body">
    <nav class="ptab" aria-label="Members portal">
      <router-link
        v-for="item in items"
        :key="item.id"
        :to="item.to"
        class="ptab__item"
        :class="{ 'is-active': activeId === item.id }"
        :aria-current="activeId === item.id ? 'page' : undefined"
      >
        <component :is="item.icon" :size="19" :stroke-width="1.7" aria-hidden="true" />
        <span>{{ item.short }}</span>
      </router-link>
    </nav>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  CalendarDays,
  ChevronDown,
  Home,
  BookOpen,
  LayoutGrid,
  LogOut,
  MessagesSquare,
  Trophy,
} from 'lucide-vue-next';
import { brand } from '../navigation/navigation.config.js';

defineProps({
  displayName: { type: String, default: 'Member' },
  email: { type: String, default: '' },
  initials: { type: String, default: '·' },
});

const emit = defineEmits(['logout']);

/**
 * Mirrors the lounge section ids exactly. `top` is the hero, which has no
 * anchor of its own — the plain /lounge route is the way back to it.
 */
const items = [
  { id: 'top', label: 'Home', short: 'Home', to: '/lounge', icon: Home },
  { id: 'events', label: 'Events', short: 'Events', to: '/lounge#events', icon: CalendarDays },
  { id: 'reading', label: 'Reading', short: 'Reading', to: '/lounge#reading', icon: BookOpen },
  {
    id: 'community',
    label: 'Community',
    short: 'House',
    to: '/lounge#community',
    icon: MessagesSquare,
  },
  {
    id: 'recognition',
    label: 'Leaderboard',
    short: 'Ranks',
    to: '/lounge#recognition',
    icon: Trophy,
  },
  { id: 'dashboard', label: 'Dashboard', short: 'You', to: '/dashboard', icon: LayoutGrid },
];

const route = useRoute();
const accountOpen = ref(false);
/** Off the top of the page the header firms up its edge. Nothing else moves. */
const scrolled = ref(false);
const accountEl = ref(null);
const visibleSection = ref('top');

/**
 * On the dashboard the answer is fixed; on the lounge the indicator follows
 * reading position, so the header always names the room the member is in.
 */
const activeId = computed(() => {
  if (route.path === '/dashboard') return 'dashboard';
  return visibleSection.value;
});

let observer = null;

/**
 * Assigned straight from the listener rather than deferred to a frame: the
 * work is one comparison, and a `requestAnimationFrame` hop would leave the
 * header in its at-rest state whenever frames are not being produced (a
 * background tab, a hidden view), which is exactly when the value is read
 * again on return. Vue coalesces the DOM write either way.
 */
function onScroll() {
  const next = window.scrollY > 24;
  if (next !== scrolled.value) scrolled.value = next;
}

function trackSections() {
  observer?.disconnect();
  if (route.path !== '/lounge' || typeof IntersectionObserver === 'undefined') return;

  const ids = items.filter((i) => i.id !== 'top' && i.id !== 'dashboard').map((i) => i.id);
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleSection.value = entry.target.id;
      }
      // Above the first tracked section the member is still in the hero.
      if (window.scrollY < 120) visibleSection.value = 'top';
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

function close() {
  accountOpen.value = false;
}

function onLogout() {
  close();
  emit('logout');
}

function onDocumentClick(event) {
  if (!accountOpen.value) return;
  if (!accountEl.value?.contains(event.target)) close();
}

function onKeydown(event) {
  if (event.key === 'Escape') close();
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // The lounge sections mount with the view, one tick after this component.
  requestAnimationFrame(trackSections);
});

watch(
  () => route.path,
  () => {
    close();
    requestAnimationFrame(trackSections);
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('scroll', onScroll);
  observer?.disconnect();
});
</script>

<style scoped>
/* ── Desktop shelf ─────────────────────────────────────────────────────
   Sticky and opaque. A translucent header would let the grid canvas slide
   underneath the words while the page scrolls. */
.pnav {
  position: sticky;
  top: 0;
  z-index: 60;
  background: var(--p-ground-deep);
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration-button, 520ms) var(--p-ease);
}
/* Scrolled, the header states its edge. No blur, no shadow, no change of
   height: it should read as attached to the portal, not as a floating bar. */
.pnav.is-scrolled {
  border-bottom-color: var(--p-line);
}
.pnav__inner {
  width: 100%;
  max-width: var(--p-shell);
  margin-inline: auto;
  padding-inline: var(--p-gutter);
  height: 4.25rem;
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
}
.pnav__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  flex: none;
}
.pnav__crest {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--p-line-card);
  object-fit: cover;
}
.pnav__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.pnav__brand-name {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--p-ink);
}
.pnav__brand-sub {
  font-size: 0.5625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}

.pnav__links {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.6vw, 1.6rem);
  margin-inline: auto;
}
.pnav__link {
  position: relative;
  padding: 0.4rem 0;
  font-size: 0.8125rem;
  letter-spacing: 0.1em;
  color: var(--p-ink-muted);
  text-decoration: none;
  transition: color var(--duration-link, 340ms) var(--p-ease);
}
.pnav__link:hover {
  color: var(--p-ink);
}
/* The whole indicator: a 14px gold rule, drawn from the centre. */
.pnav__link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -0.2rem;
  width: 14px;
  height: 1px;
  background: var(--p-gold);
  transform: translateX(-50%) scaleX(0);
  transition: transform var(--duration-link, 340ms) var(--p-ease);
}
.pnav__link.is-active {
  color: var(--p-gold-light);
}
.pnav__link.is-active::after {
  transform: translateX(-50%) scaleX(1);
}

.pnav__account {
  position: relative;
  flex: none;
}
.pnav__account-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.6rem 0.4rem 0.4rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--p-radius);
  color: var(--p-ink-muted);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    border-color var(--duration-link, 340ms) var(--p-ease),
    color var(--duration-link, 340ms) var(--p-ease);
}
.pnav__account-btn:hover,
.pnav__account-btn.is-open {
  border-color: var(--p-line-card);
  color: var(--p-ink);
}
.pnav__avatar {
  display: grid;
  place-items: center;
  width: 1.875rem;
  height: 1.875rem;
  flex: none;
  border-radius: 50%;
  border: 1px solid var(--p-line-strong);
  background: var(--p-gold-wash);
  color: var(--p-gold-light);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.pnav__avatar--lg {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.8125rem;
}
.pnav__account-name {
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pnav__chev {
  color: var(--p-ink-faint);
}

.pnav__panel {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: min(19rem, calc(100vw - 2rem));
  padding: 1.1rem;
  background: var(--p-surface);
  border: 1px solid var(--p-line-card);
  border-radius: var(--p-radius);
  box-shadow: var(--shadow-lg);
}
.pnav__panel-id {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.pnav__panel-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.pnav__panel-name {
  font-size: 0.9375rem;
  color: var(--p-ink);
}
.pnav__panel-email {
  font-size: 0.75rem;
  color: var(--p-ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
}
.pnav__panel-role {
  display: block;
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--p-line);
  font-size: 0.625rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}
.pnav__panel-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.9rem;
}
.pnav__panel-actions > * {
  flex: 1;
}
.pnav__logout:hover {
  border-color: rgba(214, 122, 122, 0.5);
  color: #dd9a9a;
}

.pnav-pop-enter-active,
.pnav-pop-leave-active {
  transition:
    opacity 260ms var(--p-ease),
    transform 260ms var(--p-ease);
}
.pnav-pop-enter-from,
.pnav-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Mobile bar ───────────────────────────────────────────────────────── */
.ptab {
  display: none;
}

@media (max-width: 900px) {
  .pnav__links {
    display: none;
  }
  .pnav__account-name {
    display: none;
  }
  .pnav__brand-sub {
    display: none;
  }
  .pnav__account {
    margin-left: auto;
  }

  .ptab {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 60;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    background: var(--p-ground-deep);
    border-top: 1px solid var(--p-line);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  .ptab__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    min-height: 3.5rem;
    padding: 0.5rem 0.15rem;
    color: var(--p-ink-faint);
    text-decoration: none;
    font-size: 0.5625rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color var(--duration-link, 340ms) var(--p-ease);
  }
  .ptab__item.is-active {
    color: var(--p-gold-light);
  }
  /* Same 14px gold rule as the desktop header, moved to the top edge. */
  .ptab__item.is-active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 1px;
    background: var(--p-gold);
  }
}
</style>
