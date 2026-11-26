// 예전 입자 분석 전용 서비스워커를 치우는 파일. 이제 한 단계 위의 ../sw.js 하나가 두 화면을 맡아요
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(self.registration.unregister()); });
