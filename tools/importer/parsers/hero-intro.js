/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://wknd.site/us/en/adventures.html
 * Generated: 2026-08-26
 *
 * Hero block: 1 column, 3 rows. First row = block name.
 * Row 2 (single cell): feature/background image (optional).
 * Row 3 (single cell): title (heading) + description paragraph.
 * NOTE: This variant has NO call-to-action button (unlike hero-feature).
 */
export default function parse(element, { document }) {
  const title = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');
  const description = element.querySelector('.cmp-teaser__description, [class*="description"]');
  const img = element.querySelector('.cmp-teaser__image img, img');

  const contentCell = [];

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title.textContent.trim();
    contentCell.push(heading);
  }

  if (description) {
    // Preserve the paragraph(s) inside the description container.
    const paragraphs = description.querySelectorAll('p');
    if (paragraphs.length) {
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text) {
          const np = document.createElement('p');
          np.textContent = text;
          contentCell.push(np);
        }
      });
    } else {
      const text = description.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        contentCell.push(p);
      }
    }
  }

  // Empty-block guard
  if (!contentCell.length && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: feature image (only if present) — single-column cell
  if (img) cells.push([img]);
  // Row 3: text content — single-column cell holding all elements
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
