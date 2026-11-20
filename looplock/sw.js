// Loop Lock offline cache. Bump VERSION when files change.
const VERSION='looplock-v4';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('looplock-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// network first so updates show up, cache when offline
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});
