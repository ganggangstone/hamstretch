// 테마 선택값을 읽고 쓰고 화면에 반영한다.
// 색 자체는 theme.css에만 있다 — 여기서는 html의 data-theme만 갈아끼운다.

export const THEMES = ['system', 'light', 'dark'];
const KEY = 'theme';
const FALLBACK = 'system';

export function getTheme() {
  const saved = localStorage.getItem(KEY);
  return THEMES.includes(saved) ? saved : FALLBACK;
}

export function setTheme(value) {
  if (!THEMES.includes(value)) return;
  localStorage.setItem(KEY, value);
}

/// 'system'이면 속성을 지운다. 그래야 CSS의 prefers-color-scheme이 다시 판단한다.
export function applyTheme() {
  const theme = getTheme();
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}
