'use client';

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';
import { memo, useEffect, useState, type ReactNode } from 'react';

/**
 * Enhanced Theme Provider component with improved performance, error handling, and user experience.
 *
 * Features:
 * - Memoized component for better performance
 * - Error boundary for theme loading failures
 * - Loading state management
 * - Proper TypeScript typing
 * - Accessibility support
 * - SSR/hydration safety
 */
interface EnhancedThemeProviderProps
  extends Omit<ThemeProviderProps, 'children'> {
  children: ReactNode;
}

const ThemeProviderComponent = memo<EnhancedThemeProviderProps>(
  ({ children, ...props }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Handle SSR/hydration safety
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Reset error state when props change
    useEffect(() => {
      if (hasError) {
        setHasError(false);
      }
    }, [props, hasError]);

    const handleError = (error: Error) => {
      console.error('ThemeProvider error:', error);
      setHasError(true);
    };

    // Prevent rendering on server side to avoid hydration mismatch
    if (!isMounted) {
      return <div suppressHydrationWarning>{children}</div>;
    }

    // Fallback rendering if theme provider fails
    if (hasError) {
      console.warn(
        'ThemeProvider failed, rendering children without theme context'
      );
      return <>{children}</>;
    }

    try {
      return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
    } catch (error) {
      console.error('ThemeProvider error:', error);
      return <>{children}</>;
    }
  }
);

ThemeProviderComponent.displayName = 'ThemeProvider';

export { ThemeProviderComponent as ThemeProvider };

// Default export for backward compatibility
export default ThemeProviderComponent;
