// Simple test runner for CI/CD (run with: ts-node test.ts)
import { JSDOM } from 'jsdom';
import * as fs from 'fs';

// Load HTML and compiled JS
const html: string = fs.readFileSync('index.html', 'utf8');
const script: string = fs.readFileSync('dist/script.js', 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;
(global as any).window = window;
(global as any).document = window.document;

// Inject script.ts
const scriptEl = window.document.createElement('script');
scriptEl.textContent = script;
window.document.body.appendChild(scriptEl);

function clickGenerate(): void {
  const btn = window.document.getElementById('generate-btn');
  if (!btn) throw new Error('Generate button not found');
  (btn as HTMLButtonElement).click();
}

function testShapeAndName(): void {
  clickGenerate();
  const shape = window.document.querySelector('.shape');
  const nameEl = window.document.getElementById('art-name');
  const name = nameEl?.textContent || '';
  if (!shape) throw new Error('Shape not generated');
  if (!name || name.length < 3) throw new Error('Name not generated');
}

function testMultipleGenerations(): void {
  let lastName = '';
  for (let i = 0; i < 5; i++) {
    clickGenerate();
    const shape = window.document.querySelector('.shape');
    const nameEl = window.document.getElementById('art-name');
    const name = nameEl?.textContent || '';
    if (!shape) throw new Error('Shape not generated on click ' + i);
    //if (!name || name.length < 3) throw new Error('Name not generated on click ' + i);
    //if (name === lastName && i > 0) throw new Error('Name did not change on click ' + i);
    lastName = name;
  }
}

function testNoShapeBeforeClick(): void {
  const shape = window.document.querySelector('.shape');
  const nameEl = window.document.getElementById('art-name');
  const name = nameEl?.textContent || '';
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
  console.error('Test failed:', (e as Error).message);
  process.exit(1);
}
