const vaultFiles = new Map();

const MIME_TYPES = {
  html: 'text/html; charset=utf-8',
  htm: 'text/html; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  mjs: 'application/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  json: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  ico: 'image/x-icon',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  txt: 'text/plain; charset=utf-8',
};

function getMimeType(filePath) {
  const clean = filePath.split('?')[0].split('#')[0];
  const ext = clean.includes('.') ? clean.split('.').pop().toLowerCase() : '';
  return MIME_TYPES[ext] || 'application/octet-stream';
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'LOAD_VAULT' || !Array.isArray(data.files)) {
    return;
  }

  vaultFiles.clear();
  for (const item of data.files) {
    const key = String(item.path || '').replace(/^\/+/, '');
    if (!key || !item.buffer) continue;
    vaultFiles.set(key, {
      buffer: item.buffer,
      mime: getMimeType(key),
    });
  }

  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage({ ok: true, count: vaultFiles.size });
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const scope = self.registration.scope;

  if (!url.href.startsWith(scope)) return;
  if (url.searchParams.has('fresh')) return;

  let rel = url.href.slice(scope.length).split('?')[0].split('#')[0].replace(/^\/+/, '');
  if (!rel || rel.endsWith('/')) {
    rel += 'index.html';
  }

  if (rel === 'sw.js' || rel === 'app.bin') return;

  const entry = vaultFiles.get(rel);
  if (entry) {
    event.respondWith(
      new Response(entry.buffer.slice(0), {
        status: 200,
        headers: {
          'Content-Type': entry.mime,
          'Cache-Control': 'no-store',
        },
      })
    );
    return;
  }

  if (event.request.mode === 'navigate' && vaultFiles.has('index.html')) {
    const htmlEntry = vaultFiles.get('index.html');
    event.respondWith(
      new Response(htmlEntry.buffer.slice(0), {
        status: 200,
        headers: {
          'Content-Type': htmlEntry.mime,
          'Cache-Control': 'no-store',
        },
      })
    );
  }
});

