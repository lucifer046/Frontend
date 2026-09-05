<template>
  <div>
    <!-- ══ INTRODUCTION ══════════════════════════════════════════════
         Compact on purpose: the desk below is what the visitor came for,
         so the heading states the page and hands over. -->
    <section class="vc-section vc-section--intro tone-a">
      <div class="container">
        <div class="vc-intro">
          <p class="vc-eyebrow">Sundarbans House · Certificate Verification</p>
          <h1 class="vc-title">Verify <span class="tg">Certificates</span></h1>
          <p class="vc-lede">
            Authenticate certificates issued under Sundarbans House. Enter the Certificate ID
            printed on your document.
          </p>
          <span class="vc-rule" aria-hidden="true"></span>
        </div>
      </div>
    </section>

    <!-- ══ THE DESK ══════════════════════════════════════════════════
         The focal point. The crest sits on the left as the issuing mark,
         the form on the right; the result opens underneath in the same
         panel system rather than as a separate card elsewhere. -->
    <section class="vc-section vc-section--desk tone-b" aria-labelledby="vc-form-heading">
      <span class="vc-watermark" aria-hidden="true">Sundarbans</span>

      <div class="container vc-desk-wrap">
        <div class="vc-panel">
          <!-- Issuing authority -->
          <div class="vc-authority">
            <span class="vc-crest">
              <img
                v-if="!crestFailed"
                src="https://res.cloudinary.com/l59gy0g2/image/upload/f_auto,q_auto:good,w_1000,c_limit/v1785911356/sundarbans/src/assets/LOGO.jpg"
                alt=""
                aria-hidden="true"
                class="vc-crest-img"
                loading="lazy"
                decoding="async"
                @error="crestFailed = true"
              />
              <span v-else class="vc-crest-letter" aria-hidden="true">S</span>
              <svg class="vc-crest-ring" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="58" />
              </svg>
            </span>

            <p class="vc-authority-name">Sundarbans House</p>
            <p class="vc-authority-role">Issuing authority</p>

            <dl class="vc-authority-meta">
              <div>
                <dt>Programme</dt>
                <dd>IIT Madras BS Degree</dd>
              </div>
              <div>
                <dt>Records on file</dt>
                <dd>{{ recordCountLabel }}</dd>
              </div>
            </dl>
          </div>

          <!-- Verification form -->
          <div class="vc-form">
            <p class="vc-form-eyebrow">Certificate verification</p>
            <h2 id="vc-form-heading" class="vc-form-title">Verify an issued certificate</h2>
            <p class="vc-form-lede">Enter the unique Certificate ID to confirm its authenticity.</p>

            <form class="vc-field" @submit.prevent="verifyCertificate">
              <label class="vc-label" for="vc-id">Certificate ID</label>
              <div class="vc-input-shell">
                <FileCheck
                  class="vc-input-icon"
                  :size="18"
                  :stroke-width="1.8"
                  aria-hidden="true"
                />
                <input
                  id="vc-id"
                  v-model="certificateId"
                  type="text"
                  class="vc-input"
                  placeholder="e.g. SH2024001"
                  autocomplete="off"
                  spellcheck="false"
                  :disabled="loading"
                  :aria-describedby="errorMsg ? 'vc-error' : undefined"
                />
              </div>

              <button
                type="submit"
                class="btn btn--primary vc-submit"
                :disabled="loading || !certificateId.trim()"
              >
                <span v-if="loading" class="vc-spinner" aria-hidden="true"></span>
                {{ loading ? 'Verifying…' : 'Verify certificate' }}
                <ArrowRight v-if="!loading" :size="16" :stroke-width="2.2" aria-hidden="true" />
              </button>
            </form>

            <!-- Stated because it is what the code does: the lookup runs against
                 a published record fetched into the page, so the ID itself is
                 never sent anywhere. No broader privacy claim is made. -->
            <p class="vc-note">
              <ShieldCheck :size="15" :stroke-width="1.8" aria-hidden="true" />
              <span>The ID is matched in your browser — it is never sent to a server.</span>
            </p>
          </div>
        </div>

        <!-- ── RESULT ─────────────────────────────────────────────────
             One record block, in the panel's own language. -->
        <div v-if="errorMsg" id="vc-error" class="vc-record vc-record--miss" role="status">
          <p class="vc-record-status vc-record-status--miss">
            <XCircle :size="16" :stroke-width="2" aria-hidden="true" />
            Not found
          </p>
          <h3 class="vc-record-title">Certificate not found</h3>
          <p class="vc-record-note">{{ errorMsg }}</p>
        </div>

        <div v-else-if="result" class="vc-record" role="status">
          <div class="vc-record-head">
            <div>
              <p class="vc-record-status">
                <BadgeCheck :size="16" :stroke-width="2" aria-hidden="true" />
                Verified
              </p>
              <h3 class="vc-record-title">Certificate verified</h3>
              <p class="vc-record-note">
                This is an authentic certificate issued by Sundarbans House.
              </p>
            </div>
            <span class="vc-record-kind">{{
              certType === 'department' ? 'Department' : 'Event'
            }}</span>
          </div>

          <dl class="vc-record-fields">
            <div>
              <dt>Certificate ID</dt>
              <dd class="vc-mono">{{ result.id }}</dd>
            </div>
            <div>
              <dt>Recipient</dt>
              <dd>{{ result.name }}</dd>
            </div>
            <div>
              <dt>{{ certType === 'department' ? 'Department' : 'Event' }}</dt>
              <dd>{{ certType === 'department' ? result.department : result.event }}</dd>
            </div>
            <div>
              <dt>Issue date</dt>
              <dd>{{ result.date }}</dd>
            </div>
            <div v-if="result.category">
              <dt>Category</dt>
              <dd>{{ result.category }}</dd>
            </div>
            <div v-if="certType === 'department' ? result.rank : result.role">
              <dt>Rank / Role</dt>
              <dd>{{ certType === 'department' ? result.rank : result.role }}</dd>
            </div>
            <div v-if="result.tenure">
              <dt>Tenure</dt>
              <dd>{{ result.tenure }}</dd>
            </div>
            <div v-if="result.issued_by">
              <dt>Issued by</dt>
              <dd>{{ result.issued_by }}</dd>
            </div>
          </dl>

          <div v-if="hasCertificateFile" class="vc-record-actions">
            <button type="button" class="btn btn--outline btn--sm" @click="viewCertificate">
              <Eye :size="15" :stroke-width="2" aria-hidden="true" />
              View certificate
            </button>
            <button type="button" class="btn btn--text vc-download" @click="downloadCertificate">
              Open &amp; download
              <ArrowRight :size="14" :stroke-width="2" aria-hidden="true" />
            </button>
          </div>
          <p v-else class="vc-record-note vc-record-note--quiet">
            Certificate file not yet uploaded.
          </p>
        </div>
      </div>
    </section>

    <!-- ══ WHY VERIFY ════════════════════════════════════════════════
         Three columns of prose separated by rules, not three cards. -->
    <section class="vc-section vc-section--why tone-a" aria-labelledby="vc-why-heading">
      <div class="container">
        <header class="vc-why-hdr">
          <p class="section-tag">Why verify?</p>
          <h2 id="vc-why-heading" class="vc-why-title">
            A certificate is only worth what it can prove
          </h2>
        </header>

        <ul class="vc-principles">
          <li v-for="principle in principles" :key="principle.title">
            <component
              :is="principle.icon"
              class="vc-principle-icon"
              :size="20"
              :stroke-width="1.7"
              aria-hidden="true"
            />
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.copy }}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  FileCheck,
  ShieldCheck,
  BadgeCheck,
  XCircle,
  Eye,
  ArrowRight,
  Fingerprint,
  Zap,
} from 'lucide-vue-next';

const certificateId = ref('');
const loading = ref(false);
const result = ref(null);
const errorMsg = ref('');
const crestFailed = ref(false);

/** Filled from the database the first time a lookup runs; blank until then. */
const recordCount = ref(null);
const recordCountLabel = computed(() =>
  recordCount.value == null ? 'Verified on request' : `${recordCount.value} issued`
);

const principles = [
  {
    icon: BadgeCheck,
    title: 'Authentic',
    copy: 'Confirm that a certificate was officially issued by Sundarbans House.',
  },
  {
    icon: Fingerprint,
    title: 'Unique',
    copy: 'Each certificate is associated with a unique Certificate ID.',
  },
  {
    icon: Zap,
    title: 'Instant',
    copy: 'Receive the verification result directly through this portal.',
  },
];

// certificates.json does not store an explicit "type" field.
// Infer it from which fields are actually present on the record,
// so old records without "type" still classify correctly.
const certType = computed(() => {
  if (!result.value) return null;
  if (result.value.type) return result.value.type;
  return result.value.event ? 'event' : 'department';
});

/** True when we can open a PDF on Drive (local /certificates PDFs removed from repo). */
const hasCertificateFile = computed(() => {
  const c = result.value;
  if (!c) return false;
  return Boolean(c.driveUrl || c.driveFileId);
});

/** Google Drive view URL only (T-16). */
function certificateViewUrl(cert) {
  if (!cert) return null;
  if (cert.driveUrl) return cert.driveUrl;
  if (cert.driveFileId) {
    return `https://drive.google.com/file/d/${encodeURIComponent(cert.driveFileId)}/view`;
  }
  return null;
}

/** Direct download via Drive export when we have a file id. */
function certificateDownloadUrl(cert) {
  if (!cert) return null;
  if (cert.driveFileId) {
    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(cert.driveFileId)}`;
  }
  if (cert.driveUrl) {
    const m = String(cert.driveUrl).match(/\/file\/d\/([^/]+)/);
    if (m) {
      return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(m[1])}`;
    }
    return cert.driveUrl;
  }
  return null;
}

async function verifyCertificate() {
  const id = certificateId.value.trim().toUpperCase();
  if (!id) return;

  result.value = null;
  errorMsg.value = '';
  loading.value = true;

  try {
    const res = await fetch('/data/certificates.json');
    if (!res.ok) throw new Error('Failed to load certificate database');
    const db = await res.json();
    recordCount.value = Object.keys(db).length;
    const cert = db[id];
    if (cert) {
      result.value = cert;
    } else {
      errorMsg.value = `No certificate found with ID "${id}". Check the ID on your document and try again.`;
    }
  } catch (err) {
    errorMsg.value = 'Could not reach the certificate database. Please try again later.';
  }

  loading.value = false;
}

function viewCertificate() {
  const url = certificateViewUrl(result.value);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function downloadCertificate() {
  const cert = result.value;
  const url = certificateDownloadUrl(cert);
  if (!url) return;

  // Drive export opens in a new tab (cross-origin; cannot force a download attr).
  if (url.startsWith('http')) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = `${cert.id}.pdf`;
  a.rel = 'noopener';
  a.click();
}
</script>

<style scoped>
/* ═══ CANVAS ════════════════════════════════════════════════════════
   Three bands of the two house tones, no rules between them: the page
   reads as one composition whose middle section is simply a shade
   different, which is what makes the desk sit forward. */
.vc-section {
  padding: var(--section-pad) 0;
}

.vc-section--intro {
  padding: clamp(7rem, 12vw, 10rem) 0 clamp(2.5rem, 5vw, 4rem);
}

.vc-section--desk {
  position: relative;
  overflow: hidden;
  padding-block: clamp(3rem, 5vw, 4.5rem);
}

/* ═══ INTRODUCTION ══════════════════════════════════════════════════ */
.vc-intro {
  max-width: 44rem;
}

.vc-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
  margin-bottom: 1.1rem;
}

.vc-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5vw, 3.9rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: 0.01em;
  color: var(--color-cream);
  margin-bottom: 1.15rem;
}

.vc-lede {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-cream-muted);
  max-width: 38rem;
}

/* The one decorative element: a thin architectural rule under the copy. */
.vc-rule {
  display: block;
  width: 5.5rem;
  height: 1px;
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
  background: linear-gradient(90deg, var(--color-gold), rgba(170, 125, 35, 0));
}

/* ═══ WATERMARK ═════════════════════════════════════════════════════
   The house name, barely above the ground, sitting behind the desk. */
.vc-watermark {
  position: absolute;
  right: -0.08em;
  bottom: -0.32em;
  font-family: var(--font-display);
  font-size: clamp(7rem, 20vw, 18rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--color-cream);
  opacity: 0.017;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.vc-desk-wrap {
  position: relative;
  z-index: 1;
}

/* ═══ PANEL ═════════════════════════════════════════════════════════ */
.vc-panel {
  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem);
  padding: clamp(1.75rem, 3.5vw, 3rem);
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad2);
}

@media (min-width: 900px) {
  .vc-panel {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: center;
  }

  /* A single hairline between the seal and the form — the only divider on
     the page that is not a change of tone. */
  .vc-form {
    padding-left: clamp(2rem, 4vw, 3.5rem);
    border-left: 1px solid var(--border-subtle);
  }
}

/* ── Issuing authority ─────────────────────────────────────────────── */
.vc-authority {
  text-align: center;
}

.vc-crest {
  position: relative;
  display: grid;
  place-items: center;
  width: min(9rem, 40vw);
  aspect-ratio: 1;
  margin: 0 auto 1.35rem;
}

.vc-crest > * {
  grid-area: 1 / 1;
}

/* The artwork carries a hard white outline at its own edge; clipping the
   last few percent of the radius drops it and nothing else, so the thin
   gold rule below is the only ring on screen. */
.vc-crest-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  clip-path: circle(47.5% at 50% 50%);
}

.vc-crest-letter {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-gold);
}

.vc-crest-ring {
  width: 100%;
  height: 100%;
}

.vc-crest-ring circle {
  fill: none;
  stroke: var(--color-gold-muted);
  stroke-width: 1;
  opacity: 0.55;
}

.vc-authority-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-cream);
}

.vc-authority-role {
  margin-top: 0.25rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
}

.vc-authority-meta {
  display: grid;
  gap: 0.85rem;
  margin-top: 1.6rem;
  padding-top: 1.35rem;
  border-top: 1px solid var(--border-subtle);
}

.vc-authority-meta dt {
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

.vc-authority-meta dd {
  margin: 0.2rem 0 0;
  font-size: 0.86rem;
  color: var(--color-cream-muted);
}

/* ── Form ──────────────────────────────────────────────────────────── */
.vc-form-eyebrow {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
  margin-bottom: 0.8rem;
}

.vc-form-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-cream);
  margin-bottom: 0.7rem;
}

.vc-form-lede {
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  max-width: 34rem;
}

.vc-field {
  margin-top: clamp(1.5rem, 3vw, 2rem);
}

.vc-label {
  display: block;
  margin-bottom: 0.55rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-cream-muted);
}

.vc-input-shell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.2rem 1rem;
  background: var(--color-bg-black);
  border: 1px solid var(--border-card);
  border-radius: var(--rad);
  transition:
    border-color var(--duration-button) var(--ease-editorial),
    background-color var(--duration-button) var(--ease-editorial);
}

/* The focus state lives on the shell so the ring frames the whole control
   rather than an inset box. */
.vc-input-shell:focus-within {
  border-color: var(--color-gold);
  background: var(--color-card-raised);
}

.vc-input-icon {
  flex: none;
  color: var(--color-gold-muted);
  transition: color var(--duration-button) var(--ease-editorial);
}

.vc-input-shell:focus-within .vc-input-icon {
  color: var(--color-gold);
}

.vc-input {
  flex: 1;
  min-width: 0;
  padding: 0.85rem 0;
  border: 0;
  background: none;
  color: var(--color-cream);
  font-family: var(--font-body);
  font-size: 0.95rem;
  letter-spacing: 0.06em;
}

.vc-input::placeholder {
  color: var(--color-cream-faint);
  letter-spacing: 0.04em;
}

.vc-input:focus {
  outline: none;
}

.vc-input:disabled {
  opacity: 0.55;
}

.vc-submit {
  width: 100%;
  margin-top: 1rem;
}

/* A thin turning rule, not a spinner graphic. */
.vc-spinner {
  width: 14px;
  height: 14px;
  flex: none;
  border: 1.5px solid rgba(5, 6, 5, 0.25);
  border-top-color: #050605;
  border-radius: 50%;
  animation: vc-spin 900ms linear infinite;
}

@keyframes vc-spin {
  to {
    transform: rotate(360deg);
  }
}

.vc-note {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin-top: 1.1rem;
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--color-cream-faint);
}

.vc-note svg {
  flex: none;
  margin-top: 0.1rem;
  color: var(--color-gold-muted);
}

/* ═══ RESULT ════════════════════════════════════════════════════════
   The same surface and border as the panel, so a result reads as the
   next page of the same document rather than a notification. */
.vc-record {
  margin-top: clamp(1.25rem, 2.5vw, 1.75rem);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-left: 2px solid var(--color-gold-muted);
  border-radius: var(--rad2);
  animation: vc-record-in var(--duration-card) var(--ease-reveal) both;
}

.vc-record--miss {
  border-left-color: var(--color-cream-faint);
}

@keyframes vc-record-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vc-record-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.vc-record-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold);
}

.vc-record-status--miss {
  color: var(--color-cream-muted);
}

.vc-record-title {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.2vw, 1.6rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-cream);
  margin-bottom: 0.45rem;
}

.vc-record-note {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-cream-muted);
  max-width: 52ch;
}

.vc-record-note--quiet {
  margin-top: 1.35rem;
  font-size: 0.82rem;
  color: var(--color-cream-faint);
}

.vc-record-kind {
  flex: none;
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
}

/* The record itself: label over value, in columns, with nothing boxed. */
.vc-record-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: 1.25rem clamp(1.5rem, 3vw, 2.5rem);
  margin: clamp(1.5rem, 3vw, 2rem) 0 0;
  padding-top: clamp(1.35rem, 2.5vw, 1.75rem);
  border-top: 1px solid var(--border-subtle);
}

.vc-record-fields dt {
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-cream-faint);
}

.vc-record-fields dd {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-cream);
  overflow-wrap: anywhere;
}

.vc-mono {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}

.vc-record-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.5rem;
  margin-top: clamp(1.5rem, 3vw, 2rem);
}

.vc-download {
  gap: 0.4rem;
}

/* ═══ WHY VERIFY ════════════════════════════════════════════════════ */
.vc-why-hdr {
  max-width: 44rem;
  margin-bottom: clamp(2.25rem, 4vw, 3.25rem);
}

.vc-why-hdr .section-tag {
  margin-bottom: 1rem;
}

.vc-why-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  line-height: 1.22;
  color: var(--color-cream);
}

/* Three columns of prose. The only structure is a rule to the left of each
   — no cards, no plates behind the icons. */
.vc-principles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: clamp(1.75rem, 4vw, 3rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.vc-principles li {
  padding-left: clamp(1.25rem, 2.5vw, 1.75rem);
  border-left: 1px solid var(--border-subtle);
}

.vc-principle-icon {
  display: block;
  color: var(--color-gold-muted);
  margin-bottom: 0.85rem;
}

.vc-principles h3 {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-cream);
  margin-bottom: 0.6rem;
}

.vc-principles p {
  font-size: 0.9rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
}

@media (prefers-reduced-motion: reduce) {
  .vc-record {
    animation: none;
  }

  .vc-spinner {
    animation: none;
    border-top-color: rgba(5, 6, 5, 0.55);
  }
}

[data-theme='light'] .vc-panel,
[data-theme='light'] .vc-record {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.08);
}
</style>
