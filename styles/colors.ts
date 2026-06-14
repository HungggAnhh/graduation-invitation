const colors = {
  midnight: '#080d1a',
  navy: '#0f1b3d',
  royal: '#1a2f6b',
  blue: '#2563eb',
  blueLight: '#60a5fa',
  gold: '#c9a96e',
  goldLight: '#e8d5a8',
  cream: '#eef0f7',
  slate: '#1e2444',
  black: '#050810',
  white: '#ffffff',
  gray: '#3a3f55',
} as const

const themeNames = ['light', 'dark'] as const
const colorNames = ['primary', 'secondary', 'contrast'] as const

const themes = {
  light: {
    primary: colors.midnight,
    secondary: colors.cream,
    contrast: colors.gold,
  },
  dark: {
    primary: colors.midnight,
    secondary: colors.cream,
    contrast: colors.gold,
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
