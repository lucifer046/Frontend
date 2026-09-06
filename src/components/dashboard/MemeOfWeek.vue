<template>
  <!-- MEME OF THE WEEK. The entries are captions, so they are set as
       captions: a quoted plate rather than a pictograph standing in for an
       image. Votes are Lucide marks. -->
  <div class="widget" id="widget-meme">
    <div class="widget-label">Community</div>
    <div class="widget-title">Meme of the Week</div>
    <p class="widget-note">The one the House picked, and the three chasing it.</p>

    <div class="meme-summary">
      <span>{{ candidates.length }} candidates</span>
      <span>{{ totalCandidateVotes }} votes</span>
    </div>

    <!-- Current champion -->
    <div class="meme-winner-wrap">
      <div class="meme-winner-crown"><Crown :size="22" :stroke-width="1.7" /></div>
      <div class="meme-winner-title">This Week's Champion</div>
      <blockquote class="meme-winner-quote">
        <Quote class="meme-quote-mark" :size="16" :stroke-width="1.6" aria-hidden="true" />
        {{ winner.caption }}
      </blockquote>
      <div class="meme-winner-byline">
        by <em>{{ winner.author }}</em>
      </div>
      <div class="meme-winner-votes">
        <span class="meme-vote-pill">
          <Flame :size="13" :stroke-width="1.8" aria-hidden="true" />
          {{ winner.fireVotes }}
        </span>
        <span class="meme-vote-pill">
          <Skull :size="13" :stroke-width="1.8" aria-hidden="true" />
          {{ winner.deadVotes }}
        </span>
      </div>
    </div>

    <!-- Candidate voting list -->
    <div class="meme-cands-label">Vote this week's candidates</div>
    <div class="meme-candidates">
      <div class="meme-candidate" v-for="c in candidates" :key="c.id">
        <div class="meme-cand-info">
          <div class="meme-cand-title">{{ c.title }}</div>
          <div class="meme-cand-by">by {{ c.author }}</div>
        </div>
        <div class="meme-cand-btns">
          <button
            class="meme-cand-v"
            :class="{ 'fire-voted': votes[c.id] === 'fire' }"
            @click="memeVote(c.id, 'fire')"
          >
            <Flame :size="13" :stroke-width="1.8" aria-hidden="true" />
            {{ c.fire }}
          </button>
          <button
            class="meme-cand-v"
            :class="{ 'dead-voted': votes[c.id] === 'dead' }"
            @click="memeVote(c.id, 'dead')"
          >
            <Skull :size="13" :stroke-width="1.8" aria-hidden="true" />
            {{ c.dead }}
          </button>
        </div>
      </div>
    </div>

    <!-- Meme upload preview -->
    <div class="meme-preview" v-show="previewSrc">
      <img :src="previewSrc" alt="Your meme preview" />
    </div>

    <!-- Drag-and-drop / click-to-browse upload zone -->
    <div
      class="meme-drop-zone"
      :class="{ 'drag-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      v-if="!uploaded"
    >
      <div class="meme-drop-icon"><ImagePlus :size="26" :stroke-width="1.6" /></div>
      <div class="meme-drop-text">Drop your meme here, or <strong>click to browse</strong></div>
    </div>
    <div class="meme-drop-zone" v-else>
      <div class="meme-drop-icon"><CircleCheck :size="26" :stroke-width="1.6" /></div>
      <div class="meme-drop-text"><strong>Meme received.</strong> Judging is under way.</div>
    </div>

    <!-- Hidden file input -->
    <input
      type="file"
      ref="fileInputRef"
      style="display: none"
      accept="image/*"
      @change="handleFileChange"
    />

    <div class="meme-submit-msg" v-show="uploaded">Queued for judging this week.</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Crown, Flame, ImagePlus, CircleCheck, Quote, Skull } from 'lucide-vue-next';
import { save, load } from '../../composables/useLocalStorage.js';

const props = defineProps({
  config: { type: Object, default: null },
});

/** The champion is data, not markup, so a new week only edits dashboard.json. */
const winner = props.config?.winner ?? {
  caption: 'When the exam is tomorrow and you just found the syllabus',
  author: 'anon_23f',
  fireVotes: 147,
  deadVotes: 89,
};

const CANDS = props.config
  ? props.config.candidates.map((c) => ({ ...c }))
  : [
      {
        id: 1,
        title: 'When you realise Stats has calculus in it',
        author: 'anon_24f',
        fire: 34,
        dead: 12,
      },
      {
        id: 2,
        title: 'My laptop at 1AM during submission week',
        author: 'anon_22f',
        fire: 28,
        dead: 45,
      },
      {
        id: 3,
        title: 'Brain 10 mins before vs during an exam',
        author: 'anon_23f',
        fire: 61,
        dead: 8,
      },
    ];

const candidates = ref(CANDS);
const votes = ref(load('sb_meme_votes', {}));
const previewSrc = ref('');
const uploaded = ref(false);
const dragOver = ref(false);
const fileInputRef = ref(null);
const totalCandidateVotes = computed(() => {
  return candidates.value.reduce((sum, c) => sum + c.fire + c.dead, 0);
});

function memeVote(id, type) {
  const c = candidates.value.find((x) => x.id === id);
  if (!c) return;

  const prev = votes.value[id];
  if (prev) c[prev] = Math.max(0, c[prev] - 1);

  if (prev !== type) {
    c[type]++;
    votes.value[id] = type;
  } else {
    delete votes.value[id];
  }

  votes.value = { ...votes.value };
  candidates.value = [...candidates.value];
  save('sb_meme_votes', votes.value);
}

function triggerFileInput() {
  if (fileInputRef.value) fileInputRef.value.click();
}

function handleFileChange(e) {
  handleFile(e.target.files[0]);
}

function handleDrop(e) {
  dragOver.value = false;
  handleFile(e.dataTransfer.files[0]);
}

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    previewSrc.value = ev.target.result;
    uploaded.value = true;
  };
  reader.readAsDataURL(file);
}
</script>
