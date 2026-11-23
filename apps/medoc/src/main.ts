/**
 * @file main.ts
 * meDoc Studio — Application Entrypoint
 */

import 'katex/dist/katex.min.css';
import '@mecraft/ui-tokens/tokens.css';
import '@mecraft/ui-tokens/theme-oled.css';
import './styles/theme-teal.css';

import { WriterApp } from './components/WriterApp.js';

function init() {
  const root = document.getElementById('app');
  if (root && !root.hasChildNodes()) {
    new WriterApp(root);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
