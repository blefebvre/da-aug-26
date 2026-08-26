export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Buttonize the CTA link (source renders it as the brand yellow button).
  // The project's global decorateButtons only styles strong/em-wrapped links,
  // so buttonize the standalone action link here.
  const cta = block.querySelector(':scope > div:last-child a[href]');
  if (cta && !cta.classList.contains('button')) {
    const p = cta.closest('p');
    if (p && p.textContent.trim() === cta.textContent.trim() && !cta.querySelector('img')) {
      cta.className = 'button';
      p.classList.add('button-container');
    }
  }
}
