// VBM-16 offline cache. Bump VERSION when files change.
const VERSION='vbm16-1.55';
const FILES=['./','index.html','tutorial.html','manual.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// network first so updates show up, cache when offline
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
