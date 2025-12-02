/**
 * Profile Modal Auto-opener
 * Opens the profile modal if there are form errors
 */
(function() {
    'use strict';
    
    // Check if we should auto-open the profile modal (e.g., after validation errors)
    var shouldOpenProfileModal = document.querySelector('[data-open-profile-modal="true"]');
    
    if (shouldOpenProfileModal) {
        document.addEventListener('DOMContentLoaded', function() {
            try {
                var modalEl = document.getElementById('profileModal');
                if (modalEl && window.bootstrap && typeof window.bootstrap.Modal === 'function') {
                    new window.bootstrap.Modal(modalEl).show();
                }
            } catch (e) {
                console.error('Profile modal auto-open error:', e);
            }
        });
    }
})();
