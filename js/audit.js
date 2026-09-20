// audit.js – simple client‑side audit utility (dev only)
// This script scans the current page for common issues:
//   * <a> tags with missing or empty href
//   * <img> tags with missing src or alt attributes
//   * Buttons that are disabled unintentionally (no form context)
// The results are printed to the browser console.

(function () {
  const report = [];

  // Check anchors
  document.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.trim() === '' || href === '#') {
      report.push({ type: 'anchor', element: a, message: 'Missing or placeholder href' });
    }
  });

  // Check images
  document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    if (!src || src.trim() === '') {
      report.push({ type: 'image', element: img, message: 'Missing src attribute' });
    }
    if (!alt || alt.trim() === '') {
      report.push({ type: 'image', element: img, message: 'Missing alt attribute (accessibility)' });
    }
  });

  // Check buttons outside of forms that are disabled without a reason
  document.querySelectorAll('button').forEach((btn) => {
    if (btn.disabled && !btn.closest('form')) {
      report.push({ type: 'button', element: btn, message: 'Disabled button outside a form' });
    }
  });

  if (report.length === 0) {
    console.log('%cAudit: No issues detected on this page.', 'color: #00c853; font-weight: bold;');
  } else {
    console.warn(`%cAudit: Detected ${report.length} issue(s) on this page:`, 'color: #ff4d4f; font-weight: bold;');
    report.forEach((item, idx) => {
      console.warn(`${idx + 1}. [${item.type}] ${item.message}`, item.element);
    });
  }
})();
