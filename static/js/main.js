// Main custom JavaScript for Job Search Tracker
// Add any custom JS here

document.addEventListener('DOMContentLoaded', function() {
    // Example: Dismiss alerts automatically after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        // Close via Bootstrap's Alert API so the element is removed (no blank space left)
        try {
            var bsAlert = (window.bootstrap && window.bootstrap.Alert) ? window.bootstrap.Alert.getOrCreateInstance(alert) : null;
            setTimeout(function() {
                if (bsAlert && typeof bsAlert.close === 'function') {
                    bsAlert.close();
                    // ensure container cleanup runs after Bootstrap removes the element
                    setTimeout(maybeRemoveMessagesContainer, 200);
                } else {
                    // fallback: remove element and then attempt to remove container
                    try { alert.remove(); } catch (err) {}
                    // small delay to allow any other handlers to run
                    setTimeout(maybeRemoveMessagesContainer, 100);
                }
            }, 5000);

            // When an alert is closed (user or auto), if the messages container is empty remove it
            alert.addEventListener('closed.bs.alert', function() {
                // closed.bs.alert should fire after Bootstrap removes the element
                // use a short timeout to give the DOM a chance to settle
                setTimeout(maybeRemoveMessagesContainer, 50);
            });
        } catch (e) {
            // fallback: just remove the element after timeout and then try to remove container
            setTimeout(function() { try { alert.remove(); } catch (err){}; setTimeout(maybeRemoveMessagesContainer, 100); }, 5000);
        }
    });

    // Collapse the navbar (burger) after clicking any nav link inside the collapse.
    try {
        var navbarCollapseEl = document.getElementById('navbarNav');
        if (navbarCollapseEl) {
            // Delegate to each nav-link so clicks hide the collapse when it's open
            var navLinks = navbarCollapseEl.querySelectorAll('.nav-link');
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    try {
                        if (navbarCollapseEl.classList.contains('show') && window.bootstrap && window.bootstrap.Collapse) {
                            var bs = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl);
                            bs.hide();
                        }
                    } catch (e) {
                        // ignore - non-critical UI behaviour
                    }
                });
            });
        }
    } catch (e) {
        // ignore
    }

    // Accessibility helpers: link helpful descriptions and improve modal focus
    try {
        // Associate adjacent .form-text hints with input/select/textarea elements
        document.querySelectorAll('form').forEach(function(form) {
            var hints = form.querySelectorAll('.form-text');
            hints.forEach(function(hint, idx) {
                // Look for an input/select/textarea immediately before the hint
                var prev = hint.previousElementSibling;
                if (!prev) return;
                // If the previous sibling is a label, use its control
                if (prev.tagName === 'LABEL' && prev.htmlFor) {
                    var control = form.querySelector('#' + prev.htmlFor);
                    if (control && !control.hasAttribute('aria-describedby')) {
                        var hid = 'hint-' + (prev.htmlFor) + (idx);
                        hint.id = hint.id || hid;
                        control.setAttribute('aria-describedby', hint.id);
                    }
                    return;
                }
                // If previous element is an input/select/textarea, attach aria-describedby
                if (/INPUT|SELECT|TEXTAREA/.test(prev.tagName)) {
                    var cid = prev.id || (prev.name ? ('input-' + prev.name) : null);
                    if (!prev.id && cid) prev.id = cid;
                    var hid2 = hint.id || (cid ? ('hint-' + cid + '-' + idx) : ('hint-' + Date.now() + '-' + idx));
                    hint.id = hint.id || hid2;
                    if (!prev.hasAttribute('aria-describedby')) prev.setAttribute('aria-describedby', hint.id);
                }
            });
        });

        // Ensure Bootstrap modals focus the first form control when shown (improves keyboard flow)
        document.querySelectorAll('.modal').forEach(function(modalEl) {
            modalEl.addEventListener('shown.bs.modal', function() {
                try {
                    var focusable = modalEl.querySelector('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
                    if (focusable) focusable.focus();
                } catch (e) { /* ignore */ }
            });
        });
    } catch (e) {
        // Non-critical: don't break other scripts
        console && console.error && console.error('accessibility helpers failed', e);
    }
});

// Utility: remove the messages container div if it contains no alert children
function maybeRemoveMessagesContainer() {
    try {
        var container = document.getElementById('messages-container');
        if (container) {
            // If there are no remaining .alert elements, remove the container
            if (container.querySelectorAll && container.querySelectorAll('.alert').length === 0) {
                container.remove();
            }
        }
    } catch (e) {
        // ignore
    }
}
