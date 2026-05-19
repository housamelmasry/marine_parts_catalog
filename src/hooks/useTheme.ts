import { useUIStore } from '../app/store';
import { colors, getTypographyStyles, spacing } from '../app/theme';

export function useTheme() {
  const { theme, toggleTheme } = useUIStore();
  
  const currentColors = colors[theme];
  const typographyStyles = getTypographyStyles(currentColors.text);

  return {
    theme,
    toggleTheme,
    colors: currentColors,
    typography: typographyStyles,
    spacing,
    isDark: theme === 'dark',
  };
}
export type ThemeHook = ReturnType<typeof useTheme>;
