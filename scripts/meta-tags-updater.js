/**
 * Meta Tags Updater
 * Dynamically updates meta tags based on selected language
 */

(function() {
    'use strict';

    const metaContent = {
        ko: {
            title: 'PLAN-G',
            description: 'PLAN-G (플랜지) is a music entertainment label. Home of artist Gaho (가호). Where People Meet Music.',
            ogLocale: 'ko_KR',
            canonical: 'https://plan-g.io/?lang=ko'
        },
        en: {
            title: 'PLAN-G',
            description: 'PLAN-G (플랜지) is a music entertainment label. Home of artist Gaho (가호). Where People Meet Music.',
            ogLocale: 'en_US',
            canonical: 'https://plan-g.io/?lang=en'
        },
        es: {
            title: 'PLAN-G',
            description: 'PLAN-G (플랜지) is a music entertainment label. Home of artist Gaho (가호). Where People Meet Music.',
            ogLocale: 'es_ES',
            canonical: 'https://plan-g.io/?lang=es'
        }
    };

    /**
     * Update meta tag content
     */
    function updateMetaTag(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            if (selector.includes('[property')) {
                element.setAttribute('content', content);
            } else {
                element.setAttribute('content', content);
            }
        }
    }

    /**
     * Update page title
     */
    function updateTitle(title) {
        document.title = title;
    }

    /**
     * Update all meta tags for the given language
     */
    function updateMetaTags(lang) {
        const content = metaContent[lang] || metaContent.en;

        // Update title
        updateTitle(content.title);

        // Update description
        updateMetaTag('meta[name="description"]', content.description);

        // Update canonical URL
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink && content.canonical) {
            canonicalLink.setAttribute('href', content.canonical);
        }

        // Update Open Graph tags
        updateMetaTag('meta[property="og:title"]', content.title);
        updateMetaTag('meta[property="og:description"]', content.description);
        updateMetaTag('meta[property="og:locale"]', content.ogLocale);
        if (content.canonical) {
            updateMetaTag('meta[property="og:url"]', content.canonical);
        }

        // Update Twitter Card tags
        updateMetaTag('meta[name="twitter:title"]', content.title);
        updateMetaTag('meta[name="twitter:description"]', content.description);
        if (content.canonical) {
            updateMetaTag('meta[name="twitter:url"]', content.canonical);
        }

        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    /**
     * Initialize meta tags updater
     */
    function init() {
        function waitForI18next() {
            if (window.i18next && window.i18next.isInitialized) {
                const currentLang = window.i18next.language || 'en';
                updateMetaTags(currentLang);
                
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

