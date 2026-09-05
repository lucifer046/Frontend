<template>
  <div>
    <PageHero
      bg-image="https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911370/sundarbans/src/assets/Sundarbans-House_Vue.jpg"
      breadcrumb-title="Leaderboard"
      title="Regional Coordinator"
      accent-title="Leaderboard"
      subtitle="The Lower House Council of Sundarbans House, chapter by chapter"
    />

    <section class="lb-section tone-b rs" aria-labelledby="standings-heading">
      <div class="container">
        <header class="lb-hdr">
          <p class="section-tag">Standings</p>
          <h2 id="standings-heading" class="section-title-xl">
            The <span class="tg">2026–27</span> board
          </h2>
        </header>

        <!-- Said plainly, because the numbers below would otherwise read as a
             result. Nothing on this page is a performance measurement yet. -->
        <p class="lb-notice">
          <Info :size="17" :stroke-width="1.8" aria-hidden="true" />
          <span>
            Scoring for the 2026–27 term has not opened, so every coordinator stands on
            <strong>0 points</strong> and all {{ coordinators.length }} are tied. Positions follow
            the regional directory order and carry no judgement of contribution.
          </span>
        </p>

        <!-- ── Featured tier ──────────────────────────────────────────
             The first three seats, given room. Deliberately not a podium:
             no medals, no metals, no step heights — the tier is a layout
             emphasis, not a claim about who is ahead. -->
        <ol class="lb-featured">
          <li v-for="rc in featured" :key="rc.id">
            <article class="lb-card">
              <p class="lb-card-rank">
                <span class="lb-rank-label">Position</span>
                <span class="lb-rank-value">{{ rc.rank }}</span>
              </p>

              <span class="lb-avatar lb-avatar--lg">
                <img
                  v-if="!failed.has(rc.id)"
                  :src="rc.photo"
                  :alt="rc.name"
                  loading="lazy"
                  decoding="async"
                  @error="onImageError(rc.id)"
                />
                <span v-else aria-hidden="true">{{ initials(rc.name) }}</span>
              </span>

              <h3 class="lb-card-name">{{ rc.name }}</h3>
              <p class="lb-card-region">{{ rc.region }} Region</p>

              <p class="lb-card-score">
                <span class="lb-score-value">{{ rc.points }}</span>
                <span class="lb-score-label">points</span>
              </p>
              <p class="lb-card-status">{{ rc.status }}</p>
            </article>
          </li>
        </ol>

        <!-- ── The rest of the board ──────────────────────────────────
             A real table: five columns of the same data, so a screen reader
             and a keyboard both get the row structure for free. -->
        <div v-if="rest.length" class="lb-table-wrap">
          <table class="lb-table">
            <caption class="sr-only">
              Regional Coordinators, positions
              {{
                rest[0].rank
              }}
              to
              {{
                rest[rest.length - 1].rank
              }}. All coordinators are tied on zero points.
            </caption>
            <thead>
              <tr>
                <th scope="col" class="lb-col-rank">Position</th>
                <th scope="col">Coordinator</th>
                <th scope="col" class="lb-col-region">Region</th>
                <th scope="col" class="lb-col-points">Points</th>
                <th scope="col" class="lb-col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rc in rest" :key="rc.id" class="lb-row">
                <td class="lb-col-rank">
                  <span class="lb-row-rank">{{ rc.rank }}</span>
                </td>
                <td>
                  <div class="lb-row-member">
                    <span class="lb-avatar">
                      <img
                        v-if="!failed.has(rc.id)"
                        :src="rc.photo"
                        :alt="rc.name"
                        loading="lazy"
                        decoding="async"
                        @error="onImageError(rc.id)"
                      />
                      <span v-else aria-hidden="true">{{ initials(rc.name) }}</span>
                    </span>
                    <span class="lb-row-text">
                      <span class="lb-row-name">{{ rc.name }}</span>
                      <span class="lb-row-sub">{{ rc.region }} Region</span>
                    </span>
                  </div>
                </td>
                <td class="lb-col-region">{{ rc.region }}</td>
                <td class="lb-col-points">
                  <span class="lb-row-points">{{ rc.points }}</span>
                </td>
                <td class="lb-col-status">{{ rc.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="lb-foot">
          Coordinators are listed from the House roster. See the
          <router-link to="/teams" class="btn btn--text lb-foot-link">
            full council directory
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
          </router-link>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Info } from 'lucide-vue-next';
import PageHero from '../components/PageHero.vue';
import { useScrollReveal } from '../composables/useAnimations.js';
import { lowerHouse, sortByRegion, initials } from '../data/council.js';

useScrollReveal();

/**
 * The board is the current Lower House Council and nothing else — the same
 * roster the Teams page renders, imported rather than copied, so a change of
 * coordinator reaches both pages at once.
 *
 * Every entry scores 0: no contribution data exists for this term, and the
 * order is the neutral, deterministic regional-directory order rather than any
 * inferred standing.
 */
const coordinators = computed(() =>
  sortByRegion(lowerHouse).map((member, i) => ({
    ...member,
    rank: i + 1,
    points: 0,
    status: 'Awaiting scoring',
  }))
);

const featured = computed(() => coordinators.value.slice(0, 3));
const rest = computed(() => coordinators.value.slice(3));

/** A missing portrait becomes a monogram, never a broken-image glyph. */
const failed = ref(new Set());

function onImageError(id) {
  const next = new Set(failed.value);
  next.add(id);
  failed.value = next;
}
</script>

<style scoped>
.lb-section {
  padding: clamp(3.75rem, 6.5vw, 5.75rem) 0 clamp(4.5rem, 7vw, 6.5rem);
}

.lb-hdr {
  text-align: center;
  max-width: 46rem;
  margin: 0 auto clamp(1.75rem, 3vw, 2.5rem);
}

.lb-hdr .section-tag {
  margin-bottom: 1rem;
}

.lb-hdr .section-title-xl {
  margin-bottom: 0;
}

/* ── Standings notice ──────────────────────────────────────────────── */
.lb-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  max-width: 52rem;
  margin: 0 auto clamp(2.5rem, 4.5vw, 3.5rem);
  padding: 1rem 1.15rem;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--color-cream-muted);
  background: var(--color-card);
  border: 1px solid var(--border-subtle);
  border-left: 2px solid var(--color-gold-muted);
  border-radius: var(--rad);
}

.lb-notice svg {
  flex: none;
  margin-top: 0.15rem;
  color: var(--color-gold-muted);
}

.lb-notice strong {
  color: var(--color-cream);
  font-weight: 600;
}

/* ── Featured tier ─────────────────────────────────────────────────── */
.lb-featured {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  max-width: 24rem;
  margin: 0 auto clamp(2rem, 3.5vw, 3rem);
  padding: 0;
  list-style: none;
}

@media (min-width: 760px) {
  .lb-featured {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: none;
  }
}

.lb-card {
  height: 100%;
  padding: clamp(1.5rem, 2.6vw, 2rem);
  text-align: center;
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial);
}

.lb-card:hover {
  border-color: var(--border-card-hover);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.lb-card-rank {
  margin-bottom: 1.1rem;
}

.lb-rank-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
  margin-bottom: 0.2rem;
}

.lb-rank-value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 700;
  line-height: 1;
  color: var(--color-gold-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Avatars ───────────────────────────────────────────────────────── */
.lb-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  background: var(--color-card-raised);
  border: 1px solid var(--border-subtle);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-gold-muted);
}

.lb-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* The portraits are 3:4 head-and-shoulders; a centred circular crop lands on
     the chest, so the frame is pulled up to the face. */
  object-position: center 22%;
}

.lb-avatar--lg {
  width: 92px;
  height: 92px;
  font-size: 1.7rem;
  margin-bottom: 1rem;
}

.lb-card-name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.22;
  color: var(--color-cream);
  margin: 0 0 0.35rem;
}

.lb-card-region {
  font-size: 0.82rem;
  color: var(--color-cream-muted);
}

.lb-card-score {
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--border-subtle);
}

.lb-score-value {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-cream);
  font-variant-numeric: tabular-nums;
}

.lb-score-label {
  margin-left: 0.4rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

.lb-card-status {
  margin-top: 0.5rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

/* ── Ranking table ─────────────────────────────────────────────────── */
.lb-table-wrap {
  overflow-x: auto;
}

.lb-table {
  width: 100%;
  border-collapse: collapse;
}

.lb-table th {
  padding: 0 1rem 0.85rem;
  text-align: left;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
  border-bottom: 1px solid var(--border-subtle);
}

.lb-table td {
  padding: 0.95rem 1rem;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
  transition:
    background-color var(--duration-selector) var(--ease-editorial),
    transform var(--duration-selector) var(--ease-editorial);
}

/* The row shifts as a unit — a translate on <tr> is ignored in most engines, so
   the cells carry it. */
.lb-row:hover td {
  background: var(--color-card);
  transform: translateX(3px);
}

.lb-row:hover td:first-child {
  box-shadow: inset 2px 0 0 var(--color-gold-muted);
}

.lb-row-rank {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gold-muted);
  font-variant-numeric: tabular-nums;
}

.lb-row-member {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.lb-row-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.lb-row-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-cream);
}

/* The region repeats in its own column on wide screens; under the name it is
   the only place it appears once that column is dropped. */
.lb-row-sub {
  font-size: 0.76rem;
  color: var(--color-cream-muted);
}

.lb-col-region,
.lb-col-status {
  font-size: 0.84rem;
  color: var(--color-cream-muted);
}

.lb-col-points {
  text-align: right;
}

.lb-row-points {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-cream);
  font-variant-numeric: tabular-nums;
}

.lb-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  justify-content: center;
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
  font-size: 0.86rem;
  color: var(--color-cream-muted);
}

.lb-foot-link {
  gap: 0.35rem;
}

/* Below the wide breakpoint the duplicated region column and the status column
   are dropped rather than squeezed; both survive inside the member cell and the
   points column. */
@media (max-width: 860px) {
  .lb-col-region,
  .lb-col-status {
    display: none;
  }
}

@media (max-width: 520px) {
  .lb-table th,
  .lb-table td {
    padding-inline: 0.5rem;
  }

  .lb-avatar {
    width: 38px;
    height: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lb-card:hover,
  .lb-row:hover td {
    transform: none;
  }
}

[data-theme='light'] .lb-card,
[data-theme='light'] .lb-notice {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.08);
}
</style>
