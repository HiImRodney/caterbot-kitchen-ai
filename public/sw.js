// CaterBot Service Worker - Offline Support
const CACHE_NAME = 'caterbot-v1';
const STATIC_CACHE = 'caterbot-static-v1';
const API_CACHE = 'caterbot-api-v1';

// Static assets to cache
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response as it can only be consumed once
          const responseClone = response.clone();
          
          // Cache successful API responses
          if (response.ok) {
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return offline fallback for chat API
            if (url.pathname.includes('/functions/v1/master-chat')) {
              return new Response(JSON.stringify({
                success: true,
                response: "📱 **Offline Mode**\n\nThe app is currently offline. Basic troubleshooting guidance:\n\n• Check power connections\n• Ensure equipment is properly plugged in\n• Look for error displays or warning lights\n• Try turning equipment off and on\n\nFor immediate assistance, contact your manager or maintenance team.",
                response_type: "pattern_match",
                cost_gbp: 0
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            
            // Generic offline response
            return new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});