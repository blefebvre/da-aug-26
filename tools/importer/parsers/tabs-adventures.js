/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-adventures. Base: tabs.
 * Source: https://wknd.site/us/en/adventures.html
 * Generated: 2026-08-26
 *
 * Tabs block: 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one tab: [tab label cell, tab content cell].
 * Tab content is a nested cards grid (image-list) of adventure cards, so the
 * content cell holds a nested `cards-article` block built from the panel's
 * .cmp-image-list__item entries.
 */

/**
 * Build the array of card rows for one tab panel from its image-list items.
 * Mirrors the cards-article extraction so nested cards render consistently.
 */
function buildCardRows(panel, document) {
  const items = panel.querySelectorAll('.cmp-image-list__item');
  const cardCells = [];

  items.forEach((item) => {
    const img = item.querySelector('.cmp-image-list__item-image img, img');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');

    const textCell = [];

    if (titleLink) {
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

    if (img || textCell.length) {
      cardCells.push([img || '', textCell.length ? textCell : '']);
    }
  });

  return cardCells;
}

export default function parse(element, { document }) {
  const tabLabels = element.querySelectorAll('.cmp-tabs__tab');
  const tabPanels = element.querySelectorAll('.cmp-tabs__tabpanel');

  const cells = [];

  tabLabels.forEach((label, index) => {
    const panel = tabPanels[index];
    if (!panel) return;

    // Cell 1: tab label
    const labelText = label.textContent.trim();

    // Cell 2: tab content — nested cards grid built from image-list items
    const cardRows = buildCardRows(panel, document);

    let contentCell;
    if (cardRows.length) {
      contentCell = WebImporter.Blocks.createBlock(document, {
        name: 'cards-article',
        cells: cardRows,
      });
    } else {
      // Fallback: preserve raw panel content if no cards were found
      contentCell = panel;
    }

    cells.push([labelText, contentCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-adventures', cells });
  element.replaceWith(block);
}
