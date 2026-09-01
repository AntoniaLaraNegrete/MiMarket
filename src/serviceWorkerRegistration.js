// Este archivo registra un service worker para que MiMarket funcione como
// app instalable (PWA): ícono en el celular, carga más rápida, y sigue
// funcionando brevemente aunque se corte la conexión a internet.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });

    // Revisa cada 60 minutos si hay una versión nueva, por si alguien deja
    // la app abierta todo el día sin cerrarla.
    setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) reg.update();
      });
    }, 60 * 60 * 1000);
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Si ya hay una versión nueva esperando (por ejemplo, alguien dejó la
      // pestaña abierta cuando subiste una actualización), la activamos ahora.
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) return;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Hay una versión nueva lista: la activamos automáticamente,
              // sin pedirle nada al usuario.
              console.log('Nueva versión de MiMarket encontrada, actualizando...');
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
              if (config && config.onUpdate) config.onUpdate(registration);
            } else {
              console.log('MiMarket está listo para funcionar sin conexión.');
              if (config && config.onSuccess) config.onSuccess(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error registrando el service worker:', error);
    });

  // Cuando la nueva versión toma el control, recargamos la página una sola
  // vez para que el usuario vea los cambios sin tener que hacer nada.
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('MiMarket no encontró conexión. Ejecutando en modo local.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}
