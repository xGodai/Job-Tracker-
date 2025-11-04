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
