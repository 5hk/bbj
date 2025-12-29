// i18next initialization and configuration

// Initialize i18next with configuration
async function initI18next() {
    try {
        // Detect language first
        const detectedLang = detectLanguage();
        
        // Load translations before initializing i18next
        const translations = await loadTranslations(detectedLang);
        
        // Initialize i18next with loaded translations
        await i18next
            .use(i18nextBrowserLanguageDetector)
            .init({
                // Language detection configuration
                detection: {
                    order: ['localStorage', 'navigator', 'htmlTag'],
                    caches: ['localStorage'],
                    lookupLocalStorage: 'i18nextLng'
                },
                
                // Set detected language
                lng: detectedLang,
                
                // Fallback language
                fallbackLng: 'en',
                
                // Supported languages
                supportedLngs: ['ko', 'en', 'es'],
                
            // Debug mode (set to true for debugging)
            debug: false,
                
                // Load translations directly
                resources: {
                    [detectedLang]: {
                        translation: translations
                    }
                },
                
                // Interpolation settings
                interpolation: {
                    escapeValue: false
                }
            });
        
        // Update page content with translations
        updateContent();
        
        // Update HTML lang attribute
        document.documentElement.lang = i18next.language;
        
        console.log('i18next initialized successfully with language:', i18next.language);
        
        // Mark as initialized
        window.i18next = i18next;
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('i18nextInitialized', { 
            detail: { language: i18next.language } 
        }));
    } catch (error) {
        console.error('Failed to initialize i18next:', error);
    }
}

// Detect language based on localStorage or browser settings
function detectLanguage() {
    // Check localStorage first
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && ['ko', 'en'].includes(storedLang)) {
        return storedLang;
    }
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('ko')) {
        return 'ko';
    }
    
    // Default to English
    return 'en';
}

// Load translation files dynamically
async function loadTranslations(language) {
    try {
        const response = await fetch(`/locales/${language}/translation.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        console.log(`Loaded translations for ${language}:`, translations);
        return translations;
    } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Return empty object as fallback
        return {};
    }
}

// Update all content with translations
function updateContent() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18next.t(key);
        
        // Check if element has data-i18n-attr for attribute translation
        const attr = element.getAttribute('data-i18n-attr');
        if (attr) {
            element.setAttribute(attr, translation);
        } else {
            // Update text content
            element.textContent = translation;
        }
    });
    
    // Update all elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const translation = i18next.t(key);
        element.innerHTML = translation;
    });
}

// Change language function
async function changeLanguage(language) {
    try {
        // Load translations for the new language
        const translations = await loadTranslations(language);
        
        // Add resource bundle if not already loaded
        if (!i18next.hasResourceBundle(language, 'translation')) {
            i18next.addResourceBundle(language, 'translation', translations, true, true);
        }
        
        // Change language
        await i18next.changeLanguage(language);
        
        // Update content
        updateContent();
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Save to localStorage
        localStorage.setItem('i18nextLng', language);
        
        console.log('Language changed to:', language);
        
        // Dispatch custom event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    } catch (error) {
        console.error('Failed to change language:', error);
    }
}

// Get current language
function getCurrentLanguage() {
    return i18next.language || 'en';
}

// Get available languages
function getAvailableLanguages() {
    return [
        { code: 'ko', label: 'KOR', name: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'ENG', name: 'English', flag: '🇺🇸' },
        { code: 'es', label: 'ESP', name: 'Español', flag: '🇪🇸' }
    ];
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18next);
} else {
    initI18next();
}

// Export functions for global use
window.i18nUtils = {
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    updateContent
};

