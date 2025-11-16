// Custom Select Dropdown Component
(function() {
    'use strict';

    class CustomSelect {
        constructor(element) {
            this.element = element;
            this.trigger = element.querySelector('.custom-select-trigger');
            this.valueDisplay = element.querySelector('.custom-select-value');
            this.optionsList = element.querySelector('.custom-select-options');
            this.options = element.querySelectorAll('.custom-option');
            this.isOpen = false;
            
            this.init();
        }

        init() {
            // Click on trigger to toggle
            this.trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });

            // Click on options
            this.options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectOption(option);
                });
            });

            // Keyboard navigation
            this.element.addEventListener('keydown', (e) => this.handleKeyDown(e));

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.element.contains(e.target)) {
                    this.close();
                }
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                    this.element.focus();
                }
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            // Close all other dropdowns first
            document.querySelectorAll('.custom-select.open').forEach(select => {
                if (select !== this.element) {
                    select.classList.remove('open');
                    select.setAttribute('aria-expanded', 'false');
                }
            });

            this.element.classList.add('open');
            this.element.setAttribute('aria-expanded', 'true');
            this.isOpen = true;

            // Focus first selected option or first option
            const selectedOption = this.element.querySelector('.custom-option.selected');
            if (selectedOption) {
                selectedOption.focus();
            } else {
                this.options[0]?.focus();
            }
        }

        close() {
            this.element.classList.remove('open');
            this.element.setAttribute('aria-expanded', 'false');
            this.isOpen = false;
        }

        selectOption(option) {
            const value = option.dataset.value;
            const text = option.textContent;

            // Update selected state
            this.options.forEach(opt => {
                opt.classList.remove('selected');
                opt.setAttribute('aria-selected', 'false');
            });

            option.classList.add('selected');
            option.setAttribute('aria-selected', 'true');

            // Update display
            this.valueDisplay.textContent = text;

            // Trigger change event
            const changeEvent = new CustomEvent('change', {
                detail: { value, text },
                bubbles: true
            });
            this.element.dispatchEvent(changeEvent);

            // Close dropdown
            this.close();
            this.element.focus();
        }

        handleKeyDown(e) {
            if (!this.isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                this.open();
                return;
            }

            if (!this.isOpen) return;

            const currentFocus = document.activeElement;
            const currentIndex = Array.from(this.options).indexOf(currentFocus);

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < this.options.length - 1) {
                        this.options[currentIndex + 1].focus();
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        this.options[currentIndex - 1].focus();
                    }
                    break;

                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (currentFocus && currentFocus.classList.contains('custom-option')) {
                        this.selectOption(currentFocus);
                    }
                    break;

                case 'Home':
                    e.preventDefault();
                    this.options[0].focus();
                    break;

                case 'End':
                    e.preventDefault();
                    this.options[this.options.length - 1].focus();
                    break;

                case 'Tab':
                    this.close();
                    break;
            }
        }

        // Public method to get current value
        getValue() {
            const selected = this.element.querySelector('.custom-option.selected');
            return selected ? selected.dataset.value : null;
        }

        // Public method to set value programmatically
        setValue(value) {
            const option = this.element.querySelector(`.custom-option[data-value="${value}"]`);
            if (option) {
                this.selectOption(option);
            }
        }
    }

    // Initialize all custom selects
    function initCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        const instances = [];

        customSelects.forEach(element => {
            const instance = new CustomSelect(element);
            instances.push(instance);
            
            // Store instance on element for external access
            element.customSelect = instance;
        });

        return instances;
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomSelects);
    } else {
        initCustomSelects();
    }

    // Export for external use
    window.CustomSelect = CustomSelect;
    window.initCustomSelects = initCustomSelects;

})();

