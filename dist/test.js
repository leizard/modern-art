"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Simple test runner for CI/CD (run with: ts-node test.ts)
const jsdom_1 = require("jsdom");
const fs = __importStar(require("fs"));
// Load HTML and compiled JS
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('dist/script.js', 'utf8');
const dom = new jsdom_1.JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;
global.window = window;
global.document = window.document;
// Inject script.ts
const scriptEl = window.document.createElement('script');
scriptEl.textContent = script;
window.document.body.appendChild(scriptEl);
function clickGenerate() {
    const btn = window.document.getElementById('generate-btn');
    if (!btn)
        throw new Error('Generate button not found');
    btn.click();
}
function testShapeAndName() {
    clickGenerate();
    const shape = window.document.querySelector('.shape');
    const nameEl = window.document.getElementById('art-name');
    const name = nameEl?.textContent || '';
    if (!shape)
        throw new Error('Shape not generated');
    if (!name || name.length < 3)
        throw new Error('Name not generated');
}
function testMultipleGenerations() {
    let lastName = '';
    for (let i = 0; i < 5; i++) {
        clickGenerate();
        const shape = window.document.querySelector('.shape');
        const nameEl = window.document.getElementById('art-name');
        const name = nameEl?.textContent || '';
        if (!shape)
            throw new Error('Shape not generated on click ' + i);
        if (!name || name.length < 3)
            throw new Error('Name not generated on click ' + i);
        if (name === lastName && i > 0)
            throw new Error('Name did not change on click ' + i);
        lastName = name;
    }
}
function testNoShapeBeforeClick() {
    const shape = window.document.querySelector('.shape');
    const nameEl = window.document.getElementById('art-name');
    const name = nameEl?.textContent || '';
    if (shape)
        throw new Error('Shape should not be present before click');
    if (name)
        throw new Error('Name should not be present before click');
}
try {
    testNoShapeBeforeClick();
    testShapeAndName();
    testMultipleGenerations();
    console.log('All tests passed!');
    process.exit(0);
}
catch (e) {
    console.error('Test failed:', e.message);
    process.exit(1);
}
