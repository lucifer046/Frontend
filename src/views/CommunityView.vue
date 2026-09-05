<template>
  <div>
    <PageHero
      bg-image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80&auto=format&fit=crop"
      breadcrumb-title="Community"
      title="Our"
      accent-title="Communities"
      subtitle="Three dynamic pillars driving excellence and innovation in Sundarbans House"
    />

    <!-- Tech Community -->
    <section class="section rs">
      <div class="container">
        <div class="about-grid">
          <div>
            <div class="section-tag" style="color: #4f8ef7">Tech Community</div>
            <h2 class="section-title-xl"><span class="tg">Build.</span> Code. Innovate.</h2>
            <p class="desc">
              Connect with builders, analysts, and innovators across specialized technical domains.
              Whether you're into frontend, AI/ML, or blockchain, there is a space for you.
            </p>
            <div class="about-highlights">
              <div class="hi">
                <div class="hi-icon"><Code2 :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Development Track</strong>
                  <p>Full-stack, mobile apps, system design</p>
                </div>
              </div>
              <div class="hi">
                <div class="hi-icon"><Bot :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>AI/ML Track</strong>
                  <p>Machine learning, NLP, computer vision</p>
                </div>
              </div>
              <div class="hi">
                <div class="hi-icon"><BarChart3 :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Data Science</strong>
                  <p>Analytics, visualization, data pipelines</p>
                </div>
              </div>
            </div>
            <div class="community-actions">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd0H31y_2l02T2TCPSaMvooqdnRyLzcpZ4ysT32PAOhvx5lkA/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                class="submit-btn"
                style="display: inline-flex; background: #f59e0b; color: var(--color-bg-black)"
              >
                Join Community
              </a>
              <RouterLink to="/community/technical" class="explore-btn" style="--accent: #f59e0b">
                Explore →
              </RouterLink>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80&auto=format&fit=crop"
              alt="Technical community members collaborating"
              style="width: 100%; border-radius: var(--rad2); aspect-ratio: 4/3; object-fit: cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Cultural Community -->
    <section class="section rs" style="background: var(--bg2)">
      <div class="container">
        <div class="about-grid" style="direction: rtl">
          <div style="direction: ltr">
            <div class="section-tag" style="color: #f59e0b">Cultural Community</div>
            <h2 class="section-title-xl">
              <span
                style="
                  background: linear-gradient(135deg, #f59e0b, #ef4444);
                  -webkit-background-clip: text;
                  background-clip: text;
                  -webkit-text-fill-color: transparent;
                "
                >Art. Music. Culture.</span
              >
            </h2>
            <p class="desc">
              Celebrate diversity through arts, music, literature and cultural exchange. Our
              cultural community bridges regional differences and creates a unified, vibrant
              Sundarbans identity.
            </p>
            <div class="about-highlights">
              <div class="hi">
                <div class="hi-icon"><Palette :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Arts & Crafts</strong>
                  <p>Design, illustration, photography</p>
                </div>
              </div>
              <div class="hi">
                <div class="hi-icon"><Music :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Music & Dance</strong>
                  <p>Performances, collaborations, jam sessions</p>
                </div>
              </div>
              <div class="hi">
                <div class="hi-icon"><BookOpen :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Literature & Debate</strong>
                  <p>Book clubs, debates, creative writing</p>
                </div>
              </div>
            </div>
            <div class="community-actions">
              <a
                href="https://forms.gle/2DGXHZJLhCKG6z1T6"
                target="_blank"
                rel="noopener noreferrer"
                class="submit-btn"
                style="display: inline-flex; background: #f59e0b; color: var(--color-bg-black)"
              >
                Join Community
              </a>
              <RouterLink to="/community/cultural" class="explore-btn" style="--accent: #f59e0b">
                Explore →
              </RouterLink>
            </div>
          </div>
          <div style="direction: ltr">
            <img
              src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=700&q=80&auto=format&fit=crop"
              alt="Cultural community event"
              style="width: 100%; border-radius: var(--rad2); aspect-ratio: 4/3; object-fit: cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- E-Sports Community -->
    <section class="section rs">
      <div class="container">
        <div class="about-grid">
          <div>
            <div class="section-tag" style="color: #ef4444">E-Sports Community</div>
            <h2 class="section-title-xl">
              <span
                style="
                  background: linear-gradient(135deg, #dc2626, #f97316);
                  -webkit-background-clip: text;
                  background-clip: text;
                  -webkit-text-fill-color: transparent;
                "
                >Play. Compete. Win.</span
              >
            </h2>
            <p class="desc">
              From casual gaming to competitive tournaments, our E-Sports community is where
              Sundarbans players grind, grow, and dominate. Every game has a team. Find yours.
            </p>
            <div class="about-highlights">
              <div class="hi">
                <div class="hi-icon"><Gamepad2 :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Competitive Gaming</strong>
                  <p>Tournaments, scrimmages, ranked ladders</p>
                </div>
              </div>
              <div class="hi">
                <div class="hi-icon"><UsersRound :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Team Formation</strong>
                  <p>Find teammates, build rosters, compete together</p>
                </div>
              </div>
              <div class="hi">
                <div class="hi-icon"><Target :size="20" :stroke-width="1.8" /></div>
                <div>
                  <strong>Skill Development</strong>
                  <p>Coaching, VOD reviews, strategy sessions</p>
                </div>
              </div>
            </div>
            <div class="community-actions">
              <a
                href="https://forms.gle/q48tZxiUuqUeLN7y9"
                target="_blank"
                rel="noopener noreferrer"
                class="submit-btn"
                style="display: inline-flex; background: #f59e0b; color: var(--color-bg-black)"
              >
                Join Community
              </a>
              <RouterLink to="/community/esports" class="explore-btn" style="--accent: #f59e0b">
                Explore →
              </RouterLink>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=80&auto=format&fit=crop"
              alt="E-Sports community gaming session"
              style="width: 100%; border-radius: var(--rad2); aspect-ratio: 4/3; object-fit: cover"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useAnimations.js';
import PageHero from '../components/PageHero.vue';
import { RouterLink } from 'vue-router';
import {
  Code2,
  Bot,
  BarChart3,
  Palette,
  Music,
  BookOpen,
  Gamepad2,
  UsersRound,
  Target,
} from 'lucide-vue-next';

useScrollReveal();
</script>

<style scoped>
.community-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.4rem;
  border-radius: var(--rad, 8px);
  border: 1px solid var(--accent, #4f8ef7);
  color: var(--accent, #4f8ef7);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    background-color var(--duration-button) var(--ease-editorial),
    border-color var(--duration-button) var(--ease-editorial),
    color var(--duration-button) var(--ease-editorial),
    box-shadow var(--duration-button) var(--ease-editorial),
    transform var(--duration-button) var(--ease-editorial);
}

/* Outline stays outline on hover — a raised dark surface and a brighter
   edge, never a sudden fill. */
.explore-btn:hover {
  background: var(--color-surface-hover);
  border-color: var(--accent, #4f8ef7);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.explore-btn:active {
  transform: translateY(0) scale(0.988);
}
</style>
