import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './readability.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

if (import.meta.env.PROD && !window.__STARX_STANDALONE__ && 'serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
