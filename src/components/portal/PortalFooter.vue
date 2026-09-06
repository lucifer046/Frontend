<template>
  <!-- The private footer. The public site closes with a sitemap; a member
       who is already inside needs a signature, two links and a way out. -->
  <footer class="pfoot">
    <div class="pfoot__inner p-shell">
      <div class="pfoot__mark">
        <span class="pfoot__name">Sundarbans House</span>
        <span class="pfoot__sub">Members Lounge</span>
      </div>

      <nav class="pfoot__links" aria-label="Portal footer">
        <router-link to="/lounge">Lounge</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/">Public site</router-link>
        <button type="button" @click="$emit('logout')">Log out</button>
      </nav>

      <p class="pfoot__copy">© {{ year }} IIT Madras BS Programme · Sundarbans House</p>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['logout']);
const year = new Date().getFullYear();
</script>

<style scoped>
.pfoot {
  background: var(--p-ground-deep);
  border-top: 1px solid var(--p-line);
}
.pfoot__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem clamp(1rem, 4vw, 3rem);
  padding-block: 2.25rem;
}
.pfoot__mark {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.pfoot__name {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.14em;
  color: var(--p-ink);
}
.pfoot__sub {
  font-size: 0.5625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--p-gold-deep);
}
.pfoot__links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-inline: auto;
}
.pfoot__links a,
.pfoot__links button {
  padding: 0;
  background: none;
  border: 0;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--p-ink-faint);
  text-decoration: none;
  cursor: pointer;
  transition: color var(--duration-link, 340ms) var(--p-ease);
}
.pfoot__links a:hover,
.pfoot__links button:hover {
  color: var(--p-gold-light);
}
.pfoot__copy {
  font-size: 0.6875rem;
  color: var(--p-ink-faint);
}

@media (max-width: 900px) {
  .pfoot__inner {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  .pfoot__links {
    margin-inline: 0;
  }
}
</style>
