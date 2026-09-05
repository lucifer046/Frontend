<template>
  <div class="team-grid">
    <article v-for="member in cards" :key="member.name" class="team-card">
      <div class="team-photo-wrap">
        <img
          v-if="member.hasPhoto"
          :src="member.photo"
          :alt="`${member.name}, ${member.role}`"
          class="team-photo"
          loading="lazy"
          decoding="async"
          @error="onImageError(member.name)"
        />
        <!-- Not a broken-image icon and not a stock face: the member's own
             initials, drawn as a deliberate state. See `hasPhoto` below. -->
        <div v-else class="team-monogram" role="img" :aria-label="member.name">
          <span aria-hidden="true">{{ member.initials }}</span>
        </div>
      </div>

      <div class="team-body">
        <h3 class="team-name">{{ member.name }}</h3>
        <p class="team-role">{{ member.role }}</p>
        <p v-if="member.level" class="team-level">{{ member.level }}</p>

        <div class="team-socials">
          <a
            v-for="link in member.links"
            :key="link.label"
            :href="link.href"
            :aria-label="`${member.name} on ${link.label}`"
            v-bind="link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              :fill="link.filled ? 'currentColor' : 'none'"
              stroke="currentColor"
              :stroke-width="link.filled ? 0 : 1.9"
              aria-hidden="true"
            >
              <path v-for="(d, i) in link.paths" :key="i" :d="d" />
              <rect
                v-for="(r, i) in link.rects || []"
                :key="`r${i}`"
                :x="r[0]"
                :y="r[1]"
                :width="r[2]"
                :height="r[3]"
                :rx="r[4]"
              />
              <circle
                v-for="(c, i) in link.circles || []"
                :key="`c${i}`"
                :cx="c[0]"
                :cy="c[1]"
                :r="c[2]"
              />
            </svg>
          </a>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  members: { type: Array, required: true },
});

// Images that 404 at runtime. A src can also be absent or a placeholder in the
// data itself, which `usablePhoto` catches before the browser ever requests it.
const failed = ref({});
function onImageError(name) {
  failed.value = { ...failed.value, [name]: true };
}

/**
 * True only for a src that can actually resolve to a portrait.
 *
 * Several roster entries carry `photo: '#'`, which a browser resolves to the
 * current page — it requests the HTML document, fails to decode it as an
 * image, and paints the broken-image icon. Empty strings behave the same way.
 * Both are treated as "no photo" up front so the request is never made.
 */
function usablePhoto(photo) {
  const src = String(photo ?? '').trim();
  return src !== '' && src !== '#';
}

function initialsOf(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

// Only render a social link that goes somewhere. The roster has a few '#'
// placeholders and a couple of bare handles with no scheme; both would render
// as a mark that does nothing, so they are dropped rather than shown dead.
function socialLinks(member) {
  const defs = [
    {
      label: 'Email',
      href: member.email,
      external: false,
      paths: ['m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
      rects: [[2, 4, 20, 16, 2]],
    },
    {
      label: 'LinkedIn',
      href: member.linkedin,
      external: true,
      filled: true,
      paths: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'],
      rects: [[2, 9, 4, 12, 0]],
      circles: [[4, 4, 2]],
    },
    {
      label: 'Instagram',
      href: member.instagram,
      external: true,
      paths: ['M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', 'M17.5 6.5h.01'],
      rects: [[2, 2, 20, 20, 5]],
    },
  ];
  return defs.filter((link) => {
    const href = String(link.href ?? '').trim();
    if (href === '' || href === '#') return false;
    // A bare handle or a schemeless domain is not a usable href.
    return /^(https?:|mailto:)/i.test(href);
  });
}

const cards = computed(() =>
  props.members.map((member) => ({
    ...member,
    hasPhoto: usablePhoto(member.photo) && !failed.value[member.name],
    initials: initialsOf(member.name),
    links: socialLinks(member),
  }))
);
</script>
