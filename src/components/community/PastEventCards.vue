<template>
  <div class="past-events-grid">
    <article v-for="event in cards" :key="event.id" class="past-event-card">
      <div v-if="event.hasImage" class="past-event-img-wrap">
        <!-- Blurred backdrop fills the frame so letterboxed art has no black bars -->
        <img :src="event.image" alt="" class="past-event-img-blur" aria-hidden="true" />
        <img
          :src="event.image"
          :alt="event.title"
          class="past-event-img"
          loading="lazy"
          decoding="async"
          @error="onImageError(event.id)"
        />
        <div class="past-event-overlay">
          <span class="past-event-date">{{ event.date }}</span>
        </div>
      </div>

      <!--
        No artwork on record. The E-Sports upcoming cards lead with a date
        badge rather than a poster, so when one ages into this list it arrives
        without an `image` — an <img> with no src, which paints the broken-image
        icon. This band replaces the frame entirely rather than rendering an
        empty one.
      -->
      <div v-else class="past-event-plate">
        <span class="past-event-plate-date">{{ event.date }}</span>
      </div>

      <div class="past-event-body">
        <span class="event-type-tag">{{ event.type }}</span>
        <h3 class="past-event-title">{{ event.title }}</h3>
        <p class="past-event-desc">{{ event.description }}</p>
        <div v-if="event.attendees" class="past-event-stat">
          <Users :size="13" :stroke-width="1.9" aria-hidden="true" /> {{ event.attendees }} attended
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Users } from 'lucide-vue-next';

const props = defineProps({
  events: { type: Array, required: true },
});

const failed = ref({});
function onImageError(id) {
  failed.value = { ...failed.value, [id]: true };
}

function usableImage(src) {
  const value = String(src ?? '').trim();
  return value !== '' && value !== '#';
}

const cards = computed(() =>
  props.events.map((event) => ({
    ...event,
    hasImage: usableImage(event.image) && !failed.value[event.id],
  }))
);
</script>

<style scoped>
/* The no-artwork header: the community accent, a hairline, and the date set
   in the display face. Same height contribution as a 16:9 frame would make in
   a short card, so a mixed grid still lines up. */
.past-event-plate {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem 1.5rem;
  background: var(--cx-tint, rgba(213, 166, 58, 0.08));
  border-bottom: 1px solid var(--border-subtle);
}

.past-event-plate-date {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--cx, var(--accent));
}
</style>
