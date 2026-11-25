import '@mecraft/studio-shell/styles.css';
import { createStudioShell } from './index.js';

const appEl = document.getElementById('app') || document.body;
createStudioShell(appEl);
