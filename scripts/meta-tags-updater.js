/**
 * Meta Tags Updater
 * Dynamically updates meta tags based on selected language
 */

(function() {
    'use strict';

    const metaContent = {
        ko: {
            title: 'PLAN-G ENTERTAINMENT',
            description: 'PLAN-G Entertainment는 진정성 있는 아티스트를 발굴하고 그들의 잠재력을 극대화하는 뮤직 레이블입니다. 독창적인 예술성과 혁신적인 사운드의 힘을 믿습니다.',
            keywords: 'PLAN-G, PLAN-G Entertainment, 플랜지, 가호, Gaho, 케이팝, 한국 음악, 음악 레이블, 엔터테인먼트, 싱어송라이터',
            ogLocale: 'ko_KR'
        },
        en: {
            title: 'PLAN-G ENTERTAINMENT',
            description: 'PLAN-G Entertainment is a forward-thinking music label dedicated to discovering and nurturing exceptional talent. We believe in the power of authentic artistry and innovative sound.',
            keywords: 'PLAN-G, PLAN-G Entertainment, Gaho, K-pop, Korean music, music label, entertainment company, singer-songwriter',
            ogLocale: 'en_US'
        },
        es: {
            title: 'PLAN-G ENTERTAINMENT',
            description: 'PLAN-G Entertainment es un sello musical visionario dedicado a descubrir y nutrir talento excepcional. Creemos en el poder del arte auténtico y el sonido innovador.',
            keywords: 'PLAN-G, PLAN-G Entertainment, Gaho, K-pop, música coreana, sello musical, compañía de entretenimiento, cantautor',
            ogLocale: 'es_ES'
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

        // Update Open Graph tags
        updateMetaTag('meta[property="og:title"]', content.title);
        updateMetaTag('meta[property="og:description"]', content.description);
        updateMetaTag('meta[property="og:locale"]', content.ogLocale);

        // Update Twitter Card tags
        updateMetaTag('meta[name="twitter:title"]', content.title);
        updateMetaTag('meta[name="twitter:description"]', content.description);

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

