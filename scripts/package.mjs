import fs from 'node:fs';
import path from 'node:path';
const dist = path.resolve('dist');
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const mime = { '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
function dataURL(file) {
 const clean = file.replace(/^\//, '');
 const target = path.join(dist, clean);
 return `data:${mime[path.extname(target)] || 'application/octet-stream'};base64,${fs.readFileSync(target).toString('base64')}`;
}
html = html.replace(/<link rel="icon" href="([^"]+)"[^>]*>/, (_, url) => `<link rel="icon" href="${dataURL(url)}" type="image/svg+xml">`);
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, url) => {
 let css = fs.readFileSync(path.join(dist, url.replace(/^\//,'')), 'utf8');
 css = css.replace(/url\((?:["']?)(\/[^)'"\s]+)(?:["']?)\)/g, (_match, asset) => `url("${dataURL(asset)}")`);
 return `<style>${css}</style>`;
});
html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, url) => {
 const js = fs.readFileSync(path.join(dist, url.replace(/^\//,'')), 'utf8').replace(/<\/script/gi, '<\\/script');
 return `<script>window.__STARX_STANDALONE__=true;</script><script type="module">${js}</script>`;
});
// The app bundle must run after the root exists, including in an offline file viewer.
html = html.replace(/(<script>window.__STARX_STANDALONE__[\s\S]*?<\/script>)(<script type="module">[\s\S]*?<\/script>)/, (_m, a, b) => { globalThis.__appScripts = a + b; return ''; });
html = html.replace('</body>', `${globalThis.__appScripts || ''}</body>`);
fs.writeFileSync(path.resolve('../StarX Health.html'), html);
const assets = ['/', '/index.html', '/favicon.svg', '/manrope.woff2', '/orbit-earth.webp', ...fs.readdirSync(path.join(dist,'assets')).map(f=>`/assets/${f}`)];
const version = fs.readdirSync(path.join(dist,'assets')).find(f=>f.endsWith('.js'));
const sw = `const CACHE = ${JSON.stringify('starx-' + version)};
const SHELL = ${JSON.stringify(assets)};
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k.startsWith('starx-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
 if (event.request.mode === 'navigate') {
   event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html'))); return;
 }
 // The static app shell is identical for every Origin; preview hosts add Vary: Origin.
 event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached=>cached||fetch(event.request)));
});`;
fs.writeFileSync(path.join(dist,'sw.js'),sw);
console.log('Created self-contained /home/user/StarX Health.html and offline service worker.');
