document.addEventListener('DOMContentLoaded', function() {
    // Note: removed automatic scroll-to-top behavior on filter submission per user preference.
    // 1) Set progress bar widths based on data-progress attributes
    const bars = document.querySelectorAll('.progress-bar[data-progress]');
    bars.forEach(function(bar) {
        const pct = parseInt(bar.getAttribute('data-progress') || '0', 10);
        if (!isNaN(pct)) {
            const clamped = Math.max(0, Math.min(100, pct));
            bar.style.width = clamped + '%';
            bar.setAttribute('aria-valuenow', String(clamped));
        }
    });

    // 2) Contact info toggle icon handling
    const contactInfo = document.getElementById('contactInfo');
    const toggleIcon = document.getElementById('contactToggleIcon');
    if (contactInfo && toggleIcon) {
        contactInfo.addEventListener('show.bs.collapse', function() {
            toggleIcon.classList.remove('fa-chevron-right');
            toggleIcon.classList.add('fa-chevron-down');
        });

        contactInfo.addEventListener('hide.bs.collapse', function() {
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-right');
        });
    }

    // 3) Auto-show profile/job application forms based on data flags
    const dashboardData = document.getElementById('dashboard-data');
    if (dashboardData) {
        const showProfile = dashboardData.getAttribute('data-show-profile') === '1';
        const showJobApp = dashboardData.getAttribute('data-show-jobapp') === '1';

        if (showProfile) {
            // Prefer modal if present
            var modalEl = document.getElementById('profileModal');
            if (modalEl && window.bootstrap && typeof window.bootstrap.Modal === 'function') {
                var m = new bootstrap.Modal(modalEl);
                m.show();
            } else {
                const el = document.getElementById('profileEditForm');
                if (el) {
                    const c = new bootstrap.Collapse(el);
                    c.show();
                }
            }
        }

        if (showJobApp) {
            // Prefer modal if present
            var jobModalEl = document.getElementById('jobApplicationModal');
            if (jobModalEl && window.bootstrap && typeof window.bootstrap.Modal === 'function') {
                var jm = new bootstrap.Modal(jobModalEl);
                jm.show();
            } else {
                // fallback to collapse (legacy behavior)
                const el = document.getElementById('jobApplicationForm');
                if (el) {
                    const c = new bootstrap.Collapse(el);
                    c.show();
                }
            }
        }
    }

    // 3b) Navbar 'Add Job Application' links: open modal if available, otherwise follow link
    try {
        // Helper: reset modal contents to blank 'Add' state
        function resetJobModalForNew() {
            var form = document.getElementById('jobApplicationForm');
            if (!form) return;

            // Reset form controls
            try { form.reset(); } catch (e) {}

            // Remove edit-specific hidden inputs if present
            var editFlag = form.querySelector('input[name="edit_job_application"]');
            if (editFlag) editFlag.remove();
            var appId = form.querySelector('input[name="application_id"]');
            if (appId) appId.remove();

            // Ensure add_job_application hidden input exists
            if (!form.querySelector('input[name="add_job_application"]')) {
                var hid = document.createElement('input');
                hid.type = 'hidden'; hid.name = 'add_job_application'; hid.value = '1';
                form.appendChild(hid);
            }

            // Update modal title and submit button text to 'Add'
            var lbl = document.getElementById('jobApplicationModalLabel');
            if (lbl) lbl.textContent = 'Add Job Application';
            var submitBtn = document.querySelector('button[type="submit"][form="jobApplicationForm"]');
            if (submitBtn) submitBtn.textContent = 'Add Application';

            // Clear validation states/messages inside the form (if any)
            var invalids = form.querySelectorAll('.is-invalid');
            invalids.forEach(function(el) { el.classList.remove('is-invalid'); });
            var errorMsgs = form.querySelectorAll('.text-danger, .invalid-feedback');
            errorMsgs.forEach(function(el) { el.remove(); });

            // If application_date input exists and is empty, set to today (YYYY-MM-DD)
            var dateInput = form.querySelector('input[name="application_date"]');
            if (dateInput && !dateInput.value) {
                var today = new Date();
                var yyyy = today.getFullYear();
                var mm = String(today.getMonth()+1).padStart(2,'0');
                var dd = String(today.getDate()).padStart(2,'0');
                dateInput.value = yyyy + '-' + mm + '-' + dd;
            }
        }

        var navAddLinks = document.querySelectorAll('.open-job-modal');
        navAddLinks.forEach(function(a) {
            a.addEventListener('click', function(e) {
                var jobModalEl = document.getElementById('jobApplicationModal');
                if (jobModalEl && window.bootstrap && typeof window.bootstrap.Modal === 'function') {
                    e.preventDefault();

                    // If the link explicitly requests a new form, reset client-side state
                    var href = a.getAttribute('href') || '';
                    if (href.indexOf('new=1') !== -1) {
                        try { resetJobModalForNew(); } catch (err) { /* ignore */ }
                    }

                    var jm = new bootstrap.Modal(jobModalEl);
                    jm.show();
                }
                // else allow default navigation (to ?new=1) which triggers server prefill
            });
        });
    } catch (err) {
        /* non-critical */
    }

    // 3c) No-op: keeping page position unchanged after filter submits (intentional).

    // 4) Weekly targets line chart (cumulative vs cumulative target)
    try {
        var chartData = window._weeklyTargetsData;
        var canvas = document.getElementById('weeklyTargetsChart');
        if (canvas && chartData && typeof Chart !== 'undefined') {
            var ctx = canvas.getContext('2d');
            // destroy existing chart instance if any (avoid duplicates)
            if (canvas._chartInstance) {
                canvas._chartInstance.destroy();
            }

            canvas._chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Cumulative Applications',
                            data: chartData.cumulativeCounts,
                            borderColor: '#2596be',
                            backgroundColor: 'rgba(37,150,190,0.05)',
                            tension: 0.25,
                            fill: true,
                        },
                        {
                            label: 'Cumulative Target',
                            data: chartData.cumulativeTarget,
                            borderColor: '#dc3545',
                            borderDash: [6,4],
                            pointRadius: 0,
                            tension: 0,
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    } catch (e) {
        console && console.error && console.error('weekly chart init failed', e);
    }

    // 5) Confirm delete action for job application delete button
    try {
        var deleteBtns = document.querySelectorAll('button[name="delete_job_application"]');
        deleteBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var ok = confirm('Are you sure you want to permanently delete this job application? This action cannot be undone.');
                if (!ok) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
                // allow form submission to proceed
            });
        });
    } catch (e) {
        // non-critical
    }
});
