/**
 * Marquette University - Shared JavaScript Utilities
 * Security, validation, and common functions
 */

const MarquetteUtils = (function() {
    'use strict';

    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input to sanitize
     * @returns {string} Sanitized input
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    /**
     * Validate email address format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email format
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate name input (alphanumeric, spaces, hyphens only)
     * @param {string} name - Name to validate
     * @returns {boolean} True if valid name format
     */
    function validateName(name) {
        const nameRegex = /^[a-zA-Z\s\-']{1,50}$/;
        return nameRegex.test(name);
    }

    /**
     * Get URL parameter with sanitization
     * @param {string} name - Parameter name
     * @returns {string|null} Sanitized parameter value or null
     */
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = urlParams.get(name);

        if (!value) {
            return null;
        }

        // Sanitize and validate based on parameter type
        if (name === 'email') {
            return validateEmail(value) ? sanitizeInput(value) : null;
        } else if (name === 'name') {
            return validateName(value) ? sanitizeInput(value) : null;
        }

        return sanitizeInput(value);
    }

    /**
     * Show error message to user
     * @param {string} message - Error message to display
     * @param {HTMLElement} container - Container element
     */
    function showError(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');
        errorDiv.textContent = sanitizeInput(message);

        container.prepend(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Show success message to user
     * @param {string} message - Success message to display
     * @param {HTMLElement} container - Container element
     */
    function showSuccess(message, container) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.setAttribute('role', 'status');
        successDiv.setAttribute('aria-live', 'polite');
        successDiv.textContent = sanitizeInput(message);

        container.prepend(successDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    /**
     * Submit form data to backend API (placeholder for real integration)
     * @param {Object} data - Form data to submit
     * @returns {Promise} Promise that resolves with response
     */
    async function submitToBackend(data) {
        // TODO: Replace with actual API endpoint
        // This is a placeholder for proper backend integration

        console.log('Form submission data:', data);

        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For now, just log and resolve
                // In production, this would be:
                // fetch('/api/leads', { method: 'POST', body: JSON.stringify(data) })
                resolve({
                    success: true,
                    message: 'Data received (placeholder - implement backend)'
                });
            }, 500);
        });
    }

    /**
     * Store data in localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} True if successful
     */
    function saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('localStorage error:', e);
            return false;
        }
    }

    /**
     * Retrieve data from localStorage with error handling
     * @param {string} key - Storage key
     * @returns {any|null} Retrieved value or null
     */
    function getFromLocalStorage(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('localStorage error:', e);
            return null;
        }
    }

    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Track analytics event (placeholder)
     * @param {string} category - Event category
     * @param {string} action - Event action
     * @param {string} label - Event label
     */
    function trackEvent(category, action, label) {
        // TODO: Integrate with Google Analytics or other analytics platform
        console.log('Analytics event:', { category, action, label });

        // Example GA4 integration:
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', action, {
        //         'event_category': category,
        //         'event_label': label
        //     });
        // }
    }

    /**
     * Copy text to clipboard with fallback
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} True if successful
     */
    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                return success;
            }
        } catch (err) {
            console.error('Copy failed:', err);
            return false;
        }
    }

    // Public API
    return {
        sanitizeInput,
        validateEmail,
        validateName,
        getUrlParameter,
        showError,
        showSuccess,
        submitToBackend,
        saveToLocalStorage,
        getFromLocalStorage,
        debounce,
        trackEvent,
        copyToClipboard
    };
})();

// Make available globally
window.MarquetteUtils = MarquetteUtils;
