/**
 * Template URL Mapper
 * Applies Django-generated URLs to elements at runtime
 */
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // Read the template mapping from the JSON script block
            var mapEl = document.getElementById('template-mapping');
            if (!mapEl) return;
            
            var txt = mapEl.textContent || mapEl.innerText;
            var map = {};
            
            try {
                map = JSON.parse(txt);
            } catch(e) {
                console.error('Failed to parse template mapping:', e);
                return;
            }
            
            // Apply URLs to elements with data-link-key attributes
            Object.keys(map).forEach(function(key) {
                var elements = document.querySelectorAll('[data-link-key="' + key + '"]');
                elements.forEach(function(el) {
                    try {
                        el.href = map[key];
                    } catch(e) {
                        console.error('Failed to set href for key:', key, e);
                    }
                });
            });
        } catch(e) {
            console.error('Template URL mapping error:', e);
        }
    });
})();
