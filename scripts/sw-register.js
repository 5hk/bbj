/**
 * Service Worker Registration
 * Registers the service worker for PWA functionality
 */

(function() {
    'use strict';

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);

                    // Check for updates periodically
                    setInterval(function() {
                        registration.update();
                    }, 60000); // Check every minute

                    // Handle updates
                    registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        
                        newWorker.addEventListener('statechange', function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available, show update notification
                                console.log('New content is available; please refresh.');
                                
                                // Optional: Show a notification to the user
                                if (confirm('New version available! Click OK to update.')) {
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });

            // Handle controller change (new service worker activated)
            navigator.serviceWorker.addEventListener('controllerchange', function() {
                console.log('New service worker activated');
            });
        });
    } else {
        console.log('Service workers are not supported.');
    }

    // Install prompt for PWA
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', function(e) {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        console.log('PWA install prompt available');
        
        // Optional: Show your own install button
        // showInstallPromotion();
    });

    window.addEventListener('appinstalled', function() {
        console.log('PWA was installed');
        deferredPrompt = null;
    });
})();

