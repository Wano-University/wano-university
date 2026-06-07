import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/ThemeProvider"
import { useTranslation } from "react-i18next";


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const { t } = useTranslation();


  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 cursor-pointer"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">{t('ModeToggle')}</span>
    </Button>
  )
}
