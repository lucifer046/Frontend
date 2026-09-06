<template>
  <div>
    <PageHero
      bg-image="https://img.freepik.com/free-vector/politician-sitting-round-table-boardroom-board-directors-with-ceo-holding-formal-talk-office-room-flat-vector-illustration-business-authority-corporate-leader-planning-strategy-concept_74855-22013.jpg?semt=ais_hybrid&w=740&q=80"
      breadcrumb-title="Meetups"
      title="City"
      accent-title="Meetups"
      subtitle="Find and connect with Sundarbans members in your city"
    />

    <!-- ══ REGIONS ═══════════════════════════════════════════════════
         Nine chapters, ordered by city name so the grid reads as a
         directory rather than as a ranking. -->
    <section class="mv-section tone-b rs" aria-labelledby="regions-heading">
      <div class="container">
        <header class="mv-hdr">
          <p class="section-tag">Across India</p>
          <h2 id="regions-heading" class="section-title-xl">
            Choose <span class="tg">your city</span>
          </h2>
        </header>

        <ul class="mv-regions">
          <li v-for="region in regions" :key="region.slug">
            <router-link :to="`/meetups/${region.slug}`" class="mvr">
              <span class="mvr-frame">
                <img
                  :src="region.image"
                  :alt="`${region.name} skyline`"
                  loading="lazy"
                  decoding="async"
                />
                <span class="mvr-scrim" aria-hidden="true"></span>
              </span>

              <span v-if="region.badge" class="mvr-badge">{{ region.badge }}</span>

              <span class="mvr-body">
                <span class="mvr-name">{{ region.name }}</span>
                <span class="mvr-foot">
                  <span class="mvr-members">{{ region.members }} members</span>
                  <ArrowRight class="mvr-arrow" :size="16" :stroke-width="2" aria-hidden="true" />
                </span>
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </section>

    <!-- ══ UPCOMING ══════════════════════════════════════════════════ -->
    <section class="mv-section tone-a rs" aria-labelledby="upcoming-heading">
      <div class="container container--measure">
        <header class="mv-hdr mv-hdr--left">
          <p class="section-tag">Next event</p>
          <h2 id="upcoming-heading" class="section-title-xl">
            Upcoming <span class="tg">Meetup</span>
          </h2>
        </header>

        <FeaturedMeetup
          :meetup="nextUpcoming"
          empty-message="Nothing is on the national calendar this week. Chapters announce their own dates — open a city above, or join the community to hear first."
        />
      </div>
    </section>

    <!-- ══ CTA ═══════════════════════════════════════════════════════ -->
    <section class="mv-section mv-section--cta tone-a rs" aria-labelledby="cta-heading">
      <div class="container">
        <div class="mv-cta">
          <p class="section-tag">Expand the map</p>
          <h2 id="cta-heading" class="mv-cta-title">Bring the community to your city</h2>
          <p class="mv-cta-copy">
            Want a meetup somewhere we have not reached yet — Siliguri, Guwahati, anywhere? Suggest
            a location, pitch an activity, or volunteer to host one.
          </p>
          <a
            href="https://forms.gle/iHeYQsAbsUTBHJJC6"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--primary"
          >
            Suggest a location or volunteer
            <ArrowRight :size="16" :stroke-width="2.2" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import PageHero from '../components/PageHero.vue';
import FeaturedMeetup from '../components/meetups/FeaturedMeetup.vue';
import { useScrollReveal } from '../composables/useAnimations.js';
import { sortedRegions } from '../data/regions.js';
import { regionConfigs } from './meetups/regionConfigs.js';

useScrollReveal();

/** Alphabetical by city — computed from the data, never hand-ordered. */
const regions = computed(() => sortedRegions());

/** URL slug → regionConfigs key; delhi-ncr is the only mismatch. */
const SLUG_TO_KEY = { 'delhi-ncr': 'delhi' };

function configFor(slug) {
  return regionConfigs[SLUG_TO_KEY[slug] ?? slug] ?? null;
}

/**
 * The soonest scheduled meetup anywhere. Chapters currently publish none, so
 * this resolves to null and the refined empty state renders — but the page
 * picks one up automatically the moment a chapter adds an upcoming record.
 */
const nextUpcoming = computed(() => {
  const scheduled = regions.value
    .map((region) => {
      const upcoming = configFor(region.slug)?.upcoming;
      return upcoming ? { ...upcoming, region: region.name } : null;
    })
    .filter(Boolean);

  if (!scheduled.length) return null;
  return scheduled.sort((a, b) => {
    const aTime = Date.parse(a.date ?? '');
    const bTime = Date.parse(b.date ?? '');
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return aTime - bTime;
  })[0];
});
</script>

<style scoped>
/* ═══ SECTIONS ══════════════════════════════════════════════════════
   Tone A and Tone B alternate down the page; no rules or panels between
   them, so the change of ground is what marks a new chapter. */
.mv-section {
  padding: clamp(3.75rem, 6.5vw, 5.75rem) 0;
}

.mv-section--cta {
  padding-bottom: clamp(4.5rem, 7vw, 6.5rem);
}

.mv-hdr {
  text-align: center;
  max-width: 46rem;
  margin: 0 auto clamp(2.5rem, 4.5vw, 3.5rem);
}

.mv-hdr--left {
  text-align: left;
  margin-inline: 0;
}

.mv-hdr .section-tag {
  margin-bottom: 1rem;
}

.mv-hdr .section-title-xl {
  margin-bottom: 0;
}

.mv-sub {
  margin-top: 1rem;
  font-size: 0.94rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  max-width: 52ch;
}

/* ═══ REGION CARDS ══════════════════════════════════════════════════ */
.mv-regions {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  max-width: 22rem;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.mvr {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
  text-decoration: none;
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial);
}

.mvr:hover,
.mvr:focus-visible {
  border-color: var(--border-card-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.mvr:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
}

.mvr-frame {
  position: absolute;
  inset: 0;
}

.mvr-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Skylines and monuments carry their subject above the midline; a centred
     crop cuts the top off a 3:4 frame. */
  object-position: center 35%;
  filter: saturate(0.85) brightness(0.72);
  transition:
    transform var(--duration-card) var(--ease-editorial),
    filter var(--duration-card) var(--ease-editorial);
}

.mvr:hover .mvr-frame img,
.mvr:focus-visible .mvr-frame img {
  transform: scale(1.04);
  filter: saturate(1) brightness(0.82);
}

/* Two stops, both Tone A: the name always has ground under it, and the top of
   the frame stays photographic. */
.mvr-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(5, 6, 5, 0.92) 0%,
    rgba(5, 6, 5, 0.55) 38%,
    rgba(5, 6, 5, 0.08) 72%
  );
}

.mvr-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-gold-light);
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border-gold);
  border-radius: 99px;
}

.mvr-body {
  position: relative;
  padding: 1.25rem;
}

.mvr-name {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.2vw, 1.7rem);
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 0.4rem;
}

.mvr-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.mvr-members {
  font-size: 0.86rem;
  color: var(--color-cream-muted);
}

.mvr-arrow {
  flex: none;
  color: var(--color-gold);
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.mvr:hover .mvr-arrow,
.mvr:focus-visible .mvr-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (min-width: 620px) {
  .mv-regions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: none;
  }
}

@media (min-width: 900px) {
  .mv-regions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Four across, written as eight half-tracks so a short final row centres
   itself instead of hanging off the left edge. The three rules catch a
   trailing row of one, two or three cards — no hard-coded roster length. */
@media (min-width: 1200px) {
  .mv-regions {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .mv-regions > * {
    grid-column: span 2;
  }

  .mv-regions > :last-child:nth-child(4n + 1) {
    grid-column: 4 / span 2;
  }

  .mv-regions > :nth-last-child(2):nth-child(4n + 1) {
    grid-column: 3 / span 2;
  }

  .mv-regions > :nth-last-child(3):nth-child(4n + 1) {
    grid-column: 2 / span 2;
  }
}

/* ═══ CTA ═══════════════════════════════════════════════════════════
   A centred column with a hairline over it, not a large bordered panel. */
.mv-cta {
  max-width: 44rem;
  margin: 0 auto;
  text-align: center;
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--border-subtle);
}

.mv-cta .section-tag {
  margin-bottom: 1rem;
}

.mv-cta-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.2vw, 2.3rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-cream);
  margin-bottom: 1rem;
}

.mv-cta-copy {
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  margin-bottom: 1.85rem;
}

@media (prefers-reduced-motion: reduce) {
  .mvr:hover,
  .mvr:focus-visible,
  .mvr:hover .mvr-frame img,
  .mvr:focus-visible .mvr-frame img,
  .mvr:hover .mvr-arrow,
  .mvr:focus-visible .mvr-arrow {
    transform: none;
  }
}
</style>
