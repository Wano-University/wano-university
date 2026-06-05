import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 lg:px-16 py-4">
        <span className="font-medium text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wano University
        </span>

        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
