/**
 * Reusable state + motion logic behind the vertical navigation.
 *
 * Everything here is deliberately cheap: no animation library, no physics, no
 * per-frame layout reads. The only measurement happens once per pointer entry,
 * and the only per-frame work is one rAF-throttled arithmetic pass over eight
 * numbers.
 */
import { ref, shallowRef, computed, watch, onMounted, onBeforeUnmount } from 'vue';

/** Live `prefers-reduced-motion` flag — motion is opt-out, not baked in. */
export function useReducedMotion() {
  const reduced = ref(false);
  let mql = null;
  const sync = () => {
    reduced.value = mql.matches;
  };

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    sync();
    mql.addEventListener('change', sync);
  });
  onBeforeUnmount(() => mql?.removeEventListener('change', sync));

  return reduced;
}

/**
 * Open-immediately / close-on-a-grace-period. The delay is what stops the rail
 * flickering when the pointer clips its edge or crosses the gap between two
 * items; opening stays instant so the rail never feels sticky.
 */
export function useHoverIntent(closeDelay = 140) {
  const open = ref(false);
  let timer = null;

  function cancel() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function show() {
    cancel();
    open.value = true;
  }
  function hide(immediate = false) {
    cancel();
    if (immediate) {
      open.value = false;
      return;
    }
    timer = setTimeout(() => {
      open.value = false;
      timer = null;
    }, closeDelay);
  }

  onBeforeUnmount(cancel);

  return { open, show, hide };
}

/**
 * The displacement field. Pointer position along the list is converted to a
 * fractional index, and each item is nudged toward the content area by a
 * gaussian falloff around it: the item under the cursor moves, its neighbours
 * barely, the rest not at all.
 *
 * These two numbers are the whole feel of the rail. `maxOffset` is how far the
 * hovered row travels; `sigma` is how much of that its neighbours inherit.
 * Both are deliberately small. At sigma 0.9 the next row along took more than
 * half the travel and the one after it was still visibly moving, which read as
 * a wave running through the list; at 0.5 it takes about an eighth and the
 * rest nothing, so the response reads as the hovered row alone lifting.
 */
export function useWaveField(count, { maxOffset = 4, sigma = 0.5 } = {}) {
  const zeros = () => new Array(count).fill(0);
  const offsets = ref(zeros());
  const listEl = shallowRef(null);

  let rect = null;
  let itemHeight = 0;
  let frame = 0;
  let pendingY = 0;
  let enabled = true;

  function measure() {
    const el = listEl.value;
    if (!el) return false;
    rect = el.getBoundingClientRect();
    itemHeight = count > 0 ? rect.height / count : 0;
    return itemHeight > 0;
  }

  function apply() {
    frame = 0;
    if (!rect || !itemHeight) return;
    // Fractional index of the cursor, so the wave travels continuously instead
    // of snapping from one item to the next.
    const center = (pendingY - rect.top) / itemHeight - 0.5;
    const twoSigmaSq = 2 * sigma * sigma;
    const next = new Array(count);
    for (let i = 0; i < count; i += 1) {
      const d = i - center;
      next[i] = Math.round(maxOffset * Math.exp(-((d * d) / twoSigmaSq)) * 100) / 100;
    }
    offsets.value = next;
  }

  function reset() {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    rect = null;
    offsets.value = zeros();
  }

  function onPointerMove(event) {
    if (!enabled || event.pointerType === 'touch') return;
    if (!rect && !measure()) return;
    pendingY = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(apply);
  }

  function onPointerEnter(event) {
    if (!enabled || event.pointerType === 'touch') return;
    if (!measure()) return;
    onPointerMove(event);
  }

  function setEnabled(value) {
    enabled = value;
    if (!value) reset();
  }

  onBeforeUnmount(reset);

  return { offsets, listEl, onPointerEnter, onPointerMove, onPointerLeave: reset, setEnabled };
}

/**
 * Which of the tracked sections is currently being read. The rootMargin pins
 * the decision to a thin band across the middle of the viewport, so at most one
 * section qualifies at a time and the indicator never oscillates between two
 * neighbours. `suppress()` parks the spy while a programmatic scroll (a route
 * change landing at the top) is in flight — the scroll/click conflict guard.
 */
export function useSectionSpy(sectionIds, activeSource) {
  const activeSectionId = ref(null);
  const visible = new Set();
  let observer = null;
  let suppressTimer = null;
  let suppressed = false;

  function pick() {
    if (suppressed) return;
    activeSectionId.value = sectionIds.find((id) => visible.has(id)) ?? null;
  }

  function disconnect() {
    observer?.disconnect();
    observer = null;
    visible.clear();
    activeSectionId.value = null;
  }

  function connect() {
    disconnect();
    if (typeof IntersectionObserver !== 'function') return false;
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return false;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return true;
  }

  /**
   * Route components are lazy, so the sections do not exist on the tick the
   * route flips — and with an out-in page transition they arrive a few hundred
   * milliseconds later still. Retry on a short bounded schedule rather than
   * guessing a single delay, and give up quietly on a page that has none.
   */
  const RETRY_SCHEDULE_MS = [0, 80, 200, 420, 700, 1100];
  let retryTimers = [];

  function cancelRetries() {
    retryTimers.forEach(clearTimeout);
    retryTimers = [];
  }

  function connectWhenReady() {
    cancelRetries();
    retryTimers = RETRY_SCHEDULE_MS.map((delay) =>
      setTimeout(() => {
        if (observer) return;
        connect();
      }, delay)
    );
  }

  function suppress(ms = 700) {
    suppressed = true;
    clearTimeout(suppressTimer);
    suppressTimer = setTimeout(() => {
      suppressed = false;
      pick();
    }, ms);
  }

  watch(
    activeSource,
    (isActive) => {
      if (!isActive) {
        cancelRetries();
        disconnect();
        return;
      }
      suppress();
      connectWhenReady();
    },
    { immediate: true }
  );

  onBeforeUnmount(() => {
    clearTimeout(suppressTimer);
    cancelRetries();
    disconnect();
  });

  return { activeSectionId, suppress };
}

/** Keeps the page behind an open drawer from scrolling. */
export function useBodyScrollLock(active) {
  let previousOverflow = '';
  let locked = false;

  function lock() {
    if (locked) return;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    locked = true;
  }
  function unlock() {
    if (!locked) return;
    document.body.style.overflow = previousOverflow;
    locked = false;
  }

  watch(active, (value) => (value ? lock() : unlock()));
  onBeforeUnmount(unlock);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Tab containment for the mobile drawer, plus focus restoration to whatever
 * opened it. Deliberately minimal — one keydown listener, no DOM mutation.
 */
export function useFocusTrap(containerRef, active) {
  let restoreTo = null;

  function onKeydown(event) {
    if (event.key !== 'Tab' || !containerRef.value) return;
    const nodes = Array.from(containerRef.value.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(active, (value) => {
    if (value) {
      restoreTo = document.activeElement;
      document.addEventListener('keydown', onKeydown);
      requestAnimationFrame(() => containerRef.value?.querySelector(FOCUSABLE)?.focus());
    } else {
      document.removeEventListener('keydown', onKeydown);
      restoreTo?.focus?.();
      restoreTo = null;
    }
  });

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
}

/**
 * Viewport-driven mode switch. The rail wants a pointer and vertical room;
 * below the breakpoint the drawer takes over. A media query, not a resize
 * listener, so it costs nothing while idle.
 */
export function useRailBreakpoint(query = '(min-width: 1024px)') {
  const isDesktop = ref(true);
  let mql = null;
  const sync = () => {
    isDesktop.value = mql.matches;
  };

  onMounted(() => {
    mql = window.matchMedia(query);
    sync();
    mql.addEventListener('change', sync);
  });
  onBeforeUnmount(() => mql?.removeEventListener('change', sync));

  return { isDesktop, isMobile: computed(() => !isDesktop.value) };
}
