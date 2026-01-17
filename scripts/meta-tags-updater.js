(function() {
    'use strict';

    function updateMetaTag(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute('content', content);
        }
    }

    function updateTitle(title) {
        document.title = title;
    }

    function updateMetaTags(lang) {
        if (!window.i18next || !window.i18next.isInitialized) {
            setTimeout(() => updateMetaTags(lang), 50);
            return;
        }

        const title = window.i18next.t('meta.title', { lng: lang });
        const description = window.i18next.t('meta.description', { lng: lang });
        const keywords = window.i18next.t('meta.keywords', { lng: lang });

        const ogLocaleMap = {
            ko: 'ko_KR',
            en: 'en_US',
            es: 'es_ES'
        };
        const ogLocale = ogLocaleMap[lang] || 'en_US';

        const canonical = `https://plan-g.io/?lang=${lang}`;

        updateTitle(title);

        updateMetaTag('meta[name="description"]', description);

        updateMetaTag('meta[name="keywords"]', keywords);

        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute('href', canonical);
        }

        updateMetaTag('meta[property="og:title"]', title);
        updateMetaTag('meta[property="og:description"]', description);
        updateMetaTag('meta[property="og:locale"]', ogLocale);
        updateMetaTag('meta[property="og:url"]', canonical);

        updateMetaTag('meta[name="twitter:title"]', title);
        updateMetaTag('meta[name="twitter:description"]', description);
        updateMetaTag('meta[name="twitter:url"]', canonical);

        document.documentElement.lang = lang;
    }

    function init() {
        function waitForI18next() {
            if (window.i18next && window.i18next.isInitialized) {
                const currentLang = window.i18next.language || 'ko';
                updateMetaTags(currentLang);
                
                // Listen for language change events
                window.addEventListener('languageChanged', function(event) {
                    updateMetaTags(event.detail.language);
                });
            } else {
                setTimeout(waitForI18next, 50);
            }
        }
        
        waitForI18next();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.updateMetaTags = updateMetaTags;
})();

