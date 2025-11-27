window.addEventListener('DOMContentLoaded', () => {
    const loadLocalBtn = document.getElementById('load-local');
    const loadRemoteBtn = document.getElementById('load-remote');
    const container = document.getElementById('projects-container');
    
    // Replace with YOUR JSONBin URL or My JSON Server URL
    const REMOTE_URL = 'https://api.jsonbin.io/v3/qs/6927eba143b1c97be9c7de87';
    
    // Sample local data - this will be stored in localStorage
    const localData = [
        {
            title: "Honda NSX",
            img: "resources/cars/honda-nsx.jpg",
            description: "The Honda NSX, a supercar developed with input from legendary F1 driver Ayrton Senna.",
            link: "https://en.wikipedia.org/wiki/Honda_NSX"
        },
        {
            title: "Subaru WRX STI",
            img: "resources/cars/wrx-sti.jpg",
            description: "Rally-bred performance with the iconic boxer engine and symmetrical AWD system.",
            link: "https://en.wikipedia.org/wiki/Subaru_Impreza_WRX_STI"
        }
    ];
    
    // Initialize localStorage with sample data on first load
    if (!localStorage.getItem('projectCards')) {
        localStorage.setItem('projectCards', JSON.stringify(localData));
    }
    
    // Function to clear existing cards
    function clearCards() {
        container.innerHTML = '';
    }
    
    // Function to render cards from data array
    function renderCards(dataArray) {
        clearCards();
        
        const appended = [];
        dataArray.forEach(cardData => {
            const card = document.createElement('project-card');
            // add a DOM class so Masonry can select items via a class selector
            card.classList.add('project-card');
            card.setAttribute('title', cardData.title);
            card.setAttribute('img', cardData.img);
            card.setAttribute('description', cardData.description);
            card.setAttribute('link', cardData.link);
            container.appendChild(card);
            appended.push(card);
        });

        // Use the optimized Masonry append helper if available.
        // This calls Masonry.appended(items) which is more efficient than reload.
        setTimeout(() => {
            if (window.appendMasonryItems) {
                window.appendMasonryItems(appended);
            } else if (window.initMasonry) {
                // fallback: ensure Masonry is initialized and layout runs
                window.initMasonry();
            }
        }, 200);
    }
    
    // Load from localStorage
    loadLocalBtn.addEventListener('click', () => {
        try {
            const storedData = localStorage.getItem('projectCards');
            if (storedData) {
                const data = JSON.parse(storedData);
                renderCards(data);
                console.log('Loaded from localStorage:', data);
            } else {
                alert('No local data found!');
            }
        } catch (error) {
            console.error('Error loading local data:', error);
            alert('Error loading local data. Check console.');
        }
    });
    
    // Load from remote server
    loadRemoteBtn.addEventListener('click', async () => {
        try {
            loadRemoteBtn.textContent = 'Loading...';
            loadRemoteBtn.disabled = true;
            
            const response = await fetch(REMOTE_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // JSONBin wraps data in a 'record' property
            const cards = data.record || data;
            
            renderCards(cards);
            console.log('Loaded from remote:', cards);
            
        } catch (error) {
            console.error('Error loading remote data:', error);
            alert('Error loading remote data. Check console and URL.');
        } finally {
            loadRemoteBtn.textContent = 'Load Remote';
            loadRemoteBtn.disabled = false;
        }
    });
});