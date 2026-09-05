<template>
  <article class="mc">
    <!-- Head: the month sits as an eyebrow over the title, with the post link
         parked on the opposite edge so it never interrupts the reading line. -->
    <div class="mc-head">
      <p v-if="meetup.badge" class="mc-eyebrow">{{ meetup.badge }}</p>
      <a
        v-if="meetup.instaUrl"
        :href="meetup.instaUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mc-post"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
        <span>View Post</span>
        <span class="sr-only"> for {{ meetup.title }}</span>
      </a>
    </div>

    <h3 class="mc-title">{{ meetup.title }}</h3>

    <!-- Plain metadata, separated by rules rather than boxed into chips. -->
    <p v-if="metadata.length" class="mc-meta">
      <template v-for="(item, i) in metadata" :key="item">
        <span v-if="i > 0" class="mc-meta-sep" aria-hidden="true">·</span>
        <span class="mc-meta-item">{{ item }}</span>
      </template>
    </p>

    <p v-if="meetup.about" class="mc-about">{{ meetup.about }}</p>

    <div v-if="stats.length" class="mc-stats">
      <div v-for="stat in stats" :key="stat.label" class="mc-stat">
        <span class="mc-stat-value">{{ stat.value }}</span>
        <span class="mc-stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div v-if="photos.length" class="mc-photos">
      <img
        v-for="(photo, i) in photos"
        :key="photo + i"
        :src="photo"
        :alt="`Photograph from ${meetup.title}`"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @error="onPhotoError(i)"
      />
    </div>

    <div v-if="meetup.tags?.length || meetup.instaUrl" class="mc-foot">
      <ul v-if="meetup.tags?.length" class="mc-tags">
        <li v-for="tag in meetup.tags" :key="tag">{{ tag }}</li>
      </ul>
      <a
        v-if="meetup.instaUrl"
        :href="meetup.instaUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mc-link"
      >
        View on Instagram
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span class="sr-only"> — {{ meetup.title }}</span>
      </a>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  meetup: { type: Object, required: true },
});

/* Date, place and number read as one line of prose. Every field is optional in
   the exports, so the line is assembled from whatever the record actually has
   rather than from a fixed set of slots. */
const metadata = computed(() =>
  [props.meetup.date, props.meetup.location, props.meetup.duration, props.meetup.meetupNumber]
    .map((value) => (value == null ? null : String(value).trim()))
    .filter(Boolean)
);

/* A short numeric summary — attendance, the meetup's number in the series, and
   who organised it where that is recorded. "Community Event" closes the row so
   a record with no numbers at all still has something to say. */
const stats = computed(() => {
  const out = [];
  if (props.meetup.attended) {
    out.push({ value: props.meetup.attended, label: 'Attended' });
  }
  if (props.meetup.numberDisplay) {
    out.push({ value: props.meetup.numberDisplay, label: 'Meetup No.' });
  }
  if (props.meetup.organizer) {
    out.push({ value: props.meetup.organizer, label: 'Organiser' });
  }
  out.push({ value: 'Community', label: 'Event Type' });
  return out;
});

/* A photograph that 404s is dropped rather than left as a broken frame. */
const brokenPhotos = ref(new Set());

const photos = computed(() =>
  (props.meetup.photos ?? []).filter((_, i) => !brokenPhotos.value.has(i)).slice(0, 5)
);

function onPhotoError(index) {
  const next = new Set(brokenPhotos.value);
  next.add(index);
  brokenPhotos.value = next;
}
</script>

<style scoped>
/* One card, one border, thin rules inside — never a box inside a box inside a
   box, which is what made the old archive card read as a form. */
.mc {
  padding: clamp(1.35rem, 2.6vw, 2rem);
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial);
}

.mc:hover,
.mc:focus-within {
  border-color: var(--border-card-hover);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.mc-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.7rem;
}

.mc-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
}

/* An editorial link with its mark as a bullet — no pill, no fill. */
.mc-post,
.mc-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: none;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-cream-muted);
  text-decoration: none;
  transition:
    color var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.mc-post svg,
.mc-link svg {
  flex: none;
  opacity: 0.75;
  transition:
    opacity var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.mc-post:hover,
.mc-link:hover {
  color: var(--color-gold);
}

.mc-post:hover svg,
.mc-link:hover svg {
  opacity: 1;
}

.mc-link:hover svg {
  transform: translateX(3px);
}

.mc-post:focus-visible,
.mc-link:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
  border-radius: 3px;
}

.mc-title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.1vw, 1.6rem);
  font-weight: 700;
  line-height: 1.22;
  color: var(--color-cream);
  margin: 0 0 0.6rem;
}

.mc-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: var(--color-cream-muted);
}

.mc-meta-sep {
  color: var(--color-cream-faint);
}

.mc-about {
  margin-top: 1rem;
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  max-width: 68ch;
}

/* A stats strip, not a grid of tiles: hairline dividers between the figures
   and nothing enclosing them. */
.mc-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0 clamp(1.5rem, 4vw, 3rem);
  margin-top: 1.4rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--border-subtle);
}

.mc-stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-right: clamp(1.5rem, 4vw, 3rem);
  border-right: 1px solid var(--border-subtle);
}

.mc-stat:last-child {
  padding-right: 0;
  border-right: 0;
}

.mc-stat-value {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-gold-light);
}

.mc-stat-label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

/* Flex rather than an auto-fit grid: on a wide card the grid kept forming
   more tracks than there are photographs, so five images spread themselves
   across seven columns and each came out smaller than on a laptop. Here the
   photographs share the row, grow into the space they actually have, and
   stop at a size that keeps the strip subordinate to the card's text. */
.mc-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.35rem;
}

.mc-photos img {
  flex: 1 1 7rem;
  max-width: 14rem;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--rad);
  border: 1px solid var(--border-subtle);
}

.mc-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  margin-top: 1.35rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--border-subtle);
}

/* Tags read as a quiet keyword line, not as nine little buttons. */
.mc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  color: var(--color-cream-faint);
}

@media (prefers-reduced-motion: reduce) {
  .mc:hover,
  .mc:focus-within,
  .mc-link:hover svg {
    transform: none;
  }
}

@media (max-width: 480px) {
  .mc-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.45rem;
  }

  .mc-stats {
    gap: 0 1.25rem;
  }

  .mc-stat {
    padding-right: 1.25rem;
  }
}

[data-theme='light'] .mc {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.08);
}
</style>
