// Accessibility utilities
// This file contains utilities to enhance accessibility throughout the application

/**
 * Generate a unique ID for accessibility attributes
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set focus on an element with accessibility considerations
 * @param element Element to focus
 */
export function focusElement(element: HTMLElement): void {
  // Ensure the element is focusable
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }
  
  // Focus the element
  element.focus();
  
  // Scroll to the element if needed
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Announce a message to screen readers
 * @param message Message to announce
 * @param priority Priority of the announcement ('polite' or 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // Create or reuse the announcement element
  let announceElement = document.getElementById('screen-reader-announce');
  
  if (!announceElement) {
    announceElement = document.createElement('div');
    announceElement.id = 'screen-reader-announce';
    announceElement.setAttribute('aria-live', priority);
    announceElement.setAttribute('aria-atomic', 'true');
    announceElement.className = 'sr-only';
    document.body.appendChild(announceElement);
  }
  
  // Update the content to trigger the announcement
  announceElement.textContent = message;
}

/**
 * Trap focus within a container for modals, dialogs, etc.
 * @param container Container element to trap focus within
 * @param initialFocus Element to initially focus (optional)
 */
export function trapFocus(
  container: HTMLElement,
  initialFocus?: HTMLElement
): void {
  // Get all focusable elements within the container
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Focus the initial element or the first focusable element
  if (initialFocus) {
    focusElement(initialFocus);
  } else {
    focusElement(firstElement);
  }
  
  // Handle tab key presses
  const handleTabKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;
    
    // Shift + Tab
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } 
    // Tab
    else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  // Add event listener
  container.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return (): void => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Handle keyboard navigation for custom components
 * @param e Keyboard event
 * @param callbacks Object containing callback functions for different keys
 */
export function handleKeyboardNavigation(
  e: KeyboardEvent,
  callbacks: {
    enter?: () => void;
    space?: () => void;
    escape?: () => void;
    arrowUp?: () => void;
    arrowDown?: () => void;
    arrowLeft?: () => void;
    arrowRight?: () => void;
    home?: () => void;
    end?: () => void;
    [key: string]: (() => void) | undefined;
  }
): void {
  const key = e.key.toLowerCase();
  
  switch (key) {
    case 'enter':
      if (callbacks.enter) {
        callbacks.enter();
        e.preventDefault();
      }
      break;
    case ' ':
      if (callbacks.space) {
        callbacks.space();
        e.preventDefault();
      }
      break;
    case 'escape':
      if (callbacks.escape) {
        callbacks.escape();
        e.preventDefault();
      }
      break;
    case 'arrowup':
      if (callbacks.arrowUp) {
        callbacks.arrowUp();
        e.preventDefault();
      }
      break;
    case 'arrowdown':
      if (callbacks.arrowDown) {
        callbacks.arrowDown();
        e.preventDefault();
      }
      break;
    case 'arrowleft':
      if (callbacks.arrowLeft) {
        callbacks.arrowLeft();
        e.preventDefault();
      }
      break;
    case 'arrowright':
      if (callbacks.arrowRight) {
        callbacks.arrowRight();
        e.preventDefault();
      }
      break;
    case 'home':
      if (callbacks.home) {
        callbacks.home();
        e.preventDefault();
      }
      break;
    case 'end':
      if (callbacks.end) {
        callbacks.end();
        e.preventDefault();
      }
      break;
    default:
      // Handle custom key callbacks
      if (callbacks[key]) {
        callbacks[key]?.();
        e.preventDefault();
      }
  }
}

/**
 * Set ARIA attributes for a loading state
 * @param element Element to set loading state on
 * @param loading Whether the element is loading
 */
export function setLoadingState(element: HTMLElement, loading: boolean): void {
  if (loading) {
    element.setAttribute('aria-busy', 'true');
    element.setAttribute('aria-disabled', 'true');
  } else {
    element.removeAttribute('aria-busy');
    element.removeAttribute('aria-disabled');
  }
}

/**
 * Set ARIA attributes for expanded/collapsed state
 * @param element Element to set expanded state on
 * @param expanded Whether the element is expanded
 */
export function setExpandedState(element: HTMLElement, expanded: boolean): void {
  element.setAttribute('aria-expanded', expanded.toString());
}

/**
 * Set ARIA attributes for selected state
 * @param element Element to set selected state on
 * @param selected Whether the element is selected
 */
export function setSelectedState(element: HTMLElement, selected: boolean): void {
  element.setAttribute('aria-selected', selected.toString());
}

/**
 * Set ARIA attributes for checked state
 * @param element Element to set checked state on
 * @param checked Whether the element is checked
 */
export function setCheckedState(element: HTMLElement, checked: boolean): void {
  element.setAttribute('aria-checked', checked.toString());
}

/**
 * Ensure sufficient color contrast for accessibility
 * @param backgroundColor Background color in hex format
 * @param textColor Text color in hex format
 * @returns True if contrast ratio meets WCAG AA standards (4.5:1)
 */
export function checkColorContrast(backgroundColor: string, textColor: string): boolean {
  // Convert hex to RGB
  const bgRgb = hexToRgb(backgroundColor);
  const textRgb = hexToRgb(textColor);
  
  if (!bgRgb || !textRgb) return false;
  
  // Calculate luminance
  const bgLuminance = calculateLuminance(bgRgb);
  const textLuminance = calculateLuminance(textRgb);
  
  // Calculate contrast ratio
  const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                        (Math.min(bgLuminance, textLuminance) + 0.05);
  
  // WCAG AA standard is 4.5:1
  return contrastRatio >= 4.5;
}

/**
 * Convert hex color to RGB
 * @param hex Hex color string (#RRGGBB)
 * @returns RGB object or null if invalid
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of an RGB color
 * @param rgb RGB color object
 * @returns Relative luminance value
 */
function calculateLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Skip to main content for keyboard users
 * @param mainContentId ID of the main content element
 */
export function createSkipLink(mainContentId: string): void {
  // Check if skip link already exists
  if (document.getElementById('skip-link')) return;
  
  // Create skip link
  const skipLink = document.createElement('a');
  skipLink.id = 'skip-link';
  skipLink.href = `#${mainContentId}`;
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-blue-500';
  
  // Add to beginning of body
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Initialize accessibility features
 */
export function initializeAccessibility(): void {
  // Create skip link
  createSkipLink('main-content');
  
  // Announce page loaded
  announceToScreenReader('Page loaded');
  
  console.log('Accessibility features initialized');
}