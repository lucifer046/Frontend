<template>
  <!-- Empty state when every upcoming event has passed -->
  <div v-if="events.length === 0" style="text-align: center; padding: 3rem 0; color: var(--text2)">
    <div
      style="color: var(--accent); margin-bottom: 0.75rem; display: flex; justify-content: center"
    >
      <CalendarX :size="28" :stroke-width="1.6" />
    </div>
    <p style="font-size: 1.1rem">{{ emptyText }}</p>
  </div>
  <div v-else class="events-grid">
    <div v-for="event in events" :key="event.id" class="event-card">
      <div class="event-img-wrap">
        <img :src="event.image" :alt="event.title" class="event-img" />
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
          :href="event.registerLink || '#'"
          target="_blank"
          rel="noopener noreferrer"
          class="register-btn"
          >Register Now</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar, Clock, MapPin, CalendarX } from 'lucide-vue-next';

// Image-led upcoming-event card, used by the Technical and Cultural pages.
// E-Sports uses a different card (date badge, no artwork) and keeps it locally.
defineProps({
  events: { type: Array, required: true },
  emptyText: { type: String, required: true },
});
</script>
