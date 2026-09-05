<template>
  <!-- The domains a community is organised around. Deliberately flat: an icon,
       a name and a sentence, on the same card surface as everything else. -->
  <div class="track-grid">
    <article
      v-for="(track, i) in tracks"
      :key="track.title"
      class="track-card rc"
      :style="{ '--card-delay': `${0.08 * (i + 1)}s` }"
    >
      <span class="track-icon">
        <component :is="track.icon" :size="20" :stroke-width="1.7" aria-hidden="true" />
      </span>
      <h3 class="track-title">{{ track.title }}</h3>
      <p class="track-desc">{{ track.desc }}</p>
    </article>
  </div>
</template>

<script setup>
defineProps({
  tracks: { type: Array, required: true },
});
</script>

<style scoped>
.track-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.track-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.75rem;
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
  box-shadow: var(--shadow-sm);
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial);
}

.track-card:hover {
  transform: translateY(-4px);
  border-color: var(--cx-soft, var(--border-card-hover));
  box-shadow: var(--shadow-lg);
}

.track-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--rad);
  border: 1px solid var(--cx-soft, var(--border-card));
  background: var(--cx-tint, transparent);
  color: var(--cx, var(--accent));
  margin-bottom: 0.3rem;
}

.track-title {
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.track-desc {
  font-size: 0.85rem;
  color: var(--text2);
  line-height: 1.75;
}

@media (max-width: 768px) {
  .track-grid {
    grid-template-columns: 1fr;
  }
}
</style>
