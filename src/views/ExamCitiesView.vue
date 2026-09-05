<template>
  <div>
    <PageHero
      compact
      bg-image="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80&auto=format&fit=crop"
      breadcrumb-title="Exam Cities"
      title="Exam"
      accent-title="Cities"
      subtitle="Every IITM BS exam centre, by region and state. Search a city or pick a region to see
        where you can sit your exams."
    />

    <!-- Tone A — the directory itself. Search first, then region, then cities. -->
    <section class="section tone-a rs" id="exam-city-browser">
      <div class="container">
        <!-- SEARCH -->
        <div class="ecb-search">
          <label class="ecb-search-label" for="ecb-search-input">Search exam centres</label>
          <div class="ecb-search-field">
            <Search class="ecb-search-icon" :size="17" :stroke-width="1.9" aria-hidden="true" />
            <input
              id="ecb-search-input"
              v-model="citySearch"
              type="search"
              class="form-input ecb-search-input"
              placeholder="Search city or state…"
              autocomplete="off"
            />
            <button
              v-if="citySearch"
              type="button"
              class="ecb-search-clear"
              aria-label="Clear search"
              @click="citySearch = ''"
            >
              <X :size="15" :stroke-width="2" />
            </button>
          </div>
        </div>

        <!-- REGION -->
        <div class="ecb-block">
          <h2 class="ecb-block-title" id="ecb-region-label">Choose a region</h2>
          <div class="ecb-chips" role="group" aria-labelledby="ecb-region-label">
            <button
              type="button"
              class="sel"
              :aria-pressed="activeRegion === null"
              @click="resetExamRegion"
            >
              All regions
            </button>
            <button
              v-for="region in examRegionMeta"
              :key="region.key"
              type="button"
              class="sel"
              :aria-pressed="activeRegion === region.key"
              @click="selectExamRegion(region.key)"
            >
              {{ region.key }}
              <span class="ecb-chip-count">{{ region.cityCount }}</span>
            </button>
          </div>
        </div>

        <!-- RESULTS -->
        <div class="ecb-block">
          <div class="ecb-results-head">
            <h2 class="ecb-block-title">{{ resultsHeading }}</h2>
            <p class="ecb-results-count" role="status" aria-live="polite">
              {{ resultSummary }}
            </p>
          </div>

          <!-- min-height is what keeps the page from jumping as results change. -->
          <div class="ecb-results">
            <div v-if="visibleRows.length" class="ecb-grid">
              <article v-for="row in visibleRows" :key="row.state" class="card-base ecb-card">
                <header class="ecb-card-head">
                  <h3 class="ecb-state">{{ row.state }}</h3>
                  <span class="ecb-region-tag">{{ row.region }}</span>
                </header>
                <ul class="ecb-city-list">
                  <li v-for="city in row.cities" :key="city" class="ecb-city">{{ city }}</li>
                </ul>
              </article>
            </div>

            <p v-else class="ecb-empty">
              <MapPinOff :size="26" :stroke-width="1.6" aria-hidden="true" />
              <span>No exam centre matches “{{ citySearch }}”.</span>
              <button type="button" class="btn btn--outline btn--sm" @click="clearAll">
                Clear filters
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Search, X, MapPinOff } from 'lucide-vue-next';

import PageHero from '../components/PageHero.vue';
import { useScrollReveal } from '../composables/useAnimations.js';
import { examCitiesData, examRegionKeys } from '../data/examCities.js';

useScrollReveal();

const citySearch = ref('');
const activeRegion = ref(null);

const examRegionMeta = computed(() =>
  examRegionKeys.map((key) => {
    const rows = examCitiesData.filter((row) => row.region === key);
    return {
      key,
      stateCount: rows.length,
      cityCount: rows.reduce((sum, row) => sum + row.cities.length, 0),
    };
  })
);

function matchesQuery(row, q) {
  return row.state.toLowerCase().includes(q) || row.cities.some((c) => c.toLowerCase().includes(q));
}

// Region and query are independent filters, so a visitor who does not know
// which region a city belongs to can still find it — the old section required
// a region to be chosen before search did anything at all.
const visibleRows = computed(() => {
  const q = citySearch.value.trim().toLowerCase();
  return examCitiesData.filter((row) => {
    if (activeRegion.value && row.region !== activeRegion.value) return false;
    if (!q) return true;
    return matchesQuery(row, q);
  });
});

const resultsHeading = computed(() =>
  activeRegion.value ? `${activeRegion.value} region` : 'All exam centres'
);

const resultSummary = computed(() => {
  const states = visibleRows.value.length;
  const cities = visibleRows.value.reduce((sum, row) => sum + row.cities.length, 0);
  if (!states) return 'No matches';
  return `${cities} ${cities === 1 ? 'city' : 'cities'} across ${states} ${
    states === 1 ? 'state' : 'states'
  }`;
});

function selectExamRegion(region) {
  activeRegion.value = region;
}

function resetExamRegion() {
  activeRegion.value = null;
}

function clearAll() {
  citySearch.value = '';
  activeRegion.value = null;
}
</script>

<style scoped>
/* ── Search ───────────────────────────────────────────────────────── */
.ecb-search {
  max-width: 560px;
  margin: 0 auto 3rem;
}

.ecb-search-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.7rem;
  text-align: center;
}

.ecb-search-field {
  position: relative;
}

.ecb-search-input {
  padding-left: 2.75rem;
  padding-right: 2.5rem;
  font-size: 0.95rem;
  height: 3.1rem;
}

/* Chrome draws its own clear affordance on type=search; ours is the only one. */
.ecb-search-input::-webkit-search-cancel-button {
  display: none;
}

.ecb-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
  pointer-events: none;
}

.ecb-search-clear {
  position: absolute;
  right: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  padding: 0.35rem;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--text2);
  cursor: pointer;
  transition: color var(--duration-micro) var(--ease-editorial);
}

.ecb-search-clear:hover {
  color: var(--text);
}

/* ── Blocks ───────────────────────────────────────────────────────── */
.ecb-block + .ecb-block {
  margin-top: 2.75rem;
}

.ecb-block-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.ecb-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.ecb-chip-count {
  font-size: 0.7rem;
  color: var(--text3);
  font-variant-numeric: tabular-nums;
}

.sel[aria-pressed='true'] .ecb-chip-count {
  color: var(--accent);
}

.ecb-results-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.ecb-results-head .ecb-block-title {
  margin-bottom: 0;
}

.ecb-results-count {
  font-size: 0.78rem;
  color: var(--text2);
  letter-spacing: 0.04em;
}

/* Reserving the height is what stops the page shifting under the reader as
   they type — the grid grows and shrinks inside a box that does not. */
.ecb-results {
  min-height: 420px;
}

.ecb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.ecb-card {
  padding: 1.4rem 1.5rem;
}

.ecb-card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.7rem;
  margin-bottom: 0.9rem;
  border-bottom: 1px solid var(--border-subtle);
}

.ecb-state {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.02em;
}

.ecb-region-tag {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text3);
  white-space: nowrap;
}

.ecb-city-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0;
  margin: 0;
}

.ecb-city {
  font-size: 0.8rem;
  color: var(--text2);
  background: var(--color-card-raised);
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
  padding: 0.25rem 0.7rem;
}

.ecb-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 420px;
  color: var(--text3);
  text-align: center;
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .ecb-search {
    margin-bottom: 2.25rem;
  }

  .ecb-results,
  .ecb-empty {
    min-height: 320px;
  }

  .ecb-grid {
    grid-template-columns: 1fr;
  }
}
</style>
