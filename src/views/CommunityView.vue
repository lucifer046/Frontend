<template>
  <div class="communities-index">
    <PageHero
      compact
      bg-image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80&auto=format&fit=crop"
      breadcrumb-title="Community"
      title="Our"
      accent-title="Communities"
      subtitle="Three student cultures inside one House — builders, artists and competitors.
        Each runs its own events, its own team and its own calendar."
    />

    <!--
      The pillars. Each is a full-bleed editorial band rather than a card in a
      grid: a community is a destination, and three destinations laid out as
      three equal tiles read as three features of one product instead.

      Tone alternates A / B / A across the three, and each band carries its own
      accent through the label, the highlighted line, the track marks and the
      outline button's edge — and nothing else. The surfaces stay the two
      house tones.
    -->
    <section
      v-for="(pillar, i) in pillars"
      :key="pillar.id"
      class="section rs pillar"
      :class="[`pillar--${pillar.id}`, i % 2 === 0 ? 'tone-a' : 'tone-b']"
    >
      <div class="container">
        <div class="pillar-grid" :class="{ 'pillar-grid--flip': i % 2 === 1 }">
          <div class="pillar-copy">
            <div class="section-tag">{{ pillar.tag }}</div>
            <h2 class="pillar-title">
              <span v-for="word in pillar.words" :key="word" class="pillar-word">{{ word }}</span>
            </h2>
            <p class="pillar-desc">{{ pillar.description }}</p>

            <ul class="pillar-tracks">
              <li v-for="track in pillar.tracks" :key="track.title">
                <span class="pillar-track-icon">
                  <component :is="track.icon" :size="18" :stroke-width="1.8" aria-hidden="true" />
                </span>
                <span class="pillar-track-text">
                  <strong>{{ track.title }}</strong>
                  <span>{{ track.desc }}</span>
                </span>
              </li>
            </ul>

            <div class="pillar-actions">
              <RouterLink class="btn btn--primary" :to="pillar.route">
                Explore {{ pillar.short }}
                <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
              </RouterLink>
              <a
                class="btn btn--outline"
                :href="pillar.joinHref"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join
                <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
              </a>
            </div>
          </div>

          <RouterLink
            class="pillar-media"
            :to="pillar.route"
            :aria-label="`Explore ${pillar.short}`"
          >
            <img :src="pillar.image" :alt="pillar.imageAlt" loading="lazy" decoding="async" />
            <span class="pillar-media-rule" aria-hidden="true"></span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import {
  Code2,
  Bot,
  BarChart3,
  Palette,
  Music,
  BookOpen,
  Gamepad2,
  UsersRound,
  Target,
  ArrowRight,
} from 'lucide-vue-next';

import PageHero from '../components/PageHero.vue';
import { useScrollReveal } from '../composables/useAnimations.js';

useScrollReveal();

// Same three communities, same copy, same destinations and the same join
// forms as before — as data, so the three bands cannot drift apart the way
// three hand-written blocks did.
const pillars = [
  {
    id: 'tech',
    short: 'Technical',
    tag: 'Technical Community',
    words: ['Build.', 'Code.', 'Innovate.'],
    description:
      'Connect with builders, analysts, and innovators across specialized technical domains. Whether you are into frontend, AI/ML, or blockchain, there is a space for you.',
    tracks: [
      { icon: Code2, title: 'Development Track', desc: 'Full-stack, mobile apps, system design' },
      { icon: Bot, title: 'AI/ML Track', desc: 'Machine learning, NLP, computer vision' },
      { icon: BarChart3, title: 'Data Science', desc: 'Analytics, visualization, data pipelines' },
    ],
    route: '/community/technical',
    joinHref:
      'https://docs.google.com/forms/d/e/1FAIpQLSd0H31y_2l02T2TCPSaMvooqdnRyLzcpZ4ysT32PAOhvx5lkA/viewform?usp=header',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80&auto=format&fit=crop',
    imageAlt: 'Technical community members collaborating at a laptop',
  },
  {
    id: 'cultural',
    short: 'Cultural',
    tag: 'Cultural Community',
    words: ['Art.', 'Music.', 'Culture.'],
    description:
      'Celebrate diversity through arts, music, literature and cultural exchange. Our cultural community bridges regional differences and creates a unified, vibrant Sundarbans identity.',
    tracks: [
      { icon: Palette, title: 'Arts & Crafts', desc: 'Design, illustration, photography' },
      { icon: Music, title: 'Music & Dance', desc: 'Performances, collaborations, jam sessions' },
      {
        icon: BookOpen,
        title: 'Literature & Debate',
        desc: 'Book clubs, debates, creative writing',
      },
    ],
    route: '/community/cultural',
    joinHref: 'https://forms.gle/2DGXHZJLhCKG6z1T6',
    image:
      'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=900&q=80&auto=format&fit=crop',
    imageAlt: 'Cultural community performance',
  },
  {
    id: 'esports',
    short: 'E-Sports',
    tag: 'E-Sports Community',
    words: ['Play.', 'Compete.', 'Win.'],
    description:
      'From casual gaming to competitive tournaments, our E-Sports community is where Sundarbans players grind, grow, and dominate. Every game has a team. Find yours.',
    tracks: [
      {
        icon: Gamepad2,
        title: 'Competitive Gaming',
        desc: 'Tournaments, scrimmages, ranked ladders',
      },
      {
        icon: UsersRound,
        title: 'Team Formation',
        desc: 'Find teammates, build rosters, compete together',
      },
      {
        icon: Target,
        title: 'Skill Development',
        desc: 'Coaching, VOD reviews, strategy sessions',
      },
    ],
    route: '/community/esports',
    joinHref: 'https://forms.gle/q48tZxiUuqUeLN7y9',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80&auto=format&fit=crop',
    imageAlt: 'E-Sports community gaming session',
  },
];
</script>

<style scoped>
/* The same three accents the sub-pages use, declared here so the index and
   the destination it links to carry one identity. Kept in sync with
   src/assets/community.css by hand — three values, one place each. */
.pillar--tech {
  --cx: #7ba7d9;
  --cx-soft: rgba(123, 167, 217, 0.42);
  --cx-tint: rgba(123, 167, 217, 0.08);
}

.pillar--cultural {
  --cx: #dda15e;
  --cx-soft: rgba(221, 161, 94, 0.42);
  --cx-tint: rgba(221, 161, 94, 0.09);
}

.pillar--esports {
  --cx: #c96f6f;
  --cx-soft: rgba(201, 111, 111, 0.42);
  --cx-tint: rgba(201, 111, 111, 0.09);
}

.pillar :deep(.section-tag) {
  color: var(--cx);
}

.pillar-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 5vw, 5rem);
  align-items: center;
}

/* Reverses the visual order without reversing the DOM, so the reading order
   and the tab order stay copy-then-image on every band. */
.pillar-grid--flip .pillar-copy {
  order: 2;
}

/* ── Copy ─────────────────────────────────────────────────────────────── */
.pillar-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.8vw, 3rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: 0.02em;
  margin-bottom: 1.25rem;
}

/* Three words, three lines — the statement reads as a stack, and the last
   word carries the accent. */
.pillar-word {
  display: block;
}

.pillar-word:last-child {
  color: var(--cx);
}

.pillar-desc {
  font-size: 0.95rem;
  color: var(--text2);
  line-height: 1.85;
  max-width: 34rem;
  margin-bottom: 2rem;
}

.pillar-tracks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 0;
  margin: 0 0 2.25rem;
}

.pillar-tracks li {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}

.pillar-track-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: var(--rad);
  border: 1px solid var(--cx-soft);
  background: var(--cx-tint);
  color: var(--cx);
}

.pillar-track-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.pillar-track-text strong {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.pillar-track-text span {
  font-size: 0.82rem;
  color: var(--text2);
  line-height: 1.6;
}

.pillar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* The one place the accent touches a button — the outline's edge. Fill,
   motion, press and arrow all still come from the global system. */
.pillar :deep(.btn--outline) {
  border-color: var(--cx-soft);
}

.pillar :deep(.btn--outline:hover) {
  border-color: var(--cx);
}

/* ── Media ────────────────────────────────────────────────────────────── */
.pillar-media {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: var(--rad2);
  border: 1px solid var(--border-card);
  aspect-ratio: 4 / 3;
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial);
}

.pillar-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--duration-card) var(--ease-editorial);
}

.pillar-media:hover {
  border-color: var(--cx-soft);
  box-shadow: var(--shadow-lg);
}

.pillar-media:hover img {
  transform: scale(1.04);
}

.pillar-media:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 4px;
}

/* A thin accent rule along the bottom edge of the frame — the only decorative
   mark on the band, and it is one pixel tall. */
.pillar-media-rule {
  position: absolute;
  inset: auto 0 0 0;
  height: 2px;
  background: linear-gradient(90deg, var(--cx) 0%, rgba(5, 6, 5, 0) 70%);
  opacity: 0.65;
  transition: opacity var(--duration-card) var(--ease-editorial);
}

.pillar-media:hover .pillar-media-rule {
  opacity: 1;
}

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .pillar-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  /* On one column the image leads and the copy follows, on every band —
     alternating the order down a phone reads as a glitch, not a rhythm. */
  .pillar-grid--flip .pillar-copy {
    order: 0;
  }

  .pillar-media {
    order: -1;
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 768px) {
  .pillar-desc {
    margin-bottom: 1.75rem;
  }

  .pillar-tracks {
    gap: 0.9rem;
    margin-bottom: 1.75rem;
  }

  .pillar-actions .btn {
    width: 100%;
  }
}
</style>
