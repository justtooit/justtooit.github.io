// 과일 깎기 서비스워커: 한 번 열면 인터넷이 끊겨도 실행되게 게임 파일을 저장해 둔다(three.js는 peel.html에 내장).
// 게임 파일은 '네트워크 먼저'(새 버전 우선).
const CACHE = "peel-v2";
const CORE = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = e.request.url; if (e.request.method !== "GET") return;
  if (new URL(u).pathname.startsWith("/")) e.respondWith(fetch(e.request).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); } return res; }).catch(() => caches.match(e.request)));
});
