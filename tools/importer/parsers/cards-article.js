/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd.site/us/en.html (also reused for /us/en/adventures.html)
 * Generated: 2026-08-26
 *
 * Reused as-is for the adventures template: adventures cards use the same
 * .cmp-image-list__item structure (image + title link + description).
 *
 * Cards block: 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one card: [image cell, text cell].
 * Text cell holds a title (heading with link) and a description.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-image-list__item');

  const cells = [];

  items.forEach((item) => {
    // Cell 1: image (mandatory)
    const img = item.querySelector('.cmp-image-list__item-image img, img');

    // Cell 2: text content (title as heading + description)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');

    const textCell = [];

    if (titleLink) {
      // Preserve the link and its target; wrap the title text as a heading.
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href') || '';
      link.textContent = (titleText || titleLink).textContent.trim();
      heading.append(link);
      textCell.push(heading);
    } else if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText.textContent.trim();
      textCell.push(heading);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }

    // Only emit a card row if it has content
    if (img || textCell.length) {
      cells.push([img || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
