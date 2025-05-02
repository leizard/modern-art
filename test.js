// Simple test runner for CI/CD (run with: node test.js)
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Load HTML and JS
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;
global.window = window;
global.document = window.document;

// Inject script.js
const scriptEl = window.document.createElement('script');
scriptEl.textContent = script;
window.document.body.appendChild(scriptEl);

function clickGenerate() {
  window.document.getElementById('generate-btn').click();
}

function testShapeAndName() {
  clickGenerate();
  const shape = window.document.querySelector('.shape');
  const name = window.document.getElementById('art-name').textContent;
  if (!shape) throw new Error('Shape not generated');
  if (!name || name.length < 3) throw new Error('Name not generated');
}

function testMultipleGenerations() {
  let lastName = '';
  for (let i = 0; i < 5; i++) {
    clickGenerate();
    const shape = window.document.querySelector('.shape');
    const name = window.document.getElementById('art-name').textContent;
    if (!shape) throw new Error('Shape not generated on click ' + i);
    if (!name || name.length < 3) throw new Error('Name not generated on click ' + i);
    if (name === lastName && i > 0) throw new Error('Name did not change on click ' + i);
    lastName = name;
  }
}

function testNoShapeBeforeClick() {
  const shape = window.document.querySelector('.shape');
  const name = window.document.getElementById('art-name').textContent;
  if (shape) throw new Error('Shape should not be present before click');
  if (name) throw new Error('Name should not be present before click');
}

try {
  testNoShapeBeforeClick();
  testShapeAndName();
  testMultipleGenerations();
  console.log('All tests passed!');
  process.exit(0);
} catch (e) {
  console.error('Test failed:', e.message);
  process.exit(1);
} 