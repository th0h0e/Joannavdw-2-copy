// Browser detection plugin
// Detects Safari and scroll-state support, sets CSS custom properties and attributes
export default defineNuxtPlugin(() => {
  // Get user agent string in lowercase for easier matching
  const ua = navigator.userAgent.toLowerCase();
  
  // Check if browser is Safari (but not Chrome or Chromium which also include 'safari' in UA)
  const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
  
  // Check for WebKit-specific features
  const isWebKit = 'webkitAppearance' in document.documentElement.style;
  const hasSafariFeatures = window.safari !== undefined;
  
  // Combine checks to determine if this is truly Safari
  const isSafariBrowser = isSafari || (isWebKit && hasSafariFeatures);
  
  // Check if browser supports CSS scroll-state container queries
  const supportsScrollState = CSS && CSS.supports && CSS.supports('container-type', 'scroll-state');
  
  // Set CSS custom properties for conditional styling
  const root = document.documentElement;
  root.style.setProperty('--is-safari', isSafariBrowser ? '1' : '0');
  root.style.setProperty('--supports-scroll-state', supportsScrollState ? '1' : '0');
  root.style.setProperty('--use-css-scroll-detection', !isSafariBrowser && supportsScrollState ? '1' : '0');
  
  // Set data attributes for JavaScript access
  root.setAttribute('data-browser-safari', isSafariBrowser.toString());
  root.setAttribute('data-supports-scroll-state', supportsScrollState.toString());
});
