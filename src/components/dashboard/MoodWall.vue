<template>
  <!-- HOUSE MOOD. Five states, marked with vector icons and a warm tonal
       ramp so the chart never introduces a colour the portal does not own. -->
  <div class="widget" id="widget-mood">
    <div class="widget-label">Anonymous vote</div>
    <div class="widget-title">Mood Wall</div>
    <p class="widget-note">How the House is doing today, one vote per member.</p>

    <div class="mood-summary">
      <div>
        <span class="mood-summary-label">Leading mood</span>
        <strong>
          <component :is="widgetIcon(leadingMood.icon)" :size="15" :stroke-width="1.8" />
          {{ leadingMood.label }}
        </strong>
      </div>
      <div>
        <span class="mood-summary-label">Participation</span>
        <strong>{{ totalVotes }}</strong>
      </div>
    </div>

    <!-- Vote buttons -->
    <div class="mood-options" id="moodOptions">
      <button
        v-for="m in moods"
        :key="m.key"
        class="mood-opt"
        :class="{ selected: votedToday && myVote === m.key }"
        :data-mood="m.key"
        :disabled="votedToday"
        @click="voteMood(m.key)"
      >
        <component :is="widgetIcon(m.icon)" :size="16" :stroke-width="1.7" aria-hidden="true" />
        {{ m.label }}
      </button>
    </div>

    <!-- Live bar chart -->
    <div class="mood-bars">
      <div class="mood-bar-row" v-for="m in moods" :key="m.key">
        <span class="mood-bar-icon" :title="m.label">
          <component :is="widgetIcon(m.icon)" :size="15" :stroke-width="1.7" aria-hidden="true" />
        </span>
        <div class="mood-bar-track">
          <div class="mood-bar-fill" :style="{ background: m.color, width: barWidth(m.key) }"></div>
        </div>
        <span class="mood-bar-count">{{ tally[m.key] || 0 }}</span>
      </div>
    </div>

    <div class="mood-total">{{ totalVotes }} votes today</div>
    <div class="mood-voted-msg" :class="{ show: votedToday }">
      Vote counted. Come back tomorrow for a fresh one.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { save, load } from '../../composables/useLocalStorage.js';
import { widgetIcon } from './widgetIcons.js';

const props = defineProps({
  config: { type: Object, default: null },
});

const TODAY = new Date().toDateString();

const moods = props.config
  ? props.config.options
  : [
      { key: 'happy', icon: 'sunrise', label: 'Thriving', color: '#e9c873' },
      { key: 'chill', icon: 'coffee', label: 'Chill', color: '#7f8a7e' },
      { key: 'grind', icon: 'zap', label: 'Grind', color: '#d5a63a' },
      { key: 'meh', icon: 'cloud', label: 'Meh', color: '#6f6a5c' },
      { key: 'chaos', icon: 'tornado', label: 'Chaos', color: '#b98149' },
    ];

const SEED_TALLY = props.config
  ? props.config.seedTally
  : { happy: 12, chill: 8, grind: 19, meh: 5, chaos: 7 };

const tally = ref(load('sb_mood_tally', SEED_TALLY));
const myVote = ref(load('sb_mood_mine', null));
const myDate = ref(load('sb_mood_date', null));

const votedToday = computed(() => myDate.value === TODAY);

const totalVotes = computed(() => {
  return Object.values(tally.value).reduce((a, b) => a + b, 0);
});

const leadingMood = computed(() => {
  return moods.reduce((lead, mood) => {
    return (tally.value[mood.key] || 0) > (tally.value[lead.key] || 0) ? mood : lead;
  }, moods[0]);
});

function barWidth(key) {
  const total = totalVotes.value || 1;
  return Math.round(((tally.value[key] || 0) / total) * 100) + '%';
}

function voteMood(key) {
  if (votedToday.value) return;
  tally.value[key] = (tally.value[key] || 0) + 1;
  // Force reactivity by replacing the object
  tally.value = { ...tally.value };
  myVote.value = key;
  myDate.value = TODAY;

  save('sb_mood_tally', tally.value);
  save('sb_mood_mine', key);
  save('sb_mood_date', TODAY);
}
</script>
