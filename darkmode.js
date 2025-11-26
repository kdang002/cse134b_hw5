window.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
            
    // ----------------------------------------------------            
    // DARK MODE
    // ----------------------------------------------------            
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
});

// Masonry Layout for Project Cards
window.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.projects-grid');
    let msnry = null;
    
    if (grid && typeof Masonry !== 'undefined') {
        customElements.whenDefined('project-card').then(() => {
            setTimeout(() => {
                initMasonry();
                handleResize();
            }, 100);
        });
        
        function initMasonry() {
            // Only init masonry on desktop/tablet
            if (window.innerWidth > 600) {
                if (!msnry) {
                    msnry = new Masonry(grid, {
                        itemSelector: 'project-card',
                        percentPosition: true,
                        gutter: 24,
                        horizontalOrder: true
                    });
                    
                    layoutAfterImagesLoad();
                }
            } else {
                // Destroy masonry on mobile
                if (msnry) {
                    msnry.destroy();
                    msnry = null;
                }
            }
        }
        
        function layoutAfterImagesLoad() {
            const cards = grid.querySelectorAll('project-card');
            let loadedCount = 0;
            const totalCards = cards.length;
            
            cards.forEach(card => {
                const shadowRoot = card.shadowRoot;
                if (shadowRoot) {
                    const img = shadowRoot.querySelector('img');
                    if (img) {
                        if (img.complete) {
                            loadedCount++;
                            if (loadedCount === totalCards && msnry) {
                                msnry.layout();
                            }
                        } else {
                            img.addEventListener('load', () => {
                                loadedCount++;
                                if (msnry) {
                                    msnry.layout();
                                }
                            });
                        }
                    }
                }
            });
            
            if (msnry) {
                setTimeout(() => msnry.layout(), 500);
            }
        }
        
        function handleResize() {
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    initMasonry();
                }, 250);
            });
        }
    }
});