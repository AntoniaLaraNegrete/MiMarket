/* eslint-disable no-restricted-globals */
// Service worker de MiMarket: guarda en caché los archivos de la app
// para que cargue más rápido y siga funcionando brevemente sin internet.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precachea todos los archivos que genera el build (JS, CSS, íconos, etc.)
precacheAndRoute(self.__WB_MANIFEST);

// Para una app de una sola página: cualquier navegación devuelve el index.html
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Imágenes: sirve desde caché y actualiza en segundo plano
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.match(/\.(png|jpg|jpeg|svg|gif)$/),
  new StaleWhileRevalidate({
    cacheName: 'imagenes-mimarket',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
