<template>
  <!-- Empty state when every upcoming event has passed -->
  <p v-if="events.length === 0" class="community-empty">
    <CalendarX :size="28" :stroke-width="1.6" aria-hidden="true" />
    <span>{{ emptyText }}</span>
  </p>
  <div v-else class="events-grid">
    <article v-for="event in events" :key="event.id" class="event-card">
      <div class="event-img-wrap">
        <img
          :src="event.image"
          :alt="event.title"
          class="event-img"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="event-body">
        <span class="event-type-tag">{{ event.type }}</span>
        <h3 class="event-title">{{ event.title }}</h3>
        <p class="event-desc">{{ event.description }}</p>
        <div class="event-meta">
          <span><Calendar :size="13" :stroke-width="1.9" /> {{ event.day }} {{ event.month }}</span>
          <span><Clock :size="13" :stroke-width="1.9" /> {{ event.time }}</span>
          <span><MapPin :size="13" :stroke-width="1.9" /> {{ event.venue }}</span>
        </div>
        <a
          v-if="hasLink(event.registerLink)"
          :href="event.registerLink"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--outline btn--sm event-cta"
        >
          Register Now
          <ArrowRight :size="14" :stroke-width="2" aria-hidden="true" />
        </a>
        <span v-else class="event-cta-pending">Registration opens soon</span>
      </div>
    </article>
  </div>
</template>

<script setup>
import { Calendar, Clock, MapPin, CalendarX, ArrowRight } from 'lucide-vue-next';

// Several events carry `registerLink: '#'`, which reloads the page and reads
// as a broken control. Those render as a status line instead of a button.
function hasLink(href) {
  const value = String(href ?? '').trim();
  return value !== '' && value !== '#';
}

// Image-led upcoming-event card, used by the Technical and Cultural pages.
// E-Sports uses a different card (date badge, no artwork) and keeps it locally.
defineProps({
  events: { type: Array, required: true },
  emptyText: { type: String, required: true },
});
</script>

<style scoped>
.event-cta {
  align-self: flex-start;
  margin-top: 0.9rem;
}

.event-cta-pending {
  margin-top: 0.9rem;
  font-size: 0.78rem;
  font-style: italic;
  color: var(--text3);
}
</style>
