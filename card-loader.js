window.addEventListener('DOMContentLoaded', async () => {
    console.log('Data loader script running...');
    
    await customElements.whenDefined('project-card');
    console.log('project-card element is defined');
    
    const loadLocalBtn = document.getElementById('load-local');
    const loadRemoteBtn = document.getElementById('load-remote');
    const container = document.getElementById('projects-container');
    
    if (!loadLocalBtn || !loadRemoteBtn || !container) {
        console.error('ERROR: Could not find required elements!');
        return;
    }
    
    // UPDATE THIS with YOUR GitHub username and repo name
    const REMOTE_URL = 'https://my-json-server.typicode.com/kdang002/cse134b-car-data/projects';
    
    let masonryInstance = null;
    
    const localData = [
        {
            title: "Lamboghini Aventador S",
            img: "resources/cars/lambo-aventador-s.jpg",
            description: "Batman's roller.",
            link: "#"
        },
        {
            title: "Aston Martin DBS",
            img: "resources/cars/am-dbs.jpg",
            description: "Performance Family SUV??!",
            link: "#"
        }
    ];
    
    if (!localStorage.getItem('projectCards')) {
        localStorage.setItem('projectCards', JSON.stringify(localData));
    }
    
    function clearCards() {
        if (masonryInstance) {
            masonryInstance.destroy();
            masonryInstance = null;
        }
        container.innerHTML = '';
    }
    
    function initMasonryLayout() {
        if (window.innerWidth > 600 && typeof Masonry !== 'undefined') {
            if (masonryInstance) {
                masonryInstance.destroy();
            }
            
            masonryInstance = new Masonry(container, {
                itemSelector: 'project-card',
                percentPosition: true,
                gutter: 24,
                horizontalOrder: true
            });
            
            setTimeout(() => {
                if (masonryInstance) {
                    masonryInstance.layout();
                }
            }, 500);
        }
    }
    
    function renderCards(dataArray) {
        clearCards();
        
        dataArray.forEach(cardData => {
            const card = document.createElement('project-card');
            card.setAttribute('title', cardData.title);
            card.setAttribute('img', cardData.img);
            card.setAttribute('description', cardData.description);
            card.setAttribute('link', cardData.link);
            container.appendChild(card);
        });
        
        setTimeout(() => {
            initMasonryLayout();
        }, 200);
    }
    
    loadLocalBtn.addEventListener('click', () => {
        try {
            const storedData = localStorage.getItem('projectCards');
            if (storedData) {
                const data = JSON.parse(storedData);
                renderCards(data);
            } else {
                alert('No local data found!');
            }
        } catch (error) {
            console.error('Error loading local data:', error);
            alert('Error loading local data. Check console.');
        }
    });
    
    loadRemoteBtn.addEventListener('click', async () => {
        try {
            loadRemoteBtn.textContent = 'Loading...';
            loadRemoteBtn.disabled = true;
            
            // NO API KEY NEEDED!
            const response = await fetch(REMOTE_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const cards = await response.json(); // Direct array, no wrapper
            console.log('Remote data:', cards);
            
            renderCards(cards);
            
        } catch (error) {
            console.error('Error loading remote data:', error);
            alert('Error loading remote data. Check console and URL.');
        } finally {
            loadRemoteBtn.textContent = 'Load Remote';
            loadRemoteBtn.disabled = false;
        }
    });
});