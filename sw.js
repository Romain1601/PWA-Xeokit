const cacheName = "cache9"; // Change value to force update

self.addEventListener("install", event => {
	// Kick out the old service worker
	self.skipWaiting();

	event.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				"img/icon-192x192.png", // Favicon, Android Chrome M39+ with 4.0 screen density
				"img/icon-256x256.png", // Favicon, Android Chrome M47+ Splash screen with 1.5 screen density
				"img/icon-384x384.png", // Favicon, Android Chrome M47+ Splash screen with 3.0 screen density
				"img/icon-512x512.png", // Favicon, Android Chrome M47+ Splash screen with 4.0 screen density
				"favicon.ico", // Favicon, IE and fallback for other browsers
				"manifest.json", // Manifest file
				"index.html", // Main HTML file
				"js/script.js", // Main Javascript file
				"js/xeokit-sdk.es.js", // Main Javascript file
				"css/style.css", // Main CSS file
			]);
		})
	);
});

self.addEventListener("activate", event => {
	// Delete any non-current cache
	event.waitUntil(
		caches.keys().then(keys => {
			Promise.all(
				keys.map(key => {
					if (![cacheName].includes(key)) {
						return caches.delete(key);
					}
				})
			)
		})
	);
});

// Offline-first, cache-first strategy
// Kick off two asynchronous requests, one to the cache and one to the network
// If there's a cached version available, use it, but fetch an update for next time.
// Gets data on screen as quickly as possible, then updates once the network has returned the latest data. 
self.addEventListener("fetch", event => {
	event.respondWith(
		caches.open(cacheName).then(cache => {
			return cache.match(event.request).then(response => {
				return response || fetch(event.request).then(networkResponse => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			})
		})
	);
});