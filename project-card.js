window.addEventListener('DOMContentLoaded', () => {
    function cardStyles() {
        return `
            :host {
                display: block;
                max-width: 350px;
                width: 100%;
                font-family: system-ui, sans-serif;
            }

            .card {
                display: flex;
                flex-direction: column;
                background: white;
                border-radius: 14px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.3s ease;
            }

            /* Dark mode styles */
            .card.dark {
                background: rgba(91, 78, 78, 1)
            }

            .card.dark h2 {
                color: #ffffff;
            }

            .card.dark p {
                color: #e5e5e5;
            }

            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 6px 20px rgba(165, 57, 57, 0.12);
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
                color: #000;
                transition: color 0.3s ease;
            }

            p {
                margin: 16px;
                line-height: 1.55;
                color: #444;
                font-size: 0.95rem;
                transition: color 0.3s ease;
            }

            a {
                display: inline-block;
                margin: 0 16px 20px 16px;
                padding: 10px 14px;
                text-decoration: none;
            }

            // RESPONSIVE DESIGN for mobile devices 
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
});
