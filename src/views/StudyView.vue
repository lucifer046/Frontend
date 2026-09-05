<template>
  <div>
    <!--
      Study Corner, in priority order.

      The resource browser comes first and immediately: search, level, subject,
      type, results, with nothing between it and the hero. Everything below it
      is secondary — a community board, a shelf of external tools, and two
      forms — and the two page tones alternate one per chapter so the reader
      can feel where one ends and the next begins.

      Tone rhythm: Hero · Browser A · Doubts B · Tools A · Contribute B.
    -->
    <PageHero
      compact
      bg-image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&q=80&auto=format&fit=crop"
      breadcrumb-title="Study Corner"
      title="Study"
      accent-title="Corner"
      subtitle="Comprehensive academic resources for Foundation, Diploma and BS level students —
        lecture material, contributor notes and past papers, all in one place."
    />

    <ResourceBrowser v-model:search="search" />

    <DoubtsBoard :search="search" />

    <StudentTools />

    <ContributeCards />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { useScrollReveal } from '../composables/useAnimations.js';
import PageHero from '../components/PageHero.vue';
import ResourceBrowser from '../components/study/ResourceBrowser.vue';
import DoubtsBoard from '../components/study/DoubtsBoard.vue';
import StudentTools from '../components/study/StudentTools.vue';
import ContributeCards from '../components/study/ContributeCards.vue';

useScrollReveal();

// The one piece of state two sections share: the resource browser owns the
// search box, the doubts board filters against the same query.
const search = ref('');
</script>
