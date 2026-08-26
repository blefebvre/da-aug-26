/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-08-26
 *
 * Columns block: first row = block name. Second row defines the layout.
 * This featured teaser groups into 2 columns:
 *   Column 1: text content (pretitle, title, description, CTA)
 *   Column 2: image
 */
export default function parse(element, { document }) {
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const title = element.querySelector('.cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');
  const img = element.querySelector('.cmp-teaser__image img, img');

  const textCell = [];

  if (pretitle) {
    const p = document.createElement('p');
    p.textContent = pretitle.textContent.trim();
    textCell.push(p);
  }

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title.textContent.trim();
    textCell.push(heading);
  }

  if (description) {
    const text = description.textContent.trim();
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      textCell.push(p);
    }
  }

  if (cta) {
    const link = document.createElement('a');
    link.href = cta.getAttribute('href') || '';
    link.textContent = cta.textContent.trim();
    textCell.push(link);
  }

  // Empty-block guard
  if (!textCell.length && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [textCell.length ? textCell : '', img || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
