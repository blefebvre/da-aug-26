/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-feature. Base: hero.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-08-26
 *
 * Hero block: 1 column, 3 rows. First row = block name.
 * Row 2 (single cell): background image (optional).
 * Row 3 (single cell): title (heading), subheading, CTA link.
 */
export default function parse(element, { document }) {
  const title = element.querySelector('.cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');
  const img = element.querySelector('.cmp-teaser__image img, img');

  const contentCell = [];

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title.textContent.trim();
    contentCell.push(heading);
  }

  if (description) {
    const text = description.textContent.trim();
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      contentCell.push(p);
    }
  }

  if (cta) {
    const link = document.createElement('a');
    link.href = cta.getAttribute('href') || '';
    link.textContent = cta.textContent.trim();
    contentCell.push(link);
  }

  // Empty-block guard
  if (!contentCell.length && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: background image (only if present) — single-column cell
  if (img) cells.push([img]);
  // Row 3: text content — single-column cell holding all elements
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
