<template>
  <div>
    <PageHero
      bg-image="https://media.licdn.com/dms/image/v2/D4D12AQGOJzss-fon-Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1709102339863?e=2147483647&v=beta&t=6kQv2j3jMNyrmUzZEG4uokdgkDC_tpWg7ZALaCcw0BM"
      breadcrumb-title="Teams"
      title="Our"
      accent-title="Teams"
      subtitle="Meet the passionate people who drive Sundarbans House forward"
    />

    <!-- ══ UPPER HOUSE COUNCIL ══════════════════════════════════════
         Three offices, not three equals: the Secretary holds the centre
         column and the wider track, with the Deputy Secretary and the Web
         Admin set symmetrically either side. -->
    <section class="tm-section tm-section--uhc tone-b rs" aria-labelledby="uhc-heading">
      <div class="container">
        <header class="tm-hdr">
          <p class="section-tag">Leadership</p>
          <h2 id="uhc-heading" class="section-title-xl">
            Upper House <span class="tg">Council</span>
          </h2>
        </header>

        <div class="tm-council">
          <article
            v-for="(m, i) in upperHouse"
            :key="m.id"
            class="tm-card"
            :class="{ 'tm-card--lead': m.lead }"
            :style="{ '--card-delay': i * 0.09 + 's' }"
          >
            <div class="tm-photo">
              <img
                v-if="!failed.has(m.id)"
                :src="m.photo"
                :alt="m.name"
                loading="lazy"
                decoding="async"
                @error="onImageError(m.id)"
              />
              <span v-else class="tm-photo-fallback" aria-hidden="true">{{
                initials(m.name)
              }}</span>
            </div>

            <div class="tm-body">
              <p class="tm-role">{{ m.role }}</p>
              <h3 class="tm-name">{{ m.name }}</h3>
              <p class="tm-region">
                <span class="tm-region-name">{{ m.region }} Region</span>
                <span class="tm-region-sep" aria-hidden="true">·</span>
                <span class="tm-council-code">{{ m.council }}</span>
              </p>
              <ul class="tm-socials">
                <li v-if="m.email">
                  <a :href="`mailto:${m.email}`">
                    <Mail :size="15" :stroke-width="1.9" aria-hidden="true" />
                    <span>Email</span>
                    <span class="sr-only"> {{ m.name }} at {{ m.email }}</span>
                  </a>
                </li>
                <li v-for="s in m.socials" :key="s.label">
                  <a :href="s.href" target="_blank" rel="noopener noreferrer">
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path :d="ICONS[s.label]" />
                    </svg>
                    <span>{{ s.label }}</span>
                    <span class="sr-only"> — {{ m.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ══ LOWER HOUSE COUNCIL ══════════════════════════════════════
         A regional directory: tighter grid, region-led, ordered by region
         name so the list stays alphabetical as the roster changes. -->
    <section class="tm-section tm-section--lhc tone-a rs" aria-labelledby="lhc-heading">
      <div class="container">
        <header class="tm-hdr">
          <p class="section-tag">Regional</p>
          <h2 id="lhc-heading" class="section-title-xl">
            Lower House <span class="tg">Council</span>
          </h2>
        </header>

        <div class="tm-directory">
          <article
            v-for="(m, i) in lowerHouseSorted"
            :key="m.id"
            class="tm-card tm-card--compact"
            :style="{ '--card-delay': Math.min(i, 7) * 0.07 + 's' }"
          >
            <div class="tm-photo">
              <img
                v-if="!failed.has(m.id)"
                :src="m.photo"
                :alt="m.name"
                loading="lazy"
                decoding="async"
                @error="onImageError(m.id)"
              />
              <span v-else class="tm-photo-fallback" aria-hidden="true">{{
                initials(m.name)
              }}</span>
            </div>

            <div class="tm-body">
              <p class="tm-role">{{ m.role }}</p>
              <h3 class="tm-name">{{ m.name }}</h3>
              <p class="tm-region">
                <span class="tm-region-name">{{ m.region }} Region</span>
                <span class="tm-region-sep" aria-hidden="true">·</span>
                <span class="tm-council-code">{{ m.council }}</span>
              </p>
              <ul class="tm-socials">
                <li v-if="m.email">
                  <a :href="`mailto:${m.email}`">
                    <Mail :size="15" :stroke-width="1.9" aria-hidden="true" />
                    <span>Email</span>
                    <span class="sr-only"> {{ m.name }} at {{ m.email }}</span>
                  </a>
                </li>
                <li v-for="s in m.socials" :key="s.label">
                  <a :href="s.href" target="_blank" rel="noopener noreferrer">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path :d="ICONS[s.label]" />
                    </svg>
                    <span>{{ s.label }}</span>
                    <span class="sr-only"> — {{ m.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Mail } from 'lucide-vue-next';
import PageHero from '../components/PageHero.vue';
import { useScrollReveal } from '../composables/useAnimations.js';
import {
  upperHouse,
  lowerHouse,
  sortByRegion,
  initials,
  SOCIAL_ICONS as ICONS,
} from '../data/council.js';

useScrollReveal();

/* Ordered by region only — never by the coordinator's name — so adding or
   replacing a coordinator keeps the directory alphabetical for free. */
const lowerHouseSorted = computed(() => sortByRegion(lowerHouse));

/* ── Portrait fallback ───────────────────────────────────────────────
   A missing file swaps the <img> for a monogram plate in the card's own
   tones; the browser's broken-image glyph is never shown. */
const failed = ref(new Set());

function onImageError(id) {
  const next = new Set(failed.value);
  next.add(id);
  failed.value = next;
}

/* Cards settle in on first sight, staggered, then the observer lets go. */
let cardObserver = null;

onMounted(() => {
  if (typeof IntersectionObserver !== 'function') {
    document.querySelectorAll('.tm-card').forEach((el) => el.classList.add('tm-in'));
    return;
  }
  cardObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('tm-in');
        cardObserver.unobserve(e.target);
      }),
    { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.tm-card').forEach((el) => cardObserver.observe(el));
});

onUnmounted(() => cardObserver?.disconnect());
</script>

<style scoped>
/* ═══ SECTIONS ══════════════════════════════════════════════════════
   Two tones and nothing else, alternating: the hero settles into Tone A,
   the Upper House sits on Tone B, the directory returns to Tone A, and the
   global footer closes on black. No rules between them — the tone change
   and the whitespace do the separating. */
.tm-section {
  padding: clamp(3.75rem, 6.5vw, 5.75rem) 0;
}

/* The senior council gets the extra air. */
.tm-section--uhc {
  padding-block: clamp(4.5rem, 8vw, 7rem) clamp(4rem, 7vw, 6.25rem);
}

.tm-section--lhc {
  padding-block: clamp(4rem, 6.5vw, 5.75rem) clamp(4.5rem, 7vw, 6.5rem);
}

.tm-hdr {
  text-align: center;
  max-width: 46rem;
  margin: 0 auto clamp(2.5rem, 4.5vw, 3.75rem);
}

/* The tag is centred here, so its leading rule would hang off-axis. */
.tm-hdr .section-tag {
  margin-bottom: 1rem;
}

.tm-hdr .section-title-xl {
  margin-bottom: 0;
}

/* ═══ CARD ══════════════════════════════════════════════════════════ */
.tm-card {
  display: flex;
  flex-direction: column;
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
  overflow: hidden;
  opacity: 0;
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial);
}

.tm-card.tm-in {
  opacity: 1;
  animation: tm-settle var(--duration-card-enter) var(--ease-reveal) backwards;
  animation-delay: var(--card-delay, 0s);
}

@keyframes tm-settle {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tm-card:hover,
.tm-card:focus-within {
  border-color: var(--border-card-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

/* ── Portrait ──────────────────────────────────────────────────────
   One ratio for every portrait on the page. The processed files are cut to
   3:4, so `cover` is a no-op on them and nothing is re-cropped; the
   object-position only matters for a file that arrives off-ratio, where it
   keeps the head in frame instead of the chest. */
.tm-photo {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--color-card-raised);
}

.tm-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 28%;
  transition: transform var(--duration-card) var(--ease-editorial);
}

.tm-card:hover .tm-photo img,
.tm-card:focus-within .tm-photo img {
  transform: scale(1.03);
}

.tm-photo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(213, 166, 58, 0.28);
  background: linear-gradient(160deg, rgba(213, 166, 58, 0.05), rgba(213, 166, 58, 0.01));
}

/* ── Card text ─────────────────────────────────────────────────────
   Three weights, read top to bottom: an understated gold office label, the
   name as the loudest thing on the card, then the region. */
.tm-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.15rem 1.25rem 1.3rem;
  transition: transform var(--duration-card) var(--ease-editorial);
}

.tm-card:hover .tm-body,
.tm-card:focus-within .tm-body {
  transform: translateY(-2px);
}

.tm-role {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
  margin-bottom: 0.5rem;
}

.tm-name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: 0.005em;
  color: var(--color-cream);
  margin: 0 0 0.5rem;
}

.tm-region {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.78rem;
  line-height: 1.4;
  color: var(--color-cream-muted);
}

.tm-region-name {
  font-weight: 500;
}

.tm-region-sep,
.tm-council-code {
  color: var(--color-cream-faint);
}

.tm-council-code {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
}

/* ── Social links ──────────────────────────────────────────────────
   The footer's Connect column, verbatim in spirit: a mark used as the
   bullet on a text link. No box, no fill, no glow. */
/* `margin-top: auto` pins the links to the foot of the card, so a name that
   wraps to a second line does not push one card's links out of line with the
   rest of its row. */
.tm-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.05rem;
  margin: auto 0 0;
  padding: 0.95rem 0 0;
  list-style: none;
}

.tm-socials a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-cream-muted);
  text-decoration: none;
  padding: 0.15rem 0;
  transition:
    color var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.tm-socials svg {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity var(--duration-link) var(--ease-editorial);
}

.tm-socials a:hover {
  color: var(--color-gold);
  transform: translateX(3px);
}

.tm-socials a:hover svg {
  opacity: 1;
}

.tm-socials a:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
  border-radius: 3px;
}

/* ═══ UPPER HOUSE — CENTRED HIERARCHY ═══════════════════════════════
   Authored order is Secretary, Deputy Secretary, Web Admin. Below the
   desktop breakpoint that is exactly the stack we want; at desktop the
   grid re-seats them so the Secretary holds the centre. */
.tm-council {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1.25rem, 2.5vw, 2rem);
  max-width: 24rem;
  margin-inline: auto;
}

.tm-card--lead {
  border-color: var(--border-gold);
}

.tm-card--lead .tm-name {
  font-size: 1.5rem;
}

.tm-card--lead .tm-role {
  color: var(--color-gold);
}

/* Two-up: the Secretary takes the full first row, the other two share the
   second — the pyramid holds even before there is room for three columns. */
@media (min-width: 620px) {
  .tm-council {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 46rem;
  }

  .tm-council > :first-child {
    grid-column: 1 / -1;
    max-width: 22rem;
    margin-inline: auto;
  }
}

/* Deputy Secretary | Secretary | Web Admin — three equal tracks, one height.
   The tracks are equal because the portraits are locked to a 3:4 frame: a
   wider centre column would make a taller photograph, and levelling the row
   after that could only be done by padding the shorter cards with dead space
   under their text. The Secretary is marked instead by the gold edge, the gold
   role label and the larger name, which cost no geometry.

   The row stretches (the grid default), so all three cards take the height of
   the tallest and their tops and feet line up. Each card is a column flexbox
   whose body is `flex: 1` and whose links are pinned with `margin-top: auto`,
   so the extra height lands in the body and the social row still sits on the
   same line across all three. */
@media (min-width: 940px) {
  .tm-council {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1.5rem, 2.6vw, 2.25rem);
    max-width: 68rem;
  }

  .tm-council > :first-child {
    grid-area: 1 / 2;
    max-width: none;
    margin-inline: 0;
  }

  .tm-council > :nth-child(2) {
    grid-area: 1 / 1;
  }

  .tm-council > :nth-child(3) {
    grid-area: 1 / 3;
  }

  .tm-card--lead .tm-name {
    font-size: 1.6rem;
  }
}

/* ═══ LOWER HOUSE — REGIONAL DIRECTORY ══════════════════════════════ */
.tm-directory {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  max-width: 22rem;
  margin-inline: auto;
}

.tm-card--compact .tm-body {
  padding: 1rem 1.1rem 1.15rem;
}

.tm-card--compact .tm-name {
  font-size: 1.18rem;
}

@media (min-width: 620px) {
  .tm-directory {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: none;
  }
}

@media (min-width: 900px) {
  .tm-directory {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Four across, expressed as eight half-tracks so a short final row can be
   centred instead of being left hanging against the left edge. The three
   rules below catch a trailing row of one, two or three cards and start it
   at the track that centres it — no hard-coded roster length. */
@media (min-width: 1200px) {
  .tm-directory {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .tm-directory > * {
    grid-column: span 2;
  }

  .tm-directory > :last-child:nth-child(4n + 1) {
    grid-column: 4 / span 2;
  }

  .tm-directory > :nth-last-child(2):nth-child(4n + 1) {
    grid-column: 3 / span 2;
  }

  .tm-directory > :nth-last-child(3):nth-child(4n + 1) {
    grid-column: 2 / span 2;
  }
}

/* ═══ REDUCED MOTION ════════════════════════════════════════════════
   The duration tokens already collapse to 1ms; the entrance keyframe is
   its own animation, so it is stopped here and the cards simply are where
   they belong. */
@media (prefers-reduced-motion: reduce) {
  .tm-card.tm-in {
    animation: none;
  }

  .tm-card:hover,
  .tm-card:focus-within,
  .tm-card:hover .tm-body,
  .tm-card:focus-within .tm-body,
  .tm-card:hover .tm-photo img,
  .tm-card:focus-within .tm-photo img,
  .tm-socials a:hover {
    transform: none;
  }
}

/* ═══ LIGHT THEME ═══════════════════════════════════════════════════ */
[data-theme='light'] .tm-card {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.08);
}

[data-theme='light'] .tm-card--lead {
  border-color: rgba(169, 124, 34, 0.45);
}
</style>
