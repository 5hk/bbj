async function initI18next() {
    try {
        const detectedLang = detectLanguage();
        
        const translations = await loadTranslations(detectedLang);
        
        await i18next
            .use(i18nextBrowserLanguageDetector)
            .init({
                detection: {
                    order: ['localStorage', 'navigator', 'htmlTag'],
                    caches: ['localStorage'],
                    lookupLocalStorage: 'i18nextLng'
                },
                
                lng: detectedLang,
                
                fallbackLng: 'en',
                
                supportedLngs: ['ko', 'en', 'es'],
                
            debug: false,
                
                resources: {
                    [detectedLang]: {
                        translation: translations
                    }
                },
                
                interpolation: {
                    escapeValue: false
                }
            });
        
        updateContent();
        
        document.documentElement.lang = i18next.language;
        
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('lang')) {
            updateURLParameter('lang', detectedLang, true);
        }
        
        console.log('i18next initialized successfully with language:', i18next.language);
        
        window.i18next = i18next;
        
        window.dispatchEvent(new CustomEvent('i18nextInitialized', { 
            detail: { language: i18next.language } 
        }));
    } catch (error) {
        console.error('Failed to initialize i18next:', error);
    }
}


function detectLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && ['ko', 'en', 'es'].includes(urlLang)) {
        localStorage.setItem('i18nextLng', urlLang);
        return urlLang;
    }
    
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && ['ko', 'en', 'es'].includes(storedLang)) {
        return storedLang;
    }
    
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ko')) {
        return 'ko';
    } else if (browserLang.startsWith('es')) {
        return 'es';
    }
    
    return 'en';
}

async function loadTranslations(language) {
    try {
        const response = await fetch(`/locales/${language}/translation.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        return translations;
    } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        return {};
    }
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18next.t(key);
        
        const attr = element.getAttribute('data-i18n-attr');
        if (attr) {
            element.setAttribute(attr, translation);
        } else {
            element.textContent = translation;
        }
    });
    
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const translation = i18next.t(key);
        element.innerHTML = translation;
    });
}

async function changeLanguage(language) {
    try {
        const translations = await loadTranslations(language);
        
        if (!i18next.hasResourceBundle(language, 'translation')) {
            i18next.addResourceBundle(language, 'translation', translations, true, true);
        }
        
        await i18next.changeLanguage(language);
        
        updateContent();
        
        document.documentElement.lang = language;
        
        localStorage.setItem('i18nextLng', language);
        
        updateURLParameter('lang', language);
        
        console.log('Language changed to:', language);
        
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    } catch (error) {
        console.error('Failed to change language:', error);
    }
}

function updateURLParameter(key, value, replaceState = false) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    
    if (replaceState) {
        window.history.replaceState({ language: value }, '', url.toString());
    } else {
        window.history.pushState({ language: value }, '', url.toString());
    }
}

function getCurrentLanguage() {
    return i18next.language || 'en';
}

function getAvailableLanguages() {
    return [
        { code: 'ko', label: 'KOR', name: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'ENG', name: 'English', flag: '🇺🇸' },
        { code: 'es', label: 'ESP', name: 'Español', flag: '🇪🇸' }
    ];
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.language) {
        changeLanguage(event.state.language);
    } else {
        const detectedLang = detectLanguage();
        if (detectedLang !== getCurrentLanguage()) {
            changeLanguage(detectedLang);
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18next);
} else {
    initI18next();
}

window.i18nUtils = {
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    updateContent
};
