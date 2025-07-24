// Make entire Invoice Generator card clickable

document.addEventListener('DOMContentLoaded', function() {
    var invoiceCard = document.querySelector('.tool-card:not(:has(.coming-soon-badge))');
    if (invoiceCard) {
        invoiceCard.style.cursor = 'pointer';
        invoiceCard.addEventListener('click', function(e) {
            // Prevent double navigation if "Open" link is clicked
            if (!e.target.classList.contains('tool-link')) {
                window.location.href = 'index.html';
            }
        });
    }
});
