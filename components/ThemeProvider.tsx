import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 'system' follows the OS's prefers-color-scheme and stays live-updated if it changes
// while the tab is open. 'dark' | 'light' | 'angelic' are explicit user choices.
type Theme = 'dark' | 'light' | 'angelic' | 'system';
// The theme actually painted on <html> — 'system' always resolves to 'dark' or 'light'
// before being applied, since there's no .system CSS (there's nothing OS-specific to
// style against — it's just a stand-in for whichever of dark/light the OS prefers).
type ResolvedTheme = 'dark' | 'light' | 'angelic';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_CLASSES: ResolvedTheme[] = ['dark', 'light', 'angelic'];

function getSystemPreference(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemPreference() : theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  const applyResolvedClass = useCallback((next: ResolvedTheme) => {
    // Only remove/replace the classes we actually manage — this used to be a blanket
    // `document.documentElement.className = theme`, which would silently wipe out any
    // other class ever added to <html> by anything else (analytics snippets, browser
    // extensions, etc). Scoping the remove/add to THEME_CLASSES avoids that.
    document.documentElement.classList.remove(...THEME_CLASSES);
    document.documentElement.classList.add(next);
    setResolvedTheme(next);
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initial: Theme =
      savedTheme && ['dark', 'light', 'angelic', 'system'].includes(savedTheme)
        ? savedTheme
        : 'dark';
    setThemeState(initial);
    applyResolvedClass(resolveTheme(initial));
  }, [applyResolvedClass]);

  // Keep the resolved theme live-updated if the OS preference changes while theme === 'system'
  // (e.g. the user's OS switches to dark mode at sunset while this tab is still open).
  useEffect(() => {
    if (!mounted || theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyResolvedClass(getSystemPreference());
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [mounted, theme, applyResolvedClass]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyResolvedClass(resolveTheme(newTheme));
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'angelic', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const value = mounted
    ? { theme, resolvedTheme, setTheme, toggleTheme }
    : {
        theme: 'dark' as Theme,
        resolvedTheme: 'dark' as ResolvedTheme,
        setTheme: () => {},
        toggleTheme: () => {},
      };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Only hit if useTheme() is called outside a ThemeProvider entirely — not the SSR
    // path (ThemeProvider itself already returns a safe 'dark' default before mount).
    return {
      theme: 'dark' as Theme,
      resolvedTheme: 'dark' as ResolvedTheme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
