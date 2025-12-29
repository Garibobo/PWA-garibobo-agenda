'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "f299a2786dc70e6e03f119f89c77833f",
"assets/AssetManifest.bin.json": "1365adbc8119d64d4390b89046c660da",
"assets/AssetManifest.json": "b3ab7a61c9b678d0d6f64dd4e2dda43c",
"assets/assets/icon/agenda-android-icone.png": "85c1849831dc66e4012448d40b7a23fc",
"assets/assets/icon/android-chrome-192x192.png": "7f69cbcfbc94aac3643bd04b53d996c3",
"assets/assets/icon/android-chrome-512x512.png": "dc7c25898f5b2e372c9bea68e7634145",
"assets/assets/icon/apple-touch-icon.png": "f7ad9cbd97445b5cbff0c0ac48f188e8",
"assets/assets/icon/epsic-agenda-android.png": "95e86d9a473fd17e7f9b41ca3252c7c1",
"assets/assets/icon/favicon-16x16.png": "7481520552a749e97cd454a9e421605b",
"assets/assets/icon/favicon-32x32.png": "855dcca523db2ee448b4ae2d3b6654c1",
"assets/assets/icon/favicon.ico": "4dbe8720dc1729a5e4473e9bf3e935dc",
"assets/assets/icon/site.webmanifest": "053100cb84a50d2ae7f5492f7dd7f25e",
"assets/assets/images/avatar-colorful.png": "8df7c021022a1ef3e3647501015526a6",
"assets/assets/images/logo-application-5.png": "d4df6d03ffbad26ad96d6efef2cf71da",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e726c65b1fc9d75e0fcec6409b04a52c",
"assets/NOTICES": "b448b56db3c8f7e103aa3b797d841175",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"browserconfig.xml": "1cdd556130f00d1bb4747914f53254d5",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"favicon.png": "85c1849831dc66e4012448d40b7a23fc",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "83acb3798daaf60a563bb295ae0f95b7",
"icons/apple-touch-icon-120x120.png": "4f699b6ed672a265c300fd050b897977",
"icons/apple-touch-icon-152x152.png": "bf2e1962bf18157f6fff6acbbfd4ffab",
"icons/apple-touch-icon-167x167.png": "b0f7cf44be471534b2fa174d18c84096",
"icons/apple-touch-icon-180x180.png": "ddc2c75a48356af81f22bb839a337217",
"icons/apple-touch-icon-60x60.png": "c2e9a3a673dfdd0636beb79ec923a8be",
"icons/apple-touch-icon-76x76.png": "5a8613678da9ae83200951593a097617",
"icons/apple-touch-icon.png": "ddc2c75a48356af81f22bb839a337217",
"icons/Icon-192.png": "fca871488e08dece65cec1683ee3720b",
"icons/Icon-512.png": "9b995710c2e1520f77a655f722536c18",
"icons/Icon-maskable-192.png": "fca871488e08dece65cec1683ee3720b",
"icons/Icon-maskable-512.png": "9b995710c2e1520f77a655f722536c18",
"index.html": "813d19ed31a6b8d6aff766dc55f138a6",
"/": "813d19ed31a6b8d6aff766dc55f138a6",
"main.dart.js": "8d47fa6f112ee83eb957090b6077e904",
"manifest.json": "94040c886806903f193ca4c9e2001c43",
"offline.html": "ea0368e67548c45f5bf6e86ea0e92923",
"pwa-install.js": "5c04a981d014ff92b32f45fe26bf17f7",
"robots.txt": "c705e80aec228cdbe7a3b7fd28e1ef08",
"sw.js": "8f034a5e802b5a5d46224fba35954699",
"version.json": "f7c20179bbb5b378bffbea38e5861b70"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
