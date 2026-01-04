/**
 * Meta Tags Updater
 * Dynamically updates meta tags based on selected language
 */

(function() {
    'use strict';

    const metaContent = {
        ko: {
            title: 'PLAN-G - Korean Music Label | Gaho Official',
            description: 'PLAN-G (플랜지) is a Korean music entertainment label. Home of artist Gaho (가호). Where People Meet Music.',
            keywords: 'PLAN-G, 플랜지, Gaho, 가호, plan g, Korean music label, K-pop, music entertainment, singer-songwriter, 음악 레이블, 케이팝',
            ogLocale: 'ko_KR',
            canonical: 'https://plan-g.io/'
        },
        en: {
            title: 'PLAN-G - Korean Music Label | Gaho Official',
            description: 'PLAN-G (플랜지) is a Korean music entertainment label. Home of artist Gaho (가호). Where People Meet Music.',
            keywords: 'PLAN-G, 플랜지, Gaho, 가호, plan g, Korean music label, K-pop, music entertainment, singer-songwriter',
            ogLocale: 'en_US',
            canonical: 'https://plan-g.io/'
        },
        es: {
            title: 'PLAN-G - Korean Music Label | Gaho Official',
            description: 'PLAN-G (플랜지) is a Korean music entertainment label. Home of artist Gaho (가호). Where People Meet Music.',
            keywords: 'PLAN-G, 플랜지, Gaho, 가호, plan g, Korean music label, K-pop, música coreana, sello musical, cantautor',
            ogLocale: 'es_ES',
            canonical: 'https://plan-g.io/'
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

        // Update keywords
        updateMetaTag('meta[name="keywords"]', content.keywords);

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
        // Get current language from i18next or default to 'ko'
        const currentLang = window.i18next?.language || 'ko';
        updateMetaTags(currentLang);

        // Listen for language changes
        if (window.i18next) {
            window.i18next.on('languageChanged', function(lng) {
                updateMetaTags(lng);
            });
        }
    }

    // Wait for i18next to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 100);
        });
    } else {
        setTimeout(init, 100);
    }

    // Export for manual updates
    window.updateMetaTags = updateMetaTags;
})();

