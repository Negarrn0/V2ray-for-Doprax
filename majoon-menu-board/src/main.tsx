import { capturePristineHtml } from './lib/exporters';
// Snapshot the document before React renders, so "Standalone HTML" export can clone the app.
capturePristineHtml();

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
