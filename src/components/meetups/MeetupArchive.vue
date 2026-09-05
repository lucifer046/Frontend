<template>
  <div class="ar" ref="root">
    <!-- Nothing recorded yet: a short, deliberate line rather than an empty
         bordered box the width of the page. -->
    <p v-if="!ordered.length" class="ar-empty">
      <Archive :size="20" :stroke-width="1.6" aria-hidden="true" />
      <span>{{ emptyMessage }}</span>
    </p>

    <template v-else>
      <!-- Keyed on the page so the outgoing list is replaced in one frame and
           only the incoming one animates — no collapse-then-expand. -->
      <div :key="page" class="ar-list">
        <MeetupCard v-for="meetup in pageItems" :key="meetup.key" :meetup="meetup" />
      </div>

      <nav v-if="pageCount > 1" class="ar-pager" aria-label="Past meetup pages">
        <button
          type="button"
          class="sel sel--tab ar-step"
          :disabled="page === 1"
          @click="goTo(page - 1)"
        >
          <ChevronLeft :size="15" :stroke-width="2" aria-hidden="true" />
          <span>Prev</span>
        </button>

        <ul class="ar-pages">
          <li v-for="(slot, i) in pageSlots" :key="`${slot}-${i}`">
            <span v-if="slot === GAP" class="ar-gap" aria-hidden="true">…</span>
            <button
              v-else
              type="button"
              class="sel ar-page"
              :aria-current="slot === page ? 'true' : undefined"
              :aria-label="`Page ${slot} of ${pageCount}`"
              @click="goTo(slot)"
            >
              {{ slot }}
            </button>
          </li>
        </ul>

        <button
          type="button"
          class="sel sel--tab ar-step"
          :disabled="page === pageCount"
          @click="goTo(page + 1)"
        >
          <span>Next</span>
          <ChevronRight :size="15" :stroke-width="2" aria-hidden="true" />
        </button>
      </nav>

      <p class="ar-count" aria-live="polite">
        Showing {{ rangeStart }}–{{ rangeEnd }} of {{ ordered.length }} meetups
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Archive, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import MeetupCard from './MeetupCard.vue';

const PER_PAGE = 5;
const GAP = '…';

const props = defineProps({
  meetups: { type: Array, default: () => [] },
  emptyMessage: {
    type: String,
    default: 'No past meetups recorded yet — the first one will be the one to remember.',
  },
});

const root = ref(null);
const page = ref(1);

/**
 * Newest first, by the meetup's own date. Records whose export carries no
 * parseable date sort after the dated ones and fall back to the meetup number,
 * which runs in the same direction — so an undated record still lands in a
 * sensible place instead of at a random offset.
 */
const ordered = computed(() =>
  [...props.meetups]
    .sort((a, b) => {
      const aTime = a.sortDate ? new Date(a.sortDate).getTime() : null;
      const bTime = b.sortDate ? new Date(b.sortDate).getTime() : null;
      if (aTime !== bTime) {
        if (aTime === null) return 1;
        if (bTime === null) return -1;
        return bTime - aTime;
      }
      return (b.sortNo ?? -Infinity) - (a.sortNo ?? -Infinity);
    })
    .map((meetup, i) => ({ ...meetup, key: meetup.key ?? `${meetup.id}-${i}` }))
);

const pageCount = computed(() => Math.max(1, Math.ceil(ordered.value.length / PER_PAGE)));
const rangeStart = computed(() => (page.value - 1) * PER_PAGE + 1);
const rangeEnd = computed(() => Math.min(page.value * PER_PAGE, ordered.value.length));
const pageItems = computed(() => ordered.value.slice(rangeStart.value - 1, rangeEnd.value));

/**
 * A windowed pager: first and last are always reachable, the current page keeps
 * a neighbour either side, and anything skipped collapses to one ellipsis. Short
 * archives never see a gap at all.
 */
const pageSlots = computed(() => {
  const total = pageCount.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const current = page.value;
  const slots = new Set([1, total, current, current - 1, current + 1]);
  const numbers = [...slots].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  return numbers.flatMap((n, i) => (i > 0 && n - numbers[i - 1] > 1 ? [GAP, n] : [n]));
});

function goTo(next) {
  const target = Math.min(Math.max(next, 1), pageCount.value);
  if (target === page.value) return;
  page.value = target;

  // Page two of a list you have scrolled past starts above the viewport. Bring
  // the archive's top edge back into view, honouring the motion preference.
  const el = root.value;
  if (!el || typeof window === 'undefined') return;
  if (el.getBoundingClientRect().top >= 0) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

// A shorter archive (a different region, a filtered list) must not leave the
// pager pointing at a page that no longer exists.
watch(pageCount, (count) => {
  if (page.value > count) page.value = count;
});
</script>

<style scoped>
.ar-list {
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
  animation: ar-page-in var(--duration-card) var(--ease-reveal) both;
}

@keyframes ar-page-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ar-empty {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 0;
  font-size: 0.92rem;
  color: var(--color-cream-muted);
  border-top: 1px solid var(--border-subtle);
}

.ar-empty svg {
  flex: none;
  color: var(--color-gold-muted);
}

/* ── Pager ──────────────────────────────────────────────────────────
   Built from the global selector tier, so a page number here behaves like
   every other tab and chip on the site. */
.ar-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
}

.ar-pages {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ar-page {
  min-width: 2.4rem;
  justify-content: center;
  font-variant-numeric: tabular-nums;
}

.ar-step {
  gap: 0.35rem;
}

.ar-step[disabled] {
  opacity: 0.35;
  pointer-events: none;
}

.ar-gap {
  display: inline-block;
  padding: 0 0.2rem;
  color: var(--color-cream-faint);
}

.ar-count {
  margin-top: 0.9rem;
  text-align: center;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--color-cream-faint);
}

@media (prefers-reduced-motion: reduce) {
  .ar-list {
    animation: none;
  }
}
</style>
