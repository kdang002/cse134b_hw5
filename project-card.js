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
                transition: transform 0.15s ease, box-shadow 0.15s ease;
            }

            .card:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.12);
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
            }

            p {
                margin: 0 16px 16px 16px;
                line-height: 1.55;
                color: #444;
                font-size: 0.95rem;
            }

            a {
                display: inline-block;
                margin: 0 16px 20px 16px;
                padding: 10px 14px;
                background: #0073ff;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 500;
                text-align: center;
                transition: background 0.15s ease;
            }

            a:hover {
                background: #005ad1;
            }

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

        // Automatically renders into the DOM
        connectedCallback() {
            this.render();
        }

        cardStyles() {
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
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }

                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
                }

                /* more styles ... */
            `;
        }


        render() {
            // Getters
            const title = this.getAttribute('title') || 'Project Title';
            const imgSrc = this.getAttribute('img') || '';
            const description = this.getAttribute('description') || 'Project description goes here.';
            const link = this.getAttribute('link') || '#';

            // Generate HTML
            this.shadowRoot.innerHTML = `
                <style>${cardStyles()}</style>

                <div class="card">
                    <picture>
                        <img src="${imgSrc}" alt="${title}">
                    </picture>

                    <h2>${title}</h2>
                    <p>${description}</p>
                    <a href="${link}">Learn More</a>
                </div>
            `;
        }

    }

    // Register the class as a custom HTML Element
    customElements.define('project-card', project_card);
});
