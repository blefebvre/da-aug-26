/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsArticleParser from './parsers/cards-article.js';
import heroFeatureParser from './parsers/hero-feature.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'WKND homepage: hero carousel, featured article, article card grids, and a feature hero.',
  urls: [
    'https://wknd.site/us/en.html'
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.carousel.cmp-carousel--hero']
    },
    {
      name: 'columns-featured',
      instances: ['.teaser.cmp-teaser--featured'],
      section: 'grey'
    },
    {
      name: 'cards-article',
      instances: ['.image-list.list']
    },
    {
      name: 'hero-feature',
      instances: ['.teaser.cmp-teaser--hero.cmp-teaser--imagebottom']
    }
  ],
  sections: [
    {
      id: 'section-1-hero-carousel',
      name: 'Hero carousel',
      selector: '.carousel.cmp-carousel--hero',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-2-featured-article',
      name: 'Featured Article',
      selector: '.teaser.cmp-teaser--featured',
      style: 'grey',
      blocks: ['columns-featured'],
      defaultContent: []
    },
    {
      id: 'section-3-recent-articles',
      name: 'Recent Articles',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(1) > div.cmp-container > div.aem-Grid > div.image-list.list',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['div.title.cmp-title--underline', 'div.separator']
    },
    {
      id: 'section-4-next-adventures',
      name: 'Next Adventures',
      selector: '.teaser.cmp-teaser--hero.cmp-teaser--imagebottom',
      style: null,
      blocks: ['hero-feature'],
      defaultContent: ['div.title']
    },
    {
      id: 'section-5-where-to-go',
      name: 'Where do you want to go?',
      selector: 'main.cmp-layout-container--fixed:nth-of-type(2) > div.cmp-container > div.aem-Grid > div.image-list.list',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['div.title', 'div.separator']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-featured': columnsFeaturedParser,
  'cards-article': cardsArticleParser,
  'hero-feature': heroFeatureParser,
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
