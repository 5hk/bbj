// Language switcher dropdown component

function initLanguageSwitcher() {
    const navContainer = document.querySelector('nav .nav-container');
    if (!navContainer) return;
    
    // Create language switcher container
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    languageSwitcher.id = 'language-switcher';
    
    // Get available languages
    const languages = window.i18nUtils.getAvailableLanguages();
    const currentLang = window.i18nUtils.getCurrentLanguage();
    
    const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];
    
    // Create dropdown structure
    languageSwitcher.innerHTML = `
        <div class="language-dropdown" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-label="Select language" tabindex="0">
            <div class="language-trigger">
                <span class="language-code">${currentLanguage.label}</span>
                <svg class="language-arrow" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12">
                    <path fill="currentColor" d="M6 9L1 4h10z"/>
                </svg>
            </div>
            <ul class="language-options" role="listbox">
                ${languages
                    .filter(lang => lang.code !== currentLang)
                    .map(lang => `
                        <li class="language-option" 
                            data-lang="${lang.code}" 
                            role="option" 
                            aria-selected="false" 
                            tabindex="0">
                            <span class="language-label">${lang.label}</span>
                        </li>
                    `).join('')}
            </ul>
        </div>
    `;
    
    // Insert into nav-right container (after divider) for desktop
    const navRight = navContainer.querySelector('.nav-right');
    if (navRight) {
        navRight.appendChild(languageSwitcher);
    }
    
    // Create mobile language switcher (desktop style with text)
    const navMobileControls = navContainer.querySelector('.nav-mobile-controls');
    if (navMobileControls) {
        const mobileLangSwitcher = document.createElement('div');
        mobileLangSwitcher.className = 'language-switcher mobile-lang-switcher';
        mobileLangSwitcher.innerHTML = `
            <div class="language-dropdown mobile-language-dropdown" role="listbox" aria-expanded="false">
                <div class="language-trigger mobile-language-trigger">
                    <span class="language-code mobile-language-code">${currentLanguage.label}</span>
                    <svg class="language-arrow mobile-language-arrow" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <ul class="language-options mobile-language-options" role="listbox">
                    ${languages
                        .filter(lang => lang.code !== currentLang)
                        .map(lang => `
                            <li class="language-option mobile-language-option" 
                                data-lang="${lang.code}" 
                                role="option" 
                                aria-selected="false"
                                tabindex="0">
                                <span class="language-label mobile-option-label">${lang.label}</span>
                            </li>
                        `).join('')}
                </ul>
            </div>
        `;
        const mobileDivider = navMobileControls.querySelector('.mobile-divider');
        navMobileControls.insertBefore(mobileLangSwitcher, mobileDivider);
        
        // Initialize mobile switcher immediately after creation
        initMobileLangSwitcher(mobileLangSwitcher);
    }
    
    // Initialize dropdown functionality
    initDropdownBehavior();
}

function initDropdownBehavior() {
    const dropdown = document.querySelector('.language-dropdown');
    const trigger = dropdown.querySelector('.language-trigger');
    const options = dropdown.querySelector('.language-options');
    
    // Toggle dropdown
    function toggleDropdown(show) {
        const isExpanded = show !== undefined ? show : dropdown.getAttribute('aria-expanded') === 'true';
        dropdown.setAttribute('aria-expanded', !isExpanded);
        dropdown.classList.toggle('active', !isExpanded);
    }
    
    // Close dropdown
    function closeDropdown() {
        dropdown.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('active');
    }
    
    // Handle language selection
    async function selectLanguage(langCode) {
        if (langCode === window.i18nUtils.getCurrentLanguage()) {
            closeDropdown();
            return;
        }
        
        try {
            // Change language
            await window.i18nUtils.changeLanguage(langCode);
            
            // Update UI
            updateSelectedLanguage(langCode);
            
            // Close dropdown
            closeDropdown();
        } catch (error) {
            console.error('Error changing language:', error);
        }
    }
    
    // Update selected language in UI
    function updateSelectedLanguage(langCode) {
        const languages = window.i18nUtils.getAvailableLanguages();
        const selectedLang = languages.find(lang => lang.code === langCode);
        
        if (selectedLang) {
            // Update trigger
            trigger.querySelector('.language-code').textContent = selectedLang.label;
            
            // Rebuild options list (exclude current language)
            const optionsList = dropdown.querySelector('.language-options');
            optionsList.innerHTML = languages
                .filter(lang => lang.code !== langCode)
                .map(lang => `
                    <li class="language-option" 
                        data-lang="${lang.code}" 
                        role="option" 
                        aria-selected="false" 
                        tabindex="0">
                        <span class="language-label">${lang.label}</span>
                    </li>
                `).join('');
            
            // Re-attach event listeners to new options
            attachOptionListeners();
        }
    }
    
    // Attach event listeners to options
    function attachOptionListeners() {
        const optionItems = dropdown.querySelectorAll('.language-option');
        
        optionItems.forEach(option => {
            
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const langCode = option.dataset.lang;
                console.log('Option clicked:', langCode);
                selectLanguage(langCode);
            });
            
            // Keyboard navigation
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const langCode = option.dataset.lang;
                    selectLanguage(langCode);
                }
            });
        });
    }
    
    // Initial attachment of option listeners
    attachOptionListeners();
    
    
    // Click on trigger
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Keyboard navigation for dropdown
    dropdown.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDropdown();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Listen for language change events
    window.addEventListener('languageChanged', (e) => {
        updateSelectedLanguage(e.detail.language);
    });
}

// Initialize mobile language switcher
function initMobileLangSwitcher(mobileSwitcher) {
    const dropdown = mobileSwitcher.querySelector('.mobile-language-dropdown');
    
    if (!dropdown) {
        console.error('Mobile language dropdown not found!');
        return;
    }
    
    const trigger = dropdown.querySelector('.mobile-language-trigger');
    const optionsList = dropdown.querySelector('.mobile-language-options');
    
    function toggleDropdown() {
        dropdown.classList.toggle('active');
        const isActive = dropdown.classList.contains('active');
        dropdown.setAttribute('aria-expanded', isActive);
        
        // Close hamburger menu when opening language dropdown
        if (isActive) {
            const navRight = document.querySelector('.nav-right');
            const menuButton = document.querySelector('.menu-button');
            if (navRight && menuButton) {
                navRight.classList.remove('active');
                menuButton.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    function closeDropdown() {
        dropdown.classList.remove('active');
        dropdown.setAttribute('aria-expanded', 'false');
    }
    
    async function selectLanguage(langCode) {
        if (langCode === window.i18nUtils.getCurrentLanguage()) {
            closeDropdown();
            return;
        }
        
        await window.i18nUtils.changeLanguage(langCode);
        
        // Update mobile trigger text
        const languages = window.i18nUtils.getAvailableLanguages();
        const selectedLang = languages.find(lang => lang.code === langCode);
        if (selectedLang) {
            trigger.querySelector('.mobile-language-code').textContent = selectedLang.label;
            
            // Rebuild options
            optionsList.innerHTML = languages
                .filter(lang => lang.code !== langCode)
                .map(lang => `
                    <li class="language-option mobile-language-option" 
                        data-lang="${lang.code}" 
                        role="option" 
                        aria-selected="false"
                        tabindex="0">
                        <span class="language-label mobile-option-label">${lang.label}</span>
                    </li>
                `).join('');
            
            // Re-attach listeners
            attachMobileOptionListeners();
        }
        
        closeDropdown();
    }
    
    function attachMobileOptionListeners() {
        const options = dropdown.querySelectorAll('.mobile-language-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                selectLanguage(option.dataset.lang);
            });
            
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectLanguage(option.dataset.lang);
                }
            });
        });
    }
    
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
    }
    
    attachMobileOptionListeners();
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileSwitcher.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Also close when hamburger menu is opened
    window.addEventListener('mobileMenuToggled', () => {
        closeDropdown();
    });
}

// Initialize when i18next is ready
function waitForI18next() {
    if (window.i18nUtils && window.i18next && window.i18next.isInitialized) {
        setTimeout(() => {
            initLanguageSwitcher();
        }, 100);
    } else {
        setTimeout(waitForI18next, 100);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForI18next);
} else {
    waitForI18next();
}

