<template>
  <!-- ── Nothing scheduled ────────────────────────────────────────────
       Compact and deliberate: an icon, one line, one control. It reads as a
       note in the page, not as a large empty container. -->
  <div v-if="!meetup" class="fm-empty">
    <span class="fm-empty-mark" aria-hidden="true">
      <CalendarClock :size="22" :stroke-width="1.6" />
    </span>
    <div class="fm-empty-copy">
      <h3 class="fm-empty-title">No meetup on the calendar right now</h3>
      <p>{{ emptyMessage }}</p>
    </div>
    <router-link to="/community" class="btn btn--outline btn--sm fm-empty-cta">
      Join the Community
      <ArrowRight :size="15" :stroke-width="2.2" aria-hidden="true" />
    </router-link>
  </div>

  <!-- ── Scheduled ────────────────────────────────────────────────────
       Two columns on desktop: the meetup on the left, the practical detail
       (spots, venue, the one gold action on the page) on the right. -->
  <article v-else class="fm">
    <div class="fm-main">
      <p class="fm-eyebrow">
        <span class="fm-dot" aria-hidden="true"></span>
        Upcoming
      </p>
      <h3 class="fm-title">{{ meetup.name }}</h3>

      <p class="fm-meta">
        <template v-for="(item, i) in metadata" :key="item">
          <span v-if="i > 0" class="fm-meta-sep" aria-hidden="true">·</span>
          <span>{{ item }}</span>
        </template>
      </p>

      <p v-if="meetup.about" class="fm-about">{{ meetup.about }}</p>

      <ul v-if="meetup.tags?.length" class="fm-tags">
        <li v-for="tag in meetup.tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>

    <div class="fm-side">
      <div v-if="meetup.spots" class="fm-spots">
        <span class="fm-spots-value">{{ meetup.spots }}</span>
        <span class="fm-spots-label">Spots remaining</span>
      </div>

      <div v-if="meetup.venue || meetup.address1" class="fm-venue">
        <p class="fm-side-label">Venue</p>
        <p class="fm-venue-name">{{ meetup.venue }}</p>
        <p v-if="meetup.address1" class="fm-venue-line">{{ meetup.address1 }}</p>
        <p v-if="meetup.address2" class="fm-venue-line">{{ meetup.address2 }}</p>
        <a
          v-if="meetup.mapsUrl"
          :href="meetup.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--text fm-map"
        >
          Open in Google Maps
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <p class="fm-note">Free and open to every IITM BS student — no registration fee.</p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowRight, CalendarClock } from 'lucide-vue-next';

const props = defineProps({
  /** The region's upcoming record, or null when nothing is scheduled. */
  meetup: { type: Object, default: null },
  emptyMessage: {
    type: String,
    default: 'We are planning the next one — join the community to hear about it first.',
  },
});

const metadata = computed(() =>
  [props.meetup?.date, props.meetup?.time, props.meetup?.venue]
    .map((value) => (value == null ? null : String(value).trim()))
    .filter(Boolean)
);
</script>

<style scoped>
/* ── Empty state ───────────────────────────────────────────────────── */
.fm-empty {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  background: var(--color-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--rad2);
}

.fm-empty-mark {
  display: inline-flex;
  flex: none;
  color: var(--color-gold-muted);
}

.fm-empty-copy {
  flex: 1 1 18rem;
}

.fm-empty-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-cream);
  margin: 0 0 0.3rem;
}

.fm-empty-copy p {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-cream-muted);
}

.fm-empty-cta {
  flex: none;
}

/* ── Scheduled ─────────────────────────────────────────────────────── */
.fm {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
}

@media (min-width: 900px) {
  .fm {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  }

  .fm-side {
    padding-left: clamp(1.5rem, 3vw, 2.5rem);
    border-left: 1px solid var(--border-subtle);
  }
}

.fm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 0.7rem;
}

.fm-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.fm-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 700;
  line-height: 1.18;
  color: var(--color-cream);
  margin: 0 0 0.6rem;
}

.fm-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.86rem;
  color: var(--color-cream-muted);
}

.fm-meta-sep {
  color: var(--color-cream-faint);
}

.fm-about {
  margin-top: 1.1rem;
  font-size: 0.94rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  max-width: 60ch;
}

.fm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1rem;
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  color: var(--color-cream-faint);
}

.fm-spots-value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 3.2rem);
  font-weight: 700;
  line-height: 1;
  color: var(--color-gold-light);
}

.fm-spots-label,
.fm-side-label {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

.fm-venue {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-subtle);
}

.fm-side-label {
  margin: 0 0 0.5rem;
}

.fm-venue-name {
  font-weight: 600;
  color: var(--color-cream);
}

.fm-venue-line {
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--color-cream-muted);
}

.fm-map {
  margin-top: 0.6rem;
}

.fm-note {
  margin-top: 1.5rem;
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--color-cream-faint);
}
</style>
