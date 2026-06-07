import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Check } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider.jsx';

const ALL_THEME_CLASSES = ['light', 'dark', 'pink', 'darkPink', 'teal', 'darkTeal', 'darkBlackAndWhite','blackAndWhite','darKBlue','blue','darkWine','wine'];

const THEMES = [
  {
    id: 'light',
    label: 'Default',
    mode: 'Light',
    p: {
      bg:      'oklch(0.9564 0.0094 279.69)',
      card:    'oklch(0.9886 0.0026 286.35)',
      primary: 'oklch(0.3093 0.2115 264.10)',
      muted:   'oklch(0.9309 0.0134 286.14)',
      border:  'oklch(0.8695 0.0357 287.40)',
    },
  },
  {
    id: 'dark',
    label: 'Default',
    mode: 'Dark',
    p: {
      bg:      'oklch(0.2288 0.0505 275.09)',
      card:    'oklch(0.2314 0.0488 273.47)',
      primary: 'oklch(0.8907 0.0339 259.42)',
      muted:   'oklch(0.2799 0.0722 272.24)',
      border:  'oklch(0.3633 0.0980 269.71)',
    },
  },
  {
    id: 'pink',
    label: 'Pink',
    mode: 'Light',
    p: {
      bg:      'oklch(0.9564 0.0094 279.69)',
      card:    'oklch(0.9886 0.0026 286.35)',
      primary: 'oklch(0.65 0.22 350)',
      muted:   'oklch(0.9309 0.0134 286.14)',
      border:  'oklch(0.8695 0.0357 287.40)',
    },
  },
  {
    id: 'darkPink',
    label: 'Pink',
    mode: 'Dark',
    p: {
      bg:      'oklch(0.2288 0.0505 275.09)',
      card:    'oklch(0.2314 0.0488 273.47)',
      primary: 'oklch(0.75 0.12 350)',
      muted:   'oklch(0.2799 0.0722 272.24)',
      border:  'oklch(0.3633 0.0980 269.71)',
    },
  },
  {
    id: 'teal',
    label: 'Teal',
    mode: 'Light',
    p: {
      bg:      'oklch(0.96 0.01 190)',
      card:    'oklch(0.98 0.005 190)',
      primary: 'oklch(0.60 0.18 185)',
      muted:   'oklch(0.92 0.02 190)',
      border:  'oklch(0.85 0.03 190)',
    },
  },
  {
    id: 'darkTeal',
    label: 'Teal',
    mode: 'Dark',
    p: {
      bg:      'oklch(0.20 0.04 190)',
      card:    'oklch(0.22 0.04 190)',
      primary: 'oklch(0.75 0.12 185)',
      muted:   'oklch(0.28 0.04 190)',
      border:  'oklch(0.35 0.05 190)',
    },
  },
  {
    id: 'blackAndWhite',
    label: 'Black & White',
    mode: 'Light',
    p: {
      bg:      'oklch(0.98 0 0)',
      card:    'oklch(0.95 0 0)',
      primary: 'oklch(0.1 0 0)',
      muted:   'oklch(0.9 0 0)',
      border:  'oklch(0.8 0 0)',
    },
  },
  {
    id: 'darkBlackAndWhite',
    label: 'Black & White',
    mode: 'Dark',
    p: {
      bg:      'oklch(0.1 0 0)',
      card:    'oklch(0.15 0 0)',
      primary: 'oklch(0.95 0 0)',
      muted:   'oklch(0.2 0 0)',
      border:  'oklch(0.25 0 0)',
    },
  },
  {
    id: 'bluee',
    label: 'Blue',
    mode: 'Light',
    p: {
      bg:      'oklch(0.96 0.01 240)',
      card:    'oklch(0.98 0.005 240)',
      primary: 'oklch(0.55 0.20 240)',
      muted:   'oklch(0.92 0.02 240)',
      border:  'oklch(0.85 0.03 240)',
    },
  },
  {
    id: 'darkBluee',
    label: 'Blue',
    mode: 'Dark',
    p: {
      bg:      'oklch(0.15 0.04 240)',
      card:    'oklch(0.18 0.04 240)',
      primary: 'oklch(0.70 0.12 240)',
      muted:   'oklch(0.25 0.04 240)',
      border:  'oklch(0.30 0.05 240)',
    },
  },
  {
    id: 'red',
    label: 'Red',
    mode: 'Light',
    p: {
      bg:      'oklch(0.97 0.005 20)',
      card:    'oklch(0.99 0.002 20)',
      primary: 'oklch(0.50 0.12 20)',
      muted:   'oklch(0.92 0.01 20)',
      border:  'oklch(0.85 0.02 20)',
    },
  },
  {
    id: 'darkRed',
    label: 'Red',
    mode: 'Dark',
    p: {
      bg:      'oklch(0.15 0.02 20)',
      card:    'oklch(0.18 0.02 20)',
      primary: 'oklch(0.65 0.10 20)',
      muted:   'oklch(0.22 0.02 20)',
      border:  'oklch(0.25 0.03 20)',
    },
  },
    {
    id: 'wine',
    label: 'Wine',
    mode: 'Light',
    p: {
        bg:      'oklch(0.97 0.005 20)',
        card:    'oklch(0.99 0.002 20)',
        primary: 'oklch(0.40 0.15 350)', 
        muted:   'oklch(0.92 0.01 20)',
        border:  'oklch(0.85 0.02 20)',
    },
    },
    {
    id: 'darkWine',
    label: 'Wine',
    mode: 'Dark',
    p: {
        bg:      'oklch(0.15 0.02 20)',
        card:    'oklch(0.18 0.02 20)',
        primary: 'oklch(0.60 0.20 350)', 
        muted:   'oklch(0.22 0.02 20)',
        border:  'oklch(0.25 0.03 20)',
    },
    },
];


function applyThemeToDOM(id) {
  const root = document.documentElement;
  root.classList.remove(...ALL_THEME_CLASSES);
  if (id && id !== 'light') root.classList.add(id);
}

function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function MiniPreview({ p, isSelected }) {
  return (
    <div
      style={{
        backgroundColor: p.bg,
        borderRadius: '12px',
        padding: '8px',
        border: `2.5px solid ${isSelected ? p.primary : p.border}`,
        transition: 'border-color 0.15s ease',
      }}
    >
      <div style={{
        backgroundColor: p.card,
        borderRadius: '7px',
        padding: '5px 6px',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        <div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: p.primary, flexShrink: 0 }} />
        <div style={{ height: 5, flex: 1, borderRadius: 3, backgroundColor: p.muted }} />
        <div style={{ width: 14, height: 5, borderRadius: 3, backgroundColor: p.primary, opacity: 0.45 }} />
      </div>

      <div style={{ backgroundColor: p.card, borderRadius: '7px', padding: '6px' }}>
        <div style={{ height: 5, width: '58%', borderRadius: 3, backgroundColor: p.primary, marginBottom: 4 }} />
        <div style={{ height: 4, width: '88%', borderRadius: 3, backgroundColor: p.muted, marginBottom: 3 }} />
        <div style={{ height: 4, width: '68%', borderRadius: 3, backgroundColor: p.muted, marginBottom: 7 }} />
        <div style={{ height: 13, width: '44%', borderRadius: 5, backgroundColor: p.primary }} />
      </div>
    </div>
  );
}

export function ThemeSwitcher({ onClose }) {
  const { theme, setTheme } = useTheme();
  const [pending, setPending]   = useState(() => resolveTheme(theme));
  const submittedRef            = useRef(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    applyThemeToDOM(pending);
  }, [pending]);

  useEffect(() => {
    return () => {
      if (!submittedRef.current) {
        applyThemeToDOM(resolveTheme(theme));
      }
    };
  }, [theme]);

  function handleApply() {
    submittedRef.current = true; 
    setTheme(pending);         
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  const selected = THEMES.find((t) => t.id === pending);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-card text-card-foreground w-full max-w-md p-6 rounded-[2rem] shadow-2xl relative border border-border"
      >
        <button
          onClick={handleCancel}
          className="absolute top-5 right-5 p-2 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary border border-primary/20">
            <Palette className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Appearance</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Previewing{' '}
            <span className="font-semibold text-foreground">
              {selected?.label} {selected?.mode}
            </span>{' '}
            — apply to save.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {THEMES.map((t) => {
            const isSelected = pending === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setPending(t.id)}
                className="flex flex-col gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
              >
                <motion.div
                  animate={{ scale: isSelected ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="w-full"
                >
                  <MiniPreview p={t.p} isSelected={isSelected} />
                </motion.div>

                <div className="flex flex-col items-center leading-tight">
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {t.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{t.mode}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 bg-muted/80 hover:bg-muted text-foreground font-bold rounded-xl transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}
