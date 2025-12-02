/**
 * Dashboard UI Utilities
 * Handles dashboard-specific UI interactions
 */
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // Check if dashboard wants to auto-open job application form
            var dashboardData = document.getElementById('dashboard-data');
            if (!dashboardData) return;
            
            var showJob = dashboardData.getAttribute('data-show-jobapp') === '1';
            if (showJob) {
                var el = document.getElementById('jobApplicationForm');
                if (el && window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
                    new window.bootstrap.Collapse(el).show();
                }
            }
        } catch (e) {
            console.error('Dashboard UI init error:', e);
        }
    });
})();
