<template>
  <!-- Tone A. Four identical editorial cards; the only thing that differs
       between them is their content, which is why they come from a list. -->
  <section class="section tone-a rs" id="student-tools">
    <div class="container">
      <div class="sec-hdr">
        <div class="section-tag">Student Tools</div>
        <h2 class="section-title-xl">Handy <span class="tg">tools</span> for studying</h2>
      </div>

      <div class="grid-4 st-grid">
        <article
          v-for="(tool, i) in tools"
          :key="tool.title"
          class="card-base rc st-card"
          :style="{ '--card-delay': `${0.1 * (i + 1)}s` }"
        >
          <span class="st-icon">
            <component :is="tool.icon" :size="22" :stroke-width="1.7" aria-hidden="true" />
          </span>
          <h3 class="st-title">{{ tool.title }}</h3>
          <p class="st-desc">{{ tool.description }}</p>
          <a
            class="btn btn--text st-cta"
            :href="tool.href"
            v-bind="tool.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            {{ tool.cta }}
            <ArrowRight :size="14" :stroke-width="2" aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BarChart3, Brain, LineChart, Code2, ArrowRight } from 'lucide-vue-next';

// Same four tools, same links, same copy — as data, so a fifth tool is one
// entry rather than another hand-styled block with its own inline CTA.
const tools = [
  {
    icon: BarChart3,
    title: 'Score Checker',
    description: 'Check your exam scores updated by IITM BS after each exam',
    cta: 'Open Scores',
    href: '#',
    external: false,
  },
  {
    icon: Brain,
    title: 'Practice for Exam',
    description: 'Practice quizzes and problems to prepare for your exams',
    cta: 'Start Practising',
    href: 'https://quizpractice.space/',
    external: true,
  },
  {
    icon: LineChart,
    title: 'Looker Studio',
    description: 'Visual dashboards and analytics for IITM BS programme data',
    cta: 'View Dashboard',
    href: 'https://datastudio.google.com/reporting/d02dac13-665b-49cc-8d51-0451268a6a3e/page/p_zohf4g5z2d?s=i1h4iWCG8o4',
    external: true,
  },
  {
    icon: Code2,
    title: 'OPPE Portal',
    description: 'Online Programming & Problem-solving Evaluation exam portal',
    cta: 'Open Portal',
    href: 'https://study.iitm.ac.in/ds/exam.html',
    external: true,
  },
];
</script>

<style scoped>
.st-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
}

.st-icon {
  display: inline-flex;
  color: var(--accent);
  margin-bottom: 0.2rem;
}

.st-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: 0.02em;
}

.st-desc {
  font-size: 0.82rem;
  color: var(--text2);
  line-height: 1.7;
}

/* Pushes every CTA to the bottom of its card so the four line up on one
   baseline regardless of how long the description runs. */
.st-cta {
  margin-top: auto;
  padding-top: 0.9rem;
}

@media (max-width: 1100px) {
  .st-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .st-grid {
    grid-template-columns: 1fr;
  }
}
</style>
