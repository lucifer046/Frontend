<template>
  <!-- Tone B, and last on the page: these are the two things a visitor does
       for the community once they have found what they came for. -->
  <section class="section tone-b rs" id="contribute">
    <div class="container">
      <div class="grid-2 cc-grid">
        <article v-for="panel in panels" :key="panel.title" class="card-base cc-card">
          <span class="cc-icon">
            <component :is="panel.icon" :size="28" :stroke-width="1.6" aria-hidden="true" />
          </span>
          <div class="section-tag cc-tag">{{ panel.tag }}</div>
          <h2 class="cc-title">{{ panel.title }}</h2>
          <p class="cc-purpose"><strong>Purpose:</strong> {{ panel.purpose }}</p>
          <ul class="cc-points">
            <li v-for="point in panel.points" :key="point">
              <span class="cc-bullet" aria-hidden="true">✦</span>{{ point }}
            </li>
          </ul>
          <a
            class="btn cc-cta"
            :class="panel.primary ? 'btn--primary' : 'btn--outline'"
            :href="panel.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ panel.cta }}
            <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Upload, Target, ArrowRight } from 'lucide-vue-next';

// Contributing is the action the House actually wants, so it takes the one
// filled button here; requesting is the outline beside it.
const panels = [
  {
    icon: Upload,
    tag: 'Student Contribution',
    title: 'Share Your Notes',
    purpose: 'Community-driven academic content',
    points: ['Upload notes & resources', 'Help juniors & peers', 'WebOps review ensures quality'],
    cta: 'Submit a Resource',
    href: 'https://forms.gle/c86b55AZ517Q8Ahg6',
    primary: true,
  },
  {
    icon: Target,
    tag: 'Resource Request',
    title: 'Request a Resource',
    purpose: 'Identify missing academic needs',
    points: ['Request missing topics', 'Exam-focused content', 'Helps WebOps prioritize'],
    cta: 'Request a Resource',
    href: 'https://forms.gle/KNm4hyupaG22Huxd6',
    primary: false,
  },
];
</script>

<style scoped>
.cc-grid {
  align-items: stretch;
}

.cc-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2.5rem;
}

.cc-icon {
  display: inline-flex;
  color: var(--accent);
  margin-bottom: 1rem;
}

.cc-tag {
  margin-bottom: 1rem;
}

.cc-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
}

.cc-purpose {
  color: var(--text2);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}

.cc-purpose strong {
  color: var(--text);
}

.cc-points {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.cc-points li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: var(--text2);
}

.cc-bullet {
  color: var(--accent);
  font-size: 0.9rem;
}

/* Both CTAs sit on the same baseline even when the bullet lists differ. */
.cc-cta {
  margin-top: auto;
}

@media (max-width: 768px) {
  .cc-grid {
    grid-template-columns: 1fr;
  }

  .cc-card {
    padding: 2rem 1.5rem;
  }

  .cc-cta {
    width: 100%;
  }
}
</style>
