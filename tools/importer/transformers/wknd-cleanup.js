/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable site shell/chrome (header, footer, mobile nav,
 * tracking iframe) and leftover empty elements/attributes so the import
 * contains only page-level authorable content.
 *
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Tracking / ID-sync iframe (line 566) and mobile nav toggle/panel
    // (#toggleNav line 568, #mobileNav line 574) — remove before parsing so
    // they never interfere with block matching.
    // Verified in cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      '#destination_publishing_iframe_wkndsite_0',
      '#toggleNav',
      '#mobileNav',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome — header experience fragment (search,
    // main nav, language nav, sign-in buttons) and footer experience
    // fragment. Verified in cleaned.html (header line 5, footer line 471).
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      'iframe',
      'meta',
      'noscript',
    ]);

    // Strip data-layer / accessibility tracking attributes present in
    // captured DOM (data-cmp-data-layer, data-cmp-link-accessibility-*).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-cmp-')) el.removeAttribute(attr.name);
      });
    });
  }
}
