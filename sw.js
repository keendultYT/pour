// Pour 서비스워커 (통합 2단계): 푸어 가이드와 입자 분석(grind/)을 같이 오프라인 지원
// 인터넷이 되면 항상 최신 파일, 안 되면 저장해 둔 파일로 열기
const CACHE = 'pour-v1';
const FILES = ['./', './manifest.json', './icon-192.png', './icon-512.png', './grind/grindscope.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // 같은 주소(keendultyt.github.io)를 쓰는 다른 앱(grindsize 등)의 저장 공간은 건드리지 않음
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('pour-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r ||
      (req.mode === 'navigate' ? caches.match(url.pathname.includes('/grind/') ? './grind/grindscope.html' : './') : undefined)))
  );
});
