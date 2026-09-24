export const THEMES = {
  default: {
    background: "#ffffff",
    border: "#e4e2e0",
    title: "#2f6fed",
    text: "#3a3a3a",
    subtext: "#6b6b6b",
    ring: "#2f6fed",
    ringTrack: "#e9edf7",
  },
  highcontrast: {
    background: "#000000",
    border: "#2a2a2a",
    title: "#ffd60a",
    text: "#ffffff",
    subtext: "#c9c9c9",
    ring: "#ffd60a",
    ringTrack: "#2a2a2a",
  },
  dark: {
    background: "#0d1117",
    border: "#30363d",
    title: "#58a6ff",
    text: "#e6edf3",
    subtext: "#8b949e",
    ring: "#58a6ff",
    ringTrack: "#21262d",
  },
};

export function getTheme(name) {
  return THEMES[name] || THEMES.default;
}
