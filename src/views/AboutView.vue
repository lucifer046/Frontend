<template>
  <!-- ══════════════════════════════════════════════════════════════════════
       ABOUT SUNDARBANS HOUSE

       Built on the public site's own design system, not a private one: the
       shared PageHero, `.section` bands alternating `tone-a` / `tone-b`,
       `.section-tag` labels, `.section-title-xl` headings with `.tg` gold
       accents, `.desc` body copy, `.card-base` surfaces and the global button
       and CTA classes. A visitor moving between Community, Teams, Contact and
       this page should not be able to tell that this one was written later.

       Every factual claim is checked against the IIT Madras BS programme's own
       student life pages and Sundarbans' own public profile. Nothing here
       counts members, ranks Houses or claims an achievement the House has not
       published; where a number would be fragile, a structural fact is used
       instead.
       ══════════════════════════════════════════════════════════════════ -->
  <div>
    <PageHero
      bg-image="https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1920,c_limit/v1785911370/sundarbans/src/assets/Sundarbans-House_Vue.jpg"
      breadcrumb-title="About"
      title="More Than a House."
      accent-title="A Community."
      subtitle="Sundarbans is a student community within the IIT Madras BS Degree Programme, bringing
        learners from across the country together through academic support, leadership, creativity
        and shared experiences."
    />

    <!-- ══ WHO WE ARE ═════════════════════════════════════════════════════
         Asymmetric: the argument on one side, two House photographs layered
         on the other. -->
    <section class="section rs tone-b" aria-labelledby="who-heading">
      <div class="container">
        <div class="ab-split">
          <div>
            <p class="section-tag">Who we are</p>
            <h2 id="who-heading" class="section-title-xl">
              A House built <span class="tg">around people</span>
            </h2>
            <p class="desc">
              Sundarbans is one of the twelve student Houses of the IIT Madras BS Degree Programme,
              each named after an Indian forest. While the programme connects learners across
              locations and backgrounds, the House system gives that community a closer sense of
              belonging.
            </p>
            <p class="desc">
              Here, students find people to learn with, ask for help, build with, celebrate with and
              grow alongside.
            </p>
            <blockquote class="ab-quote">
              Houses create a national peer identity. Regions create nearby touchpoints.
            </blockquote>
          </div>

          <div class="ab-stack">
            <figure class="ab-photo ab-stack__back">
              <img
                :src="photos.gathering"
                alt="Sundarbans House members at a community gathering"
                loading="lazy"
              />
            </figure>
            <figure class="ab-photo ab-stack__front">
              <img
                :src="photos.meetup"
                alt="Sundarbans House members at a regional meetup"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ OUR STORY ══════════════════════════════════════════════════════ -->
    <section class="section rs tone-a" aria-labelledby="story-heading">
      <div class="container">
        <div class="sec-hdr">
          <p class="section-tag ab-tag-center">Our story</p>
          <h2 id="story-heading" class="section-title-xl">
            From one House <span class="tg">to a living community</span>
          </h2>
          <p class="sec-sub">
            Founded in 2021, Sundarbans House has grown through the people who have chosen to
            participate, organise, mentor, create and lead. Each team adds another chapter to the
            House.
          </p>
        </div>

        <!-- Stages, not dates: only the founding year is on public record. -->
        <ol class="ab-timeline">
          <li v-for="(step, i) in timeline" :key="step.title" class="ab-timeline__step">
            <span class="ab-timeline__year">{{ step.year }}</span>
            <span class="ab-timeline__dot" aria-hidden="true"></span>
            <h3 class="ab-timeline__title">{{ step.title }}</h3>
            <p class="ab-timeline__desc">{{ step.desc }}</p>
            <span
              v-if="i < timeline.length - 1"
              class="ab-timeline__rule"
              aria-hidden="true"
            ></span>
          </li>
        </ol>
      </div>
    </section>

    <!-- ══ HOW THE HOUSE WORKS ════════════════════════════════════════════ -->
    <section class="section rs tone-b" aria-labelledby="works-heading">
      <div class="container">
        <div class="sec-hdr">
          <p class="section-tag ab-tag-center">How the House works</p>
          <h2 id="works-heading" class="section-title-xl">
            One House. <span class="tg">Many cities.</span>
          </h2>
          <p class="sec-sub">
            Students in the programme are distributed across India and beyond. Houses create a
            shared identity across that distance, while regional groups create local opportunities
            to meet, collaborate and participate.
          </p>
        </div>

        <div class="ab-model">
          <article v-for="part in model" :key="part.label" class="card-base ab-model__part">
            <span class="ab-model__icon">
              <component :is="part.icon" :size="24" :stroke-width="1.7" aria-hidden="true" />
            </span>
            <h3>{{ part.label }}</h3>
            <p class="desc">{{ part.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ══ WHAT WE DO ═════════════════════════════════════════════════════
         Icons beside the text rather than inside six matching boxes. -->
    <section class="section rs tone-a" aria-labelledby="do-heading">
      <div class="container">
        <div class="sec-hdr">
          <p class="section-tag ab-tag-center">What we do</p>
          <h2 id="do-heading" class="section-title-xl">
            Where student life <span class="tg">takes shape</span>
          </h2>
        </div>

        <ul class="ab-areas">
          <li v-for="area in areas" :key="area.title" class="ab-area">
            <span class="ab-area__icon">
              <component :is="area.icon" :size="20" :stroke-width="1.8" aria-hidden="true" />
            </span>
            <div>
              <h3>{{ area.title }}</h3>
              <p>{{ area.desc }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ══ THE SUNDARBANS SUMMIT ══════════════════════════════════════════ -->
    <section class="section rs tone-b" aria-labelledby="summit-heading">
      <div class="container">
        <div class="ab-split ab-split--tight">
          <div>
            <p class="section-tag">Signature initiative</p>
            <h2 id="summit-heading" class="section-title-xl">
              The Sundarbans <span class="tg">Summit</span>
            </h2>
            <p class="desc">
              A career oriented series in which working professionals share their experience and
              perspective with students of the House: how they got where they are, what the work
              actually looks like, and what they would tell someone starting out.
            </p>
            <p class="desc">
              It is one of the clearest expressions of what the House is for. Students organise it,
              students host it, and the whole House is invited.
            </p>
          </div>

          <figure class="ab-photo ab-summit__photo">
            <img :src="photos.summit" alt="A Sundarbans House session in progress" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- ══ WHAT MEMBERS EXPERIENCE ════════════════════════════════════════ -->
    <section class="section rs tone-a" aria-labelledby="experience-heading">
      <div class="container">
        <div class="sec-hdr">
          <p class="section-tag ab-tag-center">Student experience</p>
          <h2 id="experience-heading" class="section-title-xl">
            Find your people. <span class="tg">Find your place.</span>
          </h2>
        </div>

        <ol class="ab-principles">
          <li v-for="(p, i) in principles" :key="p.title" class="ab-principle">
            <span class="ab-principle__no">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ══ A HOUSE WITHOUT BORDERS ════════════════════════════════════════
         Chapter names only. No map and no geographic weighting, because no
         public dataset says how the House is distributed. -->
    <section class="section rs tone-b" aria-labelledby="borders-heading">
      <div class="container">
        <div class="ab-split ab-split--tight">
          <div>
            <p class="section-tag">Across the country</p>
            <h2 id="borders-heading" class="section-title-xl">
              A House without <span class="tg">borders</span>
            </h2>
            <p class="desc">
              Students may learn from different cities, but the House gives them a common place to
              belong. The programme runs regional chapters alongside the Houses, so a national
              community also has somewhere local to meet.
            </p>
            <router-link to="/meetups" class="btn btn--outline">
              See where we meet
              <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
            </router-link>
          </div>

          <ul class="ab-regions" aria-label="Regional chapters">
            <li v-for="region in regionNames" :key="region">{{ region }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ══ OUR PEOPLE ═════════════════════════════════════════════════════ -->
    <section class="section rs tone-a" aria-labelledby="people-heading">
      <div class="container">
        <div class="ab-split ab-split--tight">
          <div>
            <p class="section-tag">Our people</p>
            <h2 id="people-heading" class="section-title-xl">
              Built by <span class="tg">students</span>
            </h2>
            <p class="desc">
              Every edition of Sundarbans is shaped by students who choose to organise, contribute
              and lead.
            </p>
            <router-link to="/teams" class="btn btn--primary">
              View the team
              <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
            </router-link>
          </div>

          <ul class="ab-roles">
            <li v-for="role in roles" :key="role">{{ role }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ══ HOUSE ARCHIVE ══════════════════════════════════════════════════
         The institutional memory, restored. Every academic year on record is
         shown at once: with five of them an accordion would hide more than it
         saved, and the brief asks that the section be understandable without
         interaction. The year is the landmark and the offices read across it,
         so it scans as an archive rather than as a directory of cards. -->
    <section class="section rs tone-b ab-archive" aria-labelledby="archive-heading">
      <div class="container">
        <div class="sec-hdr">
          <p class="section-tag ab-tag-center">A legacy of leadership</p>
          <h2 id="archive-heading" class="section-title-xl">
            The people who built <span class="tg">the House</span>
          </h2>
          <p class="sec-sub">
            Every team leaves something behind. Over the years, students have shaped Sundarbans
            House through leadership, organisation and service to the community.
          </p>
        </div>

        <p class="ab-archive__label">House archive</p>

        <ol class="ab-archive__years">
          <li v-for="year in leadershipArchive" :key="year.period" class="ar-year">
            <h3 class="ar-year__period">{{ year.period }}</h3>

            <div class="ar-offices">
              <article
                v-for="member in membersInOfficeOrder(year)"
                :key="member.role"
                class="ar-office"
              >
                <p class="ar-office__role">{{ member.role }}</p>
                <p class="ar-office__name">{{ member.name }}</p>

                <div class="ar-office__links">
                  <a
                    v-if="member.email"
                    :href="`mailto:${member.email}`"
                    class="ar-office__link"
                    :aria-label="`Email ${member.name}`"
                    :title="member.email"
                  >
                    <Mail :size="15" :stroke-width="1.8" aria-hidden="true" />
                  </a>
                  <a
                    v-if="member.linkedin"
                    :href="member.linkedin"
                    target="_blank"
                    rel="noopener"
                    class="ar-office__link"
                    :aria-label="`${member.name} on LinkedIn`"
                  >
                    <Linkedin :size="15" :stroke-width="1.8" aria-hidden="true" />
                  </a>
                  <a
                    v-if="member.instagram"
                    :href="instagramUrl(member.instagram)"
                    target="_blank"
                    rel="noopener"
                    class="ar-office__link"
                    :aria-label="`${member.name} on Instagram`"
                    :title="member.instagram"
                  >
                    <Instagram :size="15" :stroke-width="1.8" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- ══ WHY SUNDARBANS ═════════════════════════════════════════════════ -->
    <section class="section rs tone-a" aria-labelledby="why-heading">
      <div class="container">
        <div class="sec-hdr">
          <p class="section-tag ab-tag-center">Why Sundarbans</p>
          <h2 id="why-heading" class="section-title-xl">
            What makes the House <span class="tg">worth joining</span>
          </h2>
        </div>

        <div class="ab-why">
          <article v-for="(reason, i) in reasons" :key="reason.title" class="ab-why__item">
            <span class="ab-why__no" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ reason.title }}</h3>
              <p class="desc">{{ reason.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ══ THE DELTA DIARIES ══════════════════════════════════════════════
         The House magazine, behaving exactly as before: the same Flipsnack
         embed opened in the same modal. -->
    <section class="section rs tone-b" aria-labelledby="magazine-heading">
      <div class="container">
        <div class="ab-split ab-split--tight">
          <div>
            <p class="section-tag">The House magazine</p>
            <h2 id="magazine-heading" class="section-title-xl">
              The Delta <span class="tg">Diaries</span>
            </h2>
            <p class="desc">
              Writing, artwork and reflections from across the House, collected and published by
              students.
            </p>
            <button type="button" class="btn btn--primary" @click="openMagazine">
              Read the magazine
              <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
            </button>
          </div>

          <button
            class="ab-magazine__cover"
            type="button"
            aria-label="Open The Delta Diaries magazine"
            @click="openMagazine"
          >
            <img
              :src="magazinePreview"
              alt="The Delta Diaries, Sundarbans House annual magazine"
              loading="lazy"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- ══ JOIN THE HOUSE ═════════════════════════════════════════════════
         The site's shared CTA band, the same one the homepage and Events use. -->
    <section class="section cta-section rs">
      <div class="container">
        <div class="cta-wrap">
          <div class="section-tag light">Join the House</div>
          <h2 class="cta-heading">There is room<br /><span class="cta-acc">for you here.</span></h2>
          <p class="cta-sub">
            Whether you want to study alongside other people, help run something, or simply meet the
            rest of your House, there is a way in.
          </p>
          <div class="cta-acts">
            <router-link to="/community" class="cta-btn-p">
              <span>Explore the community</span>
              <ArrowRight :size="18" :stroke-width="2.5" aria-hidden="true" />
            </router-link>
            <router-link to="/contact" class="cta-btn-o">Contact the House</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Magazine reader, unchanged in behaviour. -->
    <div
      v-if="isMagazineOpen"
      class="ab-reader"
      role="dialog"
      aria-modal="true"
      aria-label="The Delta Diaries"
    >
      <button
        type="button"
        class="ab-reader__close"
        aria-label="Close magazine"
        @click="closeMagazine"
      >
        <X :size="20" :stroke-width="2" />
      </button>
      <iframe
        :src="magazineEmbedUrl"
        title="The Delta Diaries magazine"
        allowfullscreen
        allow="autoplay; clipboard-write"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Compass,
  Drama,
  Handshake,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-vue-next';
import { useScrollReveal } from '../composables/useAnimations.js';
import PageHero from '../components/PageHero.vue';
import { regions } from '../data/regions.js';
import {
  leadershipArchive,
  membersInOfficeOrder,
  instagramUrl,
} from '../data/leadershipArchive.js';

useScrollReveal();

/**
 * Photographs of the House itself, already published through Cloudinary and
 * recorded in `media/manifest.json`. No stock imagery is used on this page.
 */
const CDN = 'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1400,c_limit';
const photos = {
  gathering: `${CDN}/v1785911322/sundarbans/public/assets/pastevent/2025-05-09_06-25-51_UTC.jpg`,
  meetup: `${CDN}/v1785911324/sundarbans/public/assets/pastevent/bengaluru_meetup_608_1.png`,
  summit: `${CDN}/v1785911314/sundarbans/public/assets/pastevent/2024-07-16_11-41-17_UTC.jpg`,
};

const magazinePreview =
  'https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911353/sundarbans/src/assets/delta-diaries-preview.webp';
const magazineEmbedUrl = 'https://player.flipsnack.com?hash=N0U3Nzg2RUQ3NUUrdTVzNGt1ZDJneA==';
const isMagazineOpen = ref(false);

function closeMagazine() {
  isMagazineOpen.value = false;
  document.body.style.overflow = '';
}

function openMagazine() {
  isMagazineOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function handleMagazineKeydown(event) {
  if (event.key === 'Escape' && isMagazineOpen.value) closeMagazine();
}

window.addEventListener('keydown', handleMagazineKeydown);
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleMagazineKeydown);
  document.body.style.overflow = '';
});

/**
 * Stages, not dates. Only the founding year is on public record (Sundarbans'
 * own LinkedIn profile), so the rest describe how the House has developed
 * rather than claiming a month for each step.
 */
const timeline = [
  {
    year: '2021',
    title: 'The House is founded',
    desc: 'Sundarbans joins the twelve Houses of the BS programme.',
  },
  {
    year: 'Then',
    title: 'A student community forms',
    desc: 'Members begin studying, organising and meeting together.',
  },
  {
    year: 'Then',
    title: 'Events, clubs and initiatives',
    desc: 'Student led clubs and sessions become a regular part of House life.',
  },
  {
    year: 'Then',
    title: 'Regional connections',
    desc: 'Chapters give the national House somewhere local to gather.',
  },
  {
    year: 'Now',
    title: 'The House today',
    desc: 'Each council adds another chapter and hands it on.',
  },
];

const model = [
  {
    icon: Building2,
    label: 'House',
    desc: 'A national community and a shared identity, held across every city the programme reaches.',
  },
  {
    icon: MapPin,
    label: 'Region',
    desc: 'Local chapters where members meet in person, collaborate and take part close to home.',
  },
  {
    icon: UsersRound,
    label: 'Leadership',
    desc: 'Secretaries, deputies and regional coordinators: students who organise and support the House.',
  },
];

const areas = [
  {
    icon: BookOpen,
    title: 'Academic support',
    desc: 'Study resources, doubt sessions, revision support and peer learning.',
  },
  {
    icon: Handshake,
    title: 'Community',
    desc: 'Regional groups, meetups and everyday opportunities to connect.',
  },
  {
    icon: UsersRound,
    title: 'Leadership',
    desc: 'Students organise, coordinate and contribute to how the House runs.',
  },
  {
    icon: Compass,
    title: 'Career and learning',
    desc: 'Career oriented sessions and expert interactions, including the Sundarbans Summit.',
  },
  {
    icon: Drama,
    title: 'Cultural life',
    desc: 'Festivals, creative activities and celebrations that the whole House shares.',
  },
  {
    icon: Sparkles,
    title: 'Clubs and interests',
    desc: 'Student led clubs spanning finance, entrepreneurship, art, culture and welfare.',
  },
];

const principles = [
  { title: 'Learn together', desc: 'Peer discussion, shared resources and academic support.' },
  { title: 'Show up', desc: 'Events, meetups and activities beyond the coursework.' },
  { title: 'Build together', desc: 'Projects, clubs, initiatives and student led ideas.' },
  {
    title: 'Grow together',
    desc: 'Leadership, friendships and experience that outlast a single term.',
  },
];

const reasons = [
  {
    title: 'Community with reach',
    desc: 'A House connected across cities and backgrounds, not confined to one campus or one cohort.',
  },
  {
    title: 'Student led',
    desc: 'Students actively organise, build and shape the experience rather than receive it.',
  },
  {
    title: 'Life beyond the classroom',
    desc: 'Learning continues through people, projects, events and shared experience.',
  },
];

const roles = ['Secretary', 'Deputy Secretary', 'Web Admin', 'Regional Coordinators'];

/** Chapter names only. The member figures in that file are not published facts. */
const regionNames = [...regions.map((r) => r.name)].sort((a, b) => a.localeCompare(b, 'en'));
</script>

<style scoped>
/* Only the compositions this page introduces are styled here. Type, colour,
   spacing, cards and buttons all come from the global system, so the page
   inherits any future change to it. */

/* ── Two column bands ───────────────────────────────────────────────────── */
.ab-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
}
.ab-split--tight {
  gap: clamp(2rem, 4vw, 3.5rem);
}

/* Centred section headers put the gold rule before the label off axis, so it
   is centred with the text it labels. */
.ab-tag-center {
  justify-content: center;
}

.ab-quote {
  margin: 1.75rem 0 0;
  padding-left: 1.25rem;
  border-left: 1px solid var(--border-card);
  max-width: 44ch;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.6;
  color: var(--text);
}

/* ── Photographs ────────────────────────────────────────────────────────── */
.ab-photo {
  position: relative;
  overflow: hidden;
  margin: 0;
  background: var(--color-bg-footer);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
}
.ab-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Held back so a bright photograph cannot break the dark page. */
  filter: saturate(0.78) brightness(0.82);
  transition:
    transform var(--duration-card) var(--ease-editorial),
    filter var(--duration-card) var(--ease-editorial);
}
.ab-photo:hover img {
  transform: scale(1.035);
  filter: saturate(0.92) brightness(0.94);
}

/* One photograph overlapping another, rather than a matching pair. */
.ab-stack {
  position: relative;
  padding-bottom: clamp(2.5rem, 6vw, 5rem);
  padding-right: clamp(1.5rem, 4vw, 3rem);
}
.ab-stack__back {
  aspect-ratio: 4 / 3;
  margin-left: clamp(1.5rem, 5vw, 4rem);
}
.ab-stack__front {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 52%;
  aspect-ratio: 1;
  box-shadow: var(--shadow-lg);
}
.ab-summit__photo {
  aspect-ratio: 5 / 4;
}

/* ── Timeline ───────────────────────────────────────────────────────────── */
.ab-timeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 2rem);
  list-style: none;
  padding: 0;
  margin: 0;
}
.ab-timeline__step {
  position: relative;
  padding-top: 2.25rem;
}
.ab-timeline__year {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
}
.ab-timeline__dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  background: var(--bg);
}
.ab-timeline__rule {
  position: absolute;
  top: 4px;
  left: 9px;
  right: calc(-1 * clamp(1rem, 2.5vw, 2rem));
  height: 1px;
  background: var(--border-subtle);
}
.ab-timeline__title {
  margin-top: 0.6rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text);
}
.ab-timeline__desc {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text2);
}

/* ── The House and region model ─────────────────────────────────────────── */
.ab-model {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}
.ab-model__icon {
  display: inline-grid;
  place-items: center;
  color: var(--accent);
  margin-bottom: 1rem;
}
.ab-model__part h3 {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
  margin-bottom: 0.65rem;
}
.ab-model__part .desc {
  margin-bottom: 0;
}

/* ── Areas of activity ──────────────────────────────────────────────────── */
.ab-areas {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.75rem, 3.5vw, 3rem) clamp(2rem, 4vw, 3.5rem);
  list-style: none;
  padding: 0;
  margin: 0;
}
.ab-area {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}
.ab-area__icon {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-card);
  border-radius: var(--rad);
  color: var(--accent);
}
.ab-area h3 {
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text);
  margin-bottom: 0.4rem;
}
.ab-area p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text2);
}

/* ── Principles ─────────────────────────────────────────────────────────── */
.ab-principles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
  list-style: none;
  padding: 0;
  margin: 0;
}
.ab-principle {
  padding-top: 1.35rem;
  border-top: 1px solid var(--border-card);
}
.ab-principle__no {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--gold-dark);
}
.ab-principle h3 {
  margin-top: 0.85rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text);
}
.ab-principle p {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text2);
}

/* ── Chapters and roles ─────────────────────────────────────────────────── */
.ab-regions,
.ab-roles {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--border-card);
}
.ab-regions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  border-top: 0;
}
.ab-regions li {
  padding: 0.95rem 0.75rem 0.95rem 0;
  border-bottom: 1px solid var(--border-subtle);
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
}
.ab-roles li {
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--border-card);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
}

/* ── Why Sundarbans ─────────────────────────────────────────────────────── */
.ab-why {
  display: grid;
  gap: clamp(1.25rem, 2.5vw, 2rem);
}
.ab-why__item {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  align-items: start;
  gap: clamp(1rem, 2.5vw, 2rem);
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-card);
}
.ab-why__no {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--gold-dark);
}
.ab-why__item h3 {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.2vw, 1.9rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text);
  margin-bottom: 0.65rem;
}
.ab-why__item .desc {
  margin-bottom: 0;
  max-width: 52ch;
}

/* ── House archive ──────────────────────────────────────────────────────
   An archive, not a directory: the year is the landmark, the offices read
   across it, and a hairline separates one year from the next. Type, colour
   and spacing all come from the public system. */
/* No decorative mark sits behind these records. A watermark here would have
   to be a direct child of the section, and the site's reveal rule
   (`section.rs.revealed > *`) forces every direct child to full opacity, so a
   faint image cannot stay faint in this position. */
.ab-archive__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text3);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-card);
  margin-bottom: 0;
}

.ab-archive__years {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ar-year {
  display: grid;
  grid-template-columns: minmax(8rem, 12rem) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: start;
  padding: clamp(1.75rem, 3vw, 2.5rem) 0;
  border-bottom: 1px solid var(--border-subtle);
}
.ar-year:last-child {
  border-bottom: 0;
}
/* The gold year label, using the site's own gradient accent. */
.ar-year__period {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--gold-light), var(--accent), var(--gold-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ar-offices {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.25rem, 3vw, 2.5rem);
}
.ar-office__role {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
}
.ar-office__name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text);
}
.ar-office__links {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.85rem;
}
.ar-office__link {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--rad);
  color: var(--text2);
  transition:
    border-color var(--duration-link) var(--ease-editorial),
    color var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}
.ar-office__link:hover {
  border-color: var(--border-card-hover);
  color: var(--accent);
  transform: translateY(-2px);
}

/* ── Magazine ───────────────────────────────────────────────────────────── */
.ab-magazine__cover {
  display: block;
  padding: 0;
  background: none;
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial);
}
.ab-magazine__cover img {
  display: block;
  width: 100%;
  height: auto;
}
.ab-magazine__cover:hover {
  border-color: var(--border-card-hover);
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

/* ── Magazine reader ────────────────────────────────────────────────────── */
.ab-reader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(3, 4, 3, 0.96);
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
}
.ab-reader iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: var(--bg);
}
.ab-reader__close {
  position: absolute;
  top: clamp(0.75rem, 2vw, 1.5rem);
  right: clamp(0.75rem, 2vw, 1.5rem);
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  background: transparent;
  border: 1px solid var(--border-card);
  border-radius: var(--rad);
  color: var(--text);
  cursor: pointer;
  transition: border-color var(--duration-link) var(--ease-editorial);
}
.ab-reader__close:hover {
  border-color: var(--border-card-hover);
}

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .ab-split {
    grid-template-columns: minmax(0, 1fr);
  }
  .ab-timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }
  .ab-timeline__rule {
    display: none;
  }
  .ab-model,
  .ab-areas,
  .ab-principles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ar-year {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 700px) {
  .ab-timeline,
  .ab-model,
  .ab-areas,
  .ab-principles,
  .ab-regions {
    grid-template-columns: minmax(0, 1fr);
  }
  .ab-stack {
    padding-bottom: 0;
    padding-right: 0;
  }
  .ab-stack__back {
    margin-left: 0;
  }
  .ab-stack__front {
    position: static;
    width: 100%;
    margin-top: 1rem;
    aspect-ratio: 4 / 3;
  }
  .ab-why__item {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }
  .ar-offices {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ab-photo img,
  .ab-magazine__cover {
    transition: none;
  }
  .ab-photo:hover img,
  .ab-magazine__cover:hover,
  .ar-office__link:hover {
    transform: none;
  }
}
</style>
