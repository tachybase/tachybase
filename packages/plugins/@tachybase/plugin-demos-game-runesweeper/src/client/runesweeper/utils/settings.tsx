import type { Settings } from '../hooks/useSettingsContext';

export const sizesDict: Record<string, { label: string; w: number; h: number }> = {
  s: { label: 'Small', w: 6, h: 7 },
  m: { label: 'Medium', w: 7, h: 10 },
  l: { label: 'Large', w: 9, h: 14 },
  xl: { label: 'Huge', w: 12, h: 19 },
};

export const difficultiesDict: Record<string, { label: string; mineRatio: number }> = {
  easy: { label: 'Bronze', mineRatio: 0.12 },
  medium: { label: 'Steel', mineRatio: 0.18 },
  hard: { label: 'Mithril', mineRatio: 0.24 },
  vHard: { label: 'Rune', mineRatio: 0.3 },
};

export const controlsDict: Partial<Record<keyof Settings, { label: string }>> = {
  allowMaybe: { label: `Use "maybe"` },
  swipeToChord: { label: 'Swipe to chord' },
  swipeToFlag: { label: 'Swipe to flag' },
};
