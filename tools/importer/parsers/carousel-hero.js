/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-08-26
 *
 * Carousel block: 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one slide: [image cell, text cell].
 * Text cell holds title (heading), description, and CTA link.
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.cmp-carousel__item');

  const cells = [];

  slides.forEach((slide) => {
    // Cell 1: slide image (mandatory)
    const img = slide.querySelector('.cmp-teaser__image img, img');

    // Cell 2: text content
    const title = slide.querySelector('.cmp-teaser__title');
    const description = slide.querySelector('.cmp-teaser__description');
    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    const textCell = [];

    if (title) {
      const heading = document.createElement('h2');
      heading.textContent = title.textContent.trim();
      textCell.push(heading);
    }

    if (description) {
      // Description may wrap a <p> or hold plain text.
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

    // Emit a slide row if it has at least an image or text
    if (img || textCell.length) {
      cells.push([img || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
