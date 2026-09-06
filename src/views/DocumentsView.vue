<template>
  <!-- Two states of one page: the route's optional :id decides which is
       showing. /documents is the index, /documents/<id> is the reader, and
       there is nothing in between. -->
  <Transition name="dl-mode" mode="out-in">
    <!-- ═══ READER ══════════════════════════════════════════════════════ -->
    <section v-if="reader" key="reader" class="dr">
      <div class="container">
        <router-link to="/documents" class="dr-back">
          <ArrowLeft :size="15" :stroke-width="2" aria-hidden="true" />
          Back to Documents
        </router-link>

        <div class="dr-head">
          <div class="dr-headings">
            <span class="dr-mark" aria-hidden="true">
              <component :is="reader.icon" :size="20" :stroke-width="1.6" />
            </span>
            <div>
              <div class="section-tag">House Archive</div>
              <h1 class="dr-title">{{ reader.title }}</h1>
              <p class="dr-meta">
                {{ categoryLabel(reader.category) }} · {{ reader.sourceKind }} ·
                {{ typeLabel(reader) }}
              </p>
            </div>
          </div>

          <div class="dr-actions">
            <a
              class="btn btn--outline btn--sm"
              :href="reader.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ isDownload(reader) ? 'Download' : 'Open Original' }}
              <component
                :is="isDownload(reader) ? Download : ExternalLink"
                :size="15"
                :stroke-width="2"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div class="dr-body">
          <!-- The rest of the archive, so moving between documents never means
               going back to the index first. A disclosure rather than a
               permanent sidebar, so a narrow screen gives its height to the
               document instead of to a list. -->
          <details class="dr-rail" open>
            <summary class="dr-rail-title">
              <ChevronDown class="dr-rail-caret" :size="14" :stroke-width="2" aria-hidden="true" />
              In this archive
            </summary>
            <ul class="dr-rail-list">
              <li v-for="doc in documents" :key="doc.id">
                <router-link
                  :to="`/documents/${doc.id}`"
                  class="dr-rail-link"
                  :class="{ 'is-current': doc.id === reader.id }"
                  :aria-current="doc.id === reader.id ? 'page' : undefined"
                >
                  <span class="dr-rail-ref" aria-hidden="true">{{ doc.ref }}</span>
                  <span>{{ doc.title }}</span>
                </router-link>
              </li>
            </ul>
          </details>

          <div class="dr-viewer">
            <DocumentViewer :document="reader" />
            <p v-if="reader.description" class="dr-note">{{ reader.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ INDEX ═══════════════════════════════════════════════════════ -->
    <div v-else key="index">
      <!-- ── MASTHEAD ────────────────────────────────────────────────
           The archive's own name, and one search field. No photograph: the
           other public pages open on an image because they are about people
           and places, and this one is about a shelf. -->
      <section class="dl-head">
        <div class="dl-head-mark" aria-hidden="true">Archive</div>
        <div class="container">
          <div class="section-tag">House Archive</div>
          <h1 class="dl-title">Document <span class="tg">Library</span></h1>
          <p class="dl-lede">
            Official handbooks, guidelines, calendars and resources for the Sundarbans community.
          </p>

          <div class="dl-search">
            <label class="sr-only" for="dl-search-input">Search the archive</label>
            <Search class="dl-search-icon" :size="16" :stroke-width="1.9" aria-hidden="true" />
            <input
              id="dl-search-input"
              v-model="query"
              type="search"
              class="form-input dl-search-input"
              placeholder="Search the archive..."
              autocomplete="off"
            />
            <button
              v-if="query"
              type="button"
              class="dl-search-clear"
              aria-label="Clear search"
              @click="query = ''"
            >
              <X :size="15" :stroke-width="2" />
            </button>
          </div>
        </div>
      </section>

      <!-- ── THE INDEX ITSELF ──────────────────────────────────────── -->
      <section class="section tone-b dl-index">
        <div class="container">
          <div class="dl-index-head">
            <h2 class="dl-index-title">Documents</h2>
            <p class="dl-count" role="status" aria-live="polite">
              {{ visibleDocuments.length }}
              {{ visibleDocuments.length === 1 ? 'document' : 'documents' }}
            </p>
          </div>

          <!-- Each card is one link: clicking anywhere on it opens the
               document. No selection step, no detail panel, no second click. -->
          <ol v-if="visibleDocuments.length" class="dl-grid">
            <li v-for="doc in visibleDocuments" :key="doc.id" class="dl-cell">
              <router-link class="dl-card" :to="`/documents/${doc.id}`">
                <span class="dl-card-ref" aria-hidden="true">{{ doc.ref }}</span>

                <span class="dl-card-title">{{ doc.title }}</span>

                <span class="dl-card-meta">
                  {{ categoryLabel(doc.category) }} · {{ doc.sourceKind }} ·
                  {{ typeLabel(doc) }}
                </span>

                <span v-if="doc.description" class="dl-card-desc">{{ doc.description }}</span>

                <span class="dl-card-action">
                  Read
                  <ArrowRight :size="15" :stroke-width="2" aria-hidden="true" />
                </span>
              </router-link>
            </li>
          </ol>

          <div v-else class="dl-empty">
            <FileSearch class="dl-empty-icon" :size="28" :stroke-width="1.6" aria-hidden="true" />
            <h3 class="dl-empty-title">No documents found</h3>
            <p>Try another search.</p>
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>

<script>
import { ref } from 'vue';

/**
 * Module scope, so it is evaluated once per page load and shared by every
 * mount of this view. App.vue keys <router-view> by route path, which means
 * opening a document remounts the component; without this, coming back from
 * the reader would lose whatever the visitor had searched for. Its lifetime is
 * exactly right: it survives any number of route changes inside the session
 * and resets on a genuine reload.
 */
const query = ref('');
</script>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  ExternalLink,
  FileSearch,
  Search,
  X,
} from 'lucide-vue-next';
import DocumentViewer from '../components/documents/DocumentViewer.vue';
import { categoryLabel, documents, searchDocuments, TYPES } from '../data/documents.js';
import '../assets/documents.css';

const route = useRoute();
const router = useRouter();

const visibleDocuments = computed(() => searchDocuments(documents, query.value));

/**
 * The reader is the route's own state, which is what makes the back button
 * work without a line of history handling.
 */
const reader = computed(() =>
  route.params.id ? (documents.find((doc) => doc.id === route.params.id) ?? null) : null
);

// An id that names no document is a dead end rather than an error page: send
// the visitor back to the index, replacing the bad entry so Back still works.
watch(
  () => route.params.id,
  (id) => {
    if (id && !documents.some((doc) => doc.id === id)) router.replace('/documents');
  },
  { immediate: true }
);

function isDownload(doc) {
  return TYPES[doc.type]?.download === true;
}

function typeLabel(doc) {
  return TYPES[doc.type]?.label ?? 'Document';
}
</script>
