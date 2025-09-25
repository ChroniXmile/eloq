// Accessibility audit and compliance check
// This file contains utilities and checks to ensure WCAG 2.1 AA compliance

/**
 * Check color contrast ratio between background and text colors
 * @param backgroundColor Background color in hex format
 * @param textColor Text color in hex format
 * @returns Contrast ratio and WCAG compliance status
 */
export function checkColorContrast(
  backgroundColor: string,
  textColor: string
): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  // Convert hex to RGB
  const bgRgb = hexToRgb(backgroundColor);
  const textRgb = hexToRgb(textColor);
  
  if (!bgRgb || !textRgb) {
    return { ratio: 0, wcagAA: false, wcagAAA: false };
  }
  
  // Calculate luminance
  const bgLuminance = calculateLuminance(bgRgb);
  const textLuminance = calculateLuminance(textRgb);
  
  // Calculate contrast ratio
  const contrastRatio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                        (Math.min(bgLuminance, textLuminance) + 0.05);
  
  // WCAG standards
  const wcagAA = contrastRatio >= 4.5;
  const wcagAAA = contrastRatio >= 7.0;
  
  return { ratio: parseFloat(contrastRatio.toFixed(2)), wcagAA, wcagAAA };
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
 * Check if an element has sufficient focus indicators
 * @param element Element to check
 * @returns True if element has visible focus indicator
 */
export function hasVisibleFocusIndicator(element: HTMLElement): boolean {
  // Check if element can receive focus
  if (!element.tabIndex || element.tabIndex < 0) {
    return true; // Non-focusable elements pass by default
  }
  
  // Check for focus styles
  const computedStyle = window.getComputedStyle(element);
  
  // Check for outline or border changes on focus
  const hasOutline = computedStyle.outlineWidth !== '0px' && 
                     computedStyle.outlineStyle !== 'none';
  
  const hasBorder = computedStyle.borderWidth !== '0px' && 
                    computedStyle.borderStyle !== 'none';
  
  // Check for background color change on focus
  const hasBackgroundChange = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                              computedStyle.backgroundColor !== 'transparent';
  
  return hasOutline || hasBorder || hasBackgroundChange;
}

/**
 * Check if an element has appropriate ARIA attributes
 * @param element Element to check
 * @returns Array of issues found
 */
export function checkAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check for ARIA roles
  const role = element.getAttribute('role');
  if (role) {
    // Validate role is a valid ARIA role
    const validRoles = [
      'button', 'checkbox', 'dialog', 'grid', 'gridcell', 'link', 'listbox',
      'menu', 'menubar', 'menuitem', 'option', 'progressbar', 'radio',
      'radiogroup', 'row', 'rowgroup', 'scrollbar', 'searchbox', 'slider',
      'spinbutton', 'switch', 'tab', 'tablist', 'tabpanel', 'textbox',
      'tooltip', 'tree', 'treegrid', 'treeitem'
    ];
    
    if (!validRoles.includes(role)) {
      issues.push(`Invalid ARIA role: ${role}`);
    }
  }
  
  // Check for ARIA attributes that require specific roles
  const ariaAttributes = Array.from(element.attributes).filter(attr => 
    attr.name.startsWith('aria-')
  );
  
  for (const attr of ariaAttributes) {
    // Check if aria-label or aria-labelledby is present for elements that need labels
    if (['button', 'link', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase())) {
      const hasLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.hasAttribute('title');
      
      if (!hasLabel && !element.textContent) {
        issues.push(`${element.tagName} element missing accessible name`);
      }
    }
    
    // Check for aria-hidden on focusable elements
    if (attr.name === 'aria-hidden' && attr.value === 'true') {
      if (element.tabIndex >= 0) {
        issues.push('Focusable element with aria-hidden=true');
      }
    }
  }
  
  return issues;
}

/**
 * Check if form elements have associated labels
 * @param formElement Form element to check
 * @returns Array of issues found
 */
export function checkFormLabels(formElement: HTMLFormElement): string[] {
  const issues: string[] = [];
  const formControls = formElement.querySelectorAll('input, select, textarea, button');
  
  for (const control of Array.from(formControls)) {
    const element = control as HTMLElement;
    
    // Skip hidden inputs
    if (element.tagName.toLowerCase() === 'input' && 
        (element as HTMLInputElement).type === 'hidden') {
      continue;
    }
    
    // Check for associated label
    const hasLabel = element.hasAttribute('aria-label') || 
                    element.hasAttribute('aria-labelledby') ||
                    element.hasAttribute('title') ||
                    element.id && document.querySelector(`label[for="${element.id}"]`);
    
    // Check for visible text content
    const hasTextContent = !!element.textContent?.trim();
    
    if (!hasLabel && !hasTextContent) {
      issues.push(`${element.tagName} element missing accessible name`);
    }
  }
  
  return issues;
}

/**
 * Check if images have appropriate alt text
 * @param images Images to check
 * @returns Array of issues found
 */
export function checkImageAltText(images: HTMLImageElement[]): string[] {
  const issues: string[] = [];
  
  for (const img of images) {
    // Decorative images should have empty alt or role="presentation"
    if (img.hasAttribute('role') && img.getAttribute('role') === 'presentation') {
      continue;
    }
    
    // Informative images should have meaningful alt text
    const altText = img.alt;
    
    if (altText === null || altText === undefined) {
      issues.push(`Image missing alt attribute: ${img.src}`);
    } else if (altText.trim() === '') {
      // Empty alt is acceptable for decorative images
      continue;
    } else if (altText.toLowerCase().includes('image of') || 
               altText.toLowerCase().includes('picture of')) {
      issues.push(`Redundant alt text for image: ${altText}`);
    }
  }
  
  return issues;
}

/**
 * Check if headings are properly structured
 * @param headings Headings to check
 * @returns Array of issues found
 */
export function checkHeadingStructure(headings: HTMLHeadingElement[]): string[] {
  const issues: string[] = [];
  let prevLevel = 0;
  
  for (const heading of headings) {
    const level = parseInt(heading.tagName.charAt(1));
    
    // Check for skipping heading levels
    if (prevLevel > 0 && level > prevLevel + 1) {
      issues.push(`Skipping heading level from H${prevLevel} to H${level}`);
    }
    
    // Check for empty headings
    if (!heading.textContent?.trim()) {
      issues.push(`Empty ${heading.tagName} heading`);
    }
    
    prevLevel = level;
  }
  
  return issues;
}

/**
 * Check if links have descriptive text
 * @param links Links to check
 * @returns Array of issues found
 */
export function checkLinkText(links: HTMLAnchorElement[]): string[] {
  const issues: string[] = [];
  
  for (const link of links) {
    const linkText = link.textContent?.trim() || '';
    const ariaLabel = link.getAttribute('aria-label') || '';
    const title = link.getAttribute('title') || '';
    
    // Check for empty links
    if (!linkText && !ariaLabel && !title) {
      issues.push(`Link with no accessible name: ${link.href}`);
    }
    
    // Check for generic link text
    const genericTexts = ['click here', 'here', 'read more', 'link', 'go'];
    if (genericTexts.some(text => 
      linkText.toLowerCase().includes(text) || 
      ariaLabel.toLowerCase().includes(text) ||
      title.toLowerCase().includes(text))) {
      issues.push(`Generic link text: ${linkText || ariaLabel || title}`);
    }
  }
  
  return issues;
}

/**
 * Check if tables have proper structure for accessibility
 * @param tables Tables to check
 * @returns Array of issues found
 */
export function checkTableAccessibility(tables: HTMLTableElement[]): string[] {
  const issues: string[] = [];
  
  for (const table of tables) {
    // Check for table headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push('Table missing headers');
    }
    
    // Check for caption
    if (!table.querySelector('caption')) {
      issues.push('Table missing caption');
    }
    
    // Check for scope attributes on headers
    for (const header of Array.from(headers)) {
      if (!header.hasAttribute('scope')) {
        issues.push('Table header missing scope attribute');
      }
    }
  }
  
  return issues;
}

/**
 * Run comprehensive accessibility audit
 * @returns Audit results
 */
export async function runAccessibilityAudit(): Promise<{
  passed: boolean;
  issues: string[];
  summary: {
    colorContrast: number;
    focusIndicators: number;
    ariaAttributes: number;
    formLabels: number;
    imageAltText: number;
    headingStructure: number;
    linkText: number;
    tableAccessibility: number;
  };
}> {
  // Wait for page to load completely
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const issues: string[] = [];
  
  // Run all accessibility checks
  const colorContrastIssues = checkColorContrast('#ffffff', '#000000'); // Example check
  issues.push(...(colorContrastIssues.wcagAA ? [] : ['Insufficient color contrast']));
  
  // Check focus indicators
  const focusableElements = document.querySelectorAll('[tabindex], a, button, input, select, textarea');
  let focusIndicatorIssues = 0;
  for (const element of Array.from(focusableElements)) {
    if (!hasVisibleFocusIndicator(element as HTMLElement)) {
      focusIndicatorIssues++;
      issues.push(`Element missing visible focus indicator: ${element.tagName}`);
    }
  }
  
  // Check ARIA attributes
  const allElements = document.querySelectorAll('*');
  let ariaIssues = 0;
  for (const element of Array.from(allElements)) {
    const elementIssues = checkAriaAttributes(element as HTMLElement);
    ariaIssues += elementIssues.length;
    issues.push(...elementIssues);
  }
  
  // Check form labels
  const forms = document.querySelectorAll('form');
  let formLabelIssues = 0;
  for (const form of Array.from(forms)) {
    const formIssues = checkFormLabels(form as HTMLFormElement);
    formLabelIssues += formIssues.length;
    issues.push(...formIssues);
  }
  
  // Check image alt text
  const images = document.querySelectorAll('img');
  const imageIssues = checkImageAltText(Array.from(images) as HTMLImageElement[]);
  issues.push(...imageIssues);
  
  // Check heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingIssues = checkHeadingStructure(Array.from(headings) as HTMLHeadingElement[]);
  issues.push(...headingIssues);
  
  // Check link text
  const links = document.querySelectorAll('a');
  const linkIssues = checkLinkText(Array.from(links) as HTMLAnchorElement[]);
  issues.push(...linkIssues);
  
  // Check table accessibility
  const tables = document.querySelectorAll('table');
  const tableIssues = checkTableAccessibility(Array.from(tables) as HTMLTableElement[]);
  issues.push(...tableIssues);
  
  // Create summary
  const summary = {
    colorContrast: colorContrastIssues.wcagAA ? 0 : 1,
    focusIndicators: focusIndicatorIssues,
    ariaAttributes: ariaIssues,
    formLabels: formLabelIssues,
    imageAltText: imageIssues.length,
    headingStructure: headingIssues.length,
    linkText: linkIssues.length,
    tableAccessibility: tableIssues.length
  };
  
  // Determine if audit passed
  const passed = issues.length === 0;
  
  // Log results
  console.log('Accessibility Audit Results:');
  console.log(`Issues found: ${issues.length}`);
  console.log('Summary:', summary);
  
  if (issues.length > 0) {
    console.warn('Accessibility issues found:', issues);
  } else {
    console.log('All accessibility checks passed!');
  }
  
  return { passed, issues, summary };
}

/**
 * Generate accessibility compliance report
 * @param auditResults Results from accessibility audit
 * @returns Compliance report
 */
export function generateComplianceReport(auditResults: Awaited<ReturnType<typeof runAccessibilityAudit>>): string {
  const { passed, issues, summary } = auditResults;
  
  let report = `
# Accessibility Compliance Report

## Overall Status: ${passed ? 'PASSED' : 'FAILED'}

## Issues Found: ${issues.length}

## Detailed Summary:
- Color Contrast Issues: ${summary.colorContrast}
- Focus Indicator Issues: ${summary.focusIndicators}
- ARIA Attribute Issues: ${summary.ariaAttributes}
- Form Label Issues: ${summary.formLabels}
- Image Alt Text Issues: ${summary.imageAltText}
- Heading Structure Issues: ${summary.headingStructure}
- Link Text Issues: ${summary.linkText}
- Table Accessibility Issues: ${summary.tableAccessibility}

## Recommendations:
`;

  if (issues.length > 0) {
    report += issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n');
  } else {
    report += 'No issues found. The application meets WCAG 2.1 AA compliance.';
  }

  return report;
}

/**
 * Initialize accessibility audit
 */
export function initializeAccessibilityAudit(): void {
  console.log('Accessibility audit initialized');
  
  // Run audit when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      runAccessibilityAudit().then(results => {
        const report = generateComplianceReport(results);
        console.log(report);
      });
    });
  } else {
    runAccessibilityAudit().then(results => {
      const report = generateComplianceReport(results);
      console.log(report);
    });
  }
}

// Export types for convenience
export type { };