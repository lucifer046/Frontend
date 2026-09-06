<template>
  <!-- ══════════════════════════════════════════════════════════════════════
       YOUR HOUSE · MEMBER COMMAND CENTRE
       Not an analytics screen. Four destinations, set as a contents page:
       a numeral, a word and a line of what it is for. One is open at a
       time, so nothing on this page competes for attention.
       ══════════════════════════════════════════════════════════════════ -->
  <div class="portal portal--tabbed dashboard-page">
    <!-- Confetti canvas (full-screen, pointer-events: none) -->
    <canvas id="confetti-canvas" ref="canvasEl"></canvas>

    <PortalNav :display-name="displayName" :email="email" :initials="initials" @logout="logout" />

    <main class="dash">
      <span class="p-mark p-mark--right dash__mark" aria-hidden="true">Yours</span>

      <!-- ── HEADER ─────────────────────────────────────────────────── -->
      <header class="p-shell dash__head">
        <p class="p-eyebrow">Member command centre</p>
        <h1 class="p-display dash__title">
          Your
          <em>House</em>
        </h1>
        <p class="dash__lede">
          One place to find your rhythm, your rooms and everything happening around you.
        </p>
      </header>

      <!-- ── THE FOUR DESTINATIONS ──────────────────────────────────────
           Numerals and words on a rule. The open one turns gold and carries
           the rule; none of them is a button dressed as a card. -->
      <div class="p-shell">
        <div class="dash__index" role="tablist" aria-label="Dashboard sections">
          <button
            v-for="(tab, i) in dashboardTabs"
            :id="`dashboard-tab-${tab.id}`"
            :key="tab.id"
            type="button"
            class="dest"
            role="tab"
            :class="{ 'is-active': activeTab === tab.id }"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`dashboard-panel-${tab.id}`"
            @click="activeTab = tab.id"
          >
            <span class="dest__no">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="dest__label">{{ tab.label }}</span>
            <span class="dest__purpose">{{ tab.purpose }}</span>
          </button>
        </div>
      </div>

      <!-- ── FOCUS ──────────────────────────────────────────────────── -->
      <section
        id="dashboard-panel-focus"
        class="p-shell dash__panel"
        role="tabpanel"
        aria-labelledby="dashboard-tab-focus"
        v-show="activeTab === 'focus'"
      >
        <header class="dash__panel-head">
          <h2>Your study rhythm and active study spaces.</h2>
          <p>Keep the streak moving, then close the door and work.</p>
        </header>
        <div class="dash__grid dash__grid--two">
          <StudyStreak @confetti="onConfetti" />
          <PomodoroRoom :config="DATA.pomodoro" @confetti="onConfetti" />
        </div>
      </section>

      <!-- ── PRACTICE ───────────────────────────────────────────────── -->
      <section
        id="dashboard-panel-practice"
        class="p-shell dash__panel"
        role="tabpanel"
        aria-labelledby="dashboard-tab-practice"
        v-show="activeTab === 'practice'"
      >
        <header class="dash__panel-head">
          <h2>Challenges, points and progress.</h2>
          <p>One challenge a day, and where your House points come from.</p>
        </header>
        <div class="dash__grid dash__grid--practice">
          <DailyChallenge :config="DATA.dailyChallenge" @confetti="onConfetti" />
          <HousePoints class="widget-compact" :config="DATA.housePoints" />
        </div>
      </section>

      <!-- ── COMMUNITY ──────────────────────────────────────────────── -->
      <section
        id="dashboard-panel-community"
        class="p-shell dash__panel"
        role="tabpanel"
        aria-labelledby="dashboard-tab-community"
        v-show="activeTab === 'community'"
      >
        <header class="dash__panel-head">
          <h2>Mood, wall and buddies.</h2>
          <p>How the House is feeling, what it is saying, and who to study with.</p>
        </header>
        <div class="dash__grid dash__grid--community">
          <MoodWall :config="DATA.moods" />
          <ConfessionWall :config="DATA.confessions" />
          <BuddyMatcher :pool="DATA.studyBuddies" :options="DATA.buddyOptions" />
        </div>
      </section>

      <!-- ── FUN ────────────────────────────────────────────────────── -->
      <section
        id="dashboard-panel-fun"
        class="p-shell dash__panel"
        role="tabpanel"
        aria-labelledby="dashboard-tab-fun"
        v-show="activeTab === 'fun'"
      >
        <header class="dash__panel-head">
          <h2>Lighthearted House moments.</h2>
          <p>The one the House picked this week.</p>
        </header>
        <div class="dash__grid dash__grid--single">
          <MemeOfWeek :config="DATA.meme" />
        </div>
      </section>
    </main>

    <PortalFooter @logout="logout" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useConfetti } from '../composables/useConfetti.js';
import { usePortalMember } from '../composables/usePortalMember.js';
import PortalNav from '../components/portal/PortalNav.vue';
import PortalFooter from '../components/portal/PortalFooter.vue';

// Widget components
import StudyStreak from '../components/dashboard/StudyStreak.vue';
import MoodWall from '../components/dashboard/MoodWall.vue';
import ConfessionWall from '../components/dashboard/ConfessionWall.vue';
import HousePoints from '../components/dashboard/HousePoints.vue';
import PomodoroRoom from '../components/dashboard/PomodoroRoom.vue';
import BuddyMatcher from '../components/dashboard/BuddyMatcher.vue';
import DailyChallenge from '../components/dashboard/DailyChallenge.vue';
import MemeOfWeek from '../components/dashboard/MemeOfWeek.vue';

// Data
import DATA from '../data/dashboard.json';

// CSS — the portal layer first, then the widget styles that sit inside it.
import '../assets/portal.css';
import '../assets/dashboard.css';

const { email, displayName, initials, requireAuth, logout } = usePortalMember();

// Confetti engine
const canvasEl = ref(null);
const activeTab = ref('focus');
const { canvasRef, fireConfetti } = useConfetti();

const dashboardTabs = [
  { id: 'focus', label: 'Focus', purpose: 'Rhythm and rooms' },
  { id: 'practice', label: 'Practice', purpose: 'Challenges and points' },
  { id: 'community', label: 'Community', purpose: 'Mood, wall and buddies' },
  { id: 'fun', label: 'Fun', purpose: 'House moments' },
];

onMounted(() => {
  if (!requireAuth()) return;

  canvasRef.value = canvasEl.value;

  // Re-init canvas size for the composable
  if (canvasEl.value) {
    canvasEl.value.width = window.innerWidth;
    canvasEl.value.height = window.innerHeight;
  }
});

function onConfetti(ox, oy) {
  fireConfetti(ox, oy);
}
</script>

<style scoped>
.dash {
  position: relative;
  overflow: hidden;
  padding-block: clamp(3rem, 7vh, 5rem) clamp(4rem, 9vh, 7rem);
}
.dash__mark {
  top: clamp(2rem, 6vw, 5rem);
}
.dash__head {
  position: relative;
  z-index: 1;
  max-width: 52rem;
}
.dash__title {
  margin-top: 1.25rem;
}
.dash__lede {
  margin-top: clamp(1.25rem, 3vw, 1.75rem);
  max-width: 38ch;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.1875rem);
  line-height: 1.6;
  color: var(--p-ink-muted);
}

/* ── The four destinations ──────────────────────────────────────────────
   A contents page: numeral over word over purpose, divided by hairlines.
   Horizontally scrollable on a phone rather than wrapping into buttons. */
.dash__index {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: clamp(2.5rem, 6vh, 4rem);
  border-top: 1px solid var(--p-line);
  border-bottom: 1px solid var(--p-line);
}
.dest {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
  padding: clamp(1.25rem, 2.5vw, 1.75rem) clamp(1rem, 2.5vw, 2rem) clamp(1.25rem, 2.5vw, 1.75rem) 0;
  background: none;
  border: 0;
  text-align: left;
  font-family: var(--font-body);
  color: var(--p-ink-faint);
  cursor: pointer;
  transition: color var(--duration-selector, 380ms) var(--p-ease);
}
.dest + .dest {
  padding-left: clamp(1rem, 2.5vw, 2rem);
  border-left: 1px solid var(--p-line);
}
.dest::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 1px;
  background: var(--p-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-selector, 380ms) var(--p-ease);
}
.dest:hover {
  color: var(--p-ink-muted);
}
.dest.is-active {
  color: var(--p-gold-light);
}
.dest.is-active::after {
  transform: scaleX(1);
}
.dest__no {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.28em;
  color: var(--p-gold-deep);
}
.dest__label {
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 1.1rem + 1vw, 2rem);
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: currentColor;
}
.dest__purpose {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--p-ink-faint);
}

/* ── Panels ───────────────────────────────────────────────────────────── */
.dash__panel {
  position: relative;
  z-index: 1;
  padding-top: clamp(2.5rem, 6vh, 3.5rem);
}
.dash__panel-head {
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  max-width: 46rem;
}
.dash__panel-head h2 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.25rem);
  line-height: 1.1;
  color: var(--p-ink);
}
.dash__panel-head p {
  margin-top: 0.65rem;
  font-size: 0.9375rem;
  color: var(--p-ink-muted);
}
.dash__grid {
  display: grid;
  gap: 1.25rem;
  align-items: start;
}
.dash__grid--two {
  grid-template-columns: repeat(auto-fit, minmax(min(21rem, 100%), 1fr));
}
.dash__grid--practice {
  grid-template-columns: minmax(0, 1.35fr) minmax(min(19rem, 100%), 0.65fr);
}
.dash__grid--community {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.dash__grid--community > :last-child {
  grid-column: 1 / -1;
}
.dash__grid--single {
  max-width: 46rem;
}

@media (max-width: 1000px) {
  .dash__grid--practice,
  .dash__grid--community {
    grid-template-columns: minmax(0, 1fr);
  }
  .dash__grid--community > :last-child {
    grid-column: auto;
  }
}

@media (max-width: 760px) {
  .dash__index {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .dest:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }
  .dest:nth-child(n + 3) {
    border-top: 1px solid var(--p-line);
  }
}
</style>
