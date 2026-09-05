<template>
  <div class="rm">
    <!-- ══ HERO ══════════════════════════════════════════════════════
         The chapter's identity page: its own city behind the name, the
         chapter line above it, and the chapter's own numbers underneath. -->
    <section class="rm-hero">
      <div v-if="cityImage" class="rm-hero-bg" aria-hidden="true">
        <img :src="cityImage" alt="" loading="eager" decoding="async" />
        <span class="rm-hero-scrim"></span>
      </div>

      <div class="container rm-hero-inner">
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
          <router-link to="/">Home</router-link><span aria-hidden="true">/</span>
          <router-link to="/meetups">Meetups</router-link><span aria-hidden="true">/</span>
          <span>{{ config.heroTitle }}</span>
        </nav>

        <p class="rm-chapter">
          <span class="rm-chapter-dot" aria-hidden="true"></span>
          IIT Madras BS · {{ config.chapterLabel }}
        </p>

        <h1 class="rm-title">{{ config.heroTitle }}<br /><span class="tg">Meetups</span></h1>

        <p class="rm-desc">{{ config.heroDesc }}</p>

        <!-- An editorial strip: figure, label, hairline. Not a bordered panel. -->
        <dl class="rm-stats">
          <div v-for="stat in stats" :key="stat.label" class="rm-stat">
            <dt class="rm-stat-label">{{ stat.label }}</dt>
            <dd class="rm-stat-value">
              {{ stat.value }}<span v-if="stat.plus" class="rm-stat-plus">+</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- ══ UPCOMING ══════════════════════════════════════════════════ -->
    <section class="rm-section tone-b" id="upcoming" aria-labelledby="rm-upcoming-heading">
      <div class="container container--measure">
        <header class="rm-hdr">
          <p class="section-tag">Next event</p>
          <h2 id="rm-upcoming-heading" class="section-title-xl">
            Upcoming <span class="tg">Meetup</span>
          </h2>
        </header>

        <FeaturedMeetup
          :meetup="config.upcoming"
          :empty-message="`The ${config.heroTitle} chapter is planning its next one — join the community to hear about it first.`"
        />
      </div>
    </section>

    <!-- ══ ARCHIVE ═══════════════════════════════════════════════════ -->
    <section class="rm-section tone-a" aria-labelledby="rm-archive-heading">
      <div class="container container--measure">
        <header class="rm-hdr">
          <p class="section-tag">Archive</p>
          <h2 id="rm-archive-heading" class="section-title-xl">
            Past <span class="tg">Meetups</span>
          </h2>
        </header>

        <MeetupArchive
          :meetups="config.pastMeetups"
          :empty-message="`No ${config.heroTitle} meetups are on record yet — this chapter is just getting started.`"
        />
      </div>
    </section>

    <!-- ══ CTA ═══════════════════════════════════════════════════════ -->
    <section class="rm-section rm-section--cta tone-b" aria-labelledby="rm-cta-heading">
      <div class="container">
        <div class="rm-cta">
          <p class="section-tag">Get involved</p>
          <h2 id="rm-cta-heading" class="rm-cta-title">
            Bring the community to your corner of {{ config.heroTitle }}
          </h2>
          <p class="rm-cta-copy">
            Suggest a venue, pitch an activity, or volunteer to host the next one — chapters grow
            because members put their hand up.
          </p>
          <div class="rm-cta-actions">
            <a
              href="https://forms.gle/iHeYQsAbsUTBHJJC6"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--primary"
            >
              Suggest a location or volunteer
              <ArrowRight :size="16" :stroke-width="2.2" aria-hidden="true" />
            </a>
            <router-link to="/meetups" class="btn btn--outline">
              All city chapters
              <ArrowRight :size="16" :stroke-width="2.2" aria-hidden="true" />
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import FeaturedMeetup from './meetups/FeaturedMeetup.vue';
import MeetupArchive from './meetups/MeetupArchive.vue';
import { regionBySlug } from '../data/regions.js';

const props = defineProps({
  /**
   * One region's entry from `regionConfigs` — chapterLabel, heroTitle,
   * heroDesc, stats {total, cities, members}, upcoming, pastMeetups[].
   */
  config: { type: Object, required: true },
  /** URL slug, used to find the chapter's own city photograph. */
  slug: { type: String, default: '' },
});

/** The same city asset the /meetups grid uses — no new artwork per region. */
const cityImage = computed(() => regionBySlug(props.slug)?.image ?? null);

/**
 * The chapter's own figures, derived in `regionConfigs` from its export. The
 * hero used to print the national totals here, which read as this chapter's
 * numbers on every one of the nine pages.
 */
const stats = computed(() => {
  const { total = 0, cities = 0, members = 0 } = props.config.stats ?? {};
  return [
    { label: 'Meetups held', value: total, plus: false },
    { label: 'Venues & locations', value: cities, plus: false },
    { label: 'Members connected', value: members, plus: members > 0 },
  ];
});
</script>

<style scoped>
/* ═══ HERO ══════════════════════════════════════════════════════════
   Compact by design — the chapter's archive is what the visitor came for,
   so the hero states who this is and gets out of the way. */
.rm-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(6.5rem, 12vw, 9rem) 0 clamp(3rem, 6vw, 4.5rem);
  background: var(--color-bg-black);
}

.rm-hero-bg {
  position: absolute;
  inset: 0;
}

.rm-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;
}

/* Graded across and down: the reading column keeps enough ground for cream
   text, the right half keeps the city, and the foot settles into Tone A so the
   next section starts without a seam. */
.rm-hero-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(5, 6, 5, 0.96) 0%,
      rgba(5, 6, 5, 0.88) 42%,
      rgba(5, 6, 5, 0.62) 72%,
      rgba(5, 6, 5, 0.45) 100%
    ),
    linear-gradient(
      180deg,
      rgba(5, 6, 5, 0.7) 0%,
      rgba(5, 6, 5, 0.25) 32%,
      rgba(5, 6, 5, 0.72) 80%,
      var(--color-bg-forest) 100%
    );
}

.rm-hero-inner {
  position: relative;
  z-index: 1;
}

.rm-chapter {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1.4rem;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-gold-light);
}

.rm-chapter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-gold);
}

.rm-title {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 7vw, 5.5rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: 0.01em;
  color: var(--color-cream);
  margin-bottom: 1.35rem;
}

.rm-desc {
  max-width: 34rem;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
}

/* ── Stats strip ───────────────────────────────────────────────────── */
.rm-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem clamp(1.75rem, 4vw, 3.25rem);
  margin-top: clamp(2rem, 4vw, 2.75rem);
  padding-top: clamp(1.25rem, 2.5vw, 1.75rem);
  border-top: 1px solid var(--border-subtle);
}

.rm-stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.3rem;
  padding-right: clamp(1.75rem, 4vw, 3.25rem);
  border-right: 1px solid var(--border-subtle);
}

.rm-stat:last-child {
  padding-right: 0;
  border-right: 0;
}

.rm-stat-value {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.6vw, 2.6rem);
  font-weight: 700;
  line-height: 1;
  color: var(--color-gold-light);
  font-variant-numeric: tabular-nums;
}

.rm-stat-plus {
  font-size: 0.55em;
  vertical-align: super;
}

.rm-stat-label {
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

/* ═══ SECTIONS ══════════════════════════════════════════════════════ */
.rm-section {
  padding: clamp(3.5rem, 6vw, 5.25rem) 0;
}

.rm-section--cta {
  padding-bottom: clamp(4.5rem, 7vw, 6.5rem);
}

.rm-hdr {
  margin-bottom: clamp(2rem, 3.5vw, 2.75rem);
}

.rm-hdr .section-tag {
  margin-bottom: 0.9rem;
}

.rm-hdr .section-title-xl {
  margin-bottom: 0;
}

/* ═══ CTA ═══════════════════════════════════════════════════════════ */
.rm-cta {
  max-width: 46rem;
  margin: 0 auto;
  text-align: center;
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--border-subtle);
}

.rm-cta .section-tag {
  margin-bottom: 1rem;
}

.rm-cta-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.2vw, 2.3rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-cream);
  margin-bottom: 1rem;
}

.rm-cta-copy {
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  margin-bottom: 1.85rem;
}

.rm-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  justify-content: center;
}

@media (max-width: 520px) {
  .rm-stats {
    gap: 1rem 1.25rem;
  }

  .rm-stat {
    padding-right: 1.25rem;
  }
}
</style>
