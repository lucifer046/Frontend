<template>
  <!-- YOUR RHYTHM. A personal ritual, not a game and not a fitness app:
       one count that matters, two that give it context, and the week laid
       out as seven marks. -->
  <div class="widget" id="widget-streak">
    <div class="widget-label">Your rhythm</div>
    <div class="widget-title">Study Streak</div>
    <p class="widget-note">Small sessions become habits. Keep your rhythm moving.</p>

    <div class="streak-count">
      <span class="streak-number">{{ streak }}</span>
      <span class="streak-label">{{ streak === 1 ? 'day' : 'days' }} running</span>
    </div>

    <div class="streak-stat-row">
      <div class="streak-stat">
        <span>{{ completedThisWeek }}</span>
        <small>This week</small>
      </div>
      <div class="streak-stat">
        <span>{{ best }}</span>
        <small>Best run</small>
      </div>
    </div>

    <div class="streak-week">
      <div
        v-for="(day, i) in weekDays"
        :key="i"
        class="streak-day"
        :class="{ done: day.done, 'today-slot': day.isToday }"
      >
        <span class="streak-day-name">{{ day.name.charAt(0) }}</span>
        <span
          class="streak-day-mark"
          :title="`${day.name}${day.done ? ', checked in' : ''}`"
        ></span>
      </div>
    </div>

    <div class="streak-checkin-row">
      <button class="btn btn-gold" ref="streakBtnRef" :disabled="checkedToday" @click="doCheckin">
        {{ checkedToday ? 'Checked in' : 'Check in today' }}
        <ArrowRight v-if="!checkedToday" :size="13" :stroke-width="1.8" aria-hidden="true" />
      </button>
      <span class="streak-checked-msg" :class="{ show: checkedToday }">Today is marked</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import { save, load } from '../../composables/useLocalStorage.js';

const emit = defineEmits(['confetti']);

const TODAY = new Date().toDateString();
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const streak = ref(load('sb_streak', 0));
const best = ref(load('sb_best', 0));
const hist = ref(load('sb_hist', []));
const last = ref(load('sb_last', null));
const streakBtnRef = ref(null);

const checkedToday = computed(() => last.value === TODAY);
const completedThisWeek = computed(() => weekDays.value.filter((day) => day.done).length);

const weekDays = computed(() => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toDateString();
    days.push({
      name: DAYS[d.getDay()],
      done: hist.value.indexOf(ds) > -1,
      isToday: ds === TODAY,
    });
  }
  return days;
});

function doCheckin() {
  if (last.value === TODAY) return;

  let s = streak.value;
  let b = best.value;
  let h = [...hist.value];

  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  s = last.value === yest.toDateString() ? s + 1 : 1;
  b = Math.max(b, s);

  if (h.indexOf(TODAY) === -1) h.push(TODAY);
  if (h.length > 60) h = h.slice(-60);

  streak.value = s;
  best.value = b;
  hist.value = h;
  last.value = TODAY;

  save('sb_streak', s);
  save('sb_best', b);
  save('sb_hist', h);
  save('sb_last', TODAY);

  // Fire confetti from button position
  if (streakBtnRef.value) {
    const r = streakBtnRef.value.getBoundingClientRect();
    emit('confetti', r.left + r.width / 2, r.top);
  }
}
</script>
