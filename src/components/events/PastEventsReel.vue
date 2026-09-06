<template>
  <div
    class="reel"
    :class="[`reel--${variant}`, { 'reel--held': heldKey !== null, 'reel--idle': idle }]"
  >
    <div ref="stageEl" class="reel-stage">
      <!-- The film plane. One rotation about Z (the slash across the page) and
           one about X (the foreshortening that turns the slash into a curve as
           it recedes). Both live in CSS custom properties so a breakpoint or a
           variant changes the geometry in one place and the hovered frame's
           counter-rotation follows automatically. -->
      <div class="reel-plane">
        <div class="reel-strip">
          <ul
            class="reel-track"
            :style="{ '--reel-duration': duration + 's' }"
            @focusin="onFocusIn"
            @focusout="onFocusOut"
          >
            <li
              v-for="frame in frames"
              :key="frame.key"
              class="reel-frame"
              :class="{ 'is-active': heldKey === frame.key, 'is-clone': frame.clone }"
              :aria-hidden="frame.clone ? 'true' : null"
            >
              <button
                type="button"
                class="reel-poster"
                :tabindex="frame.clone ? -1 : 0"
                :aria-expanded="heldKey === frame.key"
                :data-key="frame.key"
                @pointerenter="onPointerEnter(frame.key, $event)"
                @pointerleave="onPointerLeave(frame.key)"
                @click="onClick(frame.key, $event)"
                @keydown.esc="release"
              >
                <span class="reel-poster-img">
                  <img
                    :src="frame.event.img || fallbackImage"
                    :alt="`Poster for ${frame.event.title}`"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    @error="onImageError"
                  />
                </span>

                <!-- Always visible on the moving reel: category, name, date. -->
                <span class="reel-poster-meta">
                  <span v-if="frame.event.category" class="reel-poster-cat">{{
                    frame.event.category
                  }}</span>
                  <span class="reel-poster-title">{{ frame.event.title }}</span>
                  <span class="reel-poster-date">
                    <Calendar :size="13" :stroke-width="1.9" aria-hidden="true" />
                    {{ frame.event.date }}
                  </span>
                </span>

                <!-- Revealed on hover, focus or tap. Sits on the poster, so the
                     frame stays visibly part of the strip while it is open. -->
                <span class="reel-detail">
                  <span v-if="frame.event.category" class="reel-detail-cat">{{
                    frame.event.category
                  }}</span>
                  <span class="reel-detail-title">{{ frame.event.title }}</span>
                  <span v-if="frame.event.desc" class="reel-detail-desc">{{
                    frame.event.desc
                  }}</span>
                  <span class="reel-detail-facts">
                    <span class="reel-detail-fact">
                      <Calendar :size="13" :stroke-width="1.9" aria-hidden="true" />
                      {{ frame.event.date }}
                    </span>
                    <span v-if="frame.event.location" class="reel-detail-fact">
                      <MapPin :size="13" :stroke-width="1.9" aria-hidden="true" />
                      {{ frame.event.location }}
                    </span>
                    <span v-if="frame.event.time" class="reel-detail-fact">
                      <Clock :size="13" :stroke-width="1.9" aria-hidden="true" />
                      {{ frame.event.time }}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- The strip runs full-bleed; its footer does not. Sitting in the page
         container keeps the hint and any action lined up with the section
         heading above rather than with the viewport edge. -->
    <div class="container reel-foot">
      <p class="reel-hint">
        Hover a frame to hold the reel and read the details. On a touch screen, tap a frame.
      </p>
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Calendar, Clock, MapPin } from 'lucide-vue-next';
import { FALLBACK_EVENT_IMAGE } from '../../data/events.js';
import '../../assets/reel.css';

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
  /**
   * `archive` is the full-scale reel on the Events page. `compact` is the
   * homepage teaser: the same strip, loop and interactions at a smaller scale
   * and a gentler bend, so it reads as one moment in the page rather than as
   * the page's subject. Only the four geometry properties differ; there is no
   * second implementation.
   */
  variant: {
    type: String,
    default: 'archive',
    validator: (v) => ['archive', 'compact'].includes(v),
  },
  /**
   * How long one poster takes to travel its own width. The loop duration is
   * derived from it, so adding events lengthens the reel instead of speeding
   * it up: the perceived pace stays the same however many posters there are.
   */
  secondsPerFrame: {
    type: Number,
    default: 4.5,
  },
});

const fallbackImage = FALLBACK_EVENT_IMAGE;

/**
 * The track carries the archive twice and slides by exactly half its width, so
 * the moment the animation restarts, the frame under any given pixel is the
 * one that was already there. That is the whole loop: one keyframe pair, no
 * timer, no reset. Two copies is the minimum that makes it seamless, and the
 * clones are hidden from assistive tech and skipped by the tab order.
 *
 * Both variants run the complete archive. Showing the homepage a shortened
 * list would be the one change that can break the loop: a set narrower than
 * the viewport leaves a gap at the seam, and closing it would mean measuring
 * and repeating at runtime. The compact variant shrinks the frames instead.
 */
const frames = computed(() => {
  const single = props.events.map((event, i) => ({ key: `a${i}`, event, clone: false }));
  const clones = props.events.map((event, i) => ({ key: `b${i}`, event, clone: true }));
  return [...single, ...clones];
});

const duration = computed(() =>
  Math.max(20, Math.round(props.events.length * props.secondsPerFrame))
);

// One key at a time is "held": hovered, focused or tapped. It pauses the track
// and opens that frame's details.
const heldKey = ref(null);

function hold(key) {
  heldKey.value = key;
}

function release() {
  heldKey.value = null;
}

function onPointerEnter(key, event) {
  // Touch and pen raise pointerenter on tap as well; those go through onClick
  // so a tap can also close what it opened.
  if (event.pointerType === 'mouse') hold(key);
}

function onPointerLeave(key) {
  if (heldKey.value === key) release();
}

function onClick(key, event) {
  if (event.pointerType === 'mouse') return;
  if (heldKey.value === key) release();
  else hold(key);
}

function onFocusIn(event) {
  const key = event.target?.dataset?.key;
  if (key) hold(key);
}

function onFocusOut(event) {
  const key = event.target?.dataset?.key;
  if (key && heldKey.value === key) release();
}

function onImageError(event) {
  if (event.target.src !== FALLBACK_EVENT_IMAGE) event.target.src = FALLBACK_EVENT_IMAGE;
}

/**
 * Off-screen the strip stops. The animation is composited, so it is cheap
 * either way, but the homepage now opens on a full-height hero with the reel
 * well below it, and there is no reason to run film nobody is looking at.
 * One observer, no polling: the class it toggles is what pauses the CSS.
 */
const stageEl = ref(null);
const idle = ref(true);
let observer = null;

onMounted(() => {
  if (typeof IntersectionObserver !== 'function') {
    idle.value = false;
    return;
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      idle.value = !entry.isIntersecting;
    },
    // A screen of slack on each side, so the reel is already running by the
    // time it scrolls into view rather than starting from a standstill.
    { rootMargin: '100% 0px' }
  );
  observer.observe(stageEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>
