const C='routinen-v2';
const FILES=['./','./index.html','./manifest.json','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;
  const isDoc=req.mode==='navigate'||req.url.endsWith('index.html')||req.url.endsWith('/');
  if(isDoc){
    /* Netz zuerst: künftige Updates laden automatisch, offline fällt es auf den Cache zurück */
    e.respondWith(fetch(req).then(r=>{const cl=r.clone();caches.open(C).then(c=>c.put('./index.html',cl));return r})
      .catch(()=>caches.match('./index.html')));
  }else{
    e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)
      .then(rr=>{const cl=rr.clone();caches.open(C).then(c=>c.put(req,cl));return rr})
      .catch(()=>caches.match('./index.html'))));
  }
});
