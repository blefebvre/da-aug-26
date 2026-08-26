/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import tabsAdventuresParser from './parsers/tabs-adventures.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'adventures',
  description: 'WKND adventures landing: page title, feature hero intro, and a tabbed grid of adventure cards.',
  urls: [
    'https://wknd.site/us/en/adventures.html'
  ],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['.teaser.cmp-teaser--hero']
    },
    {
      name: 'tabs-adventures',
      instances: ['.tabs.panelcontainer']
    },
    {
      name: 'cards-article',
      instances: ['.image-list.list']
    }
  ],
  sections: [
    {
      id: 'section-1-page-title',
      name: 'Page Title',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(1)',
      style: null,
      blocks: [],
      defaultContent: ['h1.cmp-title__text']
    },
    {
      id: 'section-2-hero-teaser',
      name: 'Experience the world with us',
      selector: '.teaser.cmp-teaser--hero',
      style: null,
      blocks: ['hero-intro'],
      defaultContent: []
    },
    {
      id: 'section-3-current-adventures',
      name: 'Current Adventures',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(2)',
      style: null,
      blocks: ['tabs-adventures'],
      defaultContent: ['div.title.cmp-title--underline', 'div.separator']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'tabs-adventures': tabsAdventuresParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
