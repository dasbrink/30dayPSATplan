// ══════════════════════════════════════════════════════════════
// results_free_cell.js | freepracticesat.com
//
// Loads AFTER results_v2.js. Append-only, edits no other file.
//
// 3 Oct 2026. For a student who has not paid, the top of the results page
// now shows two cells instead of four:
//   1. Your score (unchanged, with everything that was in it)
//   2. Always free: what the student keeps getting without paying
// The three greyed-out cells (worked solutions, mistakes, math underneath)
// are hidden for free students. Paid students see the page as before.
// The blue $99 block below is not touched.
//
// The new cell deliberately does NOT use the .rb-cell class, because
// results_v2.js sends any click on a non-score .rb-cell to checkout.
// ══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const FREE_SOLUTIONS = 3;

  function isPaid() {
    return (typeof currentTier !== 'undefined') && currentTier >= 3;
  }

  function ensureStyles() {
    if (document.getElementById('fp-free-cell-style')) return;
    const s = document.createElement('style');
    s.id = 'fp-free-cell-style';
    s.textContent = `
      #results-top-bar.fp-free .rb-grid { grid-template-columns: 1fr 1fr;
        max-width: 860px; margin-left: auto; margin-right: auto; }
      #results-top-bar.fp-free .rb-grid > .rb-cell:not(.fp-keep) { display: none !important; }
      @media (max-width: 620px) {
        #results-top-bar.fp-free .rb-grid { grid-template-columns: 1fr; }
      }
      .fp-free-cell { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;
        border-top: 3px solid #1a7a4c; padding: 16px 18px; display: flex;
        flex-direction: column; gap: 6px; min-height: 200px; }
      .fp-free-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.07em; color: #1a7a4c; margin-bottom: 4px;
        font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
      .fp-free-list { list-style: none; margin: 0; padding: 0; }
      .fp-free-list li { position: relative; padding: 8px 0 8px 28px;
        border-bottom: 1px solid #f0f0ea; font-family: -apple-system, Segoe UI, Roboto, sans-serif;
        font-size: 0.98rem; line-height: 1.4; color: #1a1a1a; }
      .fp-free-list li:last-child { border-bottom: none; }
      .fp-free-list li::before { content: "\\2713"; position: absolute; left: 4px; top: 7px;
        color: #1a7a4c; font-weight: 700; }
      .fp-free-list small { display: block; color: #777; font-size: 0.82rem; margin-top: 2px; }
      .fp-free-btn { margin-top: auto; display: block; width: 100%; padding: 10px 12px;
        background: #fff; color: #1a7a4c; border: 2px solid #1a7a4c; border-radius: 6px;
        font-size: 0.85rem; font-weight: 700; cursor: pointer; text-align: center;
        font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
      .fp-free-btn:hover { background: #eef8f1; }
    `;
    document.head.appendChild(s);
  }

  function freeCellHTML() {
    return `
      <div class="fp-free-label">Always free</div>
      <ul class="fp-free-list">
        <li>Unlimited full-length practice tests</li>
        <li>Worked solutions<small>${FREE_SOLUTIONS} of your missed questions, on every test</small></li>
        <li>The mistakes you keep making<small>Opens after your second test</small></li>
        <li>The basic math underneath them<small>Opens after your second test</small></li>
      </ul>
      <button class="fp-free-btn" type="button" onclick="fpScrollToFree()">See your free work below</button>`;
  }

  window.fpScrollToFree = function () {
    const el = document.getElementById('v2-free');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function apply() {
    const bar = document.getElementById('results-top-bar');
    if (!bar) return;
    const grid = bar.querySelector('.rb-grid');
    if (!grid) return;

    if (isPaid()) {
      bar.classList.remove('fp-free');
      const old = grid.querySelector('.fp-free-cell');
      if (old) old.remove();
      return;
    }

    ensureStyles();
    bar.classList.add('fp-free');

    const score = grid.querySelector('.rb-cell');
    if (score) score.classList.add('fp-keep');

    let cell = grid.querySelector('.fp-free-cell');
    if (!cell) {
      cell = document.createElement('div');
      cell.className = 'fp-free-cell';
      cell.innerHTML = freeCellHTML();
      if (score && score.nextSibling) grid.insertBefore(cell, score.nextSibling);
      else grid.appendChild(cell);
    }

    // The base page rebuilds the cells while the diagnosis loads. Keep the
    // layout right if that happens after this ran.
    if (!grid.__fpObserved) {
      grid.__fpObserved = true;
      new MutationObserver(() => {
        if (isPaid()) return;
        const sc = grid.querySelector('.rb-cell');
        if (sc && !sc.classList.contains('fp-keep')) sc.classList.add('fp-keep');
        if (!grid.querySelector('.fp-free-cell')) apply();
      }).observe(grid, { childList: true });
    }
  }

  // Same pattern results_v2.js uses, so it works however script.js declared them.
  function after(r) { try { apply(); } catch (e) { console.warn('[free-cell]', e); } return r; }
  if (typeof showResults === 'function' && !showResults.__fpHooked) {
    const orig = showResults;
    showResults = async function () { return after(await orig.apply(this, arguments)); };
    showResults.__fpHooked = true;
  }
  if (typeof reopenResultsFromSnapshot === 'function' && !reopenResultsFromSnapshot.__fpHooked) {
    const orig = reopenResultsFromSnapshot;
    reopenResultsFromSnapshot = async function () { return after(await orig.apply(this, arguments)); };
    reopenResultsFromSnapshot.__fpHooked = true;
  }

  console.log('[freepracticesat] results_free_cell loaded');
})();
