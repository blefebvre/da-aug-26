/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-adventures.js
  var import_adventures_exports = {};
  __export(import_adventures_exports, {
    default: () => import_adventures_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document: document2 }) {
    const title = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');
    const description = element.querySelector('.cmp-teaser__description, [class*="description"]');
    const img = element.querySelector(".cmp-teaser__image img, img");
    const contentCell = [];
    if (title) {
      const heading = document2.createElement("h2");
      heading.textContent = title.textContent.trim();
      contentCell.push(heading);
    }
    if (description) {
      const paragraphs = description.querySelectorAll("p");
      if (paragraphs.length) {
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text) {
            const np = document2.createElement("p");
            np.textContent = text;
            contentCell.push(np);
          }
        });
      } else {
        const text = description.textContent.trim();
        if (text) {
          const p = document2.createElement("p");
          p.textContent = text;
          contentCell.push(p);
        }
      }
    }
    if (!contentCell.length && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (img) cells.push([img]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-adventures.js
  function buildCardRows(panel, document2) {
    const items = panel.querySelectorAll(".cmp-image-list__item");
    const cardCells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      const description = item.querySelector(".cmp-image-list__item-description");
      const textCell = [];
      if (titleLink) {
        const heading = document2.createElement("h3");
        const link = document2.createElement("a");
        link.href = titleLink.getAttribute("href") || "";
        link.textContent = (titleText || titleLink).textContent.trim();
        heading.append(link);
        textCell.push(heading);
      } else if (titleText) {
        const heading = document2.createElement("h3");
        heading.textContent = titleText.textContent.trim();
        textCell.push(heading);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      if (img || textCell.length) {
        cardCells.push([img || "", textCell.length ? textCell : ""]);
      }
    });
    return cardCells;
  }
  function parse2(element, { document: document2 }) {
    const tabLabels = element.querySelectorAll(".cmp-tabs__tab");
    const tabPanels = element.querySelectorAll(".cmp-tabs__tabpanel");
    const cells = [];
    tabLabels.forEach((label, index) => {
      const panel = tabPanels[index];
      if (!panel) return;
      const labelText = label.textContent.trim();
      const cardRows = buildCardRows(panel, document2);
      let contentCell;
      if (cardRows.length) {
        contentCell = WebImporter.Blocks.createBlock(document2, {
          name: "cards-article",
          cells: cardRows
        });
      } else {
        contentCell = panel;
      }
      cells.push([labelText, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-adventures", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(".cmp-image-list__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      const description = item.querySelector(".cmp-image-list__item-description");
      const textCell = [];
      if (titleLink) {
        const heading = document2.createElement("h3");
        const link = document2.createElement("a");
        link.href = titleLink.getAttribute("href") || "";
        link.textContent = (titleText || titleLink).textContent.trim();
        heading.append(link);
        textCell.push(heading);
      } else if (titleText) {
        const heading = document2.createElement("h3");
        heading.textContent = titleText.textContent.trim();
        textCell.push(heading);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      if (img || textCell.length) {
        cells.push([img || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#destination_publishing_iframe_wkndsite_0",
        "#toggleNav",
        "#mobileNav"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer",
        "iframe",
        "meta",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-cmp-")) el.removeAttribute(attr.name);
        });
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-adventures.js
  var PAGE_TEMPLATE = {
    name: "adventures",
    description: "WKND adventures landing: page title, feature hero intro, and a tabbed grid of adventure cards.",
    urls: [
      "https://wknd.site/us/en/adventures.html"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: [".teaser.cmp-teaser--hero"]
      },
      {
        name: "tabs-adventures",
        instances: [".tabs.panelcontainer"]
      },
      {
        name: "cards-article",
        instances: [".image-list.list"]
      }
    ],
    sections: [
      {
        id: "section-1-page-title",
        name: "Page Title",
        selector: "main.cmp-layout-container--fixed:nth-of-type(1)",
        style: null,
        blocks: [],
        defaultContent: ["h1.cmp-title__text"]
      },
      {
        id: "section-2-hero-teaser",
        name: "Experience the world with us",
        selector: ".teaser.cmp-teaser--hero",
        style: null,
        blocks: ["hero-intro"],
        defaultContent: []
      },
      {
        id: "section-3-current-adventures",
        name: "Current Adventures",
        selector: "main.cmp-layout-container--fixed:nth-of-type(2)",
        style: null,
        blocks: ["tabs-adventures"],
        defaultContent: ["div.title.cmp-title--underline", "div.separator"]
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "tabs-adventures": parse2,
    "cards-article": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventures_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_adventures_exports);
})();
