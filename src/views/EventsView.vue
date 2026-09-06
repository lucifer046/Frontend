<template>
  <div>
    <!-- ═══ HERO ═══════════════════════════════════════════════════════════
         The site's own page-hero shell, with one addition: an eyebrow above
         the display line. Written here rather than through PageHero so the
         other nine pages that share that component are untouched. -->
    <section class="page-hero">
      <div class="page-hero-bg">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format&fit=crop"
          alt="A House audience at a Sundarbans event"
        />
        <div class="page-hero-overlay"></div>
      </div>
      <div class="container page-hero-content">
        <div class="breadcrumb-nav">
          <router-link to="/">Home</router-link><span>/</span><span>Events</span>
        </div>
        <div class="page-hero-eyebrow">What's Happening</div>
        <h1>
          Events &amp;
          <span class="tg">Activities</span>
        </h1>
        <p>
          From conversations and workshops to meetups, competitions and cultural moments, there is
          always something happening around the House.
        </p>
      </div>
    </section>

    <!-- ═══ NEXT ON THE CALENDAR ═══════════════════════════════════════════ -->
    <section class="section rs tone-b">
      <div class="container">
        <div class="ev-sec-head">
          <div class="section-tag">Next on the Calendar</div>
          <h2 class="section-title-xl">Upcoming <span class="tg">Highlight</span></h2>
          <p class="ev-sec-sub">
            The next thing on the House calendar, in full, before the rest of the listing.
          </p>
        </div>

        <article v-if="featuredEvent" class="ev-feature">
          <div class="ev-feature-media">
            <img
              :src="featuredEvent.img || fallbackImage"
              :alt="`Poster for ${featuredEvent.title}`"
              loading="lazy"
              decoding="async"
              @error="onImageError"
            />
          </div>

          <div class="ev-feature-body">
            <div class="section-tag">{{ featuredEvent.category || 'Featured' }}</div>
            <h3 class="ev-feature-title">{{ featuredEvent.title }}</h3>
            <p v-if="featuredEvent.desc" class="ev-feature-desc">{{ featuredEvent.desc }}</p>

            <div class="ev-facts">
              <div class="ev-fact">
                <span class="ev-fact-label">
                  <Calendar :size="13" :stroke-width="1.9" aria-hidden="true" /> Date
                </span>
                <span class="ev-fact-value">{{ featuredEvent.date }}</span>
              </div>
              <div v-if="featuredEvent.time" class="ev-fact">
                <span class="ev-fact-label">
                  <Clock :size="13" :stroke-width="1.9" aria-hidden="true" /> Time
                </span>
                <span class="ev-fact-value">{{ featuredEvent.time }}</span>
              </div>
              <div v-if="featuredEvent.location" class="ev-fact">
                <span class="ev-fact-label">
                  <MapPin :size="13" :stroke-width="1.9" aria-hidden="true" /> Where
                </span>
                <span class="ev-fact-value">{{ featuredEvent.location }}</span>
              </div>
            </div>

            <div>
              <router-link :to="featuredEvent.link || '/contact'" class="btn btn--primary">
                Register Now
                <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
              </router-link>
            </div>
          </div>
        </article>

        <!-- Nothing announced yet. The band still carries type and an offer. -->
        <div v-else class="ev-empty">
          <div>
            <h3 class="ev-empty-title">Nothing on the calendar just yet.</h3>
            <p class="ev-empty-copy">
              The next session is always in the making. Look through the archive below to see what
              the House has run so far, or bring us an idea of your own and we will help put it on.
            </p>
          </div>
          <div class="ev-empty-acts">
            <button type="button" class="btn btn--outline" @click="scrollToArchive">
              Browse the archive
            </button>
            <router-link to="/contact" class="btn btn--primary">
              Propose an event
              <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ WHAT'S ON ══════════════════════════════════════════════════════ -->
    <section class="section rs tone-a">
      <div class="container">
        <div class="ev-head">
          <div>
            <div class="section-tag">What's On</div>
            <h2 class="section-title-xl">Upcoming <span class="tg">Events</span></h2>
          </div>

          <div class="ev-filters" role="group" aria-label="Filter events by category">
            <button
              v-for="tab in tabs"
              :key="tab"
              type="button"
              class="sel"
              :aria-pressed="activeTab === tab"
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>
        </div>

        <div v-if="filteredEvents.length === 0" class="ev-none">
          <CalendarClock :size="26" :stroke-width="1.6" aria-hidden="true" />
          <h3 class="ev-none-title">No upcoming events right now</h3>
          <p>
            Check back soon. New workshops, meetups, competitions and talks are announced here
            first.
          </p>
        </div>

        <div v-else class="ev-grid">
          <article
            v-for="(ev, i) in filteredEvents"
            :key="ev.title"
            class="ev-card rc"
            :style="`--card-delay:${(i % 6) * 0.08}s`"
          >
            <div class="ev-card-media">
              <img
                :src="ev.img || fallbackImage"
                :alt="`Poster for ${ev.title}`"
                loading="lazy"
                decoding="async"
                @error="onImageError"
              />
            </div>
            <div class="ev-card-body">
              <div v-if="ev.category" class="ev-card-cat">{{ ev.category }}</div>
              <h3 class="ev-card-title">{{ ev.title }}</h3>
              <p v-if="ev.desc" class="ev-card-desc">{{ ev.desc }}</p>
              <div class="ev-card-meta">
                <span>
                  <Calendar :size="13" :stroke-width="1.9" aria-hidden="true" /> {{ ev.date }}
                </span>
                <span v-if="ev.time">
                  <Clock :size="13" :stroke-width="1.9" aria-hidden="true" /> {{ ev.time }}
                </span>
                <span v-if="ev.location">
                  <MapPin :size="13" :stroke-width="1.9" aria-hidden="true" /> {{ ev.location }}
                </span>
              </div>
              <div>
                <router-link :to="ev.link || '/contact'" class="btn btn--outline btn--sm">
                  Register
                  <ArrowRight :size="15" :stroke-width="2" aria-hidden="true" />
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══ MEMORIES : THE FILM REEL ═══════════════════════════════════════ -->
    <section id="past-events" class="section rs tone-b ev-archive">
      <div class="ev-archive-watermark" aria-hidden="true">Memories</div>
      <div class="container">
        <div class="ev-sec-head">
          <div class="section-tag">Memories</div>
          <h2 class="section-title-xl">Past <span class="tg">Events</span></h2>
          <p class="ev-sec-sub">
            Moments from the events, conversations and experiences that have shaped the House.
          </p>
        </div>
        <div class="ev-archive-rule"></div>
      </div>
      <PastEventsReel :events="pastEventList" />
    </section>

    <!-- ═══ HAVE AN IDEA? ══════════════════════════════════════════════════ -->
    <section class="section rs tone-a ev-host">
      <div class="container">
        <div class="ev-host-inner">
          <div>
            <div class="section-tag">Have an Idea?</div>
            <h2 class="ev-host-heading">Host Your <span class="tg">Own Event</span></h2>
            <p class="ev-host-copy">
              Have an idea for a workshop, talk or meetup? Share it with the House and help create
              the next experience.
            </p>
            <div class="ev-host-acts">
              <router-link to="/contact" class="btn btn--primary">
                Submit a Proposal
                <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
              </router-link>
              <router-link to="/contact" class="btn btn--outline">Talk to the Team</router-link>
            </div>
          </div>
          <div class="ev-host-rules" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ArrowRight, Calendar, CalendarClock, Clock, MapPin } from 'lucide-vue-next';
import PastEventsReel from '../components/events/PastEventsReel.vue';
import { FALLBACK_EVENT_IMAGE, FILTER_TABS, splitEvents } from '../data/events.js';
import { useScrollReveal } from '../composables/useAnimations.js';
import '../assets/events.css';

useScrollReveal();

const tabs = FILTER_TABS;
const activeTab = ref('All');
const fallbackImage = FALLBACK_EVENT_IMAGE;

// Resolved once per mount: anything whose date has passed is already in the
// archive by the time the page paints.
const { upcoming, past } = splitEvents();
const pastEventList = past;

const filteredEvents = computed(() =>
  activeTab.value === 'All' ? upcoming : upcoming.filter((e) => e.type === activeTab.value)
);

/**
 * The highlight slot. An event may claim it with `featured: true`; otherwise
 * it goes to whichever announced event happens first, and to the first entry
 * in the list if none of them carry a machine date.
 */
const featuredEvent = computed(() => {
  if (upcoming.length === 0) return null;
  const claimed = upcoming.find((e) => e.featured);
  if (claimed) return claimed;
  const dated = upcoming.filter((e) => e.dateISO);
  if (dated.length === 0) return upcoming[0];
  return [...dated].sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))[0];
});

/** The router is hash-based, so an in-page `#id` link would be read as a
 *  route. Scroll instead. */
function scrollToArchive() {
  const el = document.getElementById('past-events');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onImageError(event) {
  if (event.target.src !== FALLBACK_EVENT_IMAGE) event.target.src = FALLBACK_EVENT_IMAGE;
}
</script>
