export type ThemeColor =
  | "zinc"
  | "slate"
  | "stone"
  | "gray"
  | "neutral"
  | "red"
  | "rose"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "violet"

export type ThemeRadius = 0 | 0.3 | 0.5 | 0.75 | 1.0

export type ThemeLayout = "fluid" | "boxed"

export type SidebarVariant = "default" | "inset" | "floating"

export type ThemeFont =
  | "lexend"
  | "inter"
  | "geist"
  | "plus-jakarta-sans"
  | "manrope"
  | "outfit"
  | "dm-sans"

export interface ThemeColorConfig {
  name: ThemeColor
  label: string
  activeColor: {
    light: string
    dark: string
  }
  cssVars: {
    light: {
      primary: string
      primaryForeground: string
      ring: string
      sidebarPrimary: string
      sidebarPrimaryForeground: string
      chart1: string
    }
    dark: {
      primary: string
      primaryForeground: string
      ring: string
      sidebarPrimary: string
      sidebarPrimaryForeground: string
      chart1: string
    }
  }
}

export interface ThemeRadiusConfig {
  value: ThemeRadius
  label: string
  description: string
}

export interface ThemeLayoutConfig {
  value: ThemeLayout
  label: string
  description: string
}

export interface SidebarVariantConfig {
  value: SidebarVariant
  label: string
  description: string
}

export interface ThemeFontConfig {
  value: ThemeFont
  label: string
  family: string
  description: string
}

export interface ThemeSettings {
  color: ThemeColor
  radius: ThemeRadius
  layout: ThemeLayout
  sidebarVariant: SidebarVariant
  font: ThemeFont
  displayFont: ThemeFont
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  color: "zinc",
  radius: 0.5,
  layout: "fluid",
  sidebarVariant: "default",
  font: "lexend",
  displayFont: "lexend",
}

export const THEME_COLORS: ThemeColorConfig[] = [
  {
    name: "zinc",
    label: "Zinc",
    activeColor: {
      light: "#18181b",
      dark: "#fafafa",
    },
    cssVars: {
      light: {
        primary: "oklch(0.205 0 0)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.708 0 0)",
        sidebarPrimary: "oklch(0.205 0 0)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.87 0 0)",
      },
      dark: {
        primary: "oklch(0.985 0 0)",
        primaryForeground: "oklch(0.205 0 0)",
        ring: "oklch(0.556 0 0)",
        sidebarPrimary: "oklch(0.985 0 0)",
        sidebarPrimaryForeground: "oklch(0.205 0 0)",
        chart1: "oklch(0.87 0 0)",
      },
    },
  },
  {
    name: "slate",
    label: "Slate",
    activeColor: {
      light: "#0f172a",
      dark: "#f8fafc",
    },
    cssVars: {
      light: {
        primary: "oklch(0.208 0.042 265.755)",
        primaryForeground: "oklch(0.984 0.003 247.858)",
        ring: "oklch(0.685 0.045 264.376)",
        sidebarPrimary: "oklch(0.208 0.042 265.755)",
        sidebarPrimaryForeground: "oklch(0.984 0.003 247.858)",
        chart1: "oklch(0.488 0.243 264.376)",
      },
      dark: {
        primary: "oklch(0.984 0.003 247.858)",
        primaryForeground: "oklch(0.208 0.042 265.755)",
        ring: "oklch(0.488 0.045 264.376)",
        sidebarPrimary: "oklch(0.984 0.003 247.858)",
        sidebarPrimaryForeground: "oklch(0.208 0.042 265.755)",
        chart1: "oklch(0.685 0.045 264.376)",
      },
    },
  },
  {
    name: "stone",
    label: "Stone",
    activeColor: {
      light: "#1c1917",
      dark: "#fafaf9",
    },
    cssVars: {
      light: {
        primary: "oklch(0.216 0.006 56.043)",
        primaryForeground: "oklch(0.985 0.001 106.423)",
        ring: "oklch(0.709 0.01 56.259)",
        sidebarPrimary: "oklch(0.216 0.006 56.043)",
        sidebarPrimaryForeground: "oklch(0.985 0.001 106.423)",
        chart1: "oklch(0.553 0.013 58.071)",
      },
      dark: {
        primary: "oklch(0.985 0.001 106.423)",
        primaryForeground: "oklch(0.216 0.006 56.043)",
        ring: "oklch(0.553 0.013 58.071)",
        sidebarPrimary: "oklch(0.985 0.001 106.423)",
        sidebarPrimaryForeground: "oklch(0.216 0.006 56.043)",
        chart1: "oklch(0.709 0.01 56.259)",
      },
    },
  },
  {
    name: "gray",
    label: "Gray",
    activeColor: {
      light: "#111827",
      dark: "#f9fafb",
    },
    cssVars: {
      light: {
        primary: "oklch(0.21 0.034 264.665)",
        primaryForeground: "oklch(0.985 0.002 247.839)",
        ring: "oklch(0.707 0.04 264.665)",
        sidebarPrimary: "oklch(0.21 0.034 264.665)",
        sidebarPrimaryForeground: "oklch(0.985 0.002 247.839)",
        chart1: "oklch(0.551 0.04 264.665)",
      },
      dark: {
        primary: "oklch(0.985 0.002 247.839)",
        primaryForeground: "oklch(0.21 0.034 264.665)",
        ring: "oklch(0.551 0.04 264.665)",
        sidebarPrimary: "oklch(0.985 0.002 247.839)",
        sidebarPrimaryForeground: "oklch(0.21 0.034 264.665)",
        chart1: "oklch(0.707 0.04 264.665)",
      },
    },
  },
  {
    name: "neutral",
    label: "Neutral",
    activeColor: {
      light: "#171717",
      dark: "#fafafa",
    },
    cssVars: {
      light: {
        primary: "oklch(0.205 0 0)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.708 0 0)",
        sidebarPrimary: "oklch(0.205 0 0)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.556 0 0)",
      },
      dark: {
        primary: "oklch(0.985 0 0)",
        primaryForeground: "oklch(0.205 0 0)",
        ring: "oklch(0.556 0 0)",
        sidebarPrimary: "oklch(0.985 0 0)",
        sidebarPrimaryForeground: "oklch(0.205 0 0)",
        chart1: "oklch(0.708 0 0)",
      },
    },
  },
  {
    name: "red",
    label: "Red",
    activeColor: {
      light: "#dc2626",
      dark: "#ef4444",
    },
    cssVars: {
      light: {
        primary: "oklch(0.577 0.245 27.325)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.577 0.245 27.325)",
        sidebarPrimary: "oklch(0.577 0.245 27.325)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.577 0.245 27.325)",
      },
      dark: {
        primary: "oklch(0.637 0.237 25.331)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.637 0.237 25.331)",
        sidebarPrimary: "oklch(0.637 0.237 25.331)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.637 0.237 25.331)",
      },
    },
  },
  {
    name: "rose",
    label: "Rose",
    activeColor: {
      light: "#e11d48",
      dark: "#f43f5e",
    },
    cssVars: {
      light: {
        primary: "oklch(0.586 0.253 17.585)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.586 0.253 17.585)",
        sidebarPrimary: "oklch(0.586 0.253 17.585)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.586 0.253 17.585)",
      },
      dark: {
        primary: "oklch(0.645 0.246 16.439)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.645 0.246 16.439)",
        sidebarPrimary: "oklch(0.645 0.246 16.439)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.645 0.246 16.439)",
      },
    },
  },
  {
    name: "orange",
    label: "Orange",
    activeColor: {
      light: "#ea580c",
      dark: "#f97316",
    },
    cssVars: {
      light: {
        primary: "oklch(0.646 0.222 41.116)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.646 0.222 41.116)",
        sidebarPrimary: "oklch(0.646 0.222 41.116)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.646 0.222 41.116)",
      },
      dark: {
        primary: "oklch(0.705 0.213 47.604)",
        primaryForeground: "oklch(0.145 0 0)",
        ring: "oklch(0.705 0.213 47.604)",
        sidebarPrimary: "oklch(0.705 0.213 47.604)",
        sidebarPrimaryForeground: "oklch(0.145 0 0)",
        chart1: "oklch(0.705 0.213 47.604)",
      },
    },
  },
  {
    name: "green",
    label: "Green",
    activeColor: {
      light: "#16a34a",
      dark: "#22c55e",
    },
    cssVars: {
      light: {
        primary: "oklch(0.6 0.18 145)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.6 0.18 145)",
        sidebarPrimary: "oklch(0.6 0.18 145)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.6 0.18 145)",
      },
      dark: {
        primary: "oklch(0.696 0.17 145)",
        primaryForeground: "oklch(0.145 0 0)",
        ring: "oklch(0.696 0.17 145)",
        sidebarPrimary: "oklch(0.696 0.17 145)",
        sidebarPrimaryForeground: "oklch(0.145 0 0)",
        chart1: "oklch(0.696 0.17 145)",
      },
    },
  },
  {
    name: "blue",
    label: "Blue",
    activeColor: {
      light: "#2563eb",
      dark: "#3b82f6",
    },
    cssVars: {
      light: {
        primary: "oklch(0.546 0.245 262.881)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.546 0.245 262.881)",
        sidebarPrimary: "oklch(0.546 0.245 262.881)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.546 0.245 262.881)",
      },
      dark: {
        primary: "oklch(0.623 0.214 259.815)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.623 0.214 259.815)",
        sidebarPrimary: "oklch(0.623 0.214 259.815)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.623 0.214 259.815)",
      },
    },
  },
  {
    name: "yellow",
    label: "Yellow",
    activeColor: {
      light: "#d97706",
      dark: "#f59e0b",
    },
    cssVars: {
      light: {
        primary: "oklch(0.768 0.178 75.332)",
        primaryForeground: "oklch(0.145 0 0)",
        ring: "oklch(0.768 0.178 75.332)",
        sidebarPrimary: "oklch(0.768 0.178 75.332)",
        sidebarPrimaryForeground: "oklch(0.145 0 0)",
        chart1: "oklch(0.768 0.178 75.332)",
      },
      dark: {
        primary: "oklch(0.795 0.184 86.047)",
        primaryForeground: "oklch(0.145 0 0)",
        ring: "oklch(0.795 0.184 86.047)",
        sidebarPrimary: "oklch(0.795 0.184 86.047)",
        sidebarPrimaryForeground: "oklch(0.145 0 0)",
        chart1: "oklch(0.795 0.184 86.047)",
      },
    },
  },
  {
    name: "violet",
    label: "Violet",
    activeColor: {
      light: "#7c3aed",
      dark: "#8b5cf6",
    },
    cssVars: {
      light: {
        primary: "oklch(0.541 0.281 293.009)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.541 0.281 293.009)",
        sidebarPrimary: "oklch(0.541 0.281 293.009)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.541 0.281 293.009)",
      },
      dark: {
        primary: "oklch(0.655 0.254 293.009)",
        primaryForeground: "oklch(0.985 0 0)",
        ring: "oklch(0.655 0.254 293.009)",
        sidebarPrimary: "oklch(0.655 0.254 293.009)",
        sidebarPrimaryForeground: "oklch(0.985 0 0)",
        chart1: "oklch(0.655 0.254 293.009)",
      },
    },
  },
]

export const THEME_RADII: ThemeRadiusConfig[] = [
  { value: 0, label: "0", description: "Sharp edges" },
  { value: 0.3, label: "0.3", description: "Subtle curve" },
  { value: 0.5, label: "0.5", description: "Default balanced" },
  { value: 0.75, label: "0.75", description: "Pronounced rounding" },
  { value: 1.0, label: "1.0", description: "Maximum curve" },
]

export const THEME_LAYOUTS: ThemeLayoutConfig[] = [
  {
    value: "fluid",
    label: "Fluid",
    description: "Expands dynamically across the entire viewport width.",
  },
  {
    value: "boxed",
    label: "Boxed",
    description: "Centers content within a maximum container width (1280px).",
  },
]

export const SIDEBAR_VARIANTS: SidebarVariantConfig[] = [
  {
    value: "default",
    label: "Default",
    description: "Standard rail-aligned sidebar separated by a border divider.",
  },
  {
    value: "inset",
    label: "Inset",
    description: "Framed within an inner canvas with rounded content padding.",
  },
  {
    value: "floating",
    label: "Floating",
    description: "Elevated floating navigation bar with border and shadow.",
  },
]

export const THEME_FONTS: ThemeFontConfig[] = [
  {
    value: "lexend",
    label: "Lexend",
    family: "var(--font-lexend), sans-serif",
    description: "Clean, modern geometric sans engineered for reading proficiency.",
  },
  {
    value: "inter",
    label: "Inter",
    family: "var(--font-inter), sans-serif",
    description: "Carefully crafted for computer screens, clean and neutral.",
  },
  {
    value: "geist",
    label: "Geist",
    family: "var(--font-geist), sans-serif",
    description: "Modern typeface designed for speed, clarity, and precision.",
  },
  {
    value: "plus-jakarta-sans",
    label: "Plus Jakarta Sans",
    family: "var(--font-plus-jakarta), sans-serif",
    description: "Contemporary sans-serif with a geometric, high-tech touch.",
  },
  {
    value: "manrope",
    label: "Manrope",
    family: "var(--font-manrope), sans-serif",
    description: "Open-source modern font crossover of semi-geometric style.",
  },
  {
    value: "outfit",
    label: "Outfit",
    family: "var(--font-outfit), sans-serif",
    description: "Friendly, modern geometric design inspired by brand typography.",
  },
  {
    value: "dm-sans",
    label: "DM Sans",
    family: "var(--font-dm-sans), sans-serif",
    description: "Low-contrast geometric sans-serif suited for crisp interfaces.",
  },
]

export function getThemeColorConfig(name: ThemeColor): ThemeColorConfig {
  return THEME_COLORS.find((t) => t.name === name) ?? THEME_COLORS[0]
}
