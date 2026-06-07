import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/ThemeProvider"
import { useTranslation } from "react-i18next";


const TOGGLE_MAP = {
  light:    'dark',
  dark:     'light',
  pink:     'darkPink',
  darkPink: 'pink',
  teal:     'darkTeal',
  darkTeal: 'teal',
  blackAndWhite: 'darkBlackAndWhite',
  darkBlackAndWhite: 'blackAndWhite',
  bluee: 'darKBluee',
  darkBluee: 'bluee',
  red: 'darkRed',
  darkRed: 'red',
  wine: 'darkWine',
  darkWine: 'wine',
  cyan: 'darkCyan',
  darkCyan: 'cyan'
};

const DARK_THEMES = new Set(['dark', 'darkPink', 'darkTeal', 'darkBlackAndWhite', 'darkBluee', 'darkRed', 'darkWine', 'darkCyan']);

function resolveSystemTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const resolved = resolveSystemTheme(theme);
  const isDark = DARK_THEMES.has(resolved);
   const { t } = useTranslation();

  function handleToggle() {
    setTheme(TOGGLE_MAP[resolved] ?? (isDark ? 'light' : 'dark'));
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 cursor-pointer"
      onClick={handleToggle}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">{t('ModeToggle')}</span>
    </Button>
  );
}
