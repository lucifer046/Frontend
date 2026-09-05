<template>
  <!-- The single closing action for a community page. One filled primary, one
       outline secondary, and nothing else competing with them. -->
  <section class="section rs" :class="alt ? 'tone-b' : 'tone-a'">
    <div class="container">
      <div class="community-cta">
        <div class="section-tag" style="justify-content: center">{{ tag }}</div>
        <h2>{{ heading }}</h2>
        <p>{{ body }}</p>
        <div class="community-cta-actions">
          <a class="btn btn--primary" :href="joinHref" target="_blank" rel="noopener noreferrer">
            {{ joinLabel }}
            <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
          </a>
          <RouterLink class="btn btn--outline" to="/community">
            All communities
            <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ArrowRight } from 'lucide-vue-next';

defineProps({
  tag: { type: String, default: 'Join Us' },
  heading: { type: String, required: true },
  body: { type: String, required: true },
  joinLabel: { type: String, required: true },
  joinHref: { type: String, required: true },
  alt: { type: Boolean, default: false },
});
</script>

<style scoped>
/* The label is centred here only — .section-tag is left-aligned everywhere
   else on the site and must stay that way. */
.section-tag {
  display: inline-flex;
}
</style>
