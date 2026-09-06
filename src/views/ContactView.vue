<template>
  <div>
    <PageHero
      compact
      bg-image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80&auto=format&fit=crop"
      breadcrumb-title="Contact"
      title="Get in"
      accent-title="Touch"
      subtitle="Have a question about Sundarbans House? Reach out directly to the team responsible for your query."
    />

    <!-- ══ UHC CONTACT DESK ══════════════════════════════════════════
         Three offices in a 1 + 2 composition rather than three full width
         rows: the Secretary takes a taller panel on the leading side and the
         other two offices stack beside it. The panel is the mailto target,
         so the whole surface is the action. -->
    <section class="ct-section tone-b rs" aria-labelledby="uhc-desk-heading">
      <div class="container container--measure">
        <header class="ct-hdr">
          <p class="section-tag">House leadership</p>
          <h2 id="uhc-desk-heading" class="section-title-xl">
            UHC <span class="tg">contact desk</span>
          </h2>
          <p class="ct-sub">
            Questions about the House, partnerships, events or the website? Reach the leadership
            team directly.
          </p>
        </header>

        <div class="uhc">
          <!-- Set inside the container, not as a child of the section: the
               site's reveal rule forces every direct child of a revealed
               section to full opacity, which would light this up. -->
          <span class="uhc__watermark" aria-hidden="true">UHC</span>

          <ul class="uhc__grid">
            <li
              v-for="office in leadership"
              :key="office.id"
              class="uhc__cell"
              :class="{ 'uhc__cell--lead': office.lead }"
            >
              <a
                class="uhc-office"
                :class="{ 'uhc-office--lead': office.lead }"
                :href="`mailto:${office.email}`"
              >
                <span class="section-tag uhc-office__role">{{ office.role }}</span>
                <span class="uhc-office__name">{{ office.name }}</span>
                <span class="uhc-office__mail">{{ office.email }}</span>

                <span class="uhc-office__cta">
                  <Mail :size="15" :stroke-width="1.8" aria-hidden="true" />
                  Email
                  <ArrowRight
                    class="uhc-office__arrow"
                    :size="15"
                    :stroke-width="2"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ══ COMMUNITY CHANNELS ════════════════════════════════════════ -->
    <section class="ct-section ct-section--social tone-a rs" aria-labelledby="social-heading">
      <div class="container container--measure">
        <header class="ct-hdr">
          <p class="section-tag">Elsewhere</p>
          <h2 id="social-heading" class="ct-social-title">Follow the House</h2>
        </header>

        <ul class="ct-social">
          <li v-for="channel in socials" :key="channel.label">
            <a :href="channel.href" target="_blank" rel="noopener noreferrer">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path :d="channel.path" />
              </svg>
              <span class="ct-social-label">{{ channel.label }}</span>
              <span class="ct-social-handle">{{ channel.handle }}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Mail, ArrowRight } from 'lucide-vue-next';
import PageHero from '../components/PageHero.vue';
import { useScrollReveal } from '../composables/useAnimations.js';
import { upperHouse, HOUSE_CHANNELS } from '../data/council.js';

useScrollReveal();

/**
 * Leadership list comes from the council roster the Teams page renders.
 * The desk keeps the roster's authored order — Secretary first — because
 * that is the order a reader should try the offices in.
 */
const leadership = upperHouse;

/* The House's own channels, shared with the footer so the two can never
   drift apart. */
const socials = HOUSE_CHANNELS;
</script>

<style scoped>
/* ═══ SECTIONS ══════════════════════════════════════════════════════ */
.ct-section {
  padding: clamp(3.5rem, 6vw, 5.5rem) 0;
}

.ct-section--social {
  padding-bottom: clamp(4.5rem, 7vw, 6.5rem);
}

.ct-hdr {
  margin-bottom: clamp(2rem, 3.5vw, 2.75rem);
}

.ct-hdr .section-tag {
  margin-bottom: 0.9rem;
}

.ct-hdr .section-title-xl {
  margin-bottom: 0;
}

.ct-sub {
  margin-top: 1rem;
  font-size: 0.94rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  max-width: 52ch;
}

.uhc__grid,
.ct-social {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* ═══ UHC CONTACT DESK ══════════════════════════════════════════════
   A 1 + 2 composition, not three stretched rows. The Secretary's panel is
   the tall one on the leading side and carries the heavier gold edge; the
   other two offices stack beside it and stay quieter. Surface, radius and
   hover all follow the public card language, so the desk belongs to this
   site and borrows nothing from the members area. */
.uhc {
  position: relative;
}

/* An oversized, barely there UHC behind the panels. Kept as type rather
   than an image so it can never paint a light rectangle. */
.uhc__watermark {
  position: absolute;
  top: 50%;
  right: -0.04em;
  transform: translateY(-50%);
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(7rem, 22vw, 15rem);
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: 0.02em;
  color: var(--color-cream);
  opacity: 0.022;
  pointer-events: none;
  user-select: none;
}

.uhc__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.12fr 1fr;
  gap: clamp(0.85rem, 1.8vw, 1.25rem);
}

/* The Secretary occupies the leading column across both rows. */
.uhc__cell--lead {
  grid-row: span 2;
}

.uhc-office {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(1.35rem, 2.4vw, 1.85rem);
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-top: 1px solid var(--border-card);
  border-radius: var(--rad2);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  transition:
    border-color var(--duration-card) var(--ease-editorial),
    box-shadow var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial);
}

.uhc-office:hover {
  border-color: var(--border-card-hover);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.uhc-office:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
}

/* The one piece of hierarchy: a heavier gold edge on the office to try
   first, and a little more room inside it. */
.uhc-office--lead {
  border-top: 2px solid var(--color-gold-muted);
  padding: clamp(1.6rem, 3vw, 2.25rem);
}

/* The site's own gold eyebrow, tightened for use inside a panel. */
.uhc-office__role {
  margin-bottom: 0.85rem;
}

.uhc-office__name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-cream);
}

.uhc-office--lead .uhc-office__name {
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
}

.uhc-office__mail {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-cream-muted);
  overflow-wrap: anywhere;
}

/* Pushed to the foot of the panel, which is what gives the taller lead
   panel its proportion rather than leaving dead space in it. */
.uhc-office__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: auto;
  padding-top: 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-cream-muted);
  transition: color var(--duration-card) var(--ease-editorial);
}

.uhc-office--lead .uhc-office__cta {
  font-size: 0.92rem;
  color: var(--color-gold-muted);
}

.uhc-office:hover .uhc-office__cta {
  color: var(--color-gold);
}

.uhc-office__arrow {
  transition: transform var(--duration-link) var(--ease-editorial);
}

.uhc-office:hover .uhc-office__arrow {
  transform: translateX(4px);
}

/* ═══ SOCIAL ════════════════════════════════════════════════════════
   The footer's Connect treatment: the mark is the bullet on a text link,
   no card and no fill. */
.ct-social-title {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 700;
  color: var(--color-cream);
}

.ct-social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem clamp(2rem, 5vw, 3.5rem);
}

.ct-social a {
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  color: var(--color-cream-muted);
  text-decoration: none;
  transition:
    color var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.ct-social svg {
  align-self: center;
  flex: none;
  opacity: 0.75;
  transition: opacity var(--duration-link) var(--ease-editorial);
}

.ct-social a:hover {
  color: var(--color-gold);
  transform: translateX(3px);
}

.ct-social a:hover svg {
  opacity: 1;
}

.ct-social a:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
  border-radius: 3px;
}

.ct-social-label {
  font-weight: 500;
  color: var(--color-cream);
}

.ct-social-handle {
  font-size: 0.82rem;
  color: var(--color-cream-faint);
}

/* ═══ NARROW ════════════════════════════════════════════════════════
   Tablet keeps two columns with the Secretary across the top; below that
   the three offices simply stack. */
@media (max-width: 900px) {
  .uhc__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .uhc__cell--lead {
    grid-row: auto;
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .uhc__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .uhc__watermark {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .uhc-office:hover,
  .uhc-office:hover .uhc-office__arrow,
  .ct-social a:hover {
    transform: none;
  }
}
</style>
