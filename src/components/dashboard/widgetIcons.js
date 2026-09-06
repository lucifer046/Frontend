/**
 * Icon registry for the command centre widgets.
 *
 * `dashboard.json` stores an icon key rather than a glyph, so the data file
 * stays free of pictographs and a new mood or reaction only needs an entry
 * here. Everything resolves to a Lucide vector, which inherits `currentColor`
 * and therefore stays inside the portal palette.
 */
import { Cloud, Coffee, Heart, Laugh, Sparkles, Sunrise, Tornado, Zap } from 'lucide-vue-next';

const ICONS = {
  sunrise: Sunrise,
  coffee: Coffee,
  zap: Zap,
  cloud: Cloud,
  tornado: Tornado,
  heart: Heart,
  laugh: Laugh,
  sparkles: Sparkles,
};

/** Unknown keys fall back to a neutral mark rather than rendering nothing. */
export function widgetIcon(key) {
  return ICONS[key] || Sparkles;
}
