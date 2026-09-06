<template>
  <div class="dv">
    <!-- ── Embeddable: the document renders inside the House frame ──────
         One iframe, keyed by document id, so switching records tears the old
         one down instead of stacking frames. Google renders the page itself;
         everything around it is ours, which is the only arrangement a
         cross-origin embed allows. -->
    <div v-if="strategy === 'embed'" class="dv-frame">
      <Transition name="dv-fade">
        <div v-if="state === 'loading'" class="dv-state dv-state--over">
          <span class="dv-spinner" aria-hidden="true"></span>
          <p class="dv-state-title">Opening document</p>
        </div>
      </Transition>

      <iframe
        v-if="state !== 'error'"
        :key="document.id"
        :src="embedUrl"
        :title="`${document.title}, embedded document`"
        class="dv-iframe"
        referrerpolicy="no-referrer-when-downgrade"
        @load="onLoad"
      ></iframe>

      <!-- The frame answered, but with nothing readable. -->
      <div v-else class="dv-state">
        <FileWarning class="dv-state-icon" :size="26" :stroke-width="1.6" aria-hidden="true" />
        <p class="dv-state-title">Document preview unavailable</p>
        <p class="dv-state-copy">The original resource is still available.</p>
        <a
          class="btn btn--outline btn--sm"
          :href="document.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Original
          <ExternalLink :size="15" :stroke-width="2" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- ── Download only ────────────────────────────────────────────────
         Served with frame-ancestors 'none', so it can be fetched but never
         framed. Saying so is better than a frame that will always be empty. -->
    <div v-else-if="strategy === 'download'" class="dv-frame dv-frame--flat">
      <div class="dv-state">
        <Download class="dv-state-icon" :size="26" :stroke-width="1.6" aria-hidden="true" />
        <p class="dv-state-title">{{ document.title }}</p>
        <p class="dv-state-copy">This resource is available as a downloadable file.</p>
        <a
          class="btn btn--primary btn--sm"
          :href="document.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
          <Download :size="15" :stroke-width="2" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- ── Public, but not published for embedding ─────────────────────── -->
    <div v-else class="dv-frame dv-frame--flat">
      <div class="dv-state">
        <FileWarning class="dv-state-icon" :size="26" :stroke-width="1.6" aria-hidden="true" />
        <p class="dv-state-title">This document cannot be previewed here</p>
        <p class="dv-state-copy">
          It is readable at the source, which does not allow it to be displayed inside another site.
        </p>
        <a
          class="btn btn--primary btn--sm"
          :href="document.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Original
          <ExternalLink :size="15" :stroke-width="2" aria-hidden="true" />
        </a>
      </div>
    </div>

    <p class="dv-caption">{{ document.title }}</p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { Download, ExternalLink, FileWarning } from 'lucide-vue-next';
import { embedUrlFor, TYPES } from '../../data/documents.js';
import '../../assets/reader.css';

const props = defineProps({
  document: {
    type: Object,
    required: true,
  },
  /**
   * How long to wait for the frame before offering the original instead.
   * Deliberately patient: the published handbooks are close to a megabyte of
   * HTML plus their images, and a reader on a slow connection should get the
   * document rather than a give-up notice they did not need.
   */
  timeoutMs: {
    type: Number,
    default: 30000,
  },
});

const strategy = computed(() => TYPES[props.document.type]?.viewer ?? 'external');
const embedUrl = computed(() => embedUrlFor(props.document));

// loading, ready or error. Only the embed strategy ever leaves 'ready'.
const state = ref('loading');
let timer = null;

function clearTimer() {
  if (timer) clearTimeout(timer);
  timer = null;
}

function onLoad() {
  clearTimer();
  state.value = 'ready';
}

/**
 * A frame that never loads would otherwise sit on the loading state forever.
 * The timer is the floor under that: if nothing has answered by then, the
 * reader stops promising a document and offers the original.
 */
function arm() {
  clearTimer();
  state.value = 'loading';
  if (strategy.value !== 'embed') return;
  timer = setTimeout(() => {
    if (state.value === 'loading') state.value = 'error';
  }, props.timeoutMs);
}

watch(() => props.document.id, arm, { immediate: true });
onBeforeUnmount(clearTimer);
</script>
