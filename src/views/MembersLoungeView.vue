<template>
  <!-- ══════════════════════════════════════════════════════════════════════
       THE LOUNGE · SUNDARBANS HOUSE, PRIVATE EDITION

       The public site is the front door. This is the inside of the House, so
       it is built the way a private magazine is built: oversized type, an
       asymmetric opening spread, two darks alternating band by band, and a
       photograph shown large rather than as a thumbnail. Cards appear only
       where content genuinely needs a contained surface.
       ══════════════════════════════════════════════════════════════════ -->
  <div class="portal portal--tabbed lounge">
    <PortalNav :display-name="displayName" :email="email" :initials="initials" @logout="logout" />

    <!-- ══ 01 · THE OPENING SPREAD ═══════════════════════════════════════
         Type on the left, the House crest on the right, the day across the
         bottom. Nothing is centred and nothing is boxed. -->
    <section class="p-tone-a hero">
      <span class="p-mark p-mark--right hero__mark" aria-hidden="true">House</span>

      <div class="p-shell hero__inner">
        <div class="hero__copy">
          <p class="p-eyebrow">Your place in the House</p>
          <h1 class="p-display hero__title">
            Welcome back,
            <em>{{ firstName }}</em>
          </h1>
          <p class="hero__lede">
            The House is moving. Find your next conversation, session, room or challenge.
          </p>
        </div>

        <!-- The crest, given room. Three hairline orbits and the mark: the
             same geometry the public site uses, at private-edition scale. -->
        <div class="hero__crest" aria-hidden="true">
          <span class="p-orbit hero__orbit"></span>
          <img class="hero__crest-img" :src="brand.crest" alt="" width="220" height="220" />
          <span class="hero__crest-label">Sundarbans House<br />Private Lounge</span>
        </div>
      </div>

      <!-- ── Today at the House ─────────────────────────────────────────
           Three facts read off the clock and the House calendar. Set as a
           strip of type on a rule, not as three metric boxes. -->
      <div class="p-shell today">
        <h2 class="today__label">Today at the House</h2>
        <dl class="today__row">
          <div class="today__item">
            <dt>Next event</dt>
            <dd>
              <span class="today__value">{{
                nextEvent ? nextEvent.title : 'No session scheduled'
              }}</span>
              <span class="today__sub">{{
                nextEvent ? nextEventWhen : 'The week resumes on Monday'
              }}</span>
            </dd>
          </div>
          <div class="today__item">
            <dt>Reading</dt>
            <dd>
              <span class="today__value">Night Owl</span>
              <span class="today__sub">
                <template v-if="isNightOwlTime">Rooms are open now</template>
                <template v-else>9:30 PM, opens in {{ countdownText }}</template>
              </span>
            </dd>
          </div>
          <div class="today__item">
            <dt>Community</dt>
            <dd>
              <span class="today__value">Regional groups open</span>
              <span class="today__sub">{{ regionCount }} regions, plus the main House group</span>
            </dd>
          </div>
        </dl>
      </div>

      <!-- ── House member ───────────────────────────────────────────────
           An identity strip, not a profile card. Only fields the app can
           actually fill are printed; the standing appears solely when this
           member is on the board. -->
      <div class="p-shell ident">
        <span class="ident__avatar" aria-hidden="true">{{ initials }}</span>
        <div class="ident__block">
          <span class="ident__role">House member</span>
          <span class="ident__name">{{ displayName }}</span>
        </div>
        <div class="ident__block">
          <span class="ident__role">Signed in as</span>
          <span class="ident__value">{{ email }}</span>
        </div>
        <div class="ident__block">
          <span class="ident__role">House</span>
          <span class="ident__value">Sundarbans, IIT Madras BS</span>
        </div>
        <div v-if="myStanding" class="ident__block">
          <span class="ident__role">Standing</span>
          <span class="ident__value">No. {{ myStanding.rank }}, {{ myStanding.pts }} points</span>
        </div>
      </div>

      <!-- ── The House today ────────────────────────────────────────────
           Four ways further in. Typographic columns divided by hairlines,
           so the row reads as a contents page rather than a widget grid. -->
      <nav class="p-shell doors" aria-label="Where to go next">
        <button
          v-for="(door, i) in doors"
          :key="door.id"
          v-reveal
          type="button"
          class="door"
          :style="{ transitionDelay: `${i * 90}ms` }"
          @click="goTo(door.anchor)"
        >
          <component
            :is="door.icon"
            class="door__icon"
            :size="18"
            :stroke-width="1.6"
            aria-hidden="true"
          />
          <span class="door__title">{{ door.title }}</span>
          <span class="door__fact">{{ door.fact }}</span>
          <span class="door__when">{{ door.when }}</span>
          <span class="door__action">
            {{ door.action }}
            <ArrowRight class="p-arrow" :size="14" :stroke-width="1.8" aria-hidden="true" />
          </span>
        </button>
      </nav>
    </section>

    <div class="p-seam" role="presentation"></div>

    <!-- ══ 02 · EVENTS ═══════════════════════════════════════════════════ -->
    <section id="events" class="p-tone-b band band--events">
      <span class="p-mark p-mark--left band__mark" aria-hidden="true">Events</span>

      <div class="p-shell">
        <header class="band__head" v-reveal>
          <p class="p-index">02</p>
          <p class="p-eyebrow">This week at the House</p>
          <h2 class="p-display p-display--sm">Events</h2>
          <p class="p-lede">Conversations, sessions, challenges and nights worth showing up for.</p>
        </header>

        <ol class="cal">
          <li
            v-for="ev in events"
            :key="ev.day"
            v-reveal
            class="cal__row"
            :class="{ 'is-today': ev.isToday, 'is-done': ev.isPast }"
          >
            <div class="cal__day">
              <span class="cal__day-name">{{ ev.dayLabel }}</span>
              <span v-if="ev.isToday && !ev.isPast" class="p-live">
                <span class="p-live__dot"></span>Live today
              </span>
            </div>

            <div class="cal__body">
              <h3 class="cal__title">{{ ev.title }}</h3>
              <p class="cal__desc">{{ ev.desc }}</p>
            </div>

            <div class="cal__side">
              <span class="cal__time">{{ ev.time }}</span>
              <a
                :href="ev.gmeetLink"
                target="_blank"
                rel="noopener"
                class="p-btn p-btn--small"
                :class="[
                  ev.isToday && !ev.isPast ? 'p-btn--primary' : 'p-btn--ghost',
                  { 'is-disabled': ev.isPast },
                ]"
                :aria-disabled="ev.isPast ? 'true' : undefined"
              >
                {{ ev.isPast ? 'Ended' : 'Join' }}
                <ArrowRight
                  v-if="!ev.isPast"
                  class="p-arrow"
                  :size="13"
                  :stroke-width="1.8"
                  aria-hidden="true"
                />
              </a>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <div class="p-seam" role="presentation"></div>

    <!-- ══ 03 · READING LOUNGE ═══════════════════════════════════════════
         A library inside the House: the rooms are set as type, and the pick
         of the week is laid out the way a review page lays out a book. -->
    <section id="reading" class="p-tone-a band band--reading">
      <span class="p-mark p-mark--right band__mark" aria-hidden="true">Reading</span>

      <div class="p-shell">
        <header class="band__head band__head--split" v-reveal>
          <div>
            <p class="p-index">03</p>
            <p class="p-eyebrow">Night Owl</p>
            <h2 class="p-display p-display--sm">
              Reading<br />
              Lounge
            </h2>
          </div>
          <div class="band__head-aside">
            <p class="p-lede">
              A quiet hour for the curious. Pick a room, bring your book and read alongside your
              House.
            </p>
            <p class="p-aside">
              <template v-if="isNightOwlTime">Rooms are open now</template>
              <template v-else>9:30 PM, every night</template>
            </p>
          </div>
        </header>

        <div class="reading">
          <ol class="rooms">
            <li v-for="room in readingRooms" :key="room.id" v-reveal class="room">
              <component
                :is="room.icon"
                class="room__icon"
                :size="20"
                :stroke-width="1.5"
                aria-hidden="true"
              />
              <h3 class="room__name">{{ room.name }}</h3>
              <p class="room__desc">{{ room.desc }}</p>
              <p class="room__meta">{{ room.genre }}, 60 minute session</p>
              <a :href="room.link" target="_blank" rel="noopener" class="room__enter">
                Enter room
                <ArrowRight class="p-arrow" :size="13" :stroke-width="1.8" aria-hidden="true" />
              </a>
            </li>
          </ol>

          <article v-reveal class="pick">
            <p class="pick__label">House pick of the week</p>
            <div class="pick__body">
              <div class="pick__cover" aria-hidden="true">
                <span class="pick__cover-rule"></span>
                <span class="pick__cover-title">{{ houseBookPick.title }}</span>
                <span class="pick__cover-author">{{ houseBookPick.author }}</span>
              </div>
              <div class="pick__text">
                <h3 class="pick__title">{{ houseBookPick.title }}</h3>
                <p class="pick__author">{{ houseBookPick.author }}</p>
                <p class="pick__desc">{{ houseBookPick.desc }}</p>
                <ul class="pick__tags">
                  <li v-for="tag in houseBookPick.tags" :key="tag">{{ tag }}</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="p-seam" role="presentation"></div>

    <!-- ══ 04 · COMMUNITY ════════════════════════════════════════════════
         WhatsApp is where the House actually talks. The main group gets a
         feature panel; the regions get a grid of compact cards rather than
         one full-width row each, which is what made the old list read like a
         spreadsheet. Green appears only on the mark and the join action. -->
    <section id="community" class="p-tone-b band band--community">
      <div class="p-shell">
        <header class="band__head" v-reveal>
          <p class="p-index">04</p>
          <p class="p-eyebrow">Stay connected</p>
          <h2 class="p-display p-display--sm">
            The House<br />
            is social
          </h2>
          <p class="p-lede">
            Find your regional circle and stay connected with the House beyond the website.
          </p>
        </header>

        <!-- The primary entry point: one horizontal panel, alongside a
             photograph from the House archive. -->
        <div class="social" v-reveal>
          <div class="social__main">
            <p class="social__label">
              <WhatsAppMark class="wa-mark" />
              Main House group
            </p>
            <h3 class="social__title">Sundarbans House</h3>
            <p class="social__desc">
              Announcements, events and everything happening across the House.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdP9gY3ET4EylNi771CaXQ8ihmsqEdjbat7rvSDZAsu2j0a9Q/viewform"
              target="_blank"
              rel="noopener"
              class="p-btn p-btn--primary"
            >
              Join main group
              <ArrowRight class="p-arrow" :size="14" :stroke-width="1.8" aria-hidden="true" />
            </a>
          </div>

          <figure class="social__photo p-photo p-photo--frame">
            <img
              :src="houseMoments[0].src"
              :alt="houseMoments[0].caption"
              loading="lazy"
              decoding="async"
            />
            <figcaption class="p-photo__caption">{{ houseMoments[0].caption }}</figcaption>
          </figure>
        </div>

        <!-- ── Regional groups ──────────────────────────────────────────
             A card per coordinator, so a region with two Regional
             Coordinators shows both without either name being dropped. The
             whole card is the link: one large, obvious hit area instead of a
             small tap target at the end of a long row. -->
        <h3 class="rg__heading" v-reveal>Regional groups</h3>
        <ul class="rg-grid">
          <li v-for="group in regionalGroups" :key="group.key" v-reveal class="rg-cell">
            <a :href="group.form" target="_blank" rel="noopener" class="rg">
              <span class="rg__top">
                <WhatsAppMark class="rg__mark" />
                <span class="rg__code">{{ group.code }}</span>
              </span>

              <span class="rg__city">{{ group.region }}</span>

              <span v-if="group.coordinator" class="rg__person">{{ group.coordinator }}</span>
              <span v-else class="rg__person rg__person--none">Coordinator to be announced</span>
              <span v-if="group.role" class="rg__role">{{ group.role }}</span>

              <span class="rg__join">
                Join
                <ArrowRight class="p-arrow" :size="14" :stroke-width="1.9" aria-hidden="true" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <div class="p-seam" role="presentation"></div>

    <!-- ══ 05 · HOUSE RECOGNITION ════════════════════════════════════════ -->
    <section id="recognition" class="p-tone-a band band--recognition">
      <span class="p-mark p-mark--left band__mark" aria-hidden="true">Rank</span>

      <div class="p-shell">
        <header class="band__head" v-reveal>
          <p class="p-index">05</p>
          <p class="p-eyebrow">House recognition</p>
          <h2 class="p-display p-display--sm">Top performers</h2>
          <p class="p-lede">Showing up matters. So does what you bring to the House.</p>
        </header>

        <ol v-if="podium.length" class="podium" v-reveal>
          <li
            v-for="seat in podium"
            :key="seat.roll"
            class="podium__seat"
            :class="`is-${seat.place}`"
          >
            <span class="podium__rank">{{ seat.rank }}</span>
            <span class="podium__avatar" aria-hidden="true">{{ seat.name.charAt(0) }}</span>
            <span class="podium__name">{{ seat.name }}</span>
            <span class="podium__pts">{{ seat.pts }}<small>points</small></span>
          </li>
        </ol>

        <h3 class="rank__label" v-reveal>House rankings</h3>
        <ol class="rank">
          <li
            v-for="member in board"
            :key="member.roll"
            v-reveal
            class="rank__row"
            :class="{ 'is-you': member.roll === email }"
          >
            <span class="rank__no">{{ String(member.rank).padStart(2, '0') }}</span>
            <span class="rank__avatar" aria-hidden="true">{{ member.name.charAt(0) }}</span>
            <span class="rank__who">
              <span class="rank__name">
                {{ member.name }}
                <span v-if="member.roll === email" class="rank__you">You</span>
              </span>
              <span class="rank__mail">{{ member.roll }}</span>
            </span>
            <span class="rank__pts">{{ member.pts }}<small>points</small></span>
          </li>
        </ol>
      </div>
    </section>

    <PortalFooter @logout="logout" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRight,
  BookOpen,
  BookMarked,
  Brain,
  CalendarDays,
  Drama,
  Dumbbell,
  HelpCircle,
  MessagesSquare,
  Mic2,
  Trophy,
} from 'lucide-vue-next';
import PortalNav from '../components/portal/PortalNav.vue';
import PortalFooter from '../components/portal/PortalFooter.vue';
import WhatsAppMark from '../components/portal/WhatsAppMark.vue';
import { brand } from '../components/navigation/navigation.config.js';
import { houseMoments } from '../data/portalImagery.js';
import { lowerHouse, sortByRegion } from '../data/council.js';
import { usePortalMember, vReveal } from '../composables/usePortalMember.js';
import '../assets/portal.css';

const router = useRouter();
const { email, displayName, firstName, initials, requireAuth, logout } = usePortalMember();

// ── GMEET LINKS — replace placeholders with real recurring links ───────────
const NIGHT_OWL_LINKS = {
  english: 'https://meet.google.com/placeholder-english',
  hindi: 'https://meet.google.com/placeholder-hindi',
};
const GMEET_LINKS = {
  monday: 'https://meet.google.com/placeholder-technical',
  tuesday: 'https://meet.google.com/placeholder-doubt',
  thursday: 'https://meet.google.com/placeholder-cultural',
  friday: 'https://meet.google.com/placeholder-sports',
  sunday: 'https://meet.google.com/placeholder-talk',
};

const countdownText = ref('00:00:00');
let countdownInterval = null;

// ── EVENTS ────────────────────────────────────────────────────────────────
const dayIndex = new Date().getDay();
const events = ref([
  {
    day: 1,
    dayLabel: 'Monday',
    icon: Brain,
    title: 'Technical Session',
    desc: 'Advanced DSA, system design and competitive programming with live mentors.',
    time: '8:00 PM IST',
    gmeetLink: GMEET_LINKS.monday,
    isToday: dayIndex === 1,
    isPast: false,
  },
  {
    day: 2,
    dayLabel: 'Tuesday',
    icon: HelpCircle,
    title: 'Doubt Session',
    desc: 'Live mentor questions and answers. Bring what you are stuck on, leave with clarity.',
    time: '8:00 PM IST',
    gmeetLink: GMEET_LINKS.tuesday,
    isToday: dayIndex === 2,
    isPast: false,
  },
  {
    day: 4,
    dayLabel: 'Thursday',
    icon: Drama,
    title: 'Cultural Night',
    desc: 'Debate nights, open mic and talent showcases. Say something, sing something, show up.',
    time: '8:00 PM IST',
    gmeetLink: GMEET_LINKS.thursday,
    isToday: dayIndex === 4,
    isPast: false,
  },
  {
    day: 5,
    dayLabel: 'Friday',
    icon: Dumbbell,
    title: 'Sports and Fitness',
    desc: 'House matches, fitness challenges and friendly competition. Stay active, stay sharp.',
    time: '8:00 PM IST',
    gmeetLink: GMEET_LINKS.friday,
    isToday: dayIndex === 5,
    isPast: false,
  },
  {
    day: 0,
    dayLabel: 'Sunday',
    icon: Mic2,
    title: 'Talk with Senior',
    desc: 'Career guidance, strategy sessions and real stories from seniors who have been there.',
    time: '8:00 PM IST',
    gmeetLink: GMEET_LINKS.sunday,
    isToday: dayIndex === 0,
    isPast: false,
  },
]);

// Mark today's event as past if hour >= 22
events.value.forEach((ev) => {
  if (ev.isToday && new Date().getHours() >= 22) ev.isPast = true;
});

/**
 * The nearest session still to come: tonight's if it has not finished,
 * otherwise the next weekday on the calendar. Read from the same five events
 * against today's date, never invented.
 */
const nextEvent = computed(() => {
  const upcoming = [...events.value]
    .map((ev) => ({ ev, away: (ev.day - dayIndex + 7) % 7 }))
    .filter(({ ev, away }) => !(away === 0 && ev.isPast))
    .sort((a, b) => a.away - b.away);
  return upcoming.length ? upcoming[0].ev : null;
});

const nextEventWhen = computed(() => {
  const ev = nextEvent.value;
  if (!ev) return '';
  const away = (ev.day - dayIndex + 7) % 7;
  const when = away === 0 ? 'Tonight' : away === 1 ? 'Tomorrow' : ev.dayLabel;
  return `${when}, ${ev.time}`;
});

// ── NIGHT OWL ────────────────────────────────────────────────────────────
const isNightOwlTime = computed(() => {
  const h = new Date().getHours();
  return h >= 21 && h < 23;
});
const ENGLISH_GENRES = ['Fiction', 'Sci-Fi', 'Non-Fiction', 'Mystery', 'Biography', 'Philosophy'];
const HINDI_GENRES = ['Kahani', 'Kavita', 'Upanyas', 'Sahitya', 'Natak'];
const currentEnglishGenre = ENGLISH_GENRES[new Date().getDay() % ENGLISH_GENRES.length];
const currentHindiGenre = HINDI_GENRES[new Date().getDay() % HINDI_GENRES.length];

const readingRooms = [
  {
    id: 'english',
    name: 'English Room',
    icon: BookOpen,
    genre: currentEnglishGenre,
    desc: 'Fiction, essays and everything worth reading slowly.',
    link: NIGHT_OWL_LINKS.english,
  },
  {
    id: 'hindi',
    name: 'Hindi Room',
    icon: BookMarked,
    genre: currentHindiGenre,
    desc: 'Kahani, kavita and conversation after dark.',
    link: NIGHT_OWL_LINKS.hindi,
  },
];

const houseBookPick = {
  title: 'Sapiens',
  author: 'Yuval Noah Harari',
  desc: 'A brief history of humankind, from foragers to rulers of the planet.',
  tags: ['Non-Fiction', 'History', 'Anthropology'],
};

// ── RECOGNITION ───────────────────────────────────────────────────────────
const leaderboard = [
  { name: 'Aditi Sharma', roll: '23f1000052@ds.study.iitm.ac.in', pts: 120 },
  { name: 'Rohan Verma', roll: '22f1000119@ds.study.iitm.ac.in', pts: 110 },
  { name: 'Mehak Singh', roll: '24f1000093@ds.study.iitm.ac.in', pts: 102 },
  { name: 'Dev Patel', roll: '23f2000114@ds.study.iitm.ac.in', pts: 98 },
  { name: 'Priya Nair', roll: '24f2000050@ds.study.iitm.ac.in', pts: 91 },
];

const board = computed(() => leaderboard.map((member, i) => ({ ...member, rank: i + 1 })));

/** Second, first, third: the reading order of a podium, left to right. */
const podium = computed(() => {
  const places = ['first', 'second', 'third'];
  const top = board.value.slice(0, 3).map((member, i) => ({ ...member, place: places[i] }));
  if (top.length < 3) return top;
  return [top[1], top[0], top[2]];
});

/** Only rendered when this member is genuinely on the board. */
const myStanding = computed(
  () => board.value.find((member) => member.roll === email.value) || null
);

// ── THE HOUSE TODAY ───────────────────────────────────────────────────────
const doors = computed(() => [
  {
    id: 'event',
    icon: CalendarDays,
    title: 'Next event',
    fact: nextEvent.value ? nextEvent.value.title : 'No session scheduled',
    when: nextEvent.value ? nextEventWhen.value : 'The week resumes on Monday',
    action: 'See the week',
    anchor: '#events',
  },
  {
    id: 'reading',
    icon: BookOpen,
    title: 'Reading lounge',
    fact: isNightOwlTime.value ? 'Rooms are open' : 'Night Owl at 9:30 PM',
    when: `${readingRooms.length} rooms, English and Hindi`,
    action: 'Pick a room',
    anchor: '#reading',
  },
  {
    id: 'community',
    icon: MessagesSquare,
    title: 'Community',
    fact: `${regionCount} regional groups`,
    when: 'Plus the main House group',
    action: 'Find your people',
    anchor: '#community',
  },
  {
    id: 'recognition',
    icon: Trophy,
    title: 'Recognition',
    fact: myStanding.value
      ? `You are No. ${myStanding.value.rank}`
      : `${board.value.length} on the board`,
    when: myStanding.value
      ? `${myStanding.value.pts} points this month`
      : 'The board refreshes monthly',
    action: 'See the rankings',
    anchor: '#recognition',
  },
]);

// ── COUNTDOWN ────────────────────────────────────────────────────────────
function updateCountdown() {
  const now = new Date(),
    target = new Date();
  target.setHours(21, 30, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const diff = target - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdownText.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Doors navigate through the router so the hash lands in history like a link. */
function goTo(anchor) {
  router.push(`/lounge${anchor}`);
}

onMounted(() => {
  if (!requireAuth()) return;
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

// ── WHATSAPP GROUPS ──────────────────────────────────────────────────────
// Two facts, kept apart on purpose. The sign-up link belongs to the portal;
// who coordinates a region belongs to the House roster. The roster is
// `src/data/council.js`, the same source the Teams and Leaderboard pages
// render, so a change of Regional Coordinator reaches all three at once and
// this view never keeps its own copy of a name.
const REGION_FORMS = {
  Bengaluru: 'https://forms.gle/G2qfFnE4hRPj682B9',
  Chandigarh: 'https://forms.gle/roBd62dYk6829eYCA',
  Chennai: 'https://forms.gle/uYzCs5WwngKm4zHH8',
  Delhi: 'https://forms.gle/2gagK33ZhBzsqGz67',
  Hyderabad: 'https://forms.gle/d8QRQ5eXooDHL8Db6',
  Kolkata: 'https://forms.gle/z6qnTg58cvjjNtxP6',
  Lucknow: 'https://forms.gle/poriXvnwuENkmiKF8',
  Mumbai: 'https://shorturl.at/EfRDc',
  Patna: 'https://forms.gle/jK7W2USVNEj9ifi17',
};

/** The three-letter label on each card. */
const REGION_CODES = {
  Bengaluru: 'BLR',
  Chandigarh: 'CHD',
  Chennai: 'CHE',
  Delhi: 'DEL',
  Hyderabad: 'HYD',
  Kolkata: 'KOL',
  Lucknow: 'LKO',
  Mumbai: 'MUM',
  Patna: 'PAT',
};

/** Regions in alphabetical order, which is also the order of the cards. */
const REGION_NAMES = Object.keys(REGION_FORMS).sort((a, b) => a.localeCompare(b, 'en'));

/**
 * One card per coordinator, so Mumbai's two Regional Coordinators each get
 * their own card and neither overwrites the other. A region the roster has no
 * coordinator for still renders, because its group link exists and dropping
 * the card would remove a way in; it simply says so rather than borrowing a
 * name from somewhere else.
 */
const regionalGroups = REGION_NAMES.flatMap((region) => {
  const base = { region, code: REGION_CODES[region], form: REGION_FORMS[region] };
  const coordinators = sortByRegion(lowerHouse.filter((member) => member.region === region));
  if (!coordinators.length) return [{ ...base, key: region, coordinator: null, role: null }];
  return coordinators.map((member) => ({
    ...base,
    key: member.id,
    coordinator: member.name,
    role: member.role,
  }));
});

/** Distinct regions, which is what the hero strip and the doors count. */
const regionCount = REGION_NAMES.length;
</script>

<style scoped>
/* ══ THE OPENING SPREAD ══════════════════════════════════════════════════ */
.hero {
  position: relative;
  overflow: hidden;
  padding-bottom: clamp(3rem, 6vw, 5rem);
}
.hero__mark {
  top: clamp(3rem, 8vw, 7rem);
}
.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
  padding-block: clamp(3.5rem, 9vh, 7rem) clamp(2.5rem, 6vh, 4.5rem);
}
.hero__title {
  margin-top: 1.25rem;
}
/* The name is set one step below the greeting: a long roll number or a long
   surname then has room on its own line instead of being broken mid-word,
   and the two lines read as a greeting rather than as one shout. */
.hero__title em {
  margin-top: 0.08em;
  font-size: clamp(2.25rem, 1rem + 4.4vw, 5.25rem);
  overflow-wrap: break-word;
}
.hero__lede {
  margin-top: clamp(1.5rem, 3vw, 2rem);
  max-width: 34ch;
  font-size: clamp(1rem, 0.95rem + 0.35vw, 1.25rem);
  line-height: 1.55;
  color: var(--p-ink-muted);
}

.hero__crest {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  width: min(100%, 24rem);
  justify-self: end;
}
.hero__orbit {
  inset: 0;
}
.hero__crest-img {
  width: 46%;
  height: auto;
  border-radius: 50%;
  opacity: 0.92;
}
.hero__crest-label {
  position: absolute;
  bottom: 6%;
  font-size: 0.5625rem;
  letter-spacing: 0.34em;
  line-height: 1.9;
  text-align: center;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}

/* ── Today at the House ─────────────────────────────────────────────────── */
.today__label,
.doors + .today__label {
  font-size: 0.625rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--p-line);
}
.today__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.75rem clamp(2rem, 5vw, 4rem);
  padding-block: clamp(1.75rem, 3vw, 2.25rem);
}
.today__item dt {
  font-size: 0.625rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}
.today__item dd {
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.today__value {
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem);
  line-height: 1.1;
  color: var(--p-ink);
}
.today__sub {
  font-size: 0.8125rem;
  color: var(--p-ink-faint);
  font-variant-numeric: tabular-nums;
}

/* ── The identity strip ─────────────────────────────────────────────────── */
.ident {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem clamp(1.5rem, 4vw, 3.5rem);
  padding-block: clamp(1.25rem, 2.5vw, 1.75rem);
  border-top: 1px solid var(--p-line);
  border-bottom: 1px solid var(--p-line);
}
.ident__avatar {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  border-radius: 50%;
  border: 1px solid var(--p-line-strong);
  color: var(--p-gold-light);
  font-family: var(--font-display);
  font-size: 0.9375rem;
}
.ident__block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}
.ident__role {
  font-size: 0.5625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}
.ident__name {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  color: var(--p-ink);
}
.ident__value {
  font-size: 0.8125rem;
  color: var(--p-ink-muted);
  overflow-wrap: anywhere;
}

/* ── The four doors ─────────────────────────────────────────────────────
   Columns divided by hairlines, never four boxes. The whole column is the
   hit area, and only the rule and the arrow respond. */
.doors {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding-top: clamp(2rem, 4vw, 3rem);
}
.door {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  min-width: 0;
  padding: 0.25rem clamp(1rem, 2.5vw, 2rem) 0.5rem 0;
  background: none;
  border: 0;
  text-align: left;
  font-family: var(--font-body);
  color: inherit;
  cursor: pointer;
}
.door + .door {
  padding-left: clamp(1rem, 2.5vw, 2rem);
  border-left: 1px solid var(--p-line);
}
.door::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.5rem;
  width: 100%;
  height: 1px;
  background: var(--p-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-button, 520ms) var(--p-ease);
}
.door:hover::after,
.door:focus-visible::after {
  transform: scaleX(1);
}
.door__icon {
  color: var(--p-gold);
  margin-bottom: 0.75rem;
}
.door__title {
  font-size: 0.625rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
}
.door__fact {
  font-family: var(--font-display);
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.5rem);
  line-height: 1.15;
  color: var(--p-ink);
}
.door__when {
  font-size: 0.8125rem;
  color: var(--p-ink-muted);
}
.door__action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--p-gold);
}
.door__action svg {
  transition: transform var(--duration-link, 340ms) var(--p-ease);
}
.door:hover .door__action svg {
  transform: translateX(4px);
}

/* ══ BANDS ═══════════════════════════════════════════════════════════════ */
.band {
  position: relative;
  overflow: hidden;
  padding-block: var(--p-band);
  scroll-margin-top: 5rem;
}
.band__mark {
  top: clamp(1rem, 3vw, 3rem);
}
.band__head {
  position: relative;
  z-index: 1;
  max-width: 52rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}
.band__head .p-eyebrow {
  margin-top: 0.75rem;
}
.band__head .p-display {
  margin-top: 1rem;
}
.band__head .p-lede {
  margin-top: 1.25rem;
}
/* Where the section has a second thought, it sits beside the title rather
   than under it. */
.band__head--split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
  align-items: end;
  gap: clamp(1.5rem, 4vw, 4rem);
  max-width: none;
}
.band__head-aside {
  padding-bottom: 0.5rem;
}
.band__head-aside .p-lede {
  margin-top: 0;
}

/* ── Events ─────────────────────────────────────────────────────────────── */
.cal {
  position: relative;
  z-index: 1;
  list-style: none;
  border-top: 1px solid var(--p-line);
}
.cal__row {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr) auto;
  align-items: start;
  gap: clamp(1rem, 3vw, 3rem);
  padding-block: clamp(1.5rem, 2.5vw, 2.25rem);
  border-bottom: 1px solid var(--p-line);
  transition: background-color var(--duration-card, 620ms) var(--p-ease);
}
.cal__row:hover {
  background: rgba(213, 166, 58, 0.025);
}
/* Tonight's row is the only one given weight: a gold edge and a raised
   ground, not a different component. */
.cal__row.is-today {
  background: var(--p-surface);
  box-shadow: inset 2px 0 0 var(--p-gold);
  padding-inline: clamp(1rem, 2vw, 1.75rem);
}
.cal__row.is-done {
  opacity: 0.5;
}
.cal__day {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.cal__day-name {
  font-size: 0.75rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
}
.cal__row.is-today .cal__day-name {
  color: var(--p-gold-light);
}
.cal__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.375rem, 1.1rem + 1vw, 2rem);
  line-height: 1.1;
  color: var(--p-ink);
}
.cal__desc {
  margin-top: 0.6rem;
  max-width: 56ch;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--p-ink-muted);
}
.cal__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.85rem;
}
.cal__time {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--p-ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ── Reading ────────────────────────────────────────────────────────────── */
.reading {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;
}
.rooms {
  list-style: none;
  border-top: 1px solid var(--p-line);
}
.room {
  padding-block: clamp(1.75rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--p-line);
}
.room__icon {
  color: var(--p-gold);
}
.room__name {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem);
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--p-ink);
}
.room__desc {
  margin-top: 0.9rem;
  max-width: 40ch;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--p-ink-muted);
}
.room__meta {
  margin-top: 0.75rem;
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}
.room__enter {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-ink-muted);
  text-decoration: none;
  transition: color var(--duration-link, 340ms) var(--p-ease);
}
.room__enter svg {
  transition: transform var(--duration-link, 340ms) var(--p-ease);
}
.room__enter:hover {
  color: var(--p-gold-light);
}
.room__enter:hover svg {
  transform: translateX(4px);
}

/* The pick is an editorial recommendation, so it is set like one. */
.pick {
  padding: clamp(1.5rem, 3vw, 2.25rem);
  background: var(--p-surface);
  border: 1px solid var(--p-line-card);
  border-radius: var(--p-radius);
}
.pick__label {
  font-size: 0.625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--p-gold);
}
.pick__body {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: clamp(1.25rem, 3vw, 2rem);
  margin-top: 1.75rem;
}
.pick__cover {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
  aspect-ratio: 2 / 3;
  padding: 1.1rem 1rem;
  background: linear-gradient(158deg, #0c120e, #060907 60%, #030504);
  border: 1px solid var(--p-line-card);
  border-left: 3px solid var(--p-gold-deep);
  border-radius: 2px 5px 5px 2px;
  box-shadow: var(--shadow-md);
}
.pick__cover-rule {
  position: absolute;
  top: 1.1rem;
  left: 1rem;
  width: 1.75rem;
  height: 1px;
  background: var(--p-gold-deep);
}
.pick__cover-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  line-height: 1.05;
  color: var(--p-ink);
}
.pick__cover-author {
  font-size: 0.5625rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
}
.pick__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.75rem, 1.4rem + 1vw, 2.25rem);
  line-height: 1.05;
  color: var(--p-ink);
}
.pick__author {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--p-gold-light);
}
.pick__desc {
  margin-top: 1rem;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--p-ink-muted);
}
.pick__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1.5rem;
  list-style: none;
}
.pick__tags li {
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--p-line);
  border-radius: 2px;
  font-size: 0.5625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
}

/* ── Community ──────────────────────────────────────────────────────────── */
.wa-mark {
  width: 15px;
  height: 15px;
  flex: none;
  color: var(--p-live);
}
.social {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
}
.social__label {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-ink-soft);
}
.social__title {
  margin-top: 1rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem);
  line-height: 1.05;
  color: var(--p-ink);
}
.social__desc {
  margin-top: 0.85rem;
  max-width: 44ch;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--p-ink-soft);
}
.social__main .p-btn {
  margin-top: 1.75rem;
}
/* The photograph runs past the text block on one side, so the pair reads as
   a spread rather than as two equal columns. */
.social__photo {
  aspect-ratio: 16 / 10;
  margin-top: clamp(1rem, 3vw, 2.5rem);
}

.rg__heading,
.rank__label {
  margin: clamp(2.5rem, 5vw, 4rem) 0 1.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--p-ink-soft);
}

/* ── The regional grid ──────────────────────────────────────────────────
   Explicit column counts rather than auto-fill: the card has a natural
   reading width, and letting it stretch across a 1900px shell is exactly
   what made the old row layout feel like a spreadsheet. */
.rg-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(0.75rem, 1.5vw, 1.125rem);
  list-style: none;
}
@media (min-width: 560px) {
  .rg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 900px) {
  .rg-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1600px) {
  .rg-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* The whole card is the link: one large hit area instead of a small one at
   the end of a row. Compact by design, and the same height across a row. */
.rg {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.375rem 1.375rem 1.25rem;
  background: var(--p-surface);
  border: 1px solid var(--p-line-card);
  border-radius: var(--p-radius);
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--duration-button, 520ms) var(--p-ease),
    background-color var(--duration-button, 520ms) var(--p-ease),
    transform var(--duration-button, 520ms) var(--p-ease);
}
.rg:hover {
  border-color: var(--p-line-strong);
  background: var(--p-surface-raised);
  transform: translateY(-3px);
}
.rg__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.125rem;
}
/* The single piece of green on the card, and the only thing that moves. */
.rg__mark {
  width: 18px;
  height: 18px;
  flex: none;
  color: var(--p-live);
  opacity: 0.8;
  transition:
    opacity var(--duration-button, 520ms) var(--p-ease),
    transform var(--duration-button, 520ms) var(--p-ease);
}
.rg:hover .rg__mark {
  opacity: 1;
  transform: translateY(-1px);
}
.rg__code {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  color: var(--p-gold);
}

/* City first and largest: the thing a member scans for. */
.rg__city {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.15;
  letter-spacing: 0;
  color: var(--p-ink);
}
/* Chillax, near-full contrast, no tracking. A coordinator's name is
   information, not decoration, so it is set to be read. */
.rg__person {
  margin-top: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: var(--p-ink-soft);
}
.rg__person--none {
  color: var(--p-ink-faint);
  font-style: italic;
}
.rg__role {
  margin-top: 0.2rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--p-ink-muted);
}
.rg__join {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 1.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--p-gold-light);
}
.rg__join svg {
  transition: transform var(--duration-link, 340ms) var(--p-ease);
}
.rg:hover .rg__join svg {
  transform: translateX(4px);
}
.rg:focus-visible {
  outline: 2px solid var(--p-gold);
  outline-offset: 3px;
}

/* ── Recognition ────────────────────────────────────────────────────────── */
.podium {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: end;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  list-style: none;
}
/* The seats differ in height and in metal, never in glow. */
.podium__seat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: clamp(1.5rem, 3vw, 2.25rem) 1rem;
  background: var(--p-surface);
  border: 1px solid var(--p-line);
  border-radius: var(--p-radius);
  text-align: center;
}
.podium__seat.is-first {
  border-color: var(--p-line-strong);
  padding-block: clamp(2.25rem, 5vw, 3.5rem);
  background: linear-gradient(180deg, rgba(213, 166, 58, 0.06), transparent 62%), var(--p-surface);
}
.podium__rank {
  font-family: var(--font-display);
  font-size: 0.875rem;
  letter-spacing: 0.24em;
  color: var(--p-ink-faint);
}
.podium__avatar {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  border: 1px solid var(--p-line);
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--p-ink);
}
.podium__seat.is-first .podium__avatar {
  width: 4.25rem;
  height: 4.25rem;
  font-size: 1.75rem;
  border-color: var(--p-gold);
  color: var(--p-gold-light);
}
.podium__seat.is-second .podium__avatar {
  border-color: rgba(195, 199, 201, 0.42);
  color: var(--p-silver);
}
.podium__seat.is-third .podium__avatar {
  border-color: rgba(185, 129, 73, 0.42);
  color: var(--p-bronze);
}
.podium__name {
  font-family: var(--font-display);
  font-size: clamp(1.0625rem, 0.95rem + 0.5vw, 1.375rem);
  color: var(--p-ink);
}
.podium__pts {
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
  color: var(--p-gold-light);
}
.podium__pts small,
.rank__pts small {
  margin-left: 0.35rem;
  font-size: 0.5625rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
}

.rank {
  list-style: none;
  border-top: 1px solid var(--p-line);
}
.rank__row {
  display: grid;
  grid-template-columns: 3rem 2.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding-block: 1rem;
  border-bottom: 1px solid var(--p-line);
}
.rank__row.is-you {
  box-shadow: inset 2px 0 0 var(--p-gold);
  padding-inline: 0.9rem;
  background: rgba(213, 166, 58, 0.03);
}
.rank__no {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-variant-numeric: tabular-nums;
  color: var(--p-ink-faint);
}
.rank__avatar {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid var(--p-line);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  color: var(--p-ink-muted);
}
.rank__who {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.rank__name {
  font-size: 1rem;
  color: var(--p-ink);
}
.rank__you {
  margin-left: 0.6rem;
  font-size: 0.5625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--p-gold);
}
.rank__mail {
  font-size: 0.75rem;
  color: var(--p-ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rank__pts {
  font-variant-numeric: tabular-nums;
  font-size: 1.0625rem;
  color: var(--p-ink);
  text-align: right;
  min-width: 6rem;
}

/* ══ RESPONSIVE ══════════════════════════════════════════════════════════
   The composition simplifies in three steps and never collapses into a
   stack of identical cards. */
@media (max-width: 1180px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1fr);
  }
  .hero__crest {
    justify-self: start;
    width: min(100%, 17rem);
    order: -1;
  }
  .doors {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 2.5rem;
  }
  .door:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }
  .reading,
  .social,
  .band__head--split {
    grid-template-columns: minmax(0, 1fr);
  }
  .band__head--split {
    align-items: start;
  }
}

@media (max-width: 760px) {
  .hero__crest {
    width: min(60%, 12rem);
  }
  .doors {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
  .door {
    padding: 1.5rem 0;
    border-top: 1px solid var(--p-line);
  }
  .door + .door {
    padding-left: 0;
    border-left: 0;
  }
  .door::after {
    display: none;
  }
  .cal__row,
  .cal__row.is-today {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.85rem;
    padding-inline: 0;
  }
  .cal__row.is-today {
    padding-inline: 0.9rem;
  }
  .cal__day {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .cal__side {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .pick__body {
    grid-template-columns: minmax(0, 1fr);
  }
  .pick__cover {
    max-width: 9rem;
  }
  .podium {
    grid-template-columns: minmax(0, 1fr);
  }
  /* Stacked, the first seat leads instead of sitting in the middle. */
  .podium__seat.is-first {
    order: -1;
  }
  .rank__row {
    grid-template-columns: 2.5rem 2.5rem minmax(0, 1fr);
    row-gap: 0.4rem;
  }
  .rank__pts {
    grid-column: 3;
    text-align: left;
    min-width: 0;
  }
}
</style>
