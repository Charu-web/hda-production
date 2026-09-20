// siteAudit.js – lightweight static site audit
// Run with: node js/siteAudit.js

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const websiteRoot = path.resolve(__dirname, '..'); // project root (website folder)

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(content);
  const results = { file: filePath, missingLinks: [], missingImages: [], missingAlts: [] };

  // Check internal <a href>
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return; // skip external or fragment links
    const targetPath = path.resolve(path.dirname(filePath), href);
    if (!fs.existsSync(targetPath)) {
      results.missingLinks.push({ href });
    }
  });

  // Check images
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (!src) return;
    if (!src.startsWith('http')) {
      const imgPath = path.resolve(path.dirname(filePath), src);
      if (!fs.existsSync(imgPath)) {
        results.missingImages.push({ src });
      }
    }
    const alt = $(el).attr('alt');
    if (!alt || alt.trim() === '') {
      results.missingAlts.push({ src });
    }
  });

  return results;
}

function main() {
  console.log('🔎 Running site audit...');
  const htmlFiles = getHtmlFiles(websiteRoot);
  const allResults = htmlFiles.map(auditFile);
  let hasIssues = false;
  allResults.forEach(res => {
    if (res.missingLinks.length || res.missingImages.length || res.missingAlts.length) {
      hasIssues = true;
      console.log('\n🚩 Issues in', path.relative(websiteRoot, res.file));
      if (res.missingLinks.length) {
        console.log('  🔗 Missing internal links:');
        res.missingLinks.forEach(l => console.log('    -', l.href));
      }
      if (res.missingImages.length) {
        console.log('  🖼️ Missing image files:');
        res.missingImages.forEach(i => console.log('    -', i.src));
      }
      if (res.missingAlts.length) {
        console.log('    📝 Images without alt attribute:');
        res.missingAlts.forEach(i => console.log('    -', i.src));
      }
    }
  });
  if (!hasIssues) {
    console.log('\n✅ No missing links or images detected, all images have alt attributes.');
  }
}

main();
