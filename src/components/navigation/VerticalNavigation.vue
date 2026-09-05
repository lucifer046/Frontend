<template>
  <!-- Members area ships its own header; the rail stands down there. -->
  <template v-if="!hidden">
    <!-- ================= DESKTOP RAIL ================= -->
    <nav
      v-if="isDesktop"
      class="vnav"
      :class="{ 'is-open': expanded }"
      aria-label="Primary"
      @pointerenter="onRailEnter"
      @pointerleave="onRailLeave"
      @focusin="show()"
      @focusout="onFocusOut"
    >
      <div class="vnav__inner">
        <!-- ── Crest ─────────────────────────────────────────────── -->
        <router-link to="/" class="vnav__brand">
          <span class="vnav__crest">
            <img :src="brand.crest" alt="" aria-hidden="true" />
          </span>
          <span class="vnav__brand-text">
            <span class="vnav__brand-name">{{ brand.name }}</span>
            <span class="vnav__brand-sub">{{ brand.subtitle }}</span>
          </span>
        </router-link>

        <span class="vnav__rule" aria-hidden="true"></span>

        <!-- ── Links ─────────────────────────────────────────────── -->
        <div
          class="vnav__nav"
          @pointerenter="onPointerEnter"
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <div class="vnav__track">
            <span class="vnav__spine" aria-hidden="true"></span>

            <!-- One indicator for the whole list; it translates between items
                 and stretches slightly on the way, like a thin ribbon. -->
            <span
              class="vnav__indicator"
              :class="{ 'is-moving': indicatorMoving, 'is-idle': activeIndex < 0 }"
              :style="{ '--active-index': Math.max(activeIndex, 0) }"
              aria-hidden="true"
            >
              <span class="vnav__indicator-dot"></span>
            </span>

            <ul ref="listEl" class="vnav__list">
              <li
                v-for="(item, i) in navigationItems"
                :key="item.id"
                class="vnav__item"
                :style="{ '--wave': `${offsets[i]}px`, '--stagger': `${i * 22}ms` }"
              >
                <router-link
                  :to="item.route"
                  class="vnav__link"
                  :class="{ 'is-active': i === activeIndex }"
                  :aria-current="isRouteActive(item, route.path) ? 'page' : undefined"
                >
                  <span class="vnav__icon">
                    <component :is="item.icon" :size="21" :stroke-width="1.7" />
                  </span>
                  <span class="vnav__label">
                    <span class="vnav__text">{{ item.label }}</span>
                  </span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- ── Utilities ─────────────────────────────────────────── -->
        <div class="vnav__actions">
          <span class="vnav__rule" aria-hidden="true"></span>
          <ul class="vnav__list vnav__list--actions">
            <li v-for="(item, i) in actionItems" :key="item.id" class="vnav__item">
              <a
                v-if="item.external"
                :href="item.href"
                class="vnav__link vnav__link--action"
                :style="{ '--stagger': `${i * 22}ms` }"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="vnav__icon">
                  <component :is="item.icon" :size="19" :stroke-width="1.7" />
                </span>
                <span class="vnav__label">
                  <span class="vnav__text">{{ item.label }}</span>
                  <ArrowUpRight class="vnav__ext" :size="13" :stroke-width="2" />
                </span>
              </a>
              <router-link
                v-else
                :to="item.route"
                class="vnav__link vnav__link--action"
                :class="{ 'is-active': isRouteActive(item, route.path) }"
                :style="{ '--stagger': `${i * 22}ms` }"
                :aria-current="isRouteActive(item, route.path) ? 'page' : undefined"
              >
                <span class="vnav__icon">
                  <component :is="item.icon" :size="19" :stroke-width="1.7" />
                </span>
                <span class="vnav__label">
                  <span class="vnav__text">{{ item.label }}</span>
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- ================= MOBILE ================= -->
    <template v-else>
      <header class="mnav">
        <router-link to="/" class="mnav__brand">
          <span class="vnav__crest">
            <img :src="brand.crest" alt="" aria-hidden="true" />
          </span>
          <span class="mnav__brand-text">
            <span class="vnav__brand-name">{{ brand.name }}</span>
            <span class="vnav__brand-sub">{{ brand.subtitle }}</span>
          </span>
        </router-link>

        <button
          ref="toggleEl"
          type="button"
          class="mnav__toggle"
          :aria-expanded="drawerOpen"
          aria-controls="vnav-drawer"
          :aria-label="drawerOpen ? 'Close menu' : 'Open menu'"
          @click="drawerOpen = !drawerOpen"
        >
          <Menu v-if="!drawerOpen" :size="20" :stroke-width="1.9" />
          <X v-else :size="20" :stroke-width="1.9" />
        </button>
      </header>

      <div
        class="mnav__scrim"
        :class="{ 'is-open': drawerOpen }"
        aria-hidden="true"
        @click="drawerOpen = false"
      ></div>

      <nav
        id="vnav-drawer"
        ref="drawerEl"
        class="mnav__drawer"
        :class="{ 'is-open': drawerOpen }"
        :inert="!drawerOpen || undefined"
        aria-label="Primary"
      >
        <div class="mnav__drawer-head">
          <span class="vnav__crest">
            <img :src="brand.crest" alt="" aria-hidden="true" />
          </span>
          <span class="mnav__brand-text">
            <span class="vnav__brand-name">{{ brand.name }}</span>
            <span class="vnav__brand-sub">{{ brand.subtitle }}</span>
          </span>
        </div>

        <ul class="mnav__list">
          <li v-for="item in navigationItems" :key="item.id">
            <router-link
              :to="item.route"
              class="mnav__link"
              :class="{ 'is-active': isRouteActive(item, route.path) }"
              :aria-current="isRouteActive(item, route.path) ? 'page' : undefined"
              @click="drawerOpen = false"
            >
              <component :is="item.icon" :size="19" :stroke-width="1.7" />
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>

        <div class="mnav__actions">
          <template v-for="item in actionItems" :key="item.id">
            <a
              v-if="item.external"
              :href="item.href"
              class="mnav__link mnav__link--action"
              target="_blank"
              rel="noopener noreferrer"
              @click="drawerOpen = false"
            >
              <component :is="item.icon" :size="18" :stroke-width="1.7" />
              <span>{{ item.label }}</span>
              <ArrowUpRight class="vnav__ext" :size="13" :stroke-width="2" />
            </a>
            <router-link
              v-else
              :to="item.route"
              class="mnav__link mnav__link--action"
              :class="{ 'is-active': isRouteActive(item, route.path) }"
              :aria-current="isRouteActive(item, route.path) ? 'page' : undefined"
              @click="drawerOpen = false"
            >
              <component :is="item.icon" :size="18" :stroke-width="1.7" />
              <span>{{ item.label }}</span>
            </router-link>
          </template>
        </div>
      </nav>
    </template>
  </template>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, X, ArrowUpRight } from 'lucide-vue-next';
import {
  brand,
  navigationItems,
  actionItems,
  homeSectionIds,
  isRailHiddenFor,
  isRouteActive,
} from './navigation.config.js';
import {
  useReducedMotion,
  useHoverIntent,
  useWaveField,
  useSectionSpy,
  useBodyScrollLock,
  useFocusTrap,
  useRailBreakpoint,
} from './useNavigationRail.js';

const route = useRoute();
const hidden = computed(() => isRailHiddenFor(route.path));

const { isDesktop } = useRailBreakpoint();
const reducedMotion = useReducedMotion();

/* ── Rail expansion ─────────────────────────────────────────────────
   Opens the instant the pointer arrives, closes on a grace period so a
   cursor clipping the edge cannot make it flicker. Keyboard focus opens
   it too, otherwise tabbing through would read unlabelled icons. */
const { open: expanded, show, hide } = useHoverIntent(150);

function onRailEnter(event) {
  if (event.pointerType === 'touch') return;
  show();
}
function onRailLeave(event) {
  if (event.pointerType === 'touch') return;
  hide();
}
function onFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) hide(true);
}

/* ── Wave displacement ──────────────────────────────────────────────
   A gaussian field around the cursor; see useWaveField. */
const { offsets, listEl, onPointerEnter, onPointerMove, onPointerLeave, setEnabled } = useWaveField(
  navigationItems.length
);
watch(reducedMotion, (value) => setEnabled(!value), { immediate: true });

/* ── Homepage section tracking ──────────────────────────────────────
   While the visitor reads "/", the indicator follows the section on
   screen. Links always navigate to their real route — the indicator
   reports reading position, it never hijacks a click. */
const onHome = computed(() => route.path === '/');
const { activeSectionId } = useSectionSpy(homeSectionIds, onHome);

const activeIndex = computed(() => {
  if (onHome.value && activeSectionId.value) {
    const bySection = navigationItems.findIndex(
      (item) => item.homeSectionId === activeSectionId.value
    );
    if (bySection !== -1) return bySection;
  }
  return navigationItems.findIndex((item) => isRouteActive(item, route.path));
});

/* ── Indicator ribbon ───────────────────────────────────────────────
   The dot stretches while it travels and settles back once it lands.
   One flag, one timer — no keyframes, no elastic curve. */
const indicatorMoving = ref(false);
let ribbonTimer = null;
watch(activeIndex, (next, previous) => {
  if (next < 0 || previous < 0 || next === previous || reducedMotion.value) return;
  indicatorMoving.value = true;
  clearTimeout(ribbonTimer);
  ribbonTimer = setTimeout(() => {
    indicatorMoving.value = false;
  }, 300);
});
onBeforeUnmount(() => clearTimeout(ribbonTimer));

/* ── Mobile drawer ──────────────────────────────────────────────── */
const drawerOpen = ref(false);
const drawerEl = ref(null);
const toggleEl = ref(null);

useBodyScrollLock(drawerOpen);
useFocusTrap(drawerEl, drawerOpen);

function onKeydown(event) {
  if (event.key === 'Escape' && drawerOpen.value) {
    event.stopPropagation();
    drawerOpen.value = false;
  }
}

watch(
  () => route.path,
  () => {
    drawerOpen.value = false;
    hide(true);
  }
);

// The drawer only exists below the breakpoint; leaving it "open" while the
// rail takes over would strand a scroll lock on the body.
watch(isDesktop, (value) => {
  if (value) drawerOpen.value = false;
});

onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
/* ===================================================================
   DESKTOP RAIL
   Solid, architectural, permanently present. No blur, no glass, no pill
   behind any item — identity comes from icon, type and one gold mark.
   =================================================================== */
.vnav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: var(--vnav-z-rail);
  width: var(--vnav-w);
  background: var(--vnav-surface);
  /* Expansion overlays the page rather than pushing it, so the reserved
     gutter never changes and nothing below reflows. */
  transition:
    width var(--nav-medium) var(--ease-nav),
    background-color var(--nav-medium) var(--ease-nav),
    box-shadow var(--nav-medium) var(--ease-nav);
  overflow: hidden;
}

/* The rail edge, drawn as a fading rule rather than a border: full strength
   beside the navigation itself, gone by the top and bottom of the viewport.
   It anchors the rail without drawing a wall down the page. */
.vnav::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--vnav-hairline) 18%,
    var(--vnav-hairline) 82%,
    transparent 100%
  );
}

.vnav.is-open {
  width: var(--vnav-w-open);
  background: var(--vnav-surface-open);
  box-shadow: var(--vnav-shadow);
}

.vnav__inner {
  height: 100%;
  width: var(--vnav-w-open);
  display: flex;
  flex-direction: column;
  padding: 1.6rem 0 1.4rem;
  /* Fixed inner width: icons keep their exact x-position in both states,
     so the rail grows around them and spatial memory holds. */
}

/* ── Crest / masthead ─────────────────────────────────────────────── */
.vnav__brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0 0 0 calc((var(--vnav-w) - 42px) / 2);
  text-decoration: none;
  flex-shrink: 0;
}

/* The crest artwork is a black seal on a white JPEG square. The wrapper
   clips it to a circle and the image is scaled just past the white edge:
   artwork untouched, framed by a single antique-gold hairline. No glow,
   no rotation, no orbit. */
.vnav__crest {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--color-gold-muted);
  overflow: hidden;
  flex-shrink: 0;
  display: block;
  transition: border-color var(--nav-medium) var(--ease-nav);
}

.vnav__crest img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.08);
}

.vnav__brand:hover .vnav__crest {
  border-color: var(--color-gold);
}

.vnav__brand-text,
.mnav__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
  white-space: nowrap;
}

.vnav__brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.98rem;
  letter-spacing: 0.13em;
  color: var(--color-cream);
  transition: color var(--nav-medium) var(--ease-nav);
}

.vnav__brand:hover .vnav__brand-name {
  color: var(--color-gold-light);
}

.vnav__brand-sub {
  font-size: 0.545rem;
  font-weight: 500;
  letter-spacing: 0.17em;
  color: var(--color-cream-faint);
  text-transform: uppercase;
}

/* The masthead is pulled out of the rail alongside the labels. */
.vnav__brand-text {
  opacity: 0;
  transform: translate3d(-12px, 0, 0);
  transition:
    opacity var(--nav-medium) var(--ease-nav),
    transform var(--nav-medium) var(--ease-nav-reveal);
}

.vnav.is-open .vnav__brand-text {
  opacity: 1;
  transform: none;
  transition-delay: 60ms;
}

/* ── Rules ─────────────────────────────────────────────────────────── */
.vnav__rule {
  display: block;
  height: 1px;
  margin: 1.35rem 1.3rem 1.35rem calc((var(--vnav-w) - 34px) / 2);
  width: 34px;
  background: linear-gradient(90deg, var(--color-bronze), transparent);
  transition: width var(--nav-medium) var(--ease-nav);
}

.vnav.is-open .vnav__rule {
  width: calc(var(--vnav-w-open) - 3rem);
}

/* ── Link list ─────────────────────────────────────────────────────── */
.vnav__nav {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
}

/* Sized to the list, so the indicator's geometry never depends on how many
   items the config happens to hold. */
.vnav__track {
  position: relative;
  width: 100%;
}

/* A thin muted rule the indicator rides on — the "spine". */
.vnav__spine {
  position: absolute;
  left: 9px;
  top: 10px;
  bottom: 10px;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    var(--border-subtle) 12%,
    var(--border-subtle) 88%,
    transparent
  );
}

.vnav__list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.vnav__item {
  height: var(--vnav-item-h);
}

.vnav__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.95rem;
  height: 100%;
  padding-left: calc((var(--vnav-w) - 42px) / 2);
  text-decoration: none;
  color: var(--color-cream-muted);
  /* The wave: each item is displaced toward the content by the field
     value written on it. Short duration so the row trails the cursor
     instead of lagging behind it. */
  transform: translate3d(var(--wave, 0px), 0, 0);
  transition:
    transform var(--nav-fast) var(--ease-nav),
    color var(--nav-fast) var(--ease-nav);
}

.vnav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  /* Magnetic response: a small lift toward the reader, never a bounce. */
  transition:
    transform var(--nav-medium) var(--ease-nav),
    color var(--nav-fast) var(--ease-nav);
}

.vnav__link:hover {
  color: var(--color-gold-light);
}

.vnav__link:hover .vnav__icon {
  transform: translate3d(3px, -1px, 0) scale(1.06);
}

.vnav__link.is-active {
  color: var(--color-gold);
}

.vnav__link.is-active .vnav__icon {
  color: var(--color-gold);
}

.vnav__link:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: -3px;
  border-radius: 4px;
}

/* ── Label reveal ──────────────────────────────────────────────────
   Pulled out of the rail rather than faded in: the type travels with
   the opacity, and the rail's own overflow does the clipping. */
.vnav__label {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
  white-space: nowrap;
  opacity: 0;
  transform: translate3d(-14px, 0, 0);
  transition:
    opacity var(--nav-medium) var(--ease-nav),
    transform var(--nav-slow) var(--ease-nav-reveal);
}

.vnav.is-open .vnav__label {
  opacity: 1;
  transform: none;
  transition-delay: var(--stagger, 0ms);
}

.vnav__text {
  position: relative;
  font-family: var(--font-body);
  font-size: 0.87rem;
  font-weight: 500;
  letter-spacing: 0.015em;
}

/* Short gold rule under the revealed label — the one optional flourish. */
.vnav__text::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: var(--color-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--nav-fast) var(--ease-nav);
}

.vnav.is-open .vnav__link:hover .vnav__text::after,
.vnav.is-open .vnav__link.is-active .vnav__text::after {
  transform: scaleX(1);
}

/* ── The single moving indicator ───────────────────────────────────── */
.vnav__indicator {
  position: absolute;
  top: 0;
  left: 4px;
  width: 11px;
  height: var(--vnav-item-h);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: translate3d(0, calc(var(--vnav-item-h) * var(--active-index, 0)), 0);
  transition:
    transform var(--nav-slow) var(--ease-nav-settle),
    opacity var(--nav-fast) linear;
}

/* No nav item owns the route (a utility page is open) — the mark retires
   rather than parking on a lie. */
.vnav__indicator.is-idle {
  opacity: 0;
}

.vnav__indicator-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-gold);
  /* Nearly imperceptible breathing: 1px of life, nothing more. */
  animation: vnav-breathe 6.5s ease-in-out infinite;
  transition:
    transform var(--nav-fast) var(--ease-nav),
    height var(--nav-fast) var(--ease-nav);
}

/* The ribbon: the mark stretches along its path and settles on arrival. */
.vnav__indicator.is-moving .vnav__indicator-dot {
  transform: scaleY(3.4) scaleX(0.85);
}

@keyframes vnav-breathe {
  0%,
  100% {
    opacity: 0.82;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}

/* ── Utility zone ──────────────────────────────────────────────────── */
.vnav__actions {
  flex-shrink: 0;
}

.vnav__list--actions .vnav__item {
  height: 42px;
}

.vnav__link--action {
  color: var(--color-cream-faint);
}

.vnav__link--action .vnav__text {
  font-size: 0.8rem;
  font-weight: 500;
}

.vnav__link--action:hover,
.vnav__link--action.is-active {
  color: var(--color-gold-light);
}

.vnav__ext {
  align-self: center;
  transition: transform var(--nav-fast) var(--ease-nav);
}

.vnav__link--action:hover .vnav__ext {
  transform: translate3d(3px, -3px, 0);
}

/* ===================================================================
   MOBILE — a slim solid bar and a drawer, same language, more air.
   =================================================================== */
.mnav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--vnav-z-rail);
  height: var(--vnav-mobile-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem 0 1.1rem;
  background: var(--vnav-surface);
}

/* Fades out toward the right rather than ruling a line across the content. */
.mnav::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, var(--vnav-hairline) 0%, transparent 92%);
}

.mnav__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  min-width: 0;
}

.mnav__brand .vnav__crest,
.mnav__drawer-head .vnav__crest {
  width: 36px;
  height: 36px;
}

.mnav__brand .vnav__brand-name {
  font-size: 0.88rem;
}

.mnav__brand .vnav__brand-sub {
  font-size: 0.5rem;
  letter-spacing: 0.14em;
}

/* Outline tier, same lift/press/focus grammar as every other control. */
.mnav__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  background: transparent;
  color: var(--color-gold-light);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color var(--duration-button) var(--ease-editorial),
    border-color var(--duration-button) var(--ease-editorial),
    color var(--duration-button) var(--ease-editorial),
    box-shadow var(--duration-button) var(--ease-editorial),
    transform var(--duration-button) var(--ease-editorial);
}

.mnav__toggle:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.mnav__toggle:active {
  transform: translateY(0) scale(0.988);
}

.mnav__toggle:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
}

/* Solid tint, no blur — the drawer sits on darkness, not frosted glass. */
.mnav__scrim {
  position: fixed;
  inset: 0;
  z-index: var(--vnav-z-scrim);
  background: rgba(5, 6, 5, 0.76);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--nav-drawer) var(--ease-nav),
    visibility 0s linear var(--nav-drawer);
}

.mnav__scrim.is-open {
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}

.mnav__drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: var(--vnav-z-rail);
  width: min(86vw, 336px);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.35rem 1.75rem;
  background: var(--vnav-surface-open);
  border-right: 1px solid var(--vnav-hairline);
  box-shadow: var(--vnav-shadow);
  overflow-y: auto;
  overscroll-behavior: contain;
  transform: translate3d(-100%, 0, 0);
  visibility: hidden;
  transition:
    transform var(--nav-drawer) var(--ease-nav-reveal),
    visibility 0s linear var(--nav-drawer);
}

.mnav__drawer.is-open {
  transform: none;
  visibility: visible;
  transition-delay: 0s;
}

.mnav__drawer-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.mnav__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  flex: 1 1 auto;
}

/* Generous touch rows; the visible icon stays 19px but the target is 52px. */
.mnav__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.95rem;
  min-height: 52px;
  padding: 0 0.4rem 0 0.9rem;
  color: var(--color-cream-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--nav-fast) var(--ease-nav);
}

/* Same gold mark as the rail, adapted to a row. */
.mnav__link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 2px;
  height: 0;
  background: var(--color-gold);
  transform: translateY(-50%);
  transition: height var(--nav-fast) var(--ease-nav);
}

.mnav__link.is-active {
  color: var(--color-gold);
}

.mnav__link.is-active::before {
  height: 20px;
}

.mnav__link:active {
  color: var(--color-gold-light);
}

.mnav__link:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: -2px;
  border-radius: 4px;
}

.mnav__actions {
  display: flex;
  flex-direction: column;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.mnav__link--action {
  min-height: 48px;
  font-size: 0.85rem;
  color: var(--color-cream-faint);
}

.mnav__link--action.is-active {
  color: var(--color-gold-light);
}

/* ===================================================================
   REDUCED MOTION — the duration tokens already collapse to 1ms; what is
   left to remove is the travel and the ambient loop. State changes stay
   immediate and every focus/active affordance is untouched.
   =================================================================== */
@media (prefers-reduced-motion: reduce) {
  .vnav__link {
    transform: none;
  }

  .vnav__link:hover .vnav__icon {
    transform: none;
  }

  .vnav__label,
  .vnav__brand-text {
    transform: none;
    transition-delay: 0s !important;
  }

  .vnav__indicator.is-moving .vnav__indicator-dot {
    transform: none;
  }

  .vnav__indicator-dot {
    animation: none;
    opacity: 1;
  }

  .vnav__link--action:hover .vnav__ext {
    transform: none;
  }

  .mnav__toggle:hover {
    transform: none;
  }
}
</style>
