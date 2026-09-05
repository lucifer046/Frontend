<template>
  <section class="section rs" :class="alt ? 'tone-b' : 'tone-a'">
    <div class="container">
      <div class="section-header">
        <div class="section-tag">{{ tag }}</div>
        <h2 class="section-title-xl">
          {{ title }} <span class="tg">{{ accent }}</span>
        </h2>
        <p class="desc" style="max-width: 46rem; margin-bottom: 0">{{ desc }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup>
// Section shell shared by the Technical / Cultural / E-Sports community pages.
// The accent on the label and the highlighted word comes from the page's
// variant class in src/assets/community.css; this component knows nothing
// about which community it is rendering.
defineProps({
  tag: { type: String, required: true },
  title: { type: String, required: true },
  accent: { type: String, required: true },
  desc: { type: String, required: true },
  // `true` renders the section on Tone B rather than Tone A.
  alt: { type: Boolean, default: false },
});
</script>
