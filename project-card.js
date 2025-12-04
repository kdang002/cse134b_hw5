// ----------------------------------------------------
// Card object. Generated via JS and styled the shadow-DOM
// Invoked in cars.html
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
function cardStyles() {
    return `
        :host {
            display: block;
            max-width: 350px;
            width: 100%;
            font-family: system-ui, sans-serif;
            
            /* CSS Variables */
            --card-bg: white;
            --card-bg-dark: rgba(91, 78, 78, 1);
            --card-text: #000;
            --card-text-dark: #ffffff;
            --card-desc: #444;
            --card-desc-dark: #e5e5e5;
            --card-border-radius: 14px;
            --card-shadow: rgba(0, 0, 0, 0.08);
            --card-shadow-hover: rgba(165, 57, 57, 0.12);
            --card-hover-lift: -5px;
        }

        .card {
            display: flex;
            flex-direction: column;
            background: var(--card-bg);
            border: 3px solid var(--text-color);
            border-radius: var(--card-border-radius);
            overflow: hidden;
            box-shadow: 0 4px 12px var(--card-shadow);
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.3s ease;
        }

        /* Dark mode styles */
        .card.dark {
            background: var(--card-bg-dark);
        }

        .card.dark h2 {
            color: var(--card-text-dark);
        }

        .card.dark p {
            color: var(--card-desc-dark);
        }

        .card:hover {
            transform: translateY(var(--card-hover-lift));
            box-shadow: 0 6px 20px var(--card-shadow-hover);
        }

        picture img {
            width: 100%;
            height: auto;
            display: block;
        }

        h2 {
            margin: 16px;
            font-size: 1.25rem;
            line-height: 1.3;
            color: var(--card-text);
            transition: color 0.3s ease;
        }

        p {
            margin: 16px;
            line-height: 1.55;
            color: var(--card-desc);
            font-size: 0.95rem;
            transition: color 0.3s ease;
        }

        a {
            display: inline-block;
            margin: 0 16px 20px 16px;
            padding: 10px 14px;
            text-decoration: none;
        }

        /* RESPONSIVE DESIGN for mobile devices */
        @media (max-width: 480px) {
            h2 {
                font-size: 1.15rem;
            }
            p {
                font-size: 0.9rem;
            }
        }
    `;
}
    
    class project_card extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            this.render();
            this.observeDarkMode();
        }

        observeDarkMode() {
            const card = this.shadowRoot.querySelector('.card');
            
            // Check initial dark mode state
            const updateDarkMode = () => {
                if (document.body.classList.contains('dark')) {
                    card.classList.add('dark');
                } else {
                    card.classList.remove('dark');
                }
            };

            // Initial check
            updateDarkMode();

            // Watch for changes to body's class
            const observer = new MutationObserver(updateDarkMode);
            observer.observe(document.body, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });

            // Store observer so it can be cleaned up if needed
            this._darkModeObserver = observer;
        }

        disconnectedCallback() {
            // Clean up observer when element is removed
            if (this._darkModeObserver) {
                this._darkModeObserver.disconnect();
            }
        }

        render() {
            const title = this.getAttribute('title') || 'Project Title';
            const imgSrc = this.getAttribute('img') || '';
            const description = this.getAttribute('description') || 'Project description goes here.';
            const link = this.getAttribute('link') || '#';

            this.shadowRoot.innerHTML = `
                <style>${cardStyles()}</style>

                <div class="card">
                    

                    <a href="${link}">
                        <h2>${title}</h2>
                        <picture>
                            <img src="${imgSrc}" alt="${title}">
                        </picture>                    
                        <p>${description}</p>
                    </a>
                </div>
            `;
        }
    }

    // Register the class as a custom HTML Element
    customElements.define('project-card', project_card);

    // Masonry Layout for Project Cards
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
            if (window.innerWidth > 600) {
                if (!msnry) {
                    msnry = new Masonry(grid, {
                        // use a tag selector to find custom elements
                        itemSelector: 'project-card',
                        percentPosition: true,
                        gutter: 40,
                        horizontalOrder: true
                    });
                }
            } else {
                if (msnry) {
                    msnry.destroy();
                    msnry = null;
                }
            }

            // Always attempt to layout images after cards may have changed
            if (typeof layoutAfterImagesLoad === 'function') {
                layoutAfterImagesLoad();
            }
        }
        
        function layoutAfterImagesLoad() {
            const cards = grid.querySelectorAll('.project-card');
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

        window.initMasonry = initMasonry; // Make it globally accessible
        // Expose an optimized helper to append newly-created items to Masonry
        // This uses Masonry.appended() which is more efficient when adding
        // incremental items than reloading all items.
        window.appendMasonryItems = function(nodes) {
            try {
                // normalize to array
                const items = nodes && typeof nodes.length !== 'undefined' ? Array.from(nodes) : (nodes ? [nodes] : []);
                if (!items.length) return;

                // ensure Masonry is initialized
                if (!msnry) {
                    initMasonry();
                }

                if (msnry) {
                    msnry.appended(items);
                    // allow images (from shadow DOM) to load then layout
                    setTimeout(() => {
                        msnry.layout();
                    }, 150);
                }
            } catch (err) {
                // Fallback: trigger full init which will call layoutAfterImagesLoad
                if (typeof initMasonry === 'function') initMasonry();
                console.error('appendMasonryItems error:', err);
            }
        };
    }

});
